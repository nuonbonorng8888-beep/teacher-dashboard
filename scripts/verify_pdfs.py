import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

pdf_files = re.findall(r'"pdf_file":\s*"([^"]+)"', text)
print(f"Total pdf_file references: {len(pdf_files)}")
print("Sample 5:", pdf_files[:5])

missing = [f for f in pdf_files if not os.path.exists(f)]
print(f"Missing files: {len(missing)}")
if missing:
    print("Sample missing:", missing[:5])
