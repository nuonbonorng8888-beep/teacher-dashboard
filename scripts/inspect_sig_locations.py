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
    print(f"=== {fname} ({len(doc)} pages) ===")
    for pidx in range(len(doc)-1, -1, -1):
        p = doc[pidx]
        text = p.get_text()
        if 'បានឃើញ' in text or 'គ្រូបង្រៀន' in text or 'រាជធានី' in text:
            print(f"  Found signatures on Page {pidx+1} (index {pidx}):")
            for b in p.get_text('blocks'):
                t = b[4].strip().replace('\n', ' ')
                if any(k in t for k in ['បាន', 'គ្រូ', 'នាយក', 'រាជធានី', 'ថ្ងៃ']):
                    print(f"    [{b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}]: {t[:80]}")
            break
