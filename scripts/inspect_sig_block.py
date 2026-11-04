import fitz, sys
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('កិច្ចការតែងការទី៨/8_10_1_មេរៀនទី១០_ស្ថិតិ.pdf')
p = doc[4]
print(f"Page 5 size: {p.rect}")
for b in p.get_text("blocks"):
    if b[1] >= 550:
        print(f"y=[{b[1]:.1f}-{b[3]:.1f}], x=[{b[0]:.1f}-{b[2]:.1f}]: '{b[4].strip().replace(chr(10), ' ')}'")

