# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/apply_master_perfect_pdfs.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(70, 95):
    print(f"{i+1}: {lines[i].rstrip()}")

print("---")
for i in range(130, 155):
    print(f"{i+1}: {lines[i].rstrip()}")
