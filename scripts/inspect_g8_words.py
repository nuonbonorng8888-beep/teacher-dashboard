# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

g8_pdf = "កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf"
doc = fitz.open(g8_pdf)
p0 = doc[0]

words = p0.get_text("words")
for w in words:
    if 50 < w[1] < 190:
        print(f"y: {w[1]:.1f}-{w[3]:.1f}, x: {w[0]:.1f}-{w[2]:.1f} -> {repr(w[4])}")

