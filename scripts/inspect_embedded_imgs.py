# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
pdf_path = os.path.join(artifacts_dir, "browser_stamped_8_1_1.pdf")
doc = fitz.open(pdf_path)

print("Page 0 image list:")
for img in doc[0].get_images():
    print(" ", img)

print("Page 4 image list:")
for img in doc[4].get_images():
    print(" ", img)
