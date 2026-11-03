# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf")
p0 = doc[0]

words = p0.get_text("words")
for w in words:
    if 90 < w[1] < 210:
        print(f"y: {w[1]:.1f}-{w[3]:.1f}, x: {w[0]:.1f}-{w[2]:.1f} -> {repr(w[4])}")

