import fitz, json, sys
sys.stdout.reconfigure(encoding='utf-8')

g11 = json.load(open('scripts/g11_sliced_metadata.json', encoding='utf-8'))
for idx, p in enumerate(g11):
    doc = fitz.open(p['pdf_file'])
    t0 = doc[0].get_text()
    print(f"\n--- G11 Plan {idx+1}: {p['les_title']} H{p['hour']} ---")
    lines = [line.strip() for line in t0.split('\n') if line.strip()]
    for l in lines:
        if any(k in l for k in ['វត្ថុបំណង', 'វិជ្ជា', 'បំណិន', 'ចរិយា', 'ខ្លឹមសារ', 'សកម្មភាព', 'វិធីសាស្ត្រ']):
            print("  ", l)

