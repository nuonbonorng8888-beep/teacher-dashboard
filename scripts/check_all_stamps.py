import fitz, json, sys
sys.stdout.reconfigure(encoding='utf-8')

for path, label in [
    ('កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf', 'GRADE 8'),
    ('កិច្ចការតែងការទី១១/11_1_1_មេរៀនទី_១__ស្វ៊ីតចំនួនពិត_ម៉ោងទី1.pdf', 'GRADE 11'),
    ('កិច្ចការតែងការទី១២/12_1_1_កិច្ចតែងការ_ជំពូក1_ម៉ោងទី1.pdf', 'GRADE 12')
]:
    doc = fitz.open(path)
    p = doc[0]
    h = p.rect.height
    print(f"\n==================== {label} (H={h:.1f}) ====================")
    for b in p.get_text("blocks"):
        txt = b[4].strip().replace('\n', ' ')
        y0, y1 = b[1], b[3] # from top
        pdf_y0 = h - y1 # from bottom
        pdf_y1 = h - y0 # from bottom
        if any(k in txt for k in ['វិទ្យាល័យ', 'Facebook', 'បង្រៀនដោយ', 'បរព្រៀនរោយ', 'ចាយ សុភា', 'Email', 'Tel', 'www', 'ថ្នាក់']):
            print(f"  [{txt[:40]}] -> top:[{y0:.1f}-{y1:.1f}], from bottom:[{pdf_y0:.1f}-{pdf_y1:.1f}]")
