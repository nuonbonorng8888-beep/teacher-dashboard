"""
Add Grade 9 lesson plans to js/lesson-plans-data.js.

 1. copies the Grade 9 PDFs (85 plans, 18 lessons) from the nested folder the teacher dropped them in
    to a flat 'កិច្ចការតែងការទី៩/' with clean ASCII-safe names (no zero-width spaces / colons / spaces);
 2. reads lesson title, objectives, content and steps from the matching .docx;
 3. measures from each PDF: cover value positions (class / date / teacher), duration, signature page,
    table bottom, pages whose content reaches the footer;
 4. (re)writes the plan_g9_* entries in the data file (idempotent).

Usage: python scripts/build_g9_plans.py [--dry]
"""
import re, sys, json, glob, shutil, zipfile, datetime, argparse
import xml.etree.ElementTree as ET
from pathlib import Path
import pymupdf
import sig_detect

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
DST_NAME = "កិច្ចការតែងការទី៩"
DST = ROOT / DST_NAME
DATA = ROOT / "js" / "lesson-plans-data.js"
START = datetime.date(2026, 10, 19)
SIG_DATE = datetime.date(2026, 10, 12)

KH_DIGITS = "០១២៣៤៥៦៧៨៩"
KH_DAYS = ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"]
KH_MONTHS = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"]
ZW = dict.fromkeys(map(ord, "​‌‍⁠﻿"), None)


def kh(n):
    return "".join(KH_DIGITS[int(c)] if c.isdigit() else c for c in str(n))


def khmer_date(d, day_name=True):
    if day_name:
        return f"ថ្ងៃ{KH_DAYS[d.isoweekday() % 7]} ទី{kh(d.day)} ខែ{KH_MONTHS[d.month-1]} ឆ្នាំ{kh(d.year)}"
    return f"ថ្ងៃទី {kh(d.day)} ខែ {KH_MONTHS[d.month-1]} ឆ្នាំ {kh(d.year)}"


def clean(t):
    return " ".join(t.translate(ZW).replace("\xa0", " ").split())


def find_src():
    c = [Path(p) for p in glob.glob(str(DST / "*" / "*"))]
    c = [p for p in c if p.is_dir() and any(p.glob("9_*.pdf"))]
    if not c:
        sys.exit("source folder with 9_*.pdf not found under " + str(DST))
    return c[0]


NAME_RX = re.compile(r"^9_(\d+)_(\d+)[\s_]+មេរៀនទី[^\s_៖:]*[\s_៖:​]*(.+?)\s*\.pdf$")


def list_source(src):
    items = []
    for f in sorted(src.glob("9_*.pdf")):
        name = f.name.translate(ZW)
        m = NAME_RX.match(name)
        if not m:
            print("  skip (name):", f.name)
            continue
        items.append({"ch": int(m.group(1)), "n": int(m.group(2)), "title": clean(m.group(3)), "pdf": f,
                      "docx": f.with_suffix(".docx")})
    items.sort(key=lambda x: (x["ch"], x["n"]))
    return items


def parse_docx(path):
    """lesson info from the Word file (same approach as the Grade 8 parser)."""
    info = {"know": [], "skills": [], "attitude": "", "content": [], "materials": None}
    if not path.exists():
        return info
    try:
        with zipfile.ZipFile(path) as z:
            tree = ET.fromstring(z.read("word/document.xml"))
    except Exception as e:  # noqa
        print("  docx error", path.name, e)
        return info
    ns = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    paras = []
    for p in tree.iter(ns + "p"):
        t = clean("".join(x.text for x in p.iter(ns + "t") if x.text))
        if t:
            paras.append(t)
        if len(paras) > 70:
            break
    for p in paras[:40]:
        for key, dst in (("វិជ្ជាសម្បទា", "know"), ("បំណិនសម្បទា", "skills")):
            if key in p:
                v = p.split(key)[-1].strip(" ៖:\t")
                if v and v not in info[dst]:
                    info[dst].append(v)
        if "ចរិយាសម្បទា" in p:
            info["attitude"] = p.split("ចរិយាសម្បទា")[-1].strip(" ៖:\t")
    inside = False
    for p in paras[:50]:
        if "ខ្លឹមសារមេរៀន" in p and "សកម្មភាព" not in p:
            inside = True
            v = p.split("ខ្លឹមសារមេរៀន")[-1].strip(" ៖:\t")
            if v:
                info["content"].append(v)
        elif inside:
            if any(k in p for k in ("៣.", "សម្ភារ", "វិធីសាស្រ្ត", "វិធីសាស្ត្រ", "៥. ដំណើរការ")):
                inside = False
            elif len(p) > 2:
                info["content"].append(p)
    for p in paras[:45]:
        if "សម្ភារ" in p:
            v = p.split("សម្ភារៈឧបទេស")[-1].split("សម្ភារឧបទេស")[-1].strip(" ៖:\t")
            if v and len(v) > 4:
                info["materials"] = v
    return info


