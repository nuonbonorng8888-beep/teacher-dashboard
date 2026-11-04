import fitz, glob, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in sorted(glob.glob('កិច្ចការតែងការទី៨/*.pdf')):
    if 'សៀវភៅ' in f: continue
    doc = fitz.open(f)
    for p_no, page in enumerate(doc):
        # find text near x=50..120
        blocks = page.get_text("blocks")
        for b in blocks:
            if b[0] < 120 and ('៥' in b[4] or '5' in b[4]):
                for line in b[4].split('\n'):
                    if any(line.strip().startswith(x) for x in ['៥.', '5.', '៥ .', '5 .', '៥', '5']):
                        if any(k in line for k in ['បាន', 'គណៈ', 'នាយ', 'គ្រូ', 'ហត្ថ', 'ពិនិត្យ', 'ឯកភាព', 'កាល', 'រដ្ឋ']):
                            print(f"{f} p.{p_no+1}: {b[1]:.1f}-{b[3]:.1f} x={b[0]:.1f} -> '{line.strip()}'")

