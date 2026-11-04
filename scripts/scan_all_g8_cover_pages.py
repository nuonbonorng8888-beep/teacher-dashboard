import pymupdf
import glob
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

print("=== SCANNING COVER PAGE (PAGE 0) IN ALL 78 GRADE 8 PDFS ===\n")

for f in sorted(glob.glob('កិច្ចការតែងការទី៨/8_*.pdf')):
    doc = pymupdf.open(f)
    p0 = doc[0]
    blocks = p0.get_text("blocks")
    
    fname = os.path.basename(f)
    
    # Search for class, date, teacher lines
    class_b = [b for b in blocks if 'ថ្នាក់' in b[4] or 'ថនក់' in b[4]]
    date_b = [b for b in blocks if 'កាលបរិច្ឆេទ' in b[4] or 'កលបរិេចឆទ' in b[4] or 'ថ្ងៃទី' in b[4] or 'ៃថ្ងទី' in b[4]]
    teacher_b = [b for b in blocks if 'បង្រៀនដោយ' in b[4] or 'បេរងៀនេដយ' in b[4] or 'គ្រូបង្រៀន' in b[4]]
    title_b = [b for b in blocks if 'កិច្ចតែងការ' in b[4] or 'កិចចែតងករ' in b[4]]
    
    c_y = f"{class_b[0][1]:.1f}-{class_b[0][3]:.1f}" if class_b else "N/A"
    c_x = f"{class_b[0][0]:.1f}" if class_b else "N/A"
    
    d_y = f"{date_b[0][1]:.1f}-{date_b[0][3]:.1f}" if date_b else "N/A"
    d_x = f"{date_b[0][0]:.1f}" if date_b else "N/A"
    
    t_y = f"{teacher_b[0][1]:.1f}-{teacher_b[0][3]:.1f}" if teacher_b else "N/A"
    t_x = f"{teacher_b[0][0]:.1f}" if teacher_b else "N/A"
    
    top_y = f"{title_b[0][1]:.1f}" if title_b else "N/A"
    
    print(f"{fname[:35]:35} | Title_y={top_y:5} | Class: y={c_y:11} x={c_x:5} | Date: y={d_y:11} | Teacher: y={t_y:11}")

