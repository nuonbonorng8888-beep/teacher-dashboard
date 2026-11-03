import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'window\.NGS_TEACHING_SLIDES_DATA\s*=\s*(\[.*?\]);?\s*$', text, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    print(f"Total lessons loaded: {len(data)}")
    for d in data:
        print(f"ID: {d['id']} | Grade: {d.get('grade')} | Chapter: {d.get('chapter_title')} | Lesson: {d.get('lesson_title')} | Slides: {len(d.get('slides', []))}")
else:
    print("Could not match json")