# ---------------------------------------------------------------- geometry
LABEL = {
    "class": ("ថ្នាក់", "ថនក់"),
    "date": ("កាលបរិ", "កលបរិ"),
    "teacher": ("បង្រៀន", "បេរងៀន", "បង្ងៀន", "ដោយ", "ដយ"),
    "duration": ("រយៈ", "រយ៉ៈ", "រយ:"),
}


def cover_geometry(pg):
    words = pg.get_text("words")
    colons = sorted((w for w in words if w[4].strip() == ":" and 150 <= w[0] <= 270 and w[1] < 220), key=lambda w: w[1])
    rows = []
    for c in colons:
        same = [w for w in words if abs(w[1] - c[1]) < 6 and w is not c]
        label = " ".join(w[4] for w in sorted(same, key=lambda w: w[0]) if w[0] < c[0])
        val = [w for w in same if w[0] > c[2]]
        rows.append({"y0": min([c[1]] + [w[1] for w in same if w[0] < c[0]]), "label": label,
                     "x": round(min([w[0] for w in val] or [c[2] + 8]) - 0.4, 1),
                     "text": "".join(w[4] for w in sorted(val, key=lambda w: w[0]))})
    got = {}
    for key, pats in LABEL.items():
        for r in rows:
            if any(p in r["label"] for p in pats) and r not in got.values():
                got[key] = r
                break
    # fall back on row order: class, lesson, duration, date, teacher
    if len(rows) >= 5:
        for key, idx in (("class", 0), ("duration", 2), ("date", 3), ("teacher", 4)):
            got.setdefault(key, rows[idx])
    return got


