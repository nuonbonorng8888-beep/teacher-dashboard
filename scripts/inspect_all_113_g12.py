# scripts/inspect_all_113_g12.py
import pymupdf as fitz
import re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('កិច្ចការតែងការទី១២/សៀវភៅកិច្ចតែងការបង្រៀនថ្នាក់ទី១២_Version_1.pdf')
pages = [7, 11, 16, 21, 26, 31, 37, 42, 46, 51, 56, 62, 66, 71, 75, 79, 83, 87, 91, 95, 99, 103, 107, 111, 116, 120, 125, 128, 132, 135, 138, 141, 145, 150, 153, 156, 159, 162, 166, 170, 174, 179, 184, 188, 192, 196, 200, 204, 207, 212, 216, 220, 224, 230, 240, 247, 253, 257, 263, 268, 275, 279, 284, 290, 296, 303, 308, 314, 320, 325, 330, 334, 341, 348, 354, 361, 367, 371, 375, 381, 386, 391, 397, 403, 407, 412, 416, 420, 426, 432, 436, 441, 446, 452, 458, 464, 469, 475, 481, 486, 490, 496, 501, 506, 512, 518, 522, 527, 533, 537, 542, 546, 553]

chapters = {}
current_ch = "ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច"

for i, pno in enumerate(pages):
    txt = doc[pno - 1].get_text()
    
    # Clean text to find chapter
    m_ch = re.search(r'ជំពូកទី\s*(\d+|[១-៩០]+)\s*[:៖]?\s*([^\n\r]+)', txt)
    if m_ch:
        ch_raw = m_ch.group(2).strip()
        # Clean ch_raw
        if 'កុំផ្លិច' in ch_raw or 'ក ំផ្លិច' in ch_raw:
            current_ch = "ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច"
        elif 'លីមីត' in ch_raw:
            current_ch = "ជំពូកទី ២ ៖ លីមីត"
        elif 'ដេរីវេ' in ch_raw or 'ដេរីដេ' in ch_raw:
            current_ch = "ជំពូកទី ៣ ៖ ដេរីវេនៃអនុគមន៍"
        elif 'អនុគមន៍' in ch_raw or 'អថេរភាព' in ch_raw or 'ក្រាប' in ch_raw or 'សង់រោប' in ch_raw:
            current_ch = "ជំពូកទី ៤ ៖ សិក្សាអថេរភាពនិងសង់ក្រាប"
        elif 'វ៉ិចទ័រ' in ch_raw or 'វុ៉ិចទ័រ' in ch_raw or 'េ ិចទ័រ' in ch_raw or 'លំហ' in ch_raw:
            current_ch = "ជំពូកទី ៥ ៖ វ៉ិចទ័រក្នុងលំហ"
        elif 'អាំងតេក្រាល' in ch_raw or 'អំងដត្ក្រាល' in ch_raw or 'ររីមីទីវ' in ch_raw:
            current_ch = "ជំពូកទី ៦ ៖ អាំងតេក្រាល"
        elif 'ឌីផេរ៉ង់ស្យែល' in ch_raw or 'ឌីដផ្រ៉ង់ស្សែល' in ch_raw:
            current_ch = "ជំពូកទី ៧ ៖ សមីការឌីផេរ៉ង់ស្យែល"
        elif 'ប្រូបាប' in ch_raw or 'ក្របូបាប' in ch_raw or 'ប្រូបារ' in ch_raw:
            current_ch = "ជំពូកទី ៨ ៖ ប្រូបាប"
        elif 'ស្ថិតិ' in ch_raw or 'សថិត្ិ' in ch_raw:
            current_ch = "ជំពូកទី ៩ ៖ ស្ថិតិពីរអថេរ"
        elif 'កោនិក' in ch_raw or 'ដានិក' in ch_raw or 'ប៉ារ៉ាបូល' in ch_raw or 'អែលីប' in ch_raw:
            current_ch = "ជំពូកទី ១០ ៖ កោនិក"
            
    if current_ch not in chapters:
        chapters[current_ch] = []
    chapters[current_ch].append(pno)

print(f"Total Chapters: {len(chapters)}")
for ch, pl in chapters.items():
    print(f"  {ch}: {len(pl)} plans (Pages {pl[0]} to {pl[-1]})")
