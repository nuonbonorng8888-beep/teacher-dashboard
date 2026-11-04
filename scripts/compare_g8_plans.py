# -*- coding: utf-8 -*-
import sys, re, json, os

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'window\.NGS_LESSON_PLANS_DATA\s*=\s*(\[.*?\]);', text, re.DOTALL)
data = json.loads(m.group(1))
g8_plans = [p for p in data if p.get('grade') == 'ថ្នាក់ទី ៨']

data_pdfs = set()
for p in g8_plans:
    pdf = os.path.basename(p.get('pdf_file', ''))
    data_pdfs.add(pdf)

disk_pdfs = set([f for f in os.listdir('កិច្ចការតែងការទី៨') if f.startswith('8_') and f.endswith('.pdf')])

missing_from_data = disk_pdfs - data_pdfs
missing_from_disk = data_pdfs - disk_pdfs

print("Total on disk:", len(disk_pdfs))
print("Total in data:", len(data_pdfs))
print(f"Missing from data ({len(missing_from_data)}):")
for f in sorted(missing_from_data):
    print(" ", f)

print(f"Missing from disk ({len(missing_from_disk)}):")
for f in sorted(missing_from_disk):
    print(" ", f)