def page_stats(doc):
    overflow, high = [], []
    for i, pg in enumerate(doc):
        H, area = pg.rect.height, pg.rect.get_area()
        low = max([w[3] for w in pg.get_text("words")] + [0])
        for d in pg.get_drawings():
            if d["rect"].get_area() < 0.5 * area:
                low = max(low, d["rect"].y1)
        if low > H - 34:
            overflow.append(i)
        if i >= 1 and sig_detect.wide_hlines(pg) and min(sig_detect.wide_hlines(pg)) < 90:
            high.append(i)
    return overflow, high


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    a = ap.parse_args()

    src = find_src()
    items = list_source(src)
    print(f"source: {src.name}  plans: {len(items)}  lessons: {len({i['ch'] for i in items})}")
    DST.mkdir(exist_ok=True)

    text = DATA.read_text(encoding="utf-8")
    s, e = text.index("["), text.rindex("]") + 1
    plans = [p for p in json.loads(text[s:e]) if not p["id"].startswith("plan_g9_")]
    g8_sample = next(p for p in plans if p["id"] == "plan_g8_1")

    day = START
    out, problems = [], []
    for idx, it in enumerate(items, 1):
        while day.weekday() >= 5:
            day += datetime.timedelta(days=1)
        d = day
        day += datetime.timedelta(days=1)

        title_ns = it["title"].replace(" ", "")
        fname = f"9_{it['ch']}_{it['n']}_មេរៀនទី{kh(it['ch'])}_{title_ns}.pdf"
        dst = DST / fname
        if not dst.exists() or dst.stat().st_size != it["pdf"].stat().st_size:
            if not a.dry:
                shutil.copy2(it["pdf"], dst)

        doc = pymupdf.open(it["pdf"])
        cov = cover_geometry(doc[0])
        for k in ("class", "date", "teacher"):
            if k not in cov:
                problems.append(f"{fname}: cover row '{k}' not found")
        sig = sig_detect.find_sig_page(doc)
        if not sig:
            problems.append(f"{fname}: signature block not found")
        overflow, high = page_stats(doc)
        info = parse_docx(it["docx"])

        # the "នាទី" word is mangled by some fonts, the digits never are
        digits = re.findall(r"[០-៩0-9]+", cov.get("duration", {}).get("text", ""))
        dur = (digits[0] if digits else "៦០") + "នាទី"
        topic = " · ".join(info["content"][:3])
        plan = {
            "id": f"plan_g9_{idx}",
            "num": idx,
            "ch_lesson_num": it["n"],
            "chapter": f"មេរៀនទី {kh(it['ch'])} ៖ {it['title']}",
            "chapter_code": f"g9_l{it['ch']}",
            "grade": "ថ្នាក់ទី ៩",
            "class_name": "៩A",
            "lesson_title": it["title"],
            "topic": topic,
            "duration": dur,
            "date": d.isoformat(),
            "date_khmer": khmer_date(d, True),
            "teacher": "នួន បូណង",
            "school": g8_sample["school"],
            "score": 50,
            "status": "បានផ្ទៀងផ្ទាត់",
            "pdf_file": f"{DST_NAME}/{fname}",
            "objectives": {
                "knowledge": info["know"] or [f"យល់ដឹងអំពី «{it['title']}» និងអនុវត្តបានត្រឹមត្រូវ។"],
                "skills": info["skills"] or ["ដោះស្រាយលំហាត់ និងបញ្ហាពាក់ព័ន្ធបានត្រឹមត្រូវ។"],
                "attitude": info["attitude"] or "មានទម្លាប់ក្នុងការសិក្សាជាក្រុម និងចែករំលែកចំណេះដឹងរវាងមិត្តរួមថ្នាក់។",
            },
            "content_points": info["content"],
            "materials": {
                "teacher": info["materials"] or g8_sample["materials"]["teacher"],
                "student": g8_sample["materials"]["student"],
            },
            "methods": g8_sample["methods"],
            "steps": dict(g8_sample["steps"]),
            "cover_page_index": 0,
            "total_pages": len(doc),
        }
        for key, xk, yk in (("class", "class_x", "class_y0"), ("date", "date_x", "box_y0"),
                            ("teacher", "teacher_x", "teacher_y0")):
            if key in cov:
                plan[xk] = cov[key]["x"]
                plan[yk] = round(cov[key]["y0"] + 1.0, 1)
        if sig:
            pi, top, bot, kind = sig
            hl = [y for y in sig_detect.wide_hlines(doc[pi]) if y <= top + 1.5]
            plan.update({
                "sig_page_index": pi,
                "sig_y0": round(top + 1.5, 1),
                "old_sig_y0_text": round(top + 1.5, 1),
                "table_bottom_y0": round(max(hl), 1) if hl else None,
                "sig_date": SIG_DATE.isoformat(),
                "sig_date_khmer": khmer_date(SIG_DATE, False),
            })
        else:
            plan.update({"sig_page_index": None, "has_signatures": False, "sig_y0": 450.0})
        plan["bottom_overflow_pages"] = overflow or None
        plan["high_table_pages"] = high
        out.append(plan)
        print(f"{plan['id']:11} {fname[:46]:46} pg={len(doc)} sig={sig[0]+1 if sig else None}"
              f"({sig[3] if sig else '-'}) dur={dur} class_y={plan.get('class_y0')} date_y={plan.get('box_y0')}")

    print("\nproblems:", *problems, sep="\n  " if problems else " none")
    if a.dry:
        return
    new = text[:s] + json.dumps(plans + out, ensure_ascii=False, indent=2) + text[e:]
    DATA.write_text(new, encoding="utf-8")
    print(f"\nwrote {len(out)} Grade 9 plans -> {DATA}")


if __name__ == "__main__":
    main()
