# -*- coding: utf-8 -*-
import docx
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import copy
import os
import comtypes.client
import fitz

doc = docx.Document('កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.docx')
t = doc.tables[0]
r10 = t.rows[10]

# Let's clone r10 to create r11
new_tr = copy.deepcopy(r10._tr)
t._tbl.append(new_tr)

# In original r10 (row 10): keep only P0, P1, P2 in cell 1 (delete P3, P4)
c1_orig = r10.cells[1]
# Paragraphs in cell:
# To delete P3 and P4 from c1_orig:
p_elems = c1_orig._tc.xpath('./w:p')
if len(p_elems) >= 5:
    c1_orig._tc.remove(p_elems[4])
    c1_orig._tc.remove(p_elems[3])

# In new row (r11):
# c0: clear text or keep short
new_r = t.rows[11]
c0_new = new_r.cells[0]
for p in c0_new.paragraphs:
    p.text = ''

# c1: remove P0, P1, P2 (keep only P3, P4)
c1_new = new_r.cells[1]
new_p_elems = c1_new._tc.xpath('./w:p')
if len(new_p_elems) >= 5:
    c1_new._tc.remove(new_p_elems[2])
    c1_new._tc.remove(new_p_elems[1])
    c1_new._tc.remove(new_p_elems[0])

# Set pageBreakBefore on first paragraph of c1_new so it starts on next page
first_p_new = c1_new.paragraphs[0]
first_p_new.paragraph_format.page_break_before = True

# Also ensure c0_new has pageBreakBefore
if c0_new.paragraphs:
    c0_new.paragraphs[0].paragraph_format.page_break_before = True

doc.save('scratch/test_split.docx')
print('Saved scratch/test_split.docx')

# Convert with Word
word = comtypes.client.CreateObject('Word.Application')
word.Visible = False
try:
    doc_in = os.path.abspath('scratch/test_split.docx')
    pdf_out = os.path.abspath('scratch/test_split.pdf')
    w_doc = word.Documents.Open(doc_in)
    w_doc.SaveAs(pdf_out, FileFormat=17)
    w_doc.Close()
    print('Converted to scratch/test_split.pdf successfully!')
finally:
    word.Quit()

# Inspect pages
pdf_doc = fitz.open('scratch/test_split.pdf')
print('Total pages:', len(pdf_doc))
for i in range(len(pdf_doc)):
    txt = pdf_doc[i].get_text('text')
    first_l = txt.strip().split('\n')[0] if txt.strip() else 'EMPTY'
    print(f'Page {i+1}: {first_l[:40]} (length: {len(txt)})')
    if 'ចូររៀប' in txt or 'បានឃើញ' in txt:
        print(f'   -> Found keywords on Page {i+1}!')
