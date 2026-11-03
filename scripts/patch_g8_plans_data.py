# -*- coding: utf-8 -*-
import sys
import os
import fitz
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Parse JSON array window.NGS_LESSON_PLANS_DATA = [...]
prefix = "window.NGS_LESSON_PLANS_DATA = "
suffix = ";"
idx_start = text.find(prefix)
if idx_start == -1:
    print("Could not find prefix!")
    sys.exit(1)

json_str = text[idx_start + len(prefix):].rstrip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)
print(f"Loaded {len(data)} total plans.")

g8_count = 0
for plan in data:
    if plan.get('grade') == 'ថ្នាក់ទី ៨':
        g8_count += 1
        pdf_path = plan.get('pdf_file')
        if not pdf_path or not os.path.exists(pdf_path):
            continue
            
        doc = fitz.open(pdf_path)
        total = len(doc)
        p0 = doc[0]
        p0_words = p0.get_text("words")
        
        # 1. Page 0 coordinates
        w_class = [w for w in p0_words if 'ថ្នាក់ទី' in w[4]]
        class_y = round(w_class[0][1], 1) if w_class else 75.2
        
        w_date = [w for w in p0_words if any(k in w[4] for k in ['កាលបរិ', 'កាលបរិច្ឆេទ'])]
        date_y = round(w_date[0][1], 1) if w_date else 130.0
        
        w_teach = [w for w in p0_words if any(k in w[4] for k in ['បង្រៀនដោយ', 'បង្ងៀន'])]
        t_cands = [w for w in w_teach if 120 < w[1] < 200]
        teach_y = round(t_cands[0][1], 1) if t_cands else round(date_y + 20.0, 1)

        # 2. Signature Page
        sig_pno = None
        sig_date_y = None
        sig_teacher_y = None
        sig_teacher_x = 440.0
        
        for pno in range(total):
            words = doc[pno].get_text("words")
            d_words = [w for w in words if any(k in w[4] for k in ['រាជធ្ននី', 'រាជធានី', 'ភ្នំពេញ', 'េនំមពញ', 'ព.ស'])]
            t_words = [w for w in words if any(k in w[4] for k in ['រូបង្ងៀន', 'គ្រូបង្រៀន', 'រូ'])]
            if d_words:
                sig_pno = pno
                sig_date_y = round(d_words[0][1], 1)
                if t_words:
                    sig_teacher_y = round(t_words[0][1] + 45.0, 1)
                    sig_teacher_x = round(t_words[0][0] - 10.0, 1)
                else:
                    sig_teacher_y = round(sig_date_y + 60.0, 1)
                break
                
        if sig_pno is None:
            sig_pno = max(0, total - 2) if total > 1 else 0
            sig_date_y = 50.0
            sig_teacher_y = 110.0
            sig_teacher_x = 440.0

        plan['cover_page_index'] = 0
        plan['class_y0'] = class_y
        plan['box_y0'] = date_y
        plan['teacher_y0'] = teach_y
        plan['sig_page_index'] = sig_pno
        plan['sig_y0'] = sig_date_y
        plan['sig_teacher_y0'] = sig_teacher_y
        plan['sig_teacher_x0'] = sig_teacher_x
        plan['total_pages'] = total

print(f"Updated {g8_count} Grade 8 plans with exact PDF coordinates.")

# Save back to js/lesson-plans-data.js
new_content = "window.NGS_LESSON_PLANS_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
with open('js/lesson-plans-data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Saved js/lesson-plans-data.js successfully!")

