import fitz, glob, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in sorted(glob.glob('កិច្ចការតែងការទី៨/*.pdf')):
    if 'សៀវភៅ' in f: continue
    doc = fitz.open(f)
    found = False
    for p_no, page in enumerate(doc):
        txt = page.get_text()
        for k in ['ព.ស', 'រាជធ្ននី', 'រាជធានី', 'ឯកភាេ', 'េិនិែយ', 'ឯកភាព', 'ពិនិត្យ', 'រូបង្ងៀន']:
            if k in txt:
                blocks = page.get_text("blocks")
                for b in blocks:
                    if any(x in b[4] for x in ['ព.ស', 'រាជធ្ននី', 'រាជធានី', 'ឯកភាេ', 'េិនិែយ', 'ឯកភាព', 'ពិនិត្យ', 'រូបង្ងៀន', 'នាយក']):
                        print(f"{f} p.{p_no+1}: x=[{b[0]:.1f}-{b[2]:.1f}] y=[{b[1]:.1f}-{b[3]:.1f}] -> '{b[4][:50].replace(chr(10), ' ')}'")
                found = True
                break
        if found: break
