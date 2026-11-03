# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/apply_master_perfect_pdfs.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'logo_img' in l or 'header' in l or 'Rect(70' in l:
        print(f"{i+1}: {l.strip()}")

