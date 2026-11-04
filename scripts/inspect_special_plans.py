import pymupdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

no_sig_ids = [
    ('plan_g8_l2_1', 'កិច្ចការតែងការទី៨/8_2_1_មេរៀនទី2_ស្វ័យគុណ.pdf'),
    ('plan_g8_l2_2', 'កិច្ចការតែងការទី៨/8_2_2_មេរៀនទី2_ស្វ័យគុណ.pdf'),
    ('plan_g8_l2_3', 'កិច្ចការតែងការទី៨/8_2_3_មេរៀនទី2_ស្វ័យគុណ.pdf'),
    ('plan_g8_l2_4', 'កិច្ចការតែងការទី៨/8_2_4_មេរៀនទី2_ស្វ័យគុណ.pdf'),
    ('plan_g8_l2_5', 'កិច្ចការតែងការទី៨/8_2_5_មេរៀនទី2_ស្វ័យគុណ.pdf'),
    ('plan_g8_l3_1', 'កិច្ចការតែងការទី៨/8_3_1_មេរៀនទី៣_ទំហំសមាមាត្រនិងភាគរយ.pdf'),
    ('plan_g8_6',    'កិច្ចការតែងការទី៨/8_3_2_មេរៀនទី៣_ទំហំសមាមាត្រនិងភាគរយ.pdf'),
    ('plan_g8_38',   'កិច្ចការតែងការទី៨/8_12_1_មេរៀនទី១២_ការប្រៀបធៀបត្រីកោណ.pdf'),
    ('plan_g8_39',   'កិច្ចការតែងការទី៨/8_12_2_មេរៀនទី១២_ការប្រៀបធៀបត្រីកោណ.pdf'),
    ('plan_g8_40',   'កិច្ចការតែងការទី៨/8_12_3_មេរៀនទី១២_ការប្រៀបធៀបត្រីកោណ.pdf'),
    ('plan_g8_35',   'កិច្ចការតែងការទី៨/8_10_3_មេរៀនទី១០_ស្ថិតិ.pdf'),
]

for pid, path in no_sig_ids:
    doc = pymupdf.open(path)
    print(f"\n==================== {pid} ({path}) [Pages: {len(doc)}] ====================")
    # Check last 2 pages
    for p_idx in range(max(0, len(doc)-2), len(doc)):
        page = doc[p_idx]
        blocks = page.get_text("blocks")
        text = page.get_text().strip()
        print(f"--- Page {p_idx} (blocks: {len(blocks)}) ---")
        if blocks:
            # print first 2 and last 2 text lines
            non_empty = [b for b in blocks if b[4].strip()]
            for b in non_empty[:2]:
                print(f"  TOP: y=[{b[1]:.1f}-{b[3]:.1f}] {b[4].strip()[:60]}")
            for b in non_empty[-2:]:
                print(f"  BOT: y=[{b[1]:.1f}-{b[3]:.1f}] {b[4].strip()[:60]}")
            last_y = max(b[3] for b in non_empty) if non_empty else 0
            print(f"  Max y1 on page: {last_y:.1f} (Page Height: {page.rect.height:.1f})")
        else:
            print("  (Empty page)")

