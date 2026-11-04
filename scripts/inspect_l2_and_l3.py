import pymupdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

for fn in [
    'កិច្ចការតែងការទី៨/8_2_1_មេរៀនទី2_ស្វ័យគុណ.pdf',
    'កិច្ចការតែងការទី៨/8_2_2_មេរៀនទី2_ស្វ័យគុណ.pdf',
    'កិច្ចការតែងការទី៨/8_2_3_មេរៀនទី2_ស្វ័យគុណ.pdf',
    'កិច្ចការតែងការទី៨/8_2_4_មេរៀនទី2_ស្វ័យគុណ.pdf',
    'កិច្ចការតែងការទី៨/8_2_5_មេរៀនទី2_ស្វ័យគុណ.pdf',
    'កិច្ចការតែងការទី៨/8_3_1_មេរៀនទី៣_ទំហំសមាមាត្រនិងភាគរយ.pdf',
]:
    doc = pymupdf.open(fn)
    print(f"\n===== {fn} =====")
    for p_no in range(len(doc)):
        page = doc[p_no]
        text = page.get_text()
        has_sig = any(w in text for w in ['បានឃើញ', 'បានង ើញ', 'ពិនិត្យ', 'េិនិែយ', 'គ្រូបង្រៀន', 'រូបង្ងៀន', 'បនេឃញ'])
        blocks = [b for b in page.get_text('blocks') if b[4].strip()]
        last_y = max(b[3] for b in blocks) if blocks else 0
        first_y = min(b[1] for b in blocks) if blocks else 0
        print(f"Page {p_no}: blocks={len(blocks)}, y=[{first_y:.1f} - {last_y:.1f}], has_sig={has_sig}")
