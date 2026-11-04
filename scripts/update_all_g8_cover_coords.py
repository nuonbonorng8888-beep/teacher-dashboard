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

print(f"Loaded {len(plans)} plans. Scanning and fixing coordinates for Grade 8...")

count_fixed = 0

for p in plans:
    if p.get('grade') not in ['ថ្នាក់ទី ៨', 'ថ្នាក់ទី 8']:
        continue
        
    pid = p['id']
    pdf_path = p['pdf_file']
    if not os.path.exists(pdf_path):
        continue
        
    doc = pymupdf.open(pdf_path)
    p0 = doc[0]
    blocks = p0.get_text("blocks")
    
    # 1. Search for Class line
    c_blocks = [b for b in blocks if ('ថ្នាក់' in b[4] or 'ថនក់' in b[4]) and b[1] < 120]
    if c_blocks:
        b = c_blocks[0]
        if b[0] < 110:
            p['class_x'] = 185.0
            p['class_y0'] = round(b[1] + 1.0, 1)
        else:
            p['class_x'] = 238.0
            p['class_y0'] = round(b[1] + 1.0, 1)
            
    # 2. Search for Date line
    d_blocks = [b for b in blocks if ('កាលបរិច្ឆេទ' in b[4] or 'កលបរិេចឆទ' in b[4] or 'កាលបរិងច្េទ' in b[4]) and b[1] < 180]
    if d_blocks:
        b = d_blocks[0]
        if b[0] < 110:
            p['date_x'] = 185.0
            p['box_y0'] = round(b[1] + 1.0, 1)
        else:
            p['date_x'] = 238.0
            p['box_y0'] = round(b[1] + 1.0, 1)
            
    # 3. Search for Teacher line
    t_blocks = [b for b in blocks if ('បង្រៀនដោយ' in b[4] or 'បេរងៀនេដយ' in b[4] or 'បង្ងៀនងោយ' in b[4]) and b[1] < 200]
    if t_blocks:
        b = t_blocks[0]
        if b[0] < 110:
            p['teacher_x'] = 185.0
            p['teacher_y0'] = round(b[1] + 1.0, 1)
        else:
            p['teacher_x'] = 238.0
            p['teacher_y0'] = round(b[1] + 1.0, 1)
            
    count_fixed += 1

# Re-serialize to js/lesson-plans-data.js
new_json = json.dumps(plans, ensure_ascii=False, indent=2)
new_js = f"// NGS High School Lesson Plans Data (Grades 8, 11, and 12)\n// Auto-generated master dataset for Preah Yukunthor High School (NGS)\nwindow.NGS_LESSON_PLANS_DATA = {new_json};\n"

with open('js/lesson-plans-data.js', 'w', encoding='utf-8') as f:
    f.write(new_js)

print(f"Successfully updated {count_fixed} Grade 8 plans with verified coordinates in js/lesson-plans-data.js!")
