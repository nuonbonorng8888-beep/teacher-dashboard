import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/curriculum-outlines.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(85, 185):
    if i < len(lines):
        print(f"L{i+1}: {lines[i]}", end='')

