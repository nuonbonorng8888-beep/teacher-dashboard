# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Check bottom of pages in 8_1_1
doc = fitz.open("កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf")
print("=== Footer in 8_1_1 ===")
for i, p in enumerate(doc):
    blocks = [b for b in p.get_text("blocks") if b[1] > 740]
    for b in blocks:
        if b[4].strip():
            print(f"p{i}: {repr(b[4].strip())}")

# Check bottom of pages in Grade 12
doc12 = fitz.open("ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf")
print("=== Footer in G12 ===")
for i in range(min(5, len(doc12))):
    p = doc12[i]
    blocks = [b for b in p.get_text("blocks") if b[1] > 740]
    for b in blocks:
        if b[4].strip():
            print(f"p{i}: {repr(b[4].strip())}")
