import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines, 1):
    if 'ជំពូក' in line or 'unitLabel' in line or 'isGrade8' in line:
        print(f"L{idx}: {line.strip()}")
