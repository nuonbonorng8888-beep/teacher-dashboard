import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines, 1):
    if 'pdf' in l.lower() or 'print' in l.lower() or 'download' in l.lower():
        print(f"L{idx}: {l.strip()}")

