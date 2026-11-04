import pymupdf
import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']') + 1
data = json.loads(text[start:end])
g8 = [d for d in data if d.get('grade') in ['ថ្នាក់ទី ៨', 'ថ្នាក់ទី 8']]

print(f"=== FULL GRADE 8 SIGNATURE AUDIT ({len(g8)} plans) ===\n")

# Keywords that indicate the top or content of the signature block:
SIG_MARKERS = [
    'រាជធានី', 'រាជធ', 'ព.ស', 'បានឃើញ', 'បានង ើញ', 'ពិនិត្យ', 'េិនិែយ', 'ឯកភាព', 'ឯកភាេ', 
    'គ្រូបង្រៀន', 'រូបង្ងៀន', 'ប្រធានក្រុម', 'បធាន្កុេ', 'គណៈគ្រប់គ្រង', 'រណៈ្រប់្រង', 'បនេឃញ'
]

# Words that indicate lesson process, NOT signatures
LESSON_MARKERS = [
    'ជំហាន', 'រដ្ឋបាល', 'រំលឹក', 'មេរៀនថ្មី', 'ពង្រឹងពុទ្ធិ', 'កិច្ចការផ្ទះ', 
    'បណ្តាំផ្ញើ', 'សកម្មភាព', 'វាយតម្លៃ', 'លំហាត់', 'ចម្លើយ', 'តាង'
]

audit_results = []

for item in g8:
    pid = item['id']
    pdf_path = item['pdf_file']
    curr_sig_p = item.get('sig_page_index')
    curr_sig_y0 = item.get('sig_y0')
    
    if not os.path.exists(pdf_path):
        continue
        
    doc = pymupdf.open(pdf_path)
    total_pages = len(doc)
    
    # Check each page for signature markers
    best_page = None
    best_y0 = None
    best_markers = []
    
    # Usually signature is on the last page before worksheet or the last page
    for p_no in range(total_pages):
        page = doc[p_no]
        p_text = page.get_text()
        
        # Check if signature markers present
        found_markers = []
        for m in SIG_MARKERS:
            if m in p_text:
                found_markers.append(m)
                
        if len(found_markers) >= 2:
            # Find the minimum y of signature markers on this page
            rects = []
            for m in found_markers:
                for r in page.search_for(m):
                    # Filter out header matches if any (y < 50)
                    if r.y0 > 50:
                        rects.append(r)
            if rects:
                min_y = min(r.y0 for r in rects)
                # Look if there's a date or P.S. line slightly above
                for r in page.search_for('ព.ស'):
                    if r.y0 > 50 and r.y0 < min_y:
                        min_y = min(min_y, r.y0)
                for r in page.search_for('ថ្ងៃ'):
                    if r.y0 > 50 and r.y0 < min_y and (min_y - r.y0) < 60:
                        min_y = min(min_y, r.y0)
                best_page = p_no
                best_y0 = round(min_y - 12.0, 1) # 12pt padding above
                best_markers = found_markers

    audit_results.append({
        'id': pid,
        'title': item['lesson_title'],
        'pdf': pdf_path,
        'total_pages': total_pages,
        'curr_sig_p': curr_sig_p,
        'curr_sig_y0': curr_sig_y0,
        'detected_sig_p': best_page,
        'detected_sig_y0': best_y0,
        'markers': best_markers
    })

print(f"{'ID':15} | {'Curr Page':9} | {'Det Page':8} | {'Curr Y0':7} | {'Det Y0':7} | {'Diff':6} | {'Status'}")
print("-" * 80)

discrepancies = []
for r in audit_results:
    curr_p = r['curr_sig_p']
    det_p = r['detected_sig_p']
    curr_y = r['curr_sig_y0']
    det_y = r['detected_sig_y0']
    
    status = "OK"
    diff = 0.0
    if det_p is None:
        status = "NO_AUTH_SIG"
    elif curr_p != det_p:
        status = "PAGE_MISMATCH"
    else:
        diff = round(abs((curr_y or 0) - det_y), 1)
        if diff > 40:
            status = "Y0_MISMATCH"
            
    if status != "OK":
        discrepancies.append((r, status, diff))
        print(f"{r['id']:15} | {str(curr_p):9} | {str(det_p):8} | {str(curr_y):7} | {str(det_y):7} | {diff:6.1f} | {status}")

print(f"\nTotal Discrepancies in Grade 8: {len(discrepancies)}")

