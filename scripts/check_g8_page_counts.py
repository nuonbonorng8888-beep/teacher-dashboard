# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

g8_dir = 'កិច្ចការតែងការទី៨'
files = [f for f in os.listdir(g8_dir) if f.endswith('.pdf')]
files.sort()

print(f"Total Grade 8 PDFs: {len(files)}")
page_counts = []
for f in files:
    doc = fitz.open(os.path.join(g8_dir, f))
    page_counts.append((f, len(doc)))

odd_count = sum(1 for f, cnt in page_counts if cnt % 2 == 1)
even_count = sum(1 for f, cnt in page_counts if cnt % 2 == 0)

print(f"Odd page count plans: {odd_count}")
print(f"Even page count plans: {even_count}")
print("\nFirst 10 files and their page counts:")
for f, cnt in page_counts[:10]:
    print(f"  {cnt} pages: {f}")
