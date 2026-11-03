# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect g12_page0_clip.png
# Let's see what is on Grade 12 page 0 originally
doc = fitz.open("ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf")
p0 = doc[0]
for b in p0.get_text("blocks"):
    if 90 < b[1] < 210:
        print(f"y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} -> {repr(b[4].strip())}")

