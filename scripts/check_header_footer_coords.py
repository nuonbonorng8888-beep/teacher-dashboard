import fitz, sys
sys.stdout.reconfigure(encoding='utf-8')

for path, name in [
    ('កិច្ចការតែងការទី១១/11_1_1_មេរៀនទី_១__ស្វ៊ីតចំនួនពិត_ម៉ោងទី1.pdf', 'G11'),
    ('កិច្ចការតែងការទី១២/12_1_1_កិច្ចតែងការ_ជំពូក1_ម៉ោងទី1.pdf', 'G12'),
    ('កិច្ចតែងការ_ថ្នាក់ទី៨_មេរៀនទី១_ចំនួនសនិទាន_ម៉ោងទី១.pdf', 'G8')
]:
    doc = fitz.open(path)
    p0 = doc[0]
    p1 = doc[1] if len(doc) > 1 else doc[0]
    print(f"\n=== {name} ({path}) ===")
    print("Page 0 header rects:")
    for b in p0.get_text("blocks")[:3]:
        print(f"  y=[{b[1]:.1f}-{b[3]:.1f}], x=[{b[0]:.1f}-{b[2]:.1f}] : {b[4][:60].replace(chr(10), ' ')}")
    print("Page 1 header rects:")
    for b in p1.get_text("blocks")[:3]:
        print(f"  y=[{b[1]:.1f}-{b[3]:.1f}], x=[{b[0]:.1f}-{b[2]:.1f}] : {b[4][:60].replace(chr(10), ' ')}")
    print("Page 0 footer rects:")
    for b in p0.get_text("blocks")[-3:]:
        print(f"  y=[{b[1]:.1f}-{b[3]:.1f}], x=[{b[0]:.1f}-{b[2]:.1f}] : {b[4][:60].replace(chr(10), ' ')}")
