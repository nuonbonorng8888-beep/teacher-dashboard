import os
import sys
import json
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']') + 1
data = json.loads(text[start:end])
g8 = [d for d in data if d.get('grade') in ['ថ្នាក់ទី ៨', 'ថ្នាក់ទី 8']]

print(f"Auditing all {len(g8)} Grade 8 plans for signature blocks...\n")

# Possible signature tokens / keywords in various encodings
tokens = [
    'បានឃើញ', 'បានង ើញ', 'បានពិនិត្យ', 'េិនិែយ', 'ឯកភាព', 'ឯកភាេ', 
    'គ្រូបង្រៀន', 'រូបង្ងៀន', 'រាជធានី', 'រាជធ', 'នាយករង', 'គណៈគ្រប់គ្រង'
]

plan_sig_info = []

for item in g8:
    pid = item['id']
    pdf_path = item['pdf_file']
    curr_sig_p = item.get('sig_page_index')
    curr_sig_y0 = item.get('sig_y0')
    
    if not os.path.exists(pdf_path):
        continue
    
    doc = pymupdf.open(pdf_path)
    found_pages = {}
    
    for p_no in range(len(doc)):
        page = doc[p_no]
        text_page = page.get_text()
        
        # Check tokens
        matched = []
        for t in tokens:
            if t in text_page:
                matched.append(t)
                
        if len(matched) >= 2: # At least 2 signature tokens
            # Find the minimum y of these matched words
            min_y = 9999.0
            max_y = 0.0
            min_x = 9999.0
            max_x = 0.0
            all_rects = []
            for t in matched:
                rects = page.search_for(t)
                for r in rects:
                    min_y = min(min_y, r.y0)
                    max_y = max(max_y, r.y1)
                    min_x = min(min_x, r.x0)
                    max_x = max(max_x, r.x1)
                    all_rects.append(r)
            found_pages[p_no] = {
                'matched': matched,
                'min_y': min_y,
                'max_y': max_y,
                'min_x': min_x,
                'max_x': max_x,
                'page_height': page.rect.height
            }
            
    plan_sig_info.append({
        'id': pid,
        'pdf': pdf_path,
        'total_pages': len(doc),
        'curr_sig_p': curr_sig_p,
        'curr_sig_y0': curr_sig_y0,
        'found_pages': found_pages
    })

print(f"Plans with detected authentic signatures: {sum(1 for p in plan_sig_info if p['found_pages'])}")
print(f"Plans with NO detected signatures: {sum(1 for p in plan_sig_info if not p['found_pages'])}")

print("\n--- Details of plans with NO detected signature ---")
for p in plan_sig_info:
    if not p['found_pages']:
        print(f"{p['id']}: {p['pdf']} (curr_p={p['curr_sig_p']}, curr_y0={p['curr_sig_y0']}, pages={p['total_pages']})")

print("\n--- Details of detected signatures comparison with curr_sig_y0 ---")
for p in plan_sig_info:
    if p['found_pages']:
        # Usually last detected page is the signature block
        best_p = max(p['found_pages'].keys())
        info = p['found_pages'][best_p]
        diff = abs((p['curr_sig_y0'] or 0) - info['min_y'])
        if p['curr_sig_p'] != best_p or diff > 40:
            print(f"{p['id']}: curr_p={p['curr_sig_p']}, best_p={best_p} | curr_y0={p['curr_sig_y0']}, det_min_y={info['min_y']:.1f}, min_x={info['min_x']:.1f} ({p['pdf']})")
