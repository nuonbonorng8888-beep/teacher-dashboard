import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

g11 = json.load(open('scripts/g11_sliced_metadata.json', encoding='utf-8'))
g12 = json.load(open('scripts/g12_sliced_metadata.json', encoding='utf-8'))

missing_g11 = [p['pdf_file'] for p in g11 if not os.path.exists(p['pdf_file'])]
missing_g12 = [p['pdf_file'] for p in g12 if not os.path.exists(p['pdf_file'])]

print(f"G11 total: {len(g11)}, missing: {len(missing_g11)}")
print(f"G12 total: {len(g12)}, missing: {len(missing_g12)}")
if missing_g11:
    print("Missing G11:", missing_g11)
if missing_g12:
    print("Missing G12:", missing_g12)
