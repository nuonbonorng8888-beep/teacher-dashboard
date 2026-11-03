# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Let's open "ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf" and check page 2
doc = fitz.open("ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf")
p2 = doc[2]

# Let's check if there is teacher name on page 2 in Grade 12
text = p2.get_text()
print("Grade 12 page 2 full text:")
print(text)
