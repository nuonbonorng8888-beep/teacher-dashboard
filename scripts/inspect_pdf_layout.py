# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = os.path.join('កិច្ចការតែងការទី៨', '8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

# Inspect Page 0 (Cover / Header)
page0 = doc[0]
rect = page0.rect
print(f"Page 0 dimensions: width={rect.width}, height={rect.height}")
print("\n--- Page 0 Text Blocks ---")
blocks = page0.get_text("blocks")
for b in blocks:
    # b: (x0, y0, x1, y1, text, block_no, block_type)
    text = b[4].strip().replace('\n', ' ')
    if any(k in text for k in ['ថ្នាក់', 'មេរៀន', 'កាលបរិច្ឆេទ', 'វត្ថុបំណង', 'រយៈពេល']):
        print(f"Box: ({b[0]:.2f}, {b[1]:.2f}, {b[2]:.2f}, {b[3]:.2f}) -> {text}")

# Inspect Last Page (Signatures)
last_page = doc[-1]
last_rect = last_page.rect
print(f"\nLast Page ({len(doc)-1}) dimensions: width={last_rect.width}, height={last_rect.height}")
print("\n--- Last Page Text Blocks ---")
blocks_last = last_page.get_text("blocks")
for b in blocks_last:
    text = b[4].strip().replace('\n', ' ')
    if any(k in text for k in ['ភ្នំពេញ', 'កាលបរិច្ឆេទ', 'ហត្ថលេខា', 'គ្រូបង្រៀន', 'ពិនិត្យ', 'ឯកភាព', 'ជំនួយការ', 'ប្រធាន']):
        print(f"Box: ({b[0]:.2f}, {b[1]:.2f}, {b[2]:.2f}, {b[3]:.2f}) -> {text}")

