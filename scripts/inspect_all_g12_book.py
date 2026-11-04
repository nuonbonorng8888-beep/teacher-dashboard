# scripts/inspect_all_g12_book.py
import pymupdf as fitz
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "កិច្ចការតែងការទី១២/សៀវភៅកិច្ចតែងការបង្រៀនថ្នាក់ទី១២_Version_1.pdf"
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")

# Look for each chapter heading or start of plans
# In Khmer: ជំពូកទី X, មេរៀនទី Y, កិច្ចតែងការ
chapters_found = {}
current_chapter = "Unknown"

for pno in range(len(doc)):
    txt = doc[pno].get_text()
    
    # Check for chapter title
    m_ch = re.search(r'ជំពូកទី\s*(\d+|[១-៩០]+)\s*[:៖]?\s*([^\n\r]+)', txt)
    if m_ch:
        ch_num = m_ch.group(1)
        ch_title = m_ch.group(2).strip()
        current_chapter = f"ជំពូកទី {ch_num} ៖ {ch_title}"
        if current_chapter not in chapters_found:
            chapters_found[current_chapter] = []
            
    if "កិច្ចតែងការបង្រៀន" in txt or "កិច្ចតែងការបង្ងៀន" in txt:
        # Extract lesson info
        m_les = re.search(r'(?:ងេ|មេ|ម)ម?រៀនទី\s*(\d+|[១-៩០]+)\s*[:៖]?\s*([^\n\r]+)', txt)
        les_title = m_les.group(0).strip() if m_les else "Unknown"
        # Extract topic
        m_top = re.search(r'២\.\s*ខ្លឹមសារ\s*[:៖]?\s*([^\n\r]+)', txt)
        top = m_top.group(1).strip() if m_top else ""
        if current_chapter not in chapters_found:
            chapters_found[current_chapter] = []
        chapters_found[current_chapter].append((pno + 1, les_title, top))

print(f"\nFound {len(chapters_found)} chapters in Grade 12 book:")
for ch, plans in chapters_found.items():
    print(f"\n{ch} (Plans: {len(plans)})")
    for pno, ltitle, top in plans[:5]:
        print(f"   Page {pno}: {ltitle} | {top[:60]}")
    if len(plans) > 5:
        print(f"   ... and {len(plans)-5} more plans")
