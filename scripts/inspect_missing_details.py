# -*- coding: utf-8 -*-
import sys, pymupdf, os

sys.stdout.reconfigure(encoding='utf-8')

missing_files = [
    '8_2_1_មេរៀនទី2_ស្វ័យគុណ.pdf',
    '8_2_2_មេរៀនទី2_ស្វ័យគុណ.pdf',
    '8_2_3_មេរៀនទី2_ស្វ័យគុណ.pdf',
    '8_2_4_មេរៀនទី2_ស្វ័យគុណ.pdf',
    '8_2_5_មេរៀនទី2_ស្វ័យគុណ.pdf',
    '8_3_1_មេរៀនទី៣_ទំហំសមាមាត្រនិងភាគរយ.pdf'
]

for fname in missing_files:
    fpath = os.path.join('កិច្ចការតែងការទី៨', fname)
    if not os.path.exists(fpath):
        print(f"NOT FOUND: {fpath}")
        continue
    doc = pymupdf.open(fpath)
    p0 = doc[0]
    p_last = doc[-1]
    text0 = p0.get_text()
    lines0 = [l.strip() for l in text0.split('\n') if l.strip()]
    print(f"\n==================== {fname} (Total Pages: {len(doc)}) ====================")
    for l in lines0[:12]:
        print("  ", l)

