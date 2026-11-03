import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides-data.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(7280, 7310):
    print(f"L{i+1}: {repr(lines[i])}")
