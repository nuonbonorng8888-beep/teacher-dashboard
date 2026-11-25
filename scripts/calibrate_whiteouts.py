"""
Calibrate every whiteout rectangle of applyPdfCustomStamps against the real PDF content,
and write js/lesson-plans-whiteout.js  (window.NGS_WHITEOUT_FIX).

Rule for each nominal rectangle R and every element E (word / line segment / image) touching it:
  - E mostly INSIDE R  (>= 50%)  -> old content to remove  -> grow R to cover E fully (max +8pt per side)
  - E mostly OUTSIDE R (<  50%)  -> real content to keep    -> shrink R so it no longer touches E
  - G12/G11 header: the old full-width separator line (top 80pt) is always removed.
Only rectangles that actually change are written.

Key format in output:  "<pageIdx>|<zone>|<n>" -> [x, y, w, h] in pdf-lib (bottom-up) coordinates,
where n = order of that zone's rectangle on that page (matches call order in the JS).

Usage: python scripts/calibrate_whiteouts.py  [--plan id] [--dry]
"""
import json, argparse, re
from pathlib import Path
import pymupdf
import sig_detect
from audit_whiteout_collisions import load_plans, stamp_rects, ROOT

OUT = ROOT / "js" / "lesson-plans-whiteout.js"
# Hand-measured signature geometry (see file for field meanings)
SIG_OVERRIDES = {k: v for k, v in json.loads(
    (ROOT / "scripts" / "signature_overrides.json").read_text(encoding="utf-8")).items() if not k.startswith("_")}
# Signature is NOT auto-calibrated: several signature pages are scanned images (no text layer),
# so its geometry must be reviewed visually (see audit report).
WO_ZONES = {"header", "footer-wo", "cover-class", "cover-date", "cover-teacher"}
# Which edges a zone may move when it must avoid real content
SHRINK_DIRS = {"header": ("bottom",), "footer-wo": ("top",),
               "cover-class": ("top", "bottom", "right"), "cover-date": ("top", "bottom", "right"),
               "cover-teacher": ("top", "bottom", "right")}
PAD = 0.6
MAX_GROW = 8.0


def elements(page):
    W, H = page.rect.width, page.rect.height
    els = []
    for r, _t in sig_detect.ink_words(page):
        els.append(("word", r))
    for d in page.get_drawings():
        for it in d["items"]:
            if it[0] == "l":
                a, b = it[1], it[2]
                r = pymupdf.Rect(min(a.x, b.x), min(a.y, b.y), max(a.x, b.x), max(a.y, b.y))
                els.append(("line", r))
            elif it[0] == "re":
                r = pymupdf.Rect(it[1])
                if r.get_area() > 0.5 * W * H:
                    continue
                if d.get("color") is not None or r.width < 3 or r.height < 3:
                    for e in ((r.x0, r.y0, r.x1, r.y0), (r.x0, r.y1, r.x1, r.y1),
                              (r.x0, r.y0, r.x0, r.y1), (r.x1, r.y0, r.x1, r.y1)):
                        els.append(("line", pymupdf.Rect(*e)))
                if d.get("fill") is not None and r.width >= 3 and r.height >= 3:
                    els.append(("fill", r))
            elif it[0] == "c":
                pts = it[1:5]
                xs, ys = [p.x for p in pts], [p.y for p in pts]
                els.append(("line", pymupdf.Rect(min(xs), min(ys), max(xs), max(ys))))
    for im in page.get_image_info():
        r = pymupdf.Rect(im["bbox"])
        if r.get_area() < 0.5 * W * H:
            els.append(("image", r))
    return els


def thick(r):
    r = pymupdf.Rect(r)
    if r.height < 0.5:
        r.y0 -= 0.3; r.y1 += 0.3
    if r.width < 0.5:
        r.x0 -= 0.3; r.x1 += 0.3
    return r


def touches(e, R, tol=0.15):
    inner = pymupdf.Rect(R.x0 + tol, R.y0 + tol, R.x1 - tol, R.y1 - tol)
    return inner.intersects(e)


def frac_inside(e, R):
    i = pymupdf.Rect(e) & R
    if i.is_empty:
        return 0.0
    return i.get_area() / max(e.get_area(), 1e-6)


def shrink_away(R, e, dirs=("top", "bottom", "left", "right")):
    """Smallest-loss shrink of R (only along allowed edges) so it does not overlap e."""
    allc = {"top": pymupdf.Rect(R.x0, e.y1 + PAD, R.x1, R.y1),
            "bottom": pymupdf.Rect(R.x0, R.y0, R.x1, e.y0 - PAD),
            "left": pymupdf.Rect(e.x1 + PAD, R.y0, R.x1, R.y1),
            "right": pymupdf.Rect(R.x0, R.y0, e.x0 - PAD, R.y1)}
    cands = [allc[d] for d in dirs if allc[d].width > 1 and allc[d].height > 1]
    if not cands:
        return pymupdf.Rect(R.x0, R.y0, R.x0, R.y0)
    return max(cands, key=lambda c: c.get_area())


