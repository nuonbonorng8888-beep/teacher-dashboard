# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "scratch/test_applied_plan1.pdf"
doc = fitz.open(pdf_path)

p0 = doc[0]
rect0 = fitz.Rect(100, 80, 500, 220)
pix0 = p0.get_pixmap(clip=rect0, dpi=150)
pix0.save("test_applied_p0.png")

p2 = doc[2]
rect2 = fitz.Rect(60, 540, 560, 720)
pix2 = p2.get_pixmap(clip=rect2, dpi=150)
pix2.save("test_applied_p2.png")

print("Saved test_applied_p0.png and test_applied_p2.png")
