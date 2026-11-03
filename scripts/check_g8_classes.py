import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'window\.NGS_LESSON_PLANS_DATA\s*=\s*(\[.*?\]);?\s*$', text, re.DOTALL)
data = json.loads(m.group(1))
g8 = [p for p in data if p.get('grade') == 'ថ្នាក់ទី ៨']
classes = set(p.get('class_name') for p in g8)
print("Unique Grade 8 classes in lesson-plans-data.js:", classes)

