# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("scratch/test_clean_whiteout_g8.pdf")
p0 = doc[0]
rect0 = fitz.Rect(100, 50, 500, 210)
pix0 = p0.get_pixmap(clip=rect0, dpi=150)
pix0.save("scratch/test_whiteout_p0_clip.png")

p4 = doc[4]
rect4 = fitz.Rect(60, 20, 570, 200)
pix4 = p4.get_pixmap(clip=rect4, dpi=150)
pix4.save("scratch/test_whiteout_p4_clip.png")

print("Saved clips")

