# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect Page 0 words after whiteout
doc = fitz.open('កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
p0 = doc[0]

# Check words around lines 1, 4, 5
words = p0.get_text("words")
for w in words:
    if w[1] < 200:
        print(f"y={w[1]:.1f}-{w[3]:.1f}, x={w[0]:.1f}-{w[2]:.1f}: {w[4]}")

