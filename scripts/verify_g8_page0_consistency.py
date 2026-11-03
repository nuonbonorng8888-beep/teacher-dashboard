# -*- coding: utf-8 -*-
import sys
import os
import fitz
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = list(re.finditer(r'\{\s*"id":\s*"(plan_g8_\d+)"[^}]+?"pdf_file":\s*"([^"]+)"', text, re.DOTALL))

y_class_list = []
y_date_list = []
y_teacher_list = []

for m in matches:
    plan_id = m.group(1)
    pdf_path = m.group(2)
    if not os.path.exists(pdf_path): continue
    doc = fitz.open(pdf_path)
    p0 = doc[0]
    words = p0.get_text("words")
    
    w_class = [w for w in words if 'ថ្នាក់ទី' in w[4]]
    w_date = [w for w in words if 'កាលបរិ' in w[4] or 'កាលបរិច្ឆេទ' in w[4]]
    w_teach = [w for w in words if 'បង្រៀនដោយ' in w[4] or 'បង្ងៀន' in w[4] or 'បង្រៀន' in w[4]]
    
    if w_class: y_class_list.append(round(w_class[0][1], 1))
    if w_date: y_date_list.append(round(w_date[0][1], 1))
    if w_teach:
        # filter those between y=150 and 200
        t_cands = [w for w in w_teach if 140 < w[1] < 200]
        if t_cands: y_teacher_list.append(round(t_cands[0][1], 1))

from collections import Counter
print("y_class counts:", Counter(y_class_list))
print("y_date counts:", Counter(y_date_list))
print("y_teacher counts:", Counter(y_teacher_list))

