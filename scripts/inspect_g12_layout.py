# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf'
doc = fitz.open(pdf_path)
print(f"Grade 12 PDF: total pages={len(doc)}")

page0 = doc[0]
print(f"Page 0 dimensions: {page0.rect}")
for word in page0.get_text("words"):
    if word[1] < 220:
        print(f"y: {word[1]:.1f}-{word[3]:.1f}, x: {word[0]:.1f}-{word[2]:.1f} | {word[4]}")

last_page = doc[2] # sig_page_index is 2 in data
print(f"\nPage 2 (sig page) dimensions: {last_page.rect}")
for word in last_page.get_text("words"):
    if word[1] > 500:
        print(f"y: {word[1]:.1f}-{word[3]:.1f}, x: {word[0]:.1f}-{word[2]:.1f} | {word[4]}")

