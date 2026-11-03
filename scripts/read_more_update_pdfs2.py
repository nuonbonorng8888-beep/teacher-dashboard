# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('update_pdfs_with_schedule.py', 'r', encoding='utf-8') as f:
    text = f.read()

print(text[6000:10000])
