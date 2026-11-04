import pymupdf
import sys
import glob
import os

sys.stdout.reconfigure(encoding='utf-8')

print("Checking page index of authentic signatures relative to total pages in Grade 8:")
for f in sorted(glob.glob('កិច្ចការតែងការទី៨/8_*.pdf')):
    doc = pymupdf.open(f)
    tot = len(doc)
    sig_pages = []
    ws_pages = []
    for p_no in range(tot):
        text = doc[p_no].get_text()
        if any(w in text for w in ['បានឃើញ', 'បានង ើញ', 'ពិនិត្យ', 'េិនិែយ', 'គ្រូបង្រៀន', 'រូបង្ងៀន', 'បនេឃញ']):
            sig_pages.append(p_no)
        if 'សន្លឹកកិច្ចការ' in text or 'សនលឹកកិច្ចការ' in text:
            ws_pages.append(p_no)
    fname = os.path.basename(f)
    print(f"{fname[:38]:38}: Tot={tot}, Sig={sig_pages}, WS={ws_pages}")
