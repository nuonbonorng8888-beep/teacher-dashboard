import fitz, json, sys
sys.stdout.reconfigure(encoding='utf-8')

def inspect_pdf(path, name):
    print(f"\n==================== {name}: {path} ====================")
    doc = fitz.open(path)
    p0 = doc[0]
    print(f"Page count: {len(doc)}, Size: {p0.rect}")
    print("\n--- Page 0 text blocks (y0, y1, text): ---")
    blocks = p0.get_text("blocks")
    for b in blocks[:15]:
        print(f"  [{b[1]:.1f} - {b[3]:.1f}] x=[{b[0]:.1f}-{b[2]:.1f}]: {b[4][:80].replace(chr(10), ' ')}")
        
    last_p = doc[-1]
    print(f"\n--- Last page ({len(doc)-1}) text blocks near bottom: ---")
    blocks_last = last_p.get_text("blocks")
    for b in blocks_last[-10:]:
        print(f"  [{b[1]:.1f} - {b[3]:.1f}] x=[{b[0]:.1f}-{b[2]:.1f}]: {b[4][:80].replace(chr(10), ' ')}")

inspect_pdf('កិច្ចការតែងការទី១១/11_1_1_មេរៀនទី_១__ស្វ៊ីតចំនួនពិត_ម៉ោងទី1.pdf', 'GRADE 11')
inspect_pdf('កិច្ចការតែងការទី១២/12_1_1_កិច្ចតែងការ_ជំពូក1_ម៉ោងទី1.pdf', 'GRADE 12')

