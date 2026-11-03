# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
pdf_path = os.path.join('កិច្ចការតែងការទី៨', '8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
doc = fitz.open(pdf_path)

# Let's inspect Page 0 and Page 4
p0 = doc[0]
p4 = doc[4]

# Top Part Stamping:
# Line 1: Class (y: 78.1)
p0.draw_rect(fitz.Rect(235, 76, 400, 96), color=(1,1,1), fill=(1,1,1))
p0.insert_text(fitz.Point(235, 92), ":   8NGS_B2", fontsize=13, fontname="helv", color=(0,0,0))

# Line 4: Date (y: 141.1)
p0.draw_rect(fitz.Rect(235, 139, 480, 159), color=(1,1,1), fill=(1,1,1))
p0.insert_text(fitz.Point(235, 155), ":   ថ្ងៃព្រហស្បតិ៍ ទី៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦", fontsize=11, fontname="helv", color=(0,0,0))

# Line 5: Teacher (y: 162.1)
p0.draw_rect(fitz.Rect(235, 160, 480, 180), color=(1,1,1), fill=(1,1,1))
p0.insert_text(fitz.Point(235, 176), ":   លោកគ្រូ នួន បូណង", fontsize=12, fontname="helv", color=(0,0,0))

# Bottom Part Stamping (Page 4):
# Date line: y: 50.8
p4.draw_rect(fitz.Rect(440, 48, 560, 68), color=(1,1,1), fill=(1,1,1))
p4.insert_text(fitz.Point(440, 64), " ថ្ងៃទី ២៩ ខែ តុលា ឆ្នាំ ២០២៦", fontsize=11, fontname="helv", color=(0,0,0))

# Teacher Name under 'គ្រូបង្រៀន': y: 114
p4.draw_rect(fitz.Rect(420, 110, 550, 135), color=(1,1,1), fill=(1,1,1))
p4.insert_text(fitz.Point(430, 128), "លោកគ្រូ នួន បូណង", fontsize=12, fontname="helv", color=(0,0,0))

# Save clips
pix0 = p0.get_pixmap(clip=fitz.Rect(0, 0, 612, 280), dpi=150)
pix0.save(os.path.join(artifacts_dir, "test_fixed_page0_top.png"))

pix4 = p4.get_pixmap(clip=fitz.Rect(0, 0, 612, 220), dpi=150)
pix4.save(os.path.join(artifacts_dir, "test_fixed_page4_bottom.png"))

print("Fixed top and bottom visual clips saved successfully!")
