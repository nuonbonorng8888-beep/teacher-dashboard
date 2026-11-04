# scripts/analyze_g12_book_toc.py
import pymupdf as fitz
import re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('កិច្ចការតែងការទី១២/សៀវភៅកិច្ចតែងការបង្រៀនថ្នាក់ទី១២_Version_1.pdf')
print(f"Total pages: {len(doc)}")

# Let's inspect page 5 (the Table of Contents)
toc_text = doc[4].get_text()
print("=== TOC TEXT ===")
print(toc_text)

# Let's search for all plan start pages in the book
plan_pages = []
for pno in range(len(doc)):
    txt = doc[pno].get_text()
    if "កិច្ចតែងការបង្រៀន" in txt or "កិច្ចតែងការបង្ងៀន" in txt or "កិច្ចតែងការ" in txt:
        # Check if it's the cover of a plan
        if any(w in txt for w in ["១. វត្ថុបំណង", "១. វតថុបំណង", "១.វត្ថុបំណង", "វត្ថុបំណង"]):
            # Extract chapter and lesson
            lines = [l.strip() for l in txt.split('\n') if l.strip()]
            header = ' | '.join(lines[:12])
            plan_pages.append((pno + 1, header))

print(f"\nFound {len(plan_pages)} individual lesson plans with 'វត្ថុបំណង':")
for pno, h in plan_pages:
    print(f"Page {pno:3d}: {h[:120]}")
