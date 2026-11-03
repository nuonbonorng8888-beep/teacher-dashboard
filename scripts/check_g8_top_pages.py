# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf")
print("Total pages in 8_1_1:", len(doc))

for i, p in enumerate(doc):
    blocks = [b for b in p.get_text("blocks") if b[1] < 60]
    print(f"Page {i} blocks with y < 60:")
    for b in blocks:
        if b[4].strip():
            print(f"  y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} | {repr(b[4].strip())}")

