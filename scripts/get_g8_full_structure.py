import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'window\.NGS_LESSON_PLANS_DATA\s*=\s*(\[.*?\]);?\s*$', text, re.DOTALL)
data = json.loads(m.group(1))
g8 = [p for p in data if p.get('grade') == 'ថ្នាក់ទី ៨']

lessons_dict = {}
for p in g8:
    ch = p.get('chapter')
    if ch not in lessons_dict:
        lessons_dict[ch] = {
            'title': ch,
            'lesson_title': p.get('lesson_title'),
            'topics': []
        }
    lessons_dict[ch]['topics'].append({
        'hour': p.get('ch_lesson_num'),
        'topic': p.get('topic')
    })

print(f"Total Grade 8 lessons: {len(lessons_dict)}")
for k, v in lessons_dict.items():
    print(f"{k} ({len(v['topics'])} ម៉ោង)")
    for t in v['topics']:
        print(f"   - ម៉ោងទី {t['hour']}: {t['topic']}")
