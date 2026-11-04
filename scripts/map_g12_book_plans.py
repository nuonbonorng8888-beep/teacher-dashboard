# scripts/map_g12_book_plans.py
import pymupdf as fitz
import re, json, sys, os
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "កិច្ចការតែងការទី១២/សៀវភៅកិច្ចតែងការបង្រៀនថ្នាក់ទី១២_Version_1.pdf"
doc = fitz.open(pdf_path)

# Let's locate each plan start page
plan_starts = []
for pno in range(len(doc)):
    txt = doc[pno].get_text()
    if "កិច្ចតែងការបង្រៀន" in txt or "កិច្ចតែងការបង្ងៀន" in txt or "កិច្ចតែងការ" in txt:
        if any(w in txt for w in ["១. វត្ថុបំណង", "១. វតថុបំណង", "១.វត្ថុបំណង", "វត្ថុបំណង"]):
            plan_starts.append(pno)

print(f"Total plan starts found: {len(plan_starts)}")

g12_book_plans = []
for i, p_start in enumerate(plan_starts):
    p_end = plan_starts[i+1] - 1 if i+1 < len(plan_starts) else len(doc) - 1
    page_count = p_end - p_start + 1
    
    cover_text = doc[p_start].get_text()
    
    # Extract Chapter
    m_ch = re.search(r'ជំពូកទី\s*(\d+|[១-៩០]+)\s*[:៖]?\s*([^\n\r]+)', cover_text)
    ch_num = m_ch.group(1) if m_ch else "?"
    ch_name = m_ch.group(2).strip() if m_ch else ""
    chapter = f"ជំពូកទី {ch_num} ៖ {ch_name}" if ch_name else f"ជំពូកទី {ch_num}"
    
    # Extract Lesson
    m_les = re.search(r'(?:ងេ|មេ|ម)ម?រៀនទី\s*(\d+|[១-៩០]+)\s*[:៖]?\s*([^\n\r]+)', cover_text)
    lesson = m_les.group(0).strip() if m_les else ""
    
    # Extract Topic
    m_top = re.search(r'២\.\s*ខ្លឹមសារ\s*[:៖]?\s*([^\n\r]+)', cover_text)
    topic = m_top.group(1).strip() if m_top else ""
    
    # Extract Duration
    m_dur = re.search(r'រយៈ(?:ង|មេ|ម)?ពេល\s*[:៖]?\s*([^\n\r]+)', cover_text)
    dur = m_dur.group(1).strip() if m_dur else "៤៥ នាទី"
    
    g12_book_plans.append({
        "plan_index": i + 1,
        "start_page": p_start,
        "end_page": p_end,
        "page_count": page_count,
        "chapter": chapter,
        "lesson": lesson,
        "topic": topic,
        "duration": dur
    })

print(f"Mapped {len(g12_book_plans)} plans:")
for p in g12_book_plans[:15]:
    print(f"Plan {p['plan_index']:2d}: Pages {p['start_page']+1:3d}..{p['end_page']+1:3d} ({p['page_count']} pp) | {p['chapter'][:20]} | {p['lesson'][:20]} | {p['topic'][:30]}")

with open('scripts/g12_book_mapped_plans.json', 'w', encoding='utf-8') as f:
    json.dump(g12_book_plans, f, indent=2, ensure_ascii=False)

