# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect text on Page 3 vs Page 4
doc = fitz.open('កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
print("Page 3 bottom text (last 10 lines):")
txt3 = doc[3].get_text().splitlines()
for l in txt3[-15:]:
    if l.strip(): print("  P3:", l.strip())

print("\nPage 4 text:")
txt4 = doc[4].get_text().splitlines()
for l in txt4:
    if l.strip(): print("  P4:", l.strip())
