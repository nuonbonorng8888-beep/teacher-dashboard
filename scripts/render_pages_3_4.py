# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
pdf_path = os.path.join('កិច្ចការតែងការទី៨', '8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
doc = fitz.open(pdf_path)

# Render full Page 3
pix3 = doc[3].get_pixmap(dpi=150)
pix3.save(os.path.join(artifacts_dir, "g8_page3_full.png"))

# Render full Page 4
pix4 = doc[4].get_pixmap(dpi=150)
pix4.save(os.path.join(artifacts_dir, "g8_page4_full.png"))

print("Page 3 and 4 full renders saved!")

