# -*- coding: utf-8 -*-
import sys, pymupdf, os, json, re

sys.stdout.reconfigure(encoding='utf-8')

missing_files = [
    ('8_2_1_មេរៀនទី2_ស្វ័យគុណ.pdf', 1),
    ('8_2_2_មេរៀនទី2_ស្វ័យគុណ.pdf', 2),
    ('8_2_3_មេរៀនទី2_ស្វ័យគុណ.pdf', 3),
    ('8_2_4_មេរៀនទី2_ស្វ័យគុណ.pdf', 4),
    ('8_2_5_មេរៀនទី2_ស្វ័យគុណ.pdf', 5),
    ('8_3_1_មេរៀនទី៣_ទំហំសមាមាត្រនិងភាគរយ.pdf', 1)
]

for fname, num in missing_files:
    fpath = os.path.join('កិច្ចការតែងការទី៨', fname)
    doc = pymupdf.open(fpath)
    p0 = doc[0]
    text0 = p0.get_text()
    print(f"\n==================== {fname} ====================")
    lines = [l.strip() for l in text0.split('\n') if l.strip()]
    for i, l in enumerate(lines[:35]):
        print(f"  {i}: {l}")
