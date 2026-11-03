import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\'8\'|\"8\"):.*?\{.*?\}', text, re.DOTALL)
print(f"Matches for '8': {len(matches)}")
for m in matches[:2]:
    print("--- Match ---")
    print(m[:300])
