import fitz, json, sys
sys.stdout.reconfigure(encoding='utf-8')

g12 = json.load(open('scripts/g12_sliced_metadata.json', encoding='utf-8'))
has_sig = 0
no_sig = 0
for p in g12:
    doc = fitz.open(p['pdf_file'])
    last_page = doc[-1]
    matches = last_page.search_for('បានឃើញ') or last_page.search_for('គ្រូបង្រៀន') or last_page.search_for('ហត្ថលេខា')
    if matches:
        has_sig += 1
    else:
        no_sig += 1
print(f"G12: {has_sig} have signatures, {no_sig} don't have explicit signature text on last page")
