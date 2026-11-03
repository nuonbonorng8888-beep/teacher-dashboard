# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/browser_stamped_8_1_1.pdf"
doc = fitz.open(pdf_path)

p0 = doc[0]
print("P0 images count:", len(p0.get_images()))
for img in p0.get_images():
    bi = doc.extract_image(img[0])
    print(f"  xref {img[0]}: {bi['width']}x{bi['height']}")

p1 = doc[1]
print("P1 images count:", len(p1.get_images()))
for img in p1.get_images():
    bi = doc.extract_image(img[0])
    print(f"  xref {img[0]}: {bi['width']}x{bi['height']}")

