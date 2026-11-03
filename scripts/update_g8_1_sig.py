# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx1 = text.find('"id": "plan_g8_1"')
idx2 = text.find('"id": "plan_g8_2"')

if idx1 != -1 and idx2 != -1:
    block = text[idx1:idx2]
    new_block = block.replace('"sig_y0": 32.6,', '"sig_y0": 145.0,')
    if block != new_block:
        text = text[:idx1] + new_block + text[idx2:]
        with open('js/lesson-plans-data.js', 'w', encoding='utf-8') as f:
            f.write(text)
        print('Successfully updated plan_g8_1 sig_y0 to 145.0!')
    else:
        print('Warning: "sig_y0": 32.6 not found in block')
else:
    print('Indices not found')
