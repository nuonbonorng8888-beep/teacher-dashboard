import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'window\.NGS_LESSON_PLANS_DATA\s*=\s*(\[.*?\]);?\s*$', text, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    g8 = [p for p in data if p.get('grade') == 'ថ្នាក់ទី ៨']
    lessons_seen = {}
    for p in g8:
        ch = p.get('chapter')
        title = p.get('lesson_title')
        if ch not in lessons_seen:
            lessons_seen[ch] = title
    print(f"Total unique Grade 8 lessons: {len(lessons_seen)}")
    for k, v in lessons_seen.items():
        print(f"  {k} -> {v}")

