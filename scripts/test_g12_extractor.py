import fitz, json, sys, re
sys.stdout.reconfigure(encoding='utf-8')

g12_meta = json.load(open('scripts/g12_sliced_metadata.json', encoding='utf-8'))
print(f"Loaded {len(g12_meta)} G12 metadata items.")

for i in [0, 13, 30, 37, 52, 63, 79, 89, 98, 105]:
    p = g12_meta[i]
    doc = fitz.open(p['pdf_file'])
    t0 = doc[0].get_text()
    
    # Extract Knowledge
    m_k = re.search(r'វិជ្ជាស[រម]បទា\s*[:៖]?\s*([^\n\r•▪]+)', t0)
    # Extract Skills
    m_s = re.search(r'បំណិនស[រម]បទា\s*[:៖]?\s*([^\n\r•▪]+)', t0)
    # Extract Attitude
    m_a = re.search(r'[ចឆ]រិយាស[រម]បទា\s*[:៖]?\s*([^\n\r•▪]+)', t0)
    
    k = m_k.group(1).strip() if m_k else ""
    s = m_s.group(1).strip() if m_s else ""
    a = m_a.group(1).strip() if m_a else ""
    
    print(f"\n--- Plan {p['num']}: {p['chapter']} / {p['lesson_title']} ---")
    print("  Knowledge:", k[:60])
    print("  Skills:", s[:60])
    print("  Attitude:", a[:60])

