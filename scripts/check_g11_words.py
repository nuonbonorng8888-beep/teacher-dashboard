import fitz, sys
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('កិច្ចការតែងការទី១១/11_1_1_មេរៀនទី_១__ស្វ៊ីតចំនួនពិត_ម៉ោងទី1.pdf')
p0 = doc[0]
words = p0.get_text('words') # (x0, y0, x1, y1, word, block_no, line_no, word_no)
for w in words:
    if 180 <= w[1] <= 265:
        print(f"y=[{w[1]:.1f}-{w[3]:.1f}] x=[{w[0]:.1f}-{w[2]:.1f}] : {w[4]}")
