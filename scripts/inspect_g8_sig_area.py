# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

g8_pdf = "កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf"
doc = fitz.open(g8_pdf)
p4 = doc[4] # sig page

print(f"Page 4 height: {p4.rect.height}, width: {p4.rect.width}")

# Check all text blocks in signature area
sig_blocks = [b for b in p4.get_text("blocks") if b[1] < 220 and b[1] > 20]
print("Signature area blocks on G8 p4:")
for b in sig_blocks:
    print(f"  y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} | {repr(b[4].strip())}")

