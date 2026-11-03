import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines[-25:], len(lines) - 24):
    print(f"L{idx}: {l}", end='')
