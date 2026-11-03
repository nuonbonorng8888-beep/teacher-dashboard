# -*- coding: utf-8 -*-
import sys
import os
import fitz
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = list(re.finditer(r'\{\s*"id":\s*"(plan_g8_\d+)"[^}]+?"pdf_file":\s*"([^"]+)"', text, re.DOTALL))

sig_info = {}
for m in matches:
    plan_id = m.group(1)
    pdf_path = m.group(2)
    if not os.path.exists(pdf_path):
        continue
    doc = fitz.open(pdf_path)
    total = len(doc)
    
    # 1. Check Page 0 coordinates
    # Line 1: class_name at y ~ 78 - 96
    # Line 4: date at y ~ 141 - 159
    # Line 5: teacher at y ~ 162 - 180
    
    # 2. Find Signature Page
    sig_pno = None
    date_box = None
    teacher_box = None
    
    for pno in range(total):
        words = doc[pno].get_text("words")
        # Look for signature date line
        d_words = [w for w in words if any(k in w[4] for k in ['រាជធ្ននី', 'រាជធានី', 'ភ្នំពេញ', 'េនំមពញ'])]
        t_words = [w for w in words if any(k in w[4] for k in ['រូបង្ងៀន', 'គ្រូបង្រៀន', 'រូ'])]
        if d_words:
            sig_pno = pno
            date_box = d_words[0]
            if t_words:
                teacher_box = t_words[0]
            break
            
    if sig_pno is None:
        # Fallback search for 'ព.ស'
        for pno in range(total):
            words = doc[pno].get_text("words")
            ps_words = [w for w in words if 'ព.ស' in w[4]]
            if ps_words:
                sig_pno = pno
                date_box = ps_words[0]
                t_words = [w for w in words if any(k in w[4] for k in ['រូ', 'គ្រូ'])]
                if t_words: teacher_box = t_words[0]
                break

    sig_info[plan_id] = {
        'total_pages': total,
        'sig_page': sig_pno,
        'date_y0': round(date_box[1], 1) if date_box else None,
        'teacher_y0': round(teacher_box[1], 1) if teacher_box else None,
        'teacher_x0': round(teacher_box[0], 1) if teacher_box else None,
    }

print(f"Scanned {len(sig_info)} Grade 8 plans.")
no_sig = [k for k, v in sig_info.items() if v['sig_page'] is None]
print(f"Plans without detected signature block: {len(no_sig)} -> {no_sig}")

# Print first 5
for k, v in list(sig_info.items())[:8]:
    print(k, v)

