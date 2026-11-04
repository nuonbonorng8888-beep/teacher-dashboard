import fitz, glob, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in sorted(glob.glob('កិច្ចការតែងការទី៨/*.pdf')):
    if 'សៀវភៅ' in f: continue
    doc = fitz.open(f)
    for p_no, page in enumerate(doc):
        rects = page.search_for('បានឃើញ') or page.search_for('បានលឃើញ') or page.search_for('ឯកភាព') or page.search_for('ពិនិត្យ')
        if rects:
            print(f"\n{f} (Page {p_no+1} of {len(doc)}):")
            for r in rects[:3]:
                print(f"   search rect: x=[{r.x0:.1f}-{r.x1:.1f}], y=[{r.y0:.1f}-{r.y1:.1f}]")
            # print all blocks on this page below r.y0 - 20
            for b in page.get_text("blocks"):
                if b[1] >= rects[0].y0 - 30:
                    print(f"      block y=[{b[1]:.1f}-{b[3]:.1f}], x=[{b[0]:.1f}-{b[2]:.1f}]: {b[4][:60].replace(chr(10), ' ')}")
            break
