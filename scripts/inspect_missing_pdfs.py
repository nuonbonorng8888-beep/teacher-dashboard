# -*- coding: utf-8 -*-
import sys, pymupdf, os, json

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
    print(f"\n==================== {fname} (Pages: {len(doc)}) ====================")
    p0 = doc[0]
    blocks0 = p0.get_text('blocks')
    for b in blocks0[:15]:
        t = b[4].strip().replace('\n', ' ')
        if t:
            print(f"[{b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}]: {t[:90]}")
    
    # Check last page for signature
    p_last = doc[-1]
    blocks_last = p_last.get_text('blocks')
    print(f"--- Last Page (Page {len(doc)}) Blocks: ---")
    for b in blocks_last:
        t = b[4].strip().replace('\n', ' ')
        if 'ហត្ថ' in t or 'បាន' in t or 'គ្រូ' in t or 'នាយក' in t or 'រាជធានី' in t or 'ថ្ងៃ' in t:
            print(f"  [{b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}]: {t[:90]}")