def fit(R0, els, zone, page_w, drop_old_line=False):
    R = pymupdf.Rect(R0)
    limit = pymupdf.Rect(R0.x0 - MAX_GROW, R0.y0 - MAX_GROW, R0.x1 + MAX_GROW, R0.y1 + MAX_GROW)
    keep, remove = [], []
    for kind, e in els:
        e = thick(e)
        old_header_line = (drop_old_line and zone == "header" and kind == "line" and e.height < 2.5
                           and e.width > 0.6 * page_w and e.y1 < R0.y1 + MAX_GROW)
        if old_header_line:
            e = pymupdf.Rect(e.x0, e.y0 - 0.5, e.x1, e.y1 + 0.5)  # cover full stroke width
        elif not touches(e, R0):
            continue
        if zone.startswith("cover") and kind == "word":
            # old value on the same text line, right of the colon
            vov = max(0.0, min(e.y1, R0.y1) - max(e.y0, R0.y0)) / max(e.height, 1e-6)
            is_old = vov >= 0.5 and e.x0 >= R0.x0 - MAX_GROW and e.x1 <= R0.x1 + MAX_GROW
        else:
            is_old = frac_inside(e, R0) >= 0.5 and limit.contains(e) and kind != "fill"
        if old_header_line or is_old:
            remove.append(e)
        else:
            keep.append(e)
    # header: remove anything lying fully above the old separator line too
    for e in remove:
        R |= pymupdf.Rect(e.x0 - PAD, e.y0 - PAD, e.x1 + PAD, e.y1 + PAD)
    R &= limit
    # elements newly touched by growth are re-classified as keep unless fully covered
    for kind, e in els:
        e = thick(e)
        if any(e == r for r in remove) or not touches(e, R) or touches(e, R0):
            continue
        if not R.contains(e):
            keep.append(e)
    for _ in range(3):
        moved = False
        for e in keep:
            if touches(e, R):
                R = shrink_away(R, e, SHRINK_DIRS.get(zone, ("top", "bottom", "left", "right"))); moved = True
        if not moved:
            break
    if zone == "header":
        # The old header ends with a black rule (y~63 on Grade 12) which is also the table's top border on
        # many pages. Everything above it is old header: reach it (minus 0.8pt) so no logo/Facebook/Website
        # bits survive, even when a tall neighbouring title box made the content look closer than it is.
        # first rule / table edge (horizontal or the top of a vertical border) below the Website underline (y~47)
        rules = [e for kind, e in els if kind == "line" and 50 < e.y0 < 70 and (e.width > 20 or e.height > 20)]
        if rules:
            ry = min(e.y0 for e in rules)
            if R.y1 < ry - 0.8 and ry - 0.8 - R0.y1 <= MAX_GROW:
                R = pymupdf.Rect(R.x0, R.y0, R.x1, ry - 0.8)
    return R


def calibrate(plan):
    path = ROOT / plan["pdf_file"]
    if not path.exists():
        return None, []
    doc = pymupdf.open(path)
    sizes = [(p.rect.width, p.rect.height) for p in doc]
    rects = stamp_rects(plan, len(doc), sizes)
    cache, fixes, counter, notes = {}, {}, {}, []
    for pi, zone, R0 in rects:
        n = counter.get((pi, zone), 0)
        counter[(pi, zone)] = n + 1
        if zone not in WO_ZONES:
            continue
        if pi not in cache:
            cache[pi] = elements(doc[pi])
        # JS draws a NEW header line only where hasHighTable is false (page 0, unless listed);
        # elsewhere the old separator line is the page's only line, so keep it.
        new_line_drawn = pi == 0 and 0 not in (plan.get("high_table_pages") or [])
        R = fit(R0, cache[pi], zone, sizes[pi][0], drop_old_line=new_line_drawn)
        if all(abs(a - b) < 0.05 for a, b in zip(R, R0)):
            continue
        H = sizes[pi][1]
        key = f"{pi}|{zone}|{n}"
        fixes[key] = [round(R.x0, 2), round(H - R.y1, 2), round(max(R.width, 0), 2), round(max(R.height, 0), 2)]
        notes.append(f"{plan['id']} p{pi+1} {zone}#{n}: "
                     f"{[round(v,1) for v in R0]} -> {[round(v,1) for v in R]}")
    sig = SIG_OVERRIDES.get(plan["id"])
    if sig:
        fixes["sig"] = sig
    else:
        auto = sig_block_auto(plan, doc)
        if auto:
            fixes["sig_top"], fixes["sig_bot"] = auto
    skip = footer_skip(doc)
    if skip:
        fixes["footer_skip"] = skip
    pt = cover_font_pt(plan, doc)
    if pt:
        fixes["cover_font_pt"] = pt
    return fixes, notes


