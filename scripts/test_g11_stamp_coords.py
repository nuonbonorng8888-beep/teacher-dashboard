import fitz, sys
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('កិច្ចការតែងការទី១១/11_1_1_មេរៀនទី_១__ស្វ៊ីតចំនួនពិត_ម៉ោងទី1.pdf')
p = doc[0]
pageH = p.rect.height
print(f"Page height: {pageH}")
for b in p.get_text("blocks"):
    if 'ចាយ' in b[4] or 'Facebook' in b[4] or 'វិទ្យាល័យ' in b[4]:
        # y from top
        y_top = b[1]
        y_bottom_from_top = b[3]
        # in pdf-lib (from bottom)
        pdf_y0 = pageH - y_bottom_from_top
        pdf_y1 = pageH - y_top
        print(f"Text: '{b[4][:50].replace(chr(10), ' ')}'")
        print(f"   from top: [{y_top:.1f} - {y_bottom_from_top:.1f}]")
        print(f"   pdf-lib (from bottom): [{pdf_y0:.1f} - {pdf_y1:.1f}]")

