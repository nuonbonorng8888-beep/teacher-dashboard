"""
Audit: which whiteout / stamp rectangles drawn by applyPdfCustomStamps (js/lesson-plans.js)
collide with real content in the original PDFs.

It mirrors the JS geometry, then for every rectangle checks the original page for:
  - CUT text   : a word only partly inside the rectangle  (visible "ដាច់អក្សរ")
  - CUT border : a table/line segment crossing the rectangle (visible "ដាច់ប្រអប់")
  - COVERED    : words fully hidden (may be intended old text, listed for review)

Usage:  python scripts/audit_whiteout_collisions.py [--json out.json] [--plan plan_id]
"""
import json, re, sys, argparse
from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "js" / "lesson-plans-data.js"


def load_plans():
    txt = DATA.read_text(encoding="utf-8")
    txt = txt[txt.index("["): txt.rindex("]") + 1]
    return json.loads(txt)


def grade_flags(p):
    """Mirror of gradeKey in applyPdfCustomStamps: exactly one grade."""
    g, pid, f = p.get("grade", ""), p.get("id", ""), p.get("pdf_file", "")
    key = 0
    for k, pat in ((8, r"ទី\s*(៨|8)$"), (11, r"ទី\s*(១១|11)$"), (12, r"ទី\s*(១២|12)$")):
        if re.search(pat, g):
            key = k; break
    if not key:
        m = re.search(r"_g(8|11|12)_", pid)
        if m:
            key = int(m.group(1))
    if not key:
        top = f.split("/")[0]
        key = 8 if top.endswith("ទី៨") else 11 if top.endswith("ទី១១") else 12 if top.endswith("ទី១២") else 0
    return key == 8, key == 11, key == 12


def num(v, default):
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else default


def R(H, x, y, w, h):
    """pdf-lib bottom-up rect -> PyMuPDF top-down rect"""
    return pymupdf.Rect(x, H - (y + h), x + w, H - y)


def stamp_rects(plan, n_pages, sizes):
    """Return list of (page_idx, kind, Rect) mirroring applyPdfCustomStamps."""
    g8, g11, g12 = grade_flags(plan)
    out = []
    pid = plan.get("id", "")
    compact = g12 and (plan.get("header_type") == "compact"
                       or re.match(r"^plan_g12_2_(4|5|6|7|8|9|10|11|12|13)$", pid)
                       or re.match(r"^plan_g12_4_", pid))
    for i in range(n_pages):
        W, H = sizes[i]
        if g11:
            out.append((i, "header", R(H, 45, H - 71, W - 90, 71)))
        elif g12 and compact:
            out.append((i, "header", R(H, 45, H - 49, W - 90, 49)))
        elif g12:
            out += [(i, "header", R(H, 45, H - 57, W - 90, 57)),
                    (i, "header", R(H, 45, H - 61, 85, 4)),
                    (i, "header", R(H, 340, H - 60.5, W - 385, 3.5))]
        overflow = (i in (plan.get("bottom_overflow_pages") or [])) or \
            (pid, i) in {("plan_g12_2_4", 1), ("plan_g12_10_7", 3), ("plan_g12_10_8", 2)}
        if g11 and not overflow:
            out.append((i, "footer-wo", R(H, 60, 60, 495, 38)))
        if not overflow:
            out.append((i, "footer-line", R(H, 65, 29.7, W - 130, 0.6)))
        out.append((i, "footer-text", R(H, 65, 12, 482, 15)))

    ci = plan.get("cover_page_index") or 0
    if ci < n_pages:
        W, H = sizes[ci]
        if plan.get("class_name"):
            x = num(plan.get("class_x"), 215 if g11 else 238)
            y0 = num(plan.get("class_y0"), 77.1 if g8 else (195 if g11 else 78.7))
            out.append((ci, "cover-class", pymupdf.Rect(x, y0, x + 240, y0 + 20)))
        if plan.get("date_khmer"):
            x = num(plan.get("date_x"), 215 if g11 else 238)
            y0 = num(plan.get("box_y0"), 140.1 if g8 else (239 if g11 else 151.8))
            out.append((ci, "cover-date", pymupdf.Rect(x, y0, x + 320, y0 + 20)))
        if plan.get("teacher"):
            x = num(plan.get("teacher_x"), 215 if g11 else 238)
            y0 = num(plan.get("teacher_y0"), 161.1 if g8 else (217 if g11 else 170.1))
            out.append((ci, "cover-teacher", pymupdf.Rect(x, y0, x + 320, y0 + 20)))

    if plan.get("sig_page_index") is None and "sig_page_index" in plan or plan.get("has_signatures") is False:
        return out
    sig = plan.get("_sig") or {}
    for pg_i, x0, t, x1, b in sig.get("extra", []):
        if pg_i < n_pages:
            out.append((pg_i, "signature-extra", pymupdf.Rect(x0, t, x1, b)))
    if sig:
        plan = dict(plan, sig_page_index=sig["page"], sig_y0=sig["y0"], table_bottom_y0=sig.get("table_bottom"))
    spi = plan.get("sig_page_index")
    si = spi if isinstance(spi, int) and spi < n_pages else n_pages - 1
    if not isinstance(spi, int) and g12 and n_pages >= 4:
        si = n_pages - 2
    W, H = sizes[si]
    min_y = num(plan.get("sig_y0"), 480 if g12 else (400 if g11 else 450))
    tb = plan.get("table_bottom_y0")
    safe = max(tb + 1.2, min_y - 2.5) if isinstance(tb, (int, float)) and tb > 0 else min_y - 2.5
    wo_top = min(H - 30, H - safe)
    if (H - min_y) <= 245:
        wo_y = 30.0
        wo_h = max(150.0, wo_top - wo_y)
    else:
        sig_h = num(plan.get("sig_h"), 150.0)
        wo_h = sig_h + 16
        wo_y = max(30.0, wo_top - wo_h)
    if isinstance(sig.get("bottom"), (int, float)):
        nb = max(30.0, H - sig["bottom"])
        if nb < wo_y:
            wo_h += wo_y - nb; wo_y = nb
    out.append((si, "signature", R(H, 28, wo_y, W - 56, wo_h)))
    return out


