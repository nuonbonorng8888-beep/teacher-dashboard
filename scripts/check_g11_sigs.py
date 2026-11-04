import fitz, json, sys
sys.stdout.reconfigure(encoding='utf-8')

g11 = json.load(open('scripts/g11_sliced_metadata.json', encoding='utf-8'))
for p in g11:
    path = p['pdf_file']
    doc = fitz.open(path)
    last_page = doc[-1]
    # search for text
    matches = last_page.search_for('បានឃើញ') or last_page.search_for('គ្រូបង្រៀន') or last_page.search_for('ហត្ថលេខា') or last_page.search_for('ថ្ងៃទី')
    print(f"{p['les_title']} H{p['hour']} (pages={len(doc)}): matches={matches}")

