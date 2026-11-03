import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines[90:170], 91):
    print(f"L{idx}: {l}", end='')
