# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx1 = text.find('"id": "plan_g8_1"')
idx2 = text.find('"id": "plan_g8_2"')
print('idx1:', idx1, 'idx2:', idx2)
if idx1 != -1 and idx2 != -1:
    block = text[idx1:idx2]
    for line in block.splitlines():
        if any(k in line for k in ['sig', 'box', 'class', 'teacher']):
            print(line)
