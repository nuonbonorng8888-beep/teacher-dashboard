# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = os.path.join('កិច្ចការតែងការទី៨', '8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
doc = fitz.open(pdf_path)

for pno in range(len(doc)):
    page = doc[pno]
    text = page.get_text()
    print(f"=== Page {pno} (length={len(text)}) ===")
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for l in lines[:10]:
        print("  ", l)

