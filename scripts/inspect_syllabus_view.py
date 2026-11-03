import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(553, min(700, len(lines))):
    print(f"L{i}: {lines[i]}", end='')

