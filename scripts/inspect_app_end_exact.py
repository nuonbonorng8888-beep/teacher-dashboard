import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1140, len(lines)):
    print(f"L{i+1}: {repr(lines[i])}")

