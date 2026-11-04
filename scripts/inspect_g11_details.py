# scripts/inspect_g11_details.py
import pymupdf as fitz
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

g11_files = [
    ("ស្វ៊ីតចំនួនពិត.pdf", "មេរៀនទី១ ៖ ស្វ៊ីតចំនួនពិត"),
    ("ស្វ៊ីតនព្វន្ត.pdf", "មេរៀនទី២ ៖ ស្វ៊ីតនព្វន្ត"),
    ("ស្វ៊ីតធរណីមាត្រ.pdf", "មេរៀនទី៣ ៖ ស្វ៊ីតធរណីមាត្រ")
]

for fname, title in g11_files:
    path = f"កិច្ចការតែងការទី១១/{fname}"
    doc = fitz.open(path)
    print(f"\n==========================================")
    print(f"FILE: {fname} ({len(doc)} pages) -> {title}")
    print(f"==========================================")
    
    # Search for lesson plan starts
    plan_starts = []
    for pno in range(len(doc)):
        txt = doc[pno].get_text()
        if "កិច្ចតែងការបង្រៀន" in txt or "កិច្ចតែងការបង្ងៀន" in txt:
            # Extract lesson title, hour, duration, date, teacher
            plan_starts.append((pno + 1, txt[:300].replace('\n', ' ')))
            
    print(f"Found {len(plan_starts)} lesson plan starts:")
    for pno, snippet in plan_starts:
        print(f"  Page {pno}: {snippet[:120]}...")
