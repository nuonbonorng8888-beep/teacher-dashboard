# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "scratch/test_perfect_sig.pdf"
doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")
p = doc[2] # or last page
print(f"Page 2 rect: {p.rect}")
for b in p.get_text("blocks"):
    if b[1] > p.rect.height - 300:
        print(f"y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} -> {repr(b[4].strip())}")

pix = p.get_pixmap(clip=fitz.Rect(0, p.rect.height - 300, p.rect.width, p.rect.height), dpi=150)
pix.save("test_perfect_sig_clip.png")
print("Saved test_perfect_sig_clip.png")
