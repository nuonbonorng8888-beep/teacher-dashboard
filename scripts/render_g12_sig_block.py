# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Let's see what Grade 12 PDF page 2 looks like in "ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf"
doc = fitz.open("ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf")
p2 = doc[2] # sig page of plan 1
rect = fitz.Rect(60, 560, 560, 720)
pix = p2.get_pixmap(clip=rect, dpi=150)
pix.save("g12_plan1_sig_rendered.png")
print("Saved g12_plan1_sig_rendered.png")
