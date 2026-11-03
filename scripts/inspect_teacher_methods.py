# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Find teacher related methods
matches = re.findall(r'(\w*Teacher\w*\(.*?\)\s*\{)', text)
print("Teacher methods:", matches)

# Find where batchTeacherSelect is rendered
lines = text.split('\n')
for i, l in enumerate(lines):
    if 'batchTeacherSelect' in l or 'setTeacher' in l:
        print(f"{i+1}: {l.strip()[:100]}")

