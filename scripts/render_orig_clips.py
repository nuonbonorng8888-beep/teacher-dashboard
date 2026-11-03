# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
pdf_path = os.path.join('កិច្ចការតែងការទី៨', '8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
doc = fitz.open(pdf_path)

# Render Page 0 top
page0 = doc[0]
pix0 = page0.get_pixmap(clip=fitz.Rect(0, 0, 612, 280), dpi=150)
pix0.save(os.path.join(artifacts_dir, "g8_orig_page0_top.png"))

# Render Page 4 top
page4 = doc[4]
pix4 = page4.get_pixmap(clip=fitz.Rect(0, 0, 612, 250), dpi=150)
pix4.save(os.path.join(artifacts_dir, "g8_orig_page4_top.png"))

print("Original clips saved successfully!")

