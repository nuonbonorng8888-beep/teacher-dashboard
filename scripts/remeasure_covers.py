"""
Re-measure the cover-page rows (class / date / teacher) of every plan and fix stored coordinates that are
clearly wrong (e.g. Grade 12 chapter 4 uses the Khmer colon '៖' with values at x=205 while the data said 238,
so the new class text landed beside the old one and date/teacher overlapped).

A plan whose first page has no cover rows at all (a continuation page such as plan_g12_6_16) gets
"no_cover": true and is not stamped there.

Usage: python scripts/remeasure_covers.py [--apply]
"""
import sys, json, argparse
import pymupdf
from audit_whiteout_collisions import load_plans, ROOT
import build_g9_plans as B

sys.stdout.reconfigure(encoding="utf-8")
DATA = ROOT / "js" / "lesson-plans-data.js"
COLONS = (":", "៖")


def measure(pg):
    words = pg.get_text("words")
    colons = sorted((w for w in words if w[4].strip() in COLONS and 90 <= w[0] <= 330 and w[1] < 300), key=lambda w: w[1])
    rows = []
    for c in colons:
        same = [w for w in words if abs(w[1] - c[1]) < 7 and w is not c]
        label = " ".join(w[4] for w in sorted(same, key=lambda w: w[0]) if w[0] < c[0])
        val = [w for w in same if w[0] > c[2]]
        rows.append({"y0": min([c[1]] + [w[1] for w in same if w[0] < c[0]]), "label": label,
                     "x": round(min([w[0] for w in val] or [c[2] + 8]) - 0.4, 1)})
    got = {}
    for key, pats in B.LABEL.items():
        for r in rows:
            if any(p in r["label"] for p in pats) and all(r is not v for v in got.values()):
                got[key] = r
                break
    if len(rows) >= 5:   # fall back on row order: class, lesson, duration, date, teacher
        for key, idx in (("class", 0), ("duration", 2), ("date", 3), ("teacher", 4)):
            got.setdefault(key, rows[idx])
    return got, rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()
    text = DATA.read_text(encoding="utf-8")
    s, e = text.index("["), text.rindex("]") + 1
    plans = json.loads(text[s:e])
    changed, no_cover = [], []
    for p in plans:
        # Grade 12 only: Grade 8/9 offsets are deliberate and Grade 11 labels are mangled (rows can be mis-assigned)
        if not p.get("class_name") or not p["id"].startswith("plan_g12_"):
            continue
        d = pymupdf.open(ROOT / p["pdf_file"])
        ci = p.get("cover_page_index") or 0
        got, rows = measure(d[ci])
        if not rows:
            if not p.get("no_cover"):
                p["no_cover"] = True
                no_cover.append(p["id"])
            continue
        for key, xk, yk in (("class", "class_x", "class_y0"), ("date", "date_x", "box_y0"),
                            ("teacher", "teacher_x", "teacher_y0")):
            if key not in got:
                continue
            nx, ny = got[key]["x"], round(got[key]["y0"] + 1.0, 1)
            ox, oy = p.get(xk), p.get(yk)
            # only clear errors: > 12pt sideways or > 3pt vertically (a few pt of x is a deliberate offset)
            if ox is None or oy is None or abs(nx - ox) > 12 or abs(ny - oy) > 3:
                changed.append((p["id"], key, (ox, oy), (nx, ny)))
                p[xk], p[yk] = nx, ny
    for c in changed:
        print("fix", *c)
    print("no cover rows:", no_cover)
    print(f"{len(changed)} coordinates fixed, {len(no_cover)} plans without cover")
    if a.apply:
        DATA.write_text(text[:s] + json.dumps(plans, ensure_ascii=False, indent=2) + text[e:], encoding="utf-8")
        print("written", DATA)


if __name__ == "__main__":
    main()
