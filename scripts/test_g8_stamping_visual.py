# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
pdf_path = os.path.join('កិច្ចការតែងការទី៨', '8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
doc = fitz.open(pdf_path)

page0 = doc[0]
page4 = doc[4]

# Let's inspect Page 0 drawings / rects
print("Page 0 rect:", page0.rect)
print("Page 4 rect:", page4.rect)

# In fitz, let's test drawing whiteout rectangles and inserting text
# Line 1: class at y=78.1-96.1
page0.draw_rect(fitz.Rect(235, 78, 380, 96), color=(1, 1, 1), fill=(1, 1, 1))

# Line 4: date at y=141.1-159.1
page0.draw_rect(fitz.Rect(235, 141, 450, 159), color=(1, 1, 1), fill=(1, 1, 1))

# Line 5: teacher at y=162.1-180.1
page0.draw_rect(fitz.Rect(235, 162, 450, 180), color=(1, 1, 1), fill=(1, 1, 1))

# Render clipped Page 0
pix0 = page0.get_pixmap(clip=fitz.Rect(0, 0, 612, 280), dpi=150)
pix0.save(os.path.join(artifacts_dir, "test_whiteout_page0.png"))

# Page 4 whiteout:
# Date line at y=50.8-68.8, x=450-550
page4.draw_rect(fitz.Rect(440, 50, 560, 68), color=(1, 1, 1), fill=(1, 1, 1))

# Teacher name at y=110-135, x=410-530
page4.draw_rect(fitz.Rect(410, 110, 530, 135), color=(1, 1, 1), fill=(1, 1, 1))

pix4 = page4.get_pixmap(clip=fitz.Rect(0, 0, 612, 220), dpi=150)
pix4.save(os.path.join(artifacts_dir, "test_whiteout_page4.png"))

print("Whiteout test images saved!")
