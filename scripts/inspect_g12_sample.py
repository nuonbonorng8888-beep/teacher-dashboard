# -*- coding: utf-8 -*-
import sys, re, os

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect the first plan
print("Length of lesson-plans-data.js:", len(text))

# Let's find plans with Grade 12
blocks = text.split('{\n    "id": "')
print(f"Total blocks: {len(blocks)}")

for b in blocks[1:]:
    if '"grade": "ថ្នាក់ទី ១២"' in b or '"grade": "ថ្នាក់ទី 12"' in b:
        lines = b.split('\n')
        print("--- G12 PLAN SAMPLE ---")
        for line in lines[:25]:
            print(line)
        for line in lines:
            if any(k in line for k in ['pdf_file', 'box_y0', 'class_y0', 'sig_', 'teacher_y0']):
                print(" ", line.strip())
        break
