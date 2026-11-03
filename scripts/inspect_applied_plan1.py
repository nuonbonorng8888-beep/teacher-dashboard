# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "scratch/test_applied_plan1.pdf"
doc = fitz.open(pdf_path)
print(f"Total pages in {pdf_path}: {len(doc)}")

p0 = doc[0]
print("--- Page 0 text ---")
for b in p0.get_text("blocks"):
    if 90 < b[1] < 210:
        print(f"y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} | {b[4].strip()}")

psig = doc[2]
print("--- Page 2 text ---")
for b in psig.get_text("blocks"):
    if b[1] > 550:
        print(f"y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} | {b[4].strip()}")
