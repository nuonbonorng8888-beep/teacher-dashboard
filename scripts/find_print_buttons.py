# -*- coding: utf-8 -*-
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Find click event listeners or onclick
for line in text.splitlines():
    if any(k in line for k in ['printPlans', 'downloadCustomPdf', 'downloadMergedPdf', 'window.print']):
        print(line.strip())

