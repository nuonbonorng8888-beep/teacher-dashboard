import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines, 1):
    if 'batchClassInput' in l or 'setBatchClass' in l or 'applyBatch' in l or 'saveCustomizations' in l:
        print(f"L{idx}: {l.strip()}")
