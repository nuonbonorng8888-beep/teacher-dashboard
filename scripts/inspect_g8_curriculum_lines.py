import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/curriculum-outlines.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

g8_start = None
g8_end = None
for idx, l in enumerate(lines):
    if '"8": {' in l:
        g8_start = idx
    if g8_start is not None and idx > g8_start and '"9": {' in l:
        g8_end = idx
        break

print(f"G8 lines: {g8_start} to {g8_end}")
for i in range(g8_start, min(g8_start + 40, g8_end)):
    print(lines[i], end='')
