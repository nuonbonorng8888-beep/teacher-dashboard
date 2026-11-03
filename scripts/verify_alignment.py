# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
pdf_path = os.path.join(artifacts_dir, "browser_stamped_8_1_1.pdf")
doc = fitz.open(pdf_path)

# Let's inspect the bounding boxes of drawing operations / images on Page 0
p0 = doc[0]
print("Page 0 get_drawings count:", len(p0.get_drawings()))
for d in p0.get_drawings()[-5:]:
    print("Drawing rect:", d["rect"])

p4 = doc[4]
print("\nPage 4 get_drawings count:", len(p4.get_drawings()))
for d in p4.get_drawings()[-5:]:
    print("Drawing rect:", d["rect"])

