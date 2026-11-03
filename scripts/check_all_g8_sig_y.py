# -*- coding: utf-8 -*-
import json, re, sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract all Grade 8 plans
g8_blocks = [b for b in text.split('{\n    "id": "') if '"grade": "ថ្នាក់ទី ៨"' in b or '"grade": "ថ្នាក់ទី 8"' in b]

sig_data = []
for b in g8_blocks:
    id_m = re.search(r'plan_g8_\d+', b)
    sig_p = re.search(r'"sig_page_index":\s*(\d+)', b)
    sig_y = re.search(r'"sig_y0":\s*([0-9.]+)', b)
    if id_m and sig_p and sig_y:
        sig_data.append((id_m.group(0), int(sig_p.group(1)), float(sig_y.group(1))))

print(f"Total G8 plans with sig_data: {len(sig_data)}")
y_values = [s[2] for s in sig_data]
print(f"sig_y0 range: min={min(y_values)}, max={max(y_values)}")
for s in sig_data[:10]:
    print(s)

