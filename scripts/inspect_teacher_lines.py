# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("--- Lines 160-200 ---")
for i in range(160, 205):
    print(f"{i+1}: {lines[i].rstrip()}")

print("--- Lines 980-1015 ---")
for i in range(980, 1015):
    print(f"{i+1}: {lines[i].rstrip()}")
