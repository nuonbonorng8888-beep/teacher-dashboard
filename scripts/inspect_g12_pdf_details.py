# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf"
doc = fitz.open(pdf_path)
print(f"Total pages in G12 sample: {len(doc)}")

# Render Page 0 top
p0 = doc[0]
rect0 = fitz.Rect(0, 0, p0.rect.width, 250)
pix0 = p0.get_pixmap(clip=rect0, dpi=150)
pix0.save("g12_page0_clip.png")
print("Saved g12_page0_clip.png")

# Extract text on Page 0 top
print("Page 0 top text blocks:")
for b in p0.get_text("blocks"):
    if b[1] < 250:
        print(f"  y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} -> {repr(b[4].strip())}")

# Render signature page
sig_page_idx = 2
if sig_page_idx < len(doc):
    psig = doc[sig_page_idx]
    rect_sig = fitz.Rect(0, psig.rect.height - 300, psig.rect.width, psig.rect.height)
    pix_sig = psig.get_pixmap(clip=rect_sig, dpi=150)
    pix_sig.save("g12_sig_clip.png")
    print("Saved g12_sig_clip.png")

    print(f"Page {sig_page_idx} bottom text blocks:")
    for b in psig.get_text("blocks"):
        if b[1] > psig.rect.height - 300:
            print(f"  y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} -> {repr(b[4].strip())}")

