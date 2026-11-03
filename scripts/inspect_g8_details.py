# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

g8_pdf = "កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf"
doc = fitz.open(g8_pdf)

print(f"Total pages in G8 sample: {len(doc)}")

p0 = doc[0]
print("--- G8 Page 0 top text blocks ---")
for b in p0.get_text("blocks"):
    if b[1] < 220:
        print(f"  y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} -> {repr(b[4].strip())}")

psig = doc[4] # page 4
print("--- G8 Page 4 bottom text blocks ---")
for b in psig.get_text("blocks"):
    print(f"  y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} -> {repr(b[4].strip())}")
