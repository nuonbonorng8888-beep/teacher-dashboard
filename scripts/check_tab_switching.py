import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [l for l in text.splitlines() if 'lesson-plans' in l or 'teaching-slides' in l]
for m in matches[:20]:
    print(m)
