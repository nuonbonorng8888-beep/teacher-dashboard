# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("scratch/browser_stamped_8_1_1.pdf")
p0 = doc[0]
p4 = doc[4]

print("=== Browser Stamped PDF Page 0 Text ===")
for b in p0.get_text("blocks"):
    if b[1] < 210:
        print(f"y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} | {repr(b[4].strip())}")

print("\n=== Browser Stamped PDF Page 4 Images & Text ===")
for img in p4.get_images():
    xref = img[0]
    bi = doc.extract_image(xref)
    print(f"p4 image xref {xref}: {bi['width']}x{bi['height']}")

for b in p4.get_text("blocks"):
    if b[1] < 220:
        print(f"y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} | {repr(b[4].strip())}")

