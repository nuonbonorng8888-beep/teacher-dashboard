import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/curriculum-outlines.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'["\']8["\']:\s*\{(.*?)\n\s*["\']9["\']:', text, re.DOTALL)
if m:
    print(m.group(1)[:1000])
else:
    print("Could not find Grade 8 in curriculum-outlines.js")
