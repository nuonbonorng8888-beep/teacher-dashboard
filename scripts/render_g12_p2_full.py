# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf")
p2 = doc[2]
pix = p2.get_pixmap(dpi=150)
pix.save("g12_page2_full.png")
print("Saved g12_page2_full.png:", pix.width, pix.height)
