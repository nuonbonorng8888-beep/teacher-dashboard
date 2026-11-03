import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines, 1):
    if 'getGradeSyllabus' in l or 'ថ្នាក់ទី ៨' in l or 'grade === \'8\'' in l or 'selectedGrade === \'8\'' in l:
        print(f"L{idx}: {l.strip()}")
