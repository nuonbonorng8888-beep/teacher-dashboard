import fitz, sys
sys.stdout.reconfigure(encoding='utf-8')

for name in ['ស្វ៊ីតនព្វន្ត.pdf', 'ស្វ៊ីតធរណីមាត្រ.pdf']:
    doc = fitz.open(f'កិច្ចការតែងការទី១១/{name}')
    print(f"\n=== {name} (total {len(doc)}) ===")
    for i in range(len(doc)):
        t = doc[i].get_text()
        if 'កិច្ចតែងការ' in t:
            print(f"  p.{i}: Starts new plan: {t[:60].replace(chr(10), ' ')}")
        elif len(t.strip()) == 0:
            print(f"  p.{i}: BLANK PAGE")

