import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Check occurrences of ជំពូកទី ៤ in teaching-slides-data.js
lines = text.splitlines()
for idx, l in enumerate(lines, 1):
    if 'ជំពូកទី ៤' in l and 'ថ្នាក់ទី ៨' in l:
        print(f"L{idx}: {l}")

