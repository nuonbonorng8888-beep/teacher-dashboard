import pymupdf
import glob
import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# Read js/lesson-plans-data.js
with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']') + 1
plans = json.loads(text[start:end])

g8_plans = [p for p in plans if p.get('grade') in ['ថ្នាក់ទី ៨', 'ថ្នាក់ទី 8']]
print(f"Auditing Cover Page coordinates for all {len(g8_plans)} Grade 8 plans...\n")

updated_coords = {}

for p in g8_plans:
    pid = p['id']
    pdf_path = p['pdf_file']
    
    if not os.path.exists(pdf_path):
        continue
        
    doc = pymupdf.open(pdf_path)
    p0 = doc[0]
    blocks = p0.get_text("blocks")
    
    # Defaults
    class_x = 238.0
    class_y0 = 78.1
    date_x = 238.0
    box_y0 = 141.1
    teacher_x = 238.0
    teacher_y0 = 162.1
    
    # 1. Search for Class line
    # Could be 'ថ្នាក់ទី', 'ថនក់ទី', 'ថ្នាក់'
    c_blocks = [b for b in blocks if ('ថ្នាក់' in b[4] or 'ថនក់' in b[4]) and b[1] < 120]
    if c_blocks:
        b = c_blocks[0]
        # In this block, let's find where ':' or value starts
        class_y0 = round(b[1] + (b[3] - b[1]) * 0.25, 1)
        # Check if it's the 8_12 style (x0 ~ 96.0)
        if b[0] < 110:
            class_x = 185.0
            class_y0 = round(b[1] + 2.0, 1)
        else:
            class_x = 238.0
            
    # 2. Search for Date line
    d_blocks = [b for b in blocks if ('កាលបរិច្ឆេទ' in b[4] or 'កលបរិេចឆទ' in b[4] or 'កាលបរិងច្េទ' in b[4]) and b[1] < 180]
    if d_blocks:
        b = d_blocks[0]
        box_y0 = round(b[1] + 2.0, 1)
        if b[0] < 110:
            date_x = 185.0
        else:
            date_x = 238.0
            
    # 3. Search for Teacher line
    t_blocks = [b for b in blocks if ('បង្រៀនដោយ' in b[4] or 'បេរងៀនេដយ' in b[4] or 'បង្ងៀនងោយ' in b[4]) and b[1] < 200]
    if t_blocks:
        b = t_blocks[0]
        teacher_y0 = round(b[1] + 2.0, 1)
        if b[0] < 110:
            teacher_x = 185.0
        else:
            teacher_x = 238.0
            
    updated_coords[pid] = {
        'class_x': class_x,
        'class_y0': class_y0,
        'date_x': date_x,
        'box_y0': box_y0,
        'teacher_x': teacher_x,
        'teacher_y0': teacher_y0
    }

# Specifically inspect plan_g8_38 to plan_g8_44 (Lesson 12)
for pid in ['plan_g8_38', 'plan_g8_39', 'plan_g8_40', 'plan_g8_41', 'plan_g8_42', 'plan_g8_43', 'plan_g8_44']:
    if pid in updated_coords:
        print(pid, updated_coords[pid])
