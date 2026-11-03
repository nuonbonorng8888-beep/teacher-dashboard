import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides.js', 'r', encoding='utf-8') as f:
    text = f.read()

# find where lessons or slides list is defined
import re
lines = text.splitlines()
for idx, l in enumerate(lines[:120], 1):
    print(f"L{idx}: {l}")