def segments(drawings):
    """Yield (Rect) for each line/rect edge of vector drawings (thin boxes)."""
    for d in drawings:
        for it in d["items"]:
            if it[0] == "l":
                a, b = it[1], it[2]
                yield pymupdf.Rect(min(a.x, b.x), min(a.y, b.y), max(a.x, b.x), max(a.y, b.y))
            elif it[0] == "re":
                r = it[1]
                if d.get("color") is None and r.width > 3 and r.height > 3:
                    continue  # pure fill (background), not a border
                for e in ((r.x0, r.y0, r.x1, r.y0), (r.x0, r.y1, r.x1, r.y1),
                          (r.x0, r.y0, r.x0, r.y1), (r.x1, r.y0, r.x1, r.y1)):
                    yield pymupdf.Rect(*e)


def hits(seg, rect, tol=0.3):
    r = pymupdf.Rect(rect.x0 + tol, rect.y0 + tol, rect.x1 - tol, rect.y1 - tol)
    s = pymupdf.Rect(seg.x0 - 0.01, seg.y0 - 0.01, seg.x1 + 0.01, seg.y1 + 0.01)
    if not r.intersects(s):
        return False
    big = pymupdf.Rect(rect.x0 - 0.4, rect.y0 - 0.4, rect.x1 + 0.4, rect.y1 + 0.4)
    return not big.contains(s)  # fully hidden old line is fine; crossing the edge = cut


def load_fixes():
    f = ROOT / "js" / "lesson-plans-whiteout.js"
    if not f.exists():
        return {}
    t = f.read_text(encoding="utf-8")
    return json.loads(t[t.index("{"): t.rindex("}") + 1])


def apply_fixes(plan, rects, sizes, fixes):
    fx = fixes.get(plan["id"], {})
    out, counter = [], {}
    for pi, zone, r in rects:
        n = counter.get((pi, zone), 0); counter[(pi, zone)] = n + 1
        v = fx.get(f"{pi}|{zone}|{n}")
        if v:
            H = sizes[pi][1]
            r = pymupdf.Rect(v[0], H - (v[1] + v[3]), v[0] + v[2], H - v[1])
        out.append((pi, zone, r))
    return out


FIXES = {}


def audit_plan(plan):
    path = ROOT / plan["pdf_file"]
    if not path.exists():
        return {"id": plan["id"], "error": "missing " + plan["pdf_file"]}
    doc = pymupdf.open(path)
    sizes = [(p.rect.width, p.rect.height) for p in doc]
    sigfix = FIXES.get(plan["id"], {}).get("sig")
    if sigfix:
        plan = dict(plan, _sig=sigfix)
    rects = apply_fixes(plan, stamp_rects(plan, len(doc), sizes), sizes, FIXES)
    issues = []
    cache = {}
    for pi, kind, rect in rects:
        if pi not in cache:
            pg = doc[pi]
            cache[pi] = (pg.get_text("words"), list(segments(pg.get_drawings())))
        words, segs = cache[pi]
        cut, covered = [], []
        for w in words:
            wr = pymupdf.Rect(w[:4])
            if wr.is_empty or rect.is_empty or not wr.intersects(rect):
                continue
            inter = pymupdf.Rect(wr) & rect
            ratio = inter.get_area() / max(wr.get_area(), 1e-6)
            if ratio >= 0.9:
                covered.append(w[4])
            elif ratio > 0.08:
                cut.append((w[4], round(wr.y0, 1), round(ratio, 2)))
        borders = 0 if rect.is_empty else sum(1 for s in segs if hits(s, rect))
        if kind.startswith("footer-text") or kind == "footer-line":
            covered = covered  # footer overlay: any text here is a collision
        if cut or borders or (covered and kind in ("footer-line", "footer-text")):
            issues.append({"page": pi + 1, "zone": kind,
                           "rect": [round(v, 1) for v in rect],
                           "cut_words": cut[:8], "n_cut": len(cut),
                           "cut_borders": borders,
                           "covered_sample": " ".join(covered)[:80], "n_covered": len(covered)})
    return {"id": plan["id"], "file": plan["pdf_file"], "issues": issues}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json")
    ap.add_argument("--plan")
    ap.add_argument("--raw", action="store_true", help="ignore js/lesson-plans-whiteout.js")
    a = ap.parse_args()
    global FIXES
    FIXES = {} if a.raw else load_fixes()
    plans = [p for p in load_plans() if not a.plan or p["id"] == a.plan]
    results = [audit_plan(p) for p in plans]
    zone_count = {}
    bad = 0
    for r in results:
        if r.get("error"):
            print("ERR", r["id"], r["error"]); continue
        if r["issues"]:
            bad += 1
        for it in r["issues"]:
            zone_count[it["zone"]] = zone_count.get(it["zone"], 0) + 1
    print(f"plans: {len(results)}  with collisions: {bad}")
    for z, c in sorted(zone_count.items(), key=lambda x: -x[1]):
        print(f"  {z:14s} {c}")
    if a.json:
        Path(a.json).write_text(json.dumps(results, ensure_ascii=False, indent=1), encoding="utf-8")
        print("report ->", a.json)


if __name__ == "__main__":
    main()
