# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = os.path.join('កិច្ចការតែងការទី៨', '8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
doc = fitz.open(pdf_path)

print("--- PAGE 0 LINES & WORDS ---")
page0 = doc[0]
for word in page0.get_text("words"):
    # (x0, y0, x1, y1, word, block_no, line_no, word_no)
    if word[1] < 260: # top 260 pt
        print(f"y: {word[1]:.1f}-{word[3]:.1f}, x: {word[0]:.1f}-{word[2]:.1f} | {word[4]}")

print("\n--- PAGE 4 (SIGNATURES) LINES & WORDS ---")
page4 = doc[4]
for word in page4.get_text("words"):
    print(f"y: {word[1]:.1f}-{word[3]:.1f}, x: {word[0]:.1f}-{word[2]:.1f} | {word[4]}")

