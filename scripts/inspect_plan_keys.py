import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'window\.NGS_LESSON_PLANS_DATA\s*=\s*(\[.*?\]);?\s*$', text, re.DOTALL)
data = json.loads(m.group(1))
g8 = [p for p in data if p.get('grade') == 'ថ្នាក់ទី ៨']
g12 = [p for p in data if p.get('grade') == 'ថ្នាក់ទី ១២']

print("Grade 8 sample plan:")
for k, v in g8[0].items():
    print(f"  {k}: {repr(v)[:80]}")

print("\nGrade 12 sample plan:")
for k, v in g12[0].items():
    print(f"  {k}: {repr(v)[:80]}")
