# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("scratch/test_applied_plan1.pdf")
p0 = doc[0]
bi0 = doc.extract_image(427)
with open("extracted_p0_banner.png", "wb") as f:
    f.write(bi0["image"])

p2 = doc[2]
bi2 = doc.extract_image(436)
with open("extracted_p2_sig.png", "wb") as f:
    f.write(bi2["image"])

print("Saved extracted_p0_banner.png and extracted_p2_sig.png")

