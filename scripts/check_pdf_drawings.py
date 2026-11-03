# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/browser_stamped_8_1_1.pdf"
doc = fitz.open(pdf_path)

p0 = doc[0]
print("Page 0 get_drawings:")
for d in p0.get_drawings():
    if d['rect'].y0 > 60 and d['rect'].y1 < 200:
        print("  rect:", d['rect'], "fill:", d.get('fill'))

p4 = doc[4]
print("Page 4 get_drawings:")
for d in p4.get_drawings():
    if d['rect'].y0 < 220:
        print("  rect:", d['rect'], "fill:", d.get('fill'))
