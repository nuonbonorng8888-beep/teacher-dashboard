# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"

# Load plans 1, 2, 3
files = [
    'កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf',
    'កិច្ចការតែងការទី៨/8_1_2_មេរៀនទី1_ចំនួនសនិទាន.pdf',
    'កិច្ចការតែងការទី៨/8_1_3_មេរៀនទី1_ចំនួនសនិទាន.pdf',
]

merged = fitz.open()

for i, fn in enumerate(files):
    doc = fitz.open(fn)
    pcount = len(doc)
    start_page = len(merged) + 1 # 1-indexed
    print(f"Plan {i+1} ({os.path.basename(fn)}): {pcount} pages. Starts on page {start_page} ({'ODD/សេស' if start_page % 2 == 1 else 'EVEN/គូ'})")
    
    # insert pages
    merged.insert_pdf(doc)
    
    # Check if need blank padding page before next plan
    if i < len(files) - 1:
        current_len = len(merged)
        if current_len % 2 == 1:
            # insert blank page
            blank = merged.new_page(width=612, height=792)
            print(f"  -> Added blank padding page at page {len(merged)} so next plan starts on ODD page!")

print(f"\nFinal merged PDF total pages: {len(merged)}")
out_merged_path = os.path.join(artifacts_dir, "test_merged_odd_pages.pdf")
merged.save(out_merged_path)
print("Saved:", out_merged_path)

