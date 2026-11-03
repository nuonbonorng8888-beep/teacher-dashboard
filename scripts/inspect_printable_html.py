# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'generatePrintableHtml' in l:
        print(f"generatePrintableHtml starts at line {i+1}")
        for j in range(i, min(i + 120, len(lines))):
            print(f"{j+1}: {lines[j].rstrip()}")
        break

