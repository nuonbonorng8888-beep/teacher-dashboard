import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"].*?lesson_title:\s*[\'"]([^\'"]+)[\'"].*?grade:\s*[\'"]([^\'"]+)[\'"]', text, re.DOTALL)
print(f"Total lessons in teaching-slides-data.js: {len(matches)}")
for m in matches:
    print(" ", m)

