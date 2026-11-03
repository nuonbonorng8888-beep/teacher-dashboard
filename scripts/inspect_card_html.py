import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1055, 1085):
    print(f"L{i+1}: {lines[i]}", end='')
