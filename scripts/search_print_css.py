import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('css/style.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'@media\s+print', text)]
print(f"Print media queries found: {len(matches)}")
for p in matches:
    print(text[p:p+400])
