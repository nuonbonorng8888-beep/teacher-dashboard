# -*- coding: utf-8 -*-
import docx, os, sys, json

sys.stdout.reconfigure(encoding='utf-8')

missing = [
    '8_2_1_មេរៀនទី2_ស្វ័យគុណ.docx',
    '8_2_2_មេរៀនទី2_ស្វ័យគុណ.docx',
    '8_2_3_មេរៀនទី2_ស្វ័យគុណ.docx',
    '8_2_4_មេរៀនទី2_ស្វ័យគុណ.docx',
    '8_2_5_មេរៀនទី2_ស្វ័យគុណ.docx',
    '8_3_1_មេរៀនទី៣_ទំហំសមាមាត្រនិងភាគរយ.docx'
]

for fname in missing:
    p = os.path.join('កិច្ចការតែងការទី៨', fname)
    doc = docx.Document(p)
    print(f"\n============================== {fname} ==============================")
    paras = [para.text.strip() for para in doc.paragraphs if para.text.strip()]
    for para in paras[:20]:
        print("  ", para)
