import sys
import os
import json
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']') + 1
data = json.loads(text[start:end])
print(f"Loaded total {len(data)} items from js/lesson-plans-data.js")

g8 = [d for d in data if d.get('grade') in ['ថ្នាក់ទី ៨', 'ថ្នាក់ទី 8']]
print(f"Total Grade 8 items: {len(g8)}")

for item in g8:
    sig_y = item.get('sig_y0')
    if sig_y is not None and sig_y < 350:
        print(f"{item['id']} ({item['pdf_file']}): sig_page_index={item.get('sig_page_index')}, sig_y0={sig_y}")
