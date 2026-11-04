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

print(f"Analyzing all {len(g8)} Grade 8 PDFs for signatures and content overlap...\n")

# Signature keywords to detect in original PDFs
# Note: Khmer text in PDFs might be split or have broken encoding like 'បានង ើញ', 'រូបង្ងៀន', 'េិនិែយ', 'ព.ស', 'រាជធ'
SIG_KEYWORDS = [
    'បានឃើញ', 'បានង ើញ', 'បានពិនិត្យ', 'េិនិែយ', 'ឯកភាព', 'ឯកភាេ', 
    'គ្រូបង្រៀន', 'រូបង្ងៀន', 'រាជធានី', 'រាជធ', 'ព.ស'
]

results = []

for item in g8:
    pid = item['id']
    pdf_path = item['pdf_file']
    curr_sig_p = item.get('sig_page_index')
    curr_sig_y0 = item.get('sig_y0')
    
    if not os.path.exists(pdf_path):
        results.append({'id': pid, 'pdf': pdf_path, 'error': 'File not found'})
        continue
    
    doc = pymupdf.open(pdf_path)
    total_pages = len(doc)
    
    # Check all pages from last to first for signature block
    found_sigs = []
    for p_idx in range(total_pages):
        page = doc[p_idx]
        text_page = page.get_text()
        blocks = page.get_text("blocks")
        
        # Check if any signature keyword is present
        matched_kw = [kw for kw in SIG_KEYWORDS if kw in text_page]
        
        # Also check bounding boxes of matched keywords
        kw_rects = []
        for kw in matched_kw:
            rects = page.search_for(kw)
            for r in rects:
                kw_rects.append((kw, r))
                
        if matched_kw:
            found_sigs.append({
                'page': p_idx,
                'matched': matched_kw,
                'rects': kw_rects,
                'total_blocks': len(blocks),
                'page_height': page.rect.height
            })
            
    results.append({
        'id': pid,
        'pdf': pdf_path,
        'total_pages': total_pages,
        'curr_sig_p': curr_sig_p,
        'curr_sig_y0': curr_sig_y0,
        'found_sigs': found_sigs
    })

# Print findings
no_sigs = [r for r in results if not r.get('found_sigs')]
multiple_sigs = [r for r in results if len(r.get('found_sigs', [])) > 1]
mismatched_page = []

for r in results:
    if r.get('found_sigs'):
        detected_p = r['found_sigs'][-1]['page']
        if r['curr_sig_p'] is not None and r['curr_sig_p'] != detected_p:
            mismatched_page.append((r['id'], r['pdf'], r['curr_sig_p'], detected_p))

print(f"Total Grade 8 PDFs analyzed: {len(results)}")
print(f"PDFs with NO signature detected anywhere: {len(no_sigs)}")
for r in no_sigs:
    print(f"  NO SIG: {r['id']} ({r['pdf']}) curr_sig_p={r['curr_sig_p']}, curr_sig_y0={r['curr_sig_y0']}")

print(f"\nPDFs with MISMATCHED signature page: {len(mismatched_page)}")
for item in mismatched_page:
    print(f"  PAGE MISMATCH: {item[0]} curr={item[2]} detected={item[3]} ({item[1]})")
