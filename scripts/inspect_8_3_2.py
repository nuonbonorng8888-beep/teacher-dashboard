import pymupdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('កិច្ចការតែងការទី៨/8_3_2_មេរៀនទី៣_ទំហំសមាមាត្រនិងភាគរយ.pdf')
print(f"Total pages in 8_3_2: {len(doc)}")

for p_no in range(len(doc)):
    page = doc[p_no]
    blocks = page.get_text("blocks")
    print(f"\n--- Page {p_no} (length={len(blocks)} blocks) ---")
    first_few = blocks[:2] if len(blocks) >= 2 else blocks
    last_few = blocks[-2:] if len(blocks) >= 2 else blocks
    print(f"First text: {[b[4].strip()[:60] for b in first_few]}")
    print(f"Last text: {[b[4].strip()[:60] for b in last_few]}")
    if blocks:
        last_block = blocks[-1]
        print(f"Last block rect: y0={last_block[1]:.1f}, y1={last_block[3]:.1f}")
