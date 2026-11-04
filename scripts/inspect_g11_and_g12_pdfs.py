# scripts/inspect_g11_and_g12_pdfs.py
import fitz # PyMuPDF
import os, sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== Inspecting Grade 11 PDFs ===")
g11_folder = "កិច្ចការតែងការទី១១"
for f in os.listdir(g11_folder):
    if f.endswith('.pdf') and not f.startswith('8_') and not 'សៀវភៅ' in f and not 'ក្រប' in f:
        pdf_path = os.path.join(g11_folder, f)
        doc = fitz.open(pdf_path)
        print(f"\nFile: {f} (Pages: {len(doc)})")
        # Print text of first 2 pages
        for pno in range(min(2, len(doc))):
            page = doc[pno]
            txt = page.get_text()[:400]
            print(f"--- Page {pno+1} snippet ---\n{txt}\n")

print("\n=== Inspecting Grade 12 PDF: សៀវភៅកិច្ចតែងការបង្រៀនថ្នាក់ទី១២_Version_1.pdf ===")
g12_book = os.path.join("កិច្ចការតែងការទី១២", "សៀវភៅកិច្ចតែងការបង្រៀនថ្នាក់ទី១២_Version_1.pdf")
doc12 = fitz.open(g12_book)
print(f"Total Pages in Grade 12 Book: {len(doc12)}")
# Let's check TOC or first 15 pages
for pno in range(min(15, len(doc12))):
    page = doc12[pno]
    txt = page.get_text().strip()
    if any(k in txt for k in ['មាតិកា', 'កិច្ចតែងការ', 'ជំពូក', 'មេរៀន']):
        first_line = txt.split('\n')[0] if txt else ''
        print(f"Page {pno+1}: {first_line} | {txt[:200].replace(chr(10), ' ')}")

