# scripts/slice_g12_book_plans.py
import pymupdf as fitz
import re, json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

book_path = "កិច្ចការតែងការទី១២/សៀវភៅកិច្ចតែងការបង្រៀនថ្នាក់ទី១២_Version_1.pdf"
doc = fitz.open(book_path)

starts_1indexed = [7, 11, 16, 21, 26, 31, 37, 42, 46, 51, 56, 62, 66, 71, 75, 79, 83, 87, 91, 95, 99, 103, 107, 111, 116, 120, 125, 128, 132, 135, 138, 141, 145, 150, 153, 156, 159, 162, 166, 170, 174, 179, 184, 188, 192, 196, 200, 204, 207, 212, 216, 220, 224, 230, 240, 247, 253, 257, 263, 268, 275, 279, 284, 290, 296, 303, 308, 314, 320, 325, 330, 334, 341, 348, 354, 361, 367, 371, 375, 381, 386, 391, 397, 403, 407, 412, 416, 420, 426, 432, 436, 441, 446, 452, 458, 464, 469, 475, 481, 486, 490, 496, 501, 506, 512, 518, 522, 527, 533, 537, 542, 546, 553]

output_dir = "កិច្ចការតែងការទី១២"
g12_plans = []

current_ch_num = 1
current_ch_title = "ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច"
current_ch_code = "g12_c1"
ch_plan_counter = 0

for i, p_start_1 in enumerate(starts_1indexed):
    p_start = p_start_1 - 1
    p_end = starts_1indexed[i+1] - 2 if i+1 < len(starts_1indexed) else len(doc) - 1
    page_count = p_end - p_start + 1
    
    cover_text = doc[p_start].get_text()
    
    # Detect Chapter
    m_ch = re.search(r'ជំពូកទី\s*(\d+|[១-៩០]+)\s*[:៖]?\s*([^\n\r]+)', cover_text)
    if m_ch:
        ch_raw = m_ch.group(2).strip()
        if 'កុំផ្លិច' in ch_raw or 'ក ំផ្លិច' in ch_raw:
            ch_num, ch_title = 1, "ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច"
        elif 'លីមីត' in ch_raw:
            ch_num, ch_title = 2, "ជំពូកទី ២ ៖ លីមីត"
        elif 'ដេរីវេ' in ch_raw or 'ដេរីដេ' in ch_raw:
            ch_num, ch_title = 3, "ជំពូកទី ៣ ៖ ដេរីវេនៃអនុគមន៍"
        elif 'អនុគមន៍' in ch_raw or 'អថេរភាព' in ch_raw or 'ក្រាប' in ch_raw or 'សង់រោប' in ch_raw:
            ch_num, ch_title = 4, "ជំពូកទី ៤ ៖ សិក្សាអថេរភាពនិងសង់ក្រាប"
        elif 'វ៉ិចទ័រ' in ch_raw or 'វុ៉ិចទ័រ' in ch_raw or 'េ ិចទ័រ' in ch_raw or 'លំហ' in ch_raw:
            ch_num, ch_title = 5, "ជំពូកទី ៥ ៖ វ៉ិចទ័រក្នុងលំហ"
        elif 'អាំងតេក្រាល' in ch_raw or 'អំងដត្ក្រាល' in ch_raw or 'ររីមីទីវ' in ch_raw:
            ch_num, ch_title = 6, "ជំពូកទី ៦ ៖ អាំងតេក្រាល"
        elif any(k in ch_raw for k in ['ឌីផេរ៉ង់', 'ឌីដផ្រ៉ង់', 'ឌីមផ្', 'សមីការឌី']):
            ch_num, ch_title = 7, "ជំពូកទី ៧ ៖ សមីការឌីផេរ៉ង់ស្យែល"
        elif 'ប្រូបាប' in ch_raw or 'ក្របូបាប' in ch_raw or 'ប្រូបារ' in ch_raw:
            ch_num, ch_title = 8, "ជំពូកទី ៨ ៖ ប្រូបាប"
        elif 'ស្ថិតិ' in ch_raw or 'សថិត្ិ' in ch_raw:
            ch_num, ch_title = 9, "ជំពូកទី ៩ ៖ ស្ថិតិពីរអថេរ"
        elif 'កោនិក' in ch_raw or 'ដានិក' in ch_raw or 'ប៉ារ៉ាបូល' in ch_raw or 'អែលីប' in ch_raw:
            ch_num, ch_title = 10, "ជំពូកទី ១០ ៖ កោនិក"
        else:
            ch_num, ch_title = current_ch_num, current_ch_title
            
        if ch_num != current_ch_num:
            current_ch_num = ch_num
            current_ch_title = ch_title
            current_ch_code = f"g12_c{ch_num}"
            ch_plan_counter = 0

    ch_plan_counter += 1
    
    # Lesson Title
    m_les = re.search(r'(?:ងេ|មេ|ម)ម?រៀនទី\s*(\d+|[១-៩០]+)\s*[:៖]?\s*([^\n\r]+)', cover_text)
    les_title = m_les.group(0).strip() if m_les else f"ម៉ោងទី {ch_plan_counter}"
    
    # Topic
    m_top = re.search(r'២\.\s*ខ្លឹមសារ\s*[:៖]?\s*([^\n\r]+)', cover_text)
    topic = m_top.group(1).strip() if m_top else ""
    if not topic:
        m_top2 = re.search(r'ខ្លឹមសារ\s*[:៖]?\s*([^\n\r]+)', cover_text)
        topic = m_top2.group(1).strip() if m_top2 else les_title
        
    # Duration
    m_dur = re.search(r'រយៈ(?:ង|មេ|ម)?ពេល\s*[:៖]?\s*([^\n\r]+)', cover_text)
    dur = m_dur.group(1).strip() if m_dur else "៤៥ នាទី"
    
    # Slice single plan
    new_doc = fitz.open()
    new_doc.insert_pdf(doc, from_page=p_start, to_page=p_end)
    out_filename = f"12_{current_ch_num}_{ch_plan_counter}_កិច្ចតែងការ_ជំពូក{current_ch_num}_ម៉ោងទី{ch_plan_counter}.pdf"
    out_path = os.path.join(output_dir, out_filename)
    new_doc.save(out_path)
    new_doc.close()
    
    # Find signature y0 on last page
    last_page = doc[p_end]
    rects = last_page.search_for("បានឃើញ") or last_page.search_for("គ្រូបង្រៀន") or last_page.search_for("ហត្ថលេខា")
    sig_y0 = rects[0].y0 if rects else 500.0
    
    g12_plans.append({
        "num": i + 1,
        "ch_num": current_ch_num,
        "ch_plan_counter": ch_plan_counter,
        "chapter": current_ch_title,
        "chapter_code": current_ch_code,
        "lesson_title": les_title,
        "topic": topic,
        "duration": dur,
        "pdf_file": out_path.replace('\\', '/'),
        "page_count": page_count,
        "sig_page_index": page_count - 1,
        "sig_y0": sig_y0
    })

print(f"Total sliced Grade 12 plans: {len(g12_plans)}")
with open('scripts/g12_sliced_metadata.json', 'w', encoding='utf-8') as f:
    json.dump(g12_plans, f, indent=2, ensure_ascii=False)
