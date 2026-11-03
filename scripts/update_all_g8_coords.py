# -*- coding: utf-8 -*-
import sys
import os
import fitz
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'\{\s*"id":\s*"(plan_g8_\d+)"[^}]+?"pdf_file":\s*"([^"]+)"'
matches = list(re.finditer(pattern, text, re.DOTALL))
print(f"Total Grade 8 plans: {len(matches)}")

plan_coords = {}
for m in matches:
    pid = m.group(1)
    pdf_path = m.group(2)
    if not os.path.exists(pdf_path):
        continue
    doc = fitz.open(pdf_path)
    p0 = doc[0]
    p0_words = p0.get_text("words")
    
    # 1. Page 0: class_y0, box_y0 (date), teacher_y0
    w_class = [w for w in p0_words if 'ថ្នាក់ទី' in w[4]]
    class_y = round(w_class[0][1], 1) if w_class else 75.2
    
    w_date = [w for w in p0_words if any(k in w[4] for k in ['កាលបរិ', 'កាលបរិច្ឆេទ'])]
    date_y = round(w_date[0][1], 1) if w_date else 130.0
    
    w_teach = [w for w in p0_words if any(k in w[4] for k in ['បង្រៀនដោយ', 'បង្ងៀន'])]
    # filter 120 < y < 200
    t_cands = [w for w in w_teach if 120 < w[1] < 200]
    teach_y = round(t_cands[0][1], 1) if t_cands else round(date_y + 20, 1)

    # 2. Signature Page
    total = len(doc)
    sig_pno = None
    sig_date_y = None
    sig_teacher_y = None
    sig_teacher_x = 450.0
    
    for pno in range(total):
        words = doc[pno].get_text("words")
        d_words = [w for w in words if any(k in w[4] for k in ['រាជធ្ននី', 'រាជធានី', 'ភ្នំពេញ', 'េនំមពញ', 'ព.ស'])]
        t_words = [w for w in words if any(k in w[4] for k in ['រូបង្ងៀន', 'គ្រូបង្រៀន', 'រូ'])]
        if d_words:
            sig_pno = pno
            sig_date_y = round(d_words[0][1], 1)
            if t_words:
                sig_teacher_y = round(t_words[0][1] + 45.0, 1) # ~45pt below 'គ្រូបង្រៀន'
                sig_teacher_x = round(t_words[0][0] - 10.0, 1)
            else:
                sig_teacher_y = round(sig_date_y + 60.0, 1)
            break
            
    if sig_pno is None:
        sig_pno = max(0, total - 2) if total > 1 else 0
        sig_date_y = 50.0
        sig_teacher_y = 110.0
        sig_teacher_x = 440.0

    plan_coords[pid] = {
        'cover_page_index': 0,
        'class_y0': class_y,
        'box_y0': date_y,
        'teacher_y0': teach_y,
        'sig_page_index': sig_pno,
        'sig_date_y0': sig_date_y,
        'sig_teacher_y0': sig_teacher_y,
        'sig_teacher_x0': sig_teacher_x,
        'total_pages': total
    }

print(f"Extracted coordinates for {len(plan_coords)} plans.")
print("Sample plan_g8_1:", plan_coords['plan_g8_1'])
print("Sample plan_g8_2:", plan_coords['plan_g8_2'])

