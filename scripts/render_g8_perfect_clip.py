# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("scratch/test_g8_perfect_output.pdf")
p4 = doc[4]
rect4 = fitz.Rect(60, 20, 570, 200)
pix4 = p4.get_pixmap(clip=rect4, dpi=150)
pix4.save("scratch/test_g8_sig_perfect_rendered.png")
print("Saved scratch/test_g8_sig_perfect_rendered.png")
