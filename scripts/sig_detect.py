"""
Locate the OLD signature block on a lesson-plan PDF page (shared by build_g9_plans.py and
calibrate_whiteouts.py).

The old block starts with a date line ("ថ្ងៃ ខែ ឆ្នាំ ព.ស.២៥…" / "រាជធានីភ្នំពេញ …") followed by the three
signature titles. Most PDFs keep it as text; a few keep it as images - both are handled.

block_on_page(page) -> (top, bottom, kind) in top-down points, or None.
"""
import re
import pymupdf

LUNAR = re.compile(r"[ពរ]្?\.ស")                 # "ព.ស.២៥…" / "រ.ស្.២៥…" / "ព.ស……"
CAPITAL = re.compile(r"ជធ|រារធ|រធ្ន")          # "រាជធានីភ្នំពេញ …" in every font mangling seen so far


def wide_hlines(pg, min_w=150):
    """y of every long horizontal rule / rectangle edge (table borders)."""
    ys = []
    for d in pg.get_drawings():
        for it in d["items"]:
            if it[0] == "l":
                a, b = it[1], it[2]
                if abs(a.y - b.y) < 1.5 and abs(a.x - b.x) > min_w:
                    ys.append(max(a.y, b.y))
            elif it[0] == "re":
                r = it[1]
                if r.width > min_w:
                    ys.append(r.y1)
                    if r.height < 1.5:
                        ys.append(r.y0)
    return sorted(ys)


def _images(pg):
    area = pg.rect.get_area()
    out = []
    for im in pg.get_image_info():
        r = pymupdf.Rect(im["bbox"])
        if r.get_area() < 0.3 * area and r.width > 20:
            out.append(r)
    return out


def block_on_page(pg):
    H = pg.rect.height
    words = pg.get_text("words")
    lun = [w for w in words if LUNAR.search(w[4])]
    cap = [w for w in words if CAPITAL.search(w[4])]
    # a real block has the lunar-date line AND the capital line right under it; a lone "capital-like"
    # word is usually ordinary lesson text in a mangled font
    hit = lun + [c for c in cap if any(0 <= c[1] - l[1] <= 45 for l in lun)] if lun else []
    hl = wide_hlines(pg)

    if hit:
        top = min(w[1] for w in hit)
        kind = "text"
    else:
        # image-only block: images below the table's last border (>= 2 of them, wide enough)
        last = max((y for y in hl if y < H - 60), default=None)
        lo = (last - 1.0) if last is not None else H * 0.35
        imgs = [r for r in _images(pg) if r.y0 >= lo and r.y1 <= H - 40]
        if len(imgs) < 2 or (max(r.x1 for r in imgs) - min(r.x0 for r in imgs)) < 200:
            return None
        top = min(r.y0 for r in imgs)
        kind = "image"

    # never cut into the table's bottom border just above the block
    border = max((y for y in hl if top - 25 < y <= top + 1.5), default=None)
    t = top - 1.5
    if border is not None:
        t = max(t, border + 0.7)

    # old block = contiguous lines below top (gap <= 40pt) + any images that belong to it
    rows = sorted((w[1], w[3]) for w in words if w[1] >= top - 1 and w[1] < H - 60)
    bot = top
    for y0, y1 in rows:
        if y0 - bot > 40:
            break
        bot = max(bot, y1)
    for r in _images(pg):
        if r.y0 >= top - 2 and r.y1 <= H - 40:
            bot = max(bot, r.y1)
            t = min(t, max(r.y0 - 1.5, (border + 0.7) if border is not None else -1e9))
    return round(t, 1), round(bot + 2.0, 1), kind


def find_sig_page(doc):
    """(page_index, top, bottom, kind) of the old signature block, or None.
    Text hits win (last page that has one); otherwise the last page whose images look like a block."""
    best = None
    for i in range(1, len(doc)):
        r = block_on_page(doc[i])
        if r and r[2] == "text":
            best = (i,) + r
    if best:
        return best
    for i in range(len(doc) - 1, 0, -1):
        r = block_on_page(doc[i])
        if r:
            return (i,) + r
    return None
