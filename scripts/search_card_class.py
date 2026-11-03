import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines, 1):
    if 'updateClass' in l or 'class_name' in l or 'ថ្នាក់៖' in l or 'p.class_name' in l:
        print(f"L{idx}: {l.strip()}")
