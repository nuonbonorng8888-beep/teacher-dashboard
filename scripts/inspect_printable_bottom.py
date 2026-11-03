# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1875, min(1950, len(lines))):
    print(f"{i+1}: {lines[i].rstrip()}")

