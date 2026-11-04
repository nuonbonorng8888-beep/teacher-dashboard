import fitz, glob, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in glob.glob('កិច្ចការតែងការទី៨/*.pdf'):
    if 'សៀវភៅ' in f: continue
    doc = fitz.open(f)
    for i, p in enumerate(doc):
        t = p.get_text()
        for line in t.split('\n'):
            line_s = line.strip()
            if any(line_s.startswith(k) for k in ['៥.', '5.', '៤.', '4.']) and any(w in line_s for w in ['គណៈ', 'នាយ', 'កាល', 'បាល']):
                print(f"{f} p.{i+1}: '{line_s}'")
