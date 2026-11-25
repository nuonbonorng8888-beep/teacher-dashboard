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


_DARK = bytes(1 if i < 150 else 0 for i in range(256))
_SCALE = 2.0


def _ink_rows(pix, r, scale=_SCALE):
    """(top, bottom) of the real ink of a word in page points. A word's bbox is the font's line box
    (a Khmer title can report 30pt for a 12pt line); only the ink matters for 'does this touch content'.
    Rows that are one long dark run (a table border crossing the box) are ignored."""
    x0, x1 = max(int(r.x0 * scale), 0), min(int(r.x1 * scale) + 1, pix.width)
    y0, y1 = max(int(r.y0 * scale), 0), min(int(r.y1 * scale) + 1, pix.height)
    if x1 - x0 < 2 or y1 - y0 < 2:
        return None
    buf, stride = pix.samples, pix.stride
    rows = []
    for y in range(y0, y1):
        row = buf[y * stride + x0: y * stride + x1]
        n = row.translate(_DARK).count(1)
        if 0 < n < 0.85 * len(row):
            rows.append(y)
    if not rows:
        return None
    # cluster the ink rows (gap < 1.5pt = same text line); a thin cluster at the very top/bottom that is
    # detached from the rest is a NEIGHBOUR's ink (e.g. dotted leaders of the row above) - drop it
    gap = 1.5 * scale
    clusters = [[rows[0], rows[0]]]
    for y in rows[1:]:
        if y - clusters[-1][1] <= gap:
            clusters[-1][1] = y
        else:
            clusters.append([y, y])
    thin = 1.8 * scale
    while len(clusters) > 1 and clusters[0][1] - clusters[0][0] < thin:
        clusters.pop(0)
    while len(clusters) > 1 and clusters[-1][1] - clusters[-1][0] < thin:
        clusters.pop()
    return clusters[0][0] / scale, (clusters[-1][1] + 1) / scale


def ink_words(page):
    """Word rects trimmed to their real ink (top/bottom) in the header, cover and footer bands."""
    H = page.rect.height
    pix = page.get_pixmap(matrix=pymupdf.Matrix(_SCALE, _SCALE), colorspace=pymupdf.csGRAY, alpha=False)
    out = []
    for w in page.get_text("words"):
        r = pymupdf.Rect(w[:4])
        if r.is_empty:
            continue
        if r.y0 < 230 or r.y1 > H - 110:
            ink = _ink_rows(pix, r)
            if ink:
                r = pymupdf.Rect(r.x0, max(r.y0, ink[0]), r.x1, min(r.y1, ink[1]))
        out.append((r, w[4]))
    return out
