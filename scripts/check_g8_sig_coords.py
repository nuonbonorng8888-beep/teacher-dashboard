# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'\{\s*"id":\s*"(plan_g8_\d+)"[^}]+?"pdf_file":\s*"([^"]+)"', text, re.DOTALL))

sig_coords = []
for m in matches[:10]:
    plan_id = m.group(1)
    pdf_path = m.group(2)
    doc = fitz.open(pdf_path)
    total = len(doc)
    sig_pno = None
    for pno in range(total):
        txt = doc[pno].get_text()
        if any(k in txt for k in ['ព.ស', 'រាជធ្ននី', 'រាជធានី', 'ឯកភាេ', 'េិនិែយ']):
            sig_pno = pno
            break
    if sig_pno is not None:
        page = doc[sig_pno]
        words = page.get_text("words")
        date_w = [w for w in words if 'រាជធ' in w[4] or 'ថ្ងៃ' in w[4]]
        teacher_w = [w for w in words if 'រូបង្ងៀន' in w[4] or 'គ្រូ' in w[4]]
        print(f"{plan_id} (p{sig_pno}):")
        if date_w:
            print(f"  Date word rect: y={date_w[0][1]:.1f}-{date_w[0][3]:.1f}, x={date_w[0][0]:.1f}")
        if teacher_w:
            print(f"  Teacher word rect: y={teacher_w[0][1]:.1f}-{teacher_w[0][3]:.1f}, x={teacher_w[0][0]:.1f}")
