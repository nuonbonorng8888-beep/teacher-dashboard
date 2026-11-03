# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("scratch/test_applied_plan1.pdf")
p0 = doc[0]
for img in p0.get_images():
    xref = img[0]
    bi = doc.extract_image(xref)
    print(f"P0 image xref {xref}: {bi['width']}x{bi['height']}")

p2 = doc[2]
for img in p2.get_images():
    xref = img[0]
    bi = doc.extract_image(xref)
    print(f"P2 image xref {xref}: {bi['width']}x{bi['height']}")

