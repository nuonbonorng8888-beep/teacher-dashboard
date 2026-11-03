import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides-data.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines, 1):
    if 'កាដ្រង់' in l:
        print(f"L{idx}: {l.strip()}")

