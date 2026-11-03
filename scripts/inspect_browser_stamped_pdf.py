# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
pdf_path = os.path.join(artifacts_dir, "browser_stamped_8_1_1.pdf")

doc = fitz.open(pdf_path)
print("Browser stamped PDF pages:", len(doc))

# Clip 1: Page 0 top (y: 0 to 250)
p0 = doc[0]
pix0 = p0.get_pixmap(clip=fitz.Rect(0, 0, 612, 250), dpi=150)
out_img0 = os.path.join(artifacts_dir, "verified_browser_page0_top.png")
pix0.save(out_img0)
print("Saved Page 0 clip:", out_img0)

# Clip 2: Page 4 (bottom signatures, y: 0 to 220)
p4 = doc[4]
pix4 = p4.get_pixmap(clip=fitz.Rect(0, 0, 612, 220), dpi=150)
out_img4 = os.path.join(artifacts_dir, "verified_browser_page4_signatures.png")
pix4.save(out_img4)
print("Saved Page 4 clip:", out_img4)

