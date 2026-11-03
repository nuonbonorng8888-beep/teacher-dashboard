import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/g8_outline.json', 'r', encoding='utf-8') as f:
    g8_data = json.load(f)

with open('js/curriculum-outlines.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the "8": { ... } section in curriculum-outlines.js
g8_json = json.dumps(g8_data, ensure_ascii=False, indent=2)
# Indent 4 spaces
g8_json_indented = '\n'.join('  ' + line for line in g8_json.splitlines())

pattern = r'  "8":\s*\{.*?\n  \},(?=\s*\n  "9":)'
replacement = f'  "8": {g8_json_indented[2:]},'

new_content, count = re.subn(pattern, replacement, content, flags=re.DOTALL)
if count == 1:
    with open('js/curriculum-outlines.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced Grade 8 in js/curriculum-outlines.js!")
else:
    print(f"Error: regex matched {count} times.")

