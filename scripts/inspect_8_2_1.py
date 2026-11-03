# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = os.path.join('កិច្ចការតែងការទី៨', '8_2_1_មេរៀនទី2_ស្វ័យគុណ.pdf')
doc = fitz.open(pdf_path)
print("8_2_1 pages:", len(doc))
for pno in range(len(doc)):
    txt = doc[pno].get_text()
    print(f"Page {pno} has {len(txt)} chars. Sample: {repr(txt[:100])}")

