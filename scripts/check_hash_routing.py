import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'hash|location\.hash|switchTab', text)
print(f"Matches count: {len(matches)}")
for idx, l in enumerate(text.splitlines()[-150:], 1):
    if 'hash' in l or 'switchTab' in l or 'lesson-plans' in l:
        print(f"L{idx}: {l.strip()}")
