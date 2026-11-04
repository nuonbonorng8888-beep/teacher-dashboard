# scripts/inspect_g12_book_plans.py
import pymupdf as fitz
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "កិច្ចការតែងការទី១២/សៀវភៅកិច្ចតែងការបង្រៀនថ្នាក់ទី១២_Version_1.pdf"
doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

plans = []
for pno in range(len(doc)):
    txt = doc[pno].get_text()
    if "កិច្ចតែងការបង្រៀន" in txt or "កិច្ចតែងការបង្ងៀន" in txt or "កិច្ចតែងការ" in txt:
        # Check if it has metadata like ជំពូក or ថ្នាក់ទី or ម៉ោង
        lines = [line.strip() for line in txt.split('\n') if line.strip()]
        header_lines = lines[:15]
        header_text = ' '.join(header_lines)
        if any(k in header_text for k in ['ជំពូក', 'មេរៀន', 'ថ្នាក់ទី', 'វត្ថុបំណង', '១. វត្ថុបំណង']):
            plans.append((pno + 1, header_text))

print(f"Found {len(plans)} plan markers:")
for pno, h in plans[:30]:
    print(f"Page {pno}: {h[:100]}...")
if len(plans) > 30:
    print(f"... and {len(plans) - 30} more")