def sig_page_index(plan, n):
    spi = plan.get("sig_page_index")
    if spi is None and "sig_page_index" in plan or plan.get("has_signatures") is False:
        return None
    si = spi if isinstance(spi, int) and spi < n else n - 1
    g = plan.get("id", "")
    if not isinstance(spi, int) and "_g12_" in g and n >= 4:
        si = n - 2
    return si


def sig_block_auto(plan, doc):
    """(top, bottom) top-down y of the OLD signature block on the page the JS stamps
    (text lines or, failing that, images - see sig_detect.py). None if not found."""
    si = sig_page_index(plan, len(doc))
    if si is None:
        return None
    r = sig_detect.block_on_page(doc[si])
    return (r[0], r[1]) if r else None


FOOTER_PARTS = (("L", 65.0, 260.0), ("C", 262.0, 335.0), ("R", 400.0, 547.0))   # x ranges of the 3 footer parts


def footer_skip(doc):
    """{page_index: "LCR-subset"}: footer parts (teacher / page number / phone, drawn at y = H-27 .. H-12)
    that would be printed on top of real page content (a table or figure that runs to the page bottom)."""
    out = {}
    for i, pg in enumerate(doc):
        H, W = pg.rect.height, pg.rect.width
        if W < 400:
            continue
        pix = pg.get_pixmap(matrix=pymupdf.Matrix(2, 2), colorspace=pymupdf.csGRAY, alpha=False)
        buf, st = pix.samples, pix.stride
        bad = ""
        for key, x0, x1 in FOOTER_PARTS:
            n = 0
            for y in range(int((H - 28) * 2), min(int((H - 11) * 2), pix.height)):
                row = buf[y * st + int(x0 * 2): y * st + int(x1 * 2)]
                n += row.translate(sig_detect._DARK).count(1)
            if n > 6:
                bad += key
        if bad:
            out[str(i)] = bad
    return out


def cover_font_pt(plan, doc):
    """Font size (pt) of the original cover-page value text (right of the colons),
    so stamped class/date/teacher match the document. Most common Siemreap size wins."""
    ci = plan.get("cover_page_index") or 0
    if ci >= len(doc):
        return None
    xs = [v for v in (plan.get("class_x"), plan.get("date_x"), plan.get("teacher_x")) if isinstance(v, (int, float))]
    ys = [v for v in (plan.get("class_y0"), plan.get("box_y0"), plan.get("teacher_y0")) if isinstance(v, (int, float))]
    if not xs or not ys:
        return None
    x0, y0, y1 = min(xs) - 5, min(ys) - 4, max(ys) + 24
    cnt = {}
    for b in doc[ci].get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            for sp in l["spans"]:
                t = sp["text"].strip()
                if not t or set(t) <= set(".…:") or "Siemreap" not in sp["font"]:
                    continue
                bx = sp["bbox"]
                if bx[0] >= x0 and y0 <= bx[1] <= y1:
                    k = round(sp["size"] * 2) / 2
                    cnt[k] = cnt.get(k, 0) + len(t)
    if not cnt:
        return None
    return max(cnt, key=cnt.get)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plan")
    ap.add_argument("--dry", action="store_true")
    a = ap.parse_args()
    allfix, total = {}, 0
    for p in load_plans():
        if a.plan and p["id"] != a.plan:
            continue
        fixes, notes = calibrate(p)
        if fixes:
            allfix[p["id"]] = fixes
            total += len(fixes)
        for s in notes:
            if a.plan:
                print(s)
    print(f"plans fixed: {len(allfix)}  rectangles adjusted: {total}")
    if not a.dry and not a.plan:
        OUT.write_text(
            "// AUTO-GENERATED by scripts/calibrate_whiteouts.py - do not edit by hand.\n"
            "// Per-plan whiteout rectangles measured against the real PDF content.\n"
            "// key: \"pageIdx|zone|n\" -> [x, y, w, h] (pdf-lib bottom-up points)\n"
            "window.NGS_WHITEOUT_FIX = " + json.dumps(allfix, ensure_ascii=False, indent=1) + ";\n",
            encoding="utf-8")
        print("written", OUT)


if __name__ == "__main__":
    main()
