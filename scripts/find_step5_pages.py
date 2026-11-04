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
    doc = pymupdf.open(fpath)
    print(f"\n==================== {fname} (Total Pages: {len(doc)}) ====================")
    for pidx in range(len(doc)):
        p = doc[pidx]
        text = p.get_text()
        blocks = p.get_text('blocks')
        step5_blocks = [b for b in blocks if 'ជំហានទី៥' in b[4] or 'កិច្ចការផ្ទះ' in b[4]]
        if step5_blocks:
            max_y = max(b[3] for b in blocks if b[4].strip())
            print(f"  Step 5 on Page {pidx+1} (idx {pidx}): last block y1 = {max_y:.1f}")
        worksheet_blocks = [b for b in blocks if 'សន្លឹកកិច្ចការ' in b[4] or 'សនលឹកកិច្ចការ' in b[4]]
        if worksheet_blocks:
            print(f"  Worksheet on Page {pidx+1} (idx {pidx})")
