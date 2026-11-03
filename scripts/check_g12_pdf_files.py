import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'window\.NGS_LESSON_PLANS_DATA\s*=\s*(\[.*?\]);?\s*$', text, re.DOTALL)
data = json.loads(m.group(1))
g12 = [p for p in data if p.get('grade') == 'ថ្នាក់ទី ១២']

missing = []
found = []
for p in g12:
    pdf_p = p.get('pdf_file')
    if pdf_p and os.path.exists(pdf_p):
        found.append(pdf_p)
    else:
        missing.append((p.get('id'), pdf_p))

print(f"Grade 12 PDF files checked: Total {len(g12)}")
print(f"  Found on disk: {len(found)}")
print(f"  Missing: {len(missing)}")
if missing:
    for m_item in missing[:10]:
        print("    Missing:", m_item)

