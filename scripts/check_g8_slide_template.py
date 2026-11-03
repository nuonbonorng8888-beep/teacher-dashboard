import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'window\.NGS_TEACHING_SLIDES_DATA\s*=\s*(\[.*?\]);?\s*$', text, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    g8 = [d for d in data if d['id'] == 'g8_template'][0]
    print("g8_template keys:")
    for k, v in g8.items():
        if k != 'slides':
            print(f"  {k}: {v}")
    print(f"Total slides in g8_template: {len(g8['slides'])}")
    for s in g8['slides'][:5]:
        print("  Slide:", s.get('slide_num'), s.get('type'), s.get('title'), s.get('chapter_title'))

