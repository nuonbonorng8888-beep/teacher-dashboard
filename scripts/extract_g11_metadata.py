# scripts/extract_g11_metadata.py
import pymupdf as fitz
import re, json, sys, os
sys.stdout.reconfigure(encoding='utf-8')

g11_folder = "កិច្ចការតែងការទី១១"
files = [
    ("ស្វ៊ីតចំនួនពិត.pdf", "ch1_l1", "ជំពូកទី ១ ៖ ស្វ៊ីត និងអនុមានរួមគណិតវិទ្យា", "មេរៀនទី ១ ៖ ស្វ៊ីតចំនួនពិត"),
    ("ស្វ៊ីតនព្វន្ត.pdf", "ch1_l2", "ជំពូកទី ១ ៖ ស្វ៊ីត និងអនុមានរួមគណិតវិទ្យា", "មេរៀនទី ២ ៖ ស្វ៊ីតនព្វន្ត"),
    ("ស្វ៊ីតធរណីមាត្រ.pdf", "ch1_l3", "ជំពូកទី ១ ៖ ស្វ៊ីត និងអនុមានរួមគណិតវិទ្យា", "មេរៀនទី ៣ ៖ ស្វ៊ីតធរណីមាត្រ")
]

g11_plans = []

for fname, ch_code, ch_title, les_title in files:
    fpath = os.path.join(g11_folder, fname)
    doc = fitz.open(fpath)
    
    # Locate plan start pages
    start_pages = []
    for pno in range(len(doc)):
        txt = doc[pno].get_text()
        if "កិច្ចតែងការបង្រៀន" in txt or "កិច្ចតែងការបង្ងៀន" in txt:
            start_pages.append(pno)
            
    print(f"\n{fname}: {len(start_pages)} plans detected at pages {[p+1 for p in start_pages]}")
    
    for i, p_start in enumerate(start_pages):
        p_end = start_pages[i+1] - 1 if i+1 < len(start_pages) else len(doc) - 1
        page_count = p_end - p_start + 1
        
        # Read cover page text
        cover_text = doc[p_start].get_text()
        
        # Find signatures page
        sig_pno = p_end
        sig_y0 = 500.0
        for p in range(p_start, p_end + 1):
            ptxt = doc[p].get_text()
            if any(k in ptxt for k in ["បានឃើញ", "បានពិនិត្យ", "ហត្ថលេខា", "គ្រូបង្រៀន", "នាយក"]):
                sig_pno = p
                # Look for rect of signature
                rects = doc[p].search_for("បានឃើញ") or doc[p].search_for("គ្រូបង្រៀន")
                if rects:
                    sig_y0 = rects[0].y0
                break
                
        # Extract metadata
        m_dur = re.search(r'រយៈ(?:ង|មេ|ម)?ពេល\s*[:៖]?\s*([^\n\r]+)', cover_text)
        duration = m_dur.group(1).strip() if m_dur else "៤៥ នាទី"
        
        m_top = re.search(r'២\.\s*ខ្លឹមសារ\s*[:៖]?\s*([^\n\r]+)', cover_text)
        topic = m_top.group(1).strip() if m_top else ""
        if not topic:
            m_top2 = re.search(r'ខ្លឹមសារ\s*[:៖]?\s*([^\n\r]+)', cover_text)
            topic = m_top2.group(1).strip() if m_top2 else les_title
            
        m_know = re.search(r'វិជ្ជាសម្បទា\s*[:៖]?\s*([^\n\r•▪]+)', cover_text)
        know = m_know.group(1).strip() if m_know else ""
        
        m_skill = re.search(r'បំណិនសម្បទា\s*[:៖]?\s*([^\n\r•▪]+)', cover_text)
        skill = m_skill.group(1).strip() if m_skill else ""
        
        m_att = re.search(r'ចរិយាសម្បទា\s*[:៖]?\s*([^\n\r•▪]+)', cover_text)
        attitude = m_att.group(1).strip() if m_att else ""
        
        plan_item = {
            "file": fname,
            "path": fpath.replace('\\', '/'),
            "ch_code": ch_code,
            "ch_title": ch_title,
            "les_title": les_title,
            "hour": i + 1,
            "start_page": p_start,
            "end_page": p_end,
            "page_count": page_count,
            "sig_page": sig_pno,
            "sig_y0": sig_y0,
            "duration": duration,
            "topic": topic,
            "knowledge": know,
            "skills": skill,
            "attitude": attitude
        }
        g11_plans.append(plan_item)
        print(f"  - Plan Hour {i+1}: Pages {p_start+1}..{p_end+1} ({page_count} pages), sig Page {sig_pno+1} y={sig_y0:.1f} | Topic: {topic[:45]}")

print(f"\nTotal Grade 11 plans extracted: {len(g11_plans)}")
with open('scripts/g11_extracted_plans.json', 'w', encoding='utf-8') as f:
    json.dump(g11_plans, f, indent=2, ensure_ascii=False)
