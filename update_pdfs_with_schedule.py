#!/usr/bin/env python3
"""
NGS Lesson Plans PDF Generator & Synchronizer
Teacher: Nuon Bonorng (នួន បូណង)
School: Preah Yukunthor High School - New Generation School (NGS)

Key Features:
1. Every Lesson Plan starts on an ODD page (1, 3, 5, 7, 9...). If a plan ends on an odd page,
   a blank page is automatically inserted so the next plan begins on an odd page (Duplex printing standard).
2. Cover Date & Teacher block:
   - Labels ('កាលបរិច្ឆេទ', 'បង្រៀនដោយ') use 'Khmer OS Muol Light' matching 'រយៈពេល : ៤៥ នាទី' in font, weight, and size.
   - Colons (:) align at the exact horizontal position (x = 226.83 pt) with lines above.
   - Values use 'Khmer OS Siemreap' (10pt equivalent).
3. Signature block: Clean date without dots, closed bottom table border, and 3 clean columns.
"""

import fitz, os, sys, subprocess, json, re
from datetime import datetime, timedelta
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
KHMER_MONTHS = [
    'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
    'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
]

def to_khmer_num(num):
    return ''.join(KHMER_DIGITS[int(d)] if d.isdigit() else d for d in str(num))

def format_khmer_date_clean(dt):
    d = to_khmer_num(dt.day)
    m = KHMER_MONTHS[dt.month - 1]
    y = to_khmer_num(dt.year)
    return f"ថ្ងៃទី {d} ខែ {m} ឆ្នាំ {y}"

def generate_schedule(start_date_str, count, step_days=2):
    dt = datetime.strptime(start_date_str, '%Y-%m-%d')
    if dt.weekday() == 6: # Shift Sunday to Monday
        dt += timedelta(days=1)
    dates = []
    for _ in range(count):
        dates.append(dt)
        dt += timedelta(days=step_days)
        if dt.weekday() == 6: # Skip Sunday
            dt += timedelta(days=1)
    return dates

def render_all_banners_html(dates_list, out_png):
    """
    Render high-res banners matching Image 2 exactly:
    - Labels: 'Khmer OS Muol Light' (size 31.5px / 10pt)
    - Colons (:): Perfectly aligned at 303px (x = 226.83 pt in PDF)
    - Values: 'Khmer OS Siemreap' (size 31.5px / 10pt)
    """
    html = '''<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<style>
@font-face {
  font-family: 'Khmer OS Muol Light';
  src: local('Khmer OS Muol Light'), local('KhmerOSmuollight');
}
@font-face {
  font-family: 'Khmer OS Siemreap';
  src: local('Khmer OS Siemreap'), local('KhmerOSsiemreap');
}
body {
  margin: 0;
  padding: 0;
  background: white;
}
.banner {
  width: 900px;
  height: 114px;
  box-sizing: border-box;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.row {
  height: 57px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.lbl {
  width: 303px;
  flex-shrink: 0;
  font-family: 'Khmer OS Muol Light', 'Khmer OS Muol', sans-serif;
  font-size: 31.5px;
  font-weight: normal;
  color: #000;
  line-height: 57px;
}
.colon {
  width: 36px;
  flex-shrink: 0;
  font-family: 'Khmer OS Siemreap', 'Noto Sans Khmer', sans-serif;
  font-size: 31.5px;
  color: #000;
  line-height: 57px;
}
.val {
  flex-grow: 1;
  font-family: 'Khmer OS Siemreap', 'Noto Sans Khmer', sans-serif;
  font-size: 31.5px;
  color: #000;
  line-height: 57px;
}
.sig-banner {
  width: 900px;
  height: 60px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15px;
  font-family: 'Khmer OS Siemreap', 'Noto Sans Khmer', sans-serif;
}
.sig-date {
  font-size: 28px;
  font-weight: bold;
  color: #000;
}
</style>
</head>
<body>
'''
    for i, dt in enumerate(dates_list):
        kd = format_khmer_date_clean(dt)
        html += f'''
        <div id='cover_{i}' class='banner'>
            <div class='row'>
                <span class='lbl'>កាលបរិច្ឆេទ</span>
                <span class='colon'>:</span>
                <span class='val'>{kd}</span>
            </div>
            <div class='row'>
                <span class='lbl'>បង្រៀនដោយ</span>
                <span class='colon'>:</span>
                <span class='val'>នួន បូណង</span>
            </div>
        </div>
        <div id='sig_{i}' class='sig-banner'>
            <div class='sig-date'>រាជធានីភ្នំពេញ {kd}</div>
        </div>
        '''
    html += '</body></html>'

    tmp_html = 'scratch/banners_temp.html'
    with open(tmp_html, 'w', encoding='utf-8') as f:
        f.write(html)

    edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
    abs_out = os.path.abspath(out_png)
    abs_html = 'file:///' + os.path.abspath(tmp_html).replace('\\', '/')
    total_h = len(dates_list) * 174 + 100
    cmd = [
        edge_path, '--headless', '--disable-gpu',
        f'--screenshot={abs_out}',
        f'--window-size=950,{total_h}',
        abs_html
    ]
    subprocess.run(cmd, capture_output=True)

def update_all_pdfs(start_date_str='2026-11-05', class_name='១២A', step_days=2):
    print(f"=== Synchronizing NGS PDFs with Start Date: {start_date_str}, Class: {class_name} ===")

    logo_img = 'scratch/yukunthor_logo.jpg'
    text_img = 'scratch/yukunthor_header_text.png'
    sig_columns_img = 'images/sample_sig_columns_clean.png'

    # 13 dates for Ch1, 13 dates for Ch2, 11 dates for Ch5
    dates_ch1 = generate_schedule(start_date_str, 13, step_days)
    dates_ch2 = generate_schedule(start_date_str, 13, step_days)
    dates_ch5 = generate_schedule(start_date_str, 11, step_days)

    all_dates = dates_ch1 + dates_ch2 + dates_ch5
    banners_png = 'scratch/all_generated_banners_clean.png'
    render_all_banners_html(all_dates, banners_png)
    banners_im = Image.open(banners_png)

    def get_banners_for_index(idx):
        y_top = idx * 174
        cover_crop = banners_im.crop((0, y_top, 900, y_top + 114))
        sig_crop = banners_im.crop((0, y_top + 114, 900, y_top + 174))
        c_path = f'scratch/c_banner_clean_{idx}.png'
        s_path = f'scratch/s_banner_clean_{idx}.png'
        cover_crop.save(c_path)
        sig_crop.save(s_path)
        return c_path, s_path

    new_indices_map = {}

    # ==========================
    # CHAPTER 1: COMPLEX NUMBERS (13 PLANS)
    # ==========================
    doc_c = fitz.open('គំរូ   ជំពូកទី_1_ចំនួនកុំផ្លិច.pdf')
    cover_pages_c = [0, 4, 10, 16, 22, 28, 35, 41, 45, 51, 57, 65, 69]
    sig_pages_c = [2, 7, 13, 19, 25, 32, 38, 43, 48, 54, 61, 67, 71]

    # First modify in-memory source pages
    for i, pno in enumerate(cover_pages_c):
        p = doc_c[pno]
        b_date = [b for b in p.get_text('blocks') if 'កាលបរិ' in b[4] or 'Ƴលបរិ' in b[4]]
        c_path, _ = get_banners_for_index(i)
        y0_d = b_date[0][1] if b_date else 172.0
        p.add_redact_annot(fitz.Rect(130, y0_d - 1, 450, y0_d + 37.0), fill=(1, 1, 1))
        p.apply_redactions()
        p.insert_image(fitz.Rect(130.93, y0_d, 130.93 + 285.0, y0_d + 36.14), filename=c_path)

    for i, pno in enumerate(sig_pages_c):
        p = doc_c[pno]
        b_date = [b for b in p.get_text('blocks') if 'Ǎជǅនី' in b[4] or 'រាជធានី' in b[4] or 'ភƒំេពញ' in b[4]]
        _, s_path = get_banners_for_index(i)
        if b_date:
            min_y = b_date[0][1]
            p.add_redact_annot(fitz.Rect(65, min_y, 565, min_y + 138), fill=(1, 1, 1))
            p.apply_redactions()
            p.draw_line(fitz.Point(71.0, min_y - 0.7), fitz.Point(538.5, min_y - 0.7), color=(0, 0, 0), width=0.6)
            p.insert_image(fitz.Rect(300, min_y + 5, 555, min_y + 5 + 20), filename=s_path)
            p.insert_image(fitz.Rect(65, min_y + 27, 565, min_y + 27 + 110.5), filename=sig_columns_img)

    # Assemble into doc_out enforcing ODD PAGE START
    doc_c_out = fitz.open()
    ch1_new_covers = []
    ch1_new_sigs = []
    p_w, p_h = doc_c[0].rect.width, doc_c[0].rect.height

    for i in range(len(cover_pages_c)):
        start = cover_pages_c[i]
        end = cover_pages_c[i+1] - 1 if i+1 < len(cover_pages_c) else len(doc_c) - 1
        sig_offset = sig_pages_c[i] - start

        # If current page count in doc_out is ODD, next page is EVEN -> Insert Blank Page!
        if len(doc_c_out) % 2 == 1:
            doc_c_out.new_page(width=p_w, height=p_h)

        new_cover = len(doc_c_out)
        new_sig = new_cover + sig_offset
        ch1_new_covers.append(new_cover)
        ch1_new_sigs.append(new_sig)
        new_indices_map[f"plan_{i+1}"] = {"cover": new_cover, "sig": new_sig}

        for pno in range(start, end + 1):
            doc_c_out.insert_pdf(doc_c, from_page=pno, to_page=pno)

    doc_c_out.save('ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf')
    doc_c_out.close()
    doc_c.close()
    print(f"✓ Chapter 1 PDF Updated successfully (All {len(cover_pages_c)} plans start on ODD pages).")

    # ==========================
    # CHAPTER 2: LIMITS (13 PLANS)
    # ==========================
    doc_l = fitz.open('ជំពូកទី 2 លីមីត (2).pdf')
    for p in doc_l:
        p.add_redact_annot(fitz.Rect(70, 9, 550, 46.5), fill=(1, 1, 1))
        p.apply_redactions()
        p.insert_image(fitz.Rect(70.9, 11.2, 104.9, 45.2), filename=logo_img)
        p.insert_image(fitz.Rect(112.0, 22.0, 112.0 + 237.8, 22.0 + 20.3), filename=text_img)

    cover_pages_l = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 39, 45, 49]
    sig_pages_l = [3, 7, 11, 15, 19, 22, 26, 30, 34, 38, 43, 47, 51]

    for i, pno in enumerate(cover_pages_l):
        p = doc_l[pno]
        b_date = [b for b in p.get_text('blocks') if 'កាលបរិ' in b[4]]
        c_path, _ = get_banners_for_index(13 + i)
        y0_d = b_date[0][1] if b_date else 161.81
        p.add_redact_annot(fitz.Rect(130, y0_d - 1, 450, y0_d + 37.0), fill=(1, 1, 1))
        p.apply_redactions()
        p.insert_image(fitz.Rect(130.93, y0_d, 130.93 + 285.0, y0_d + 36.14), filename=c_path)

    for i, pno in enumerate(sig_pages_l):
        p = doc_l[pno]
        blocks = [b for b in p.get_text('blocks') if any(w in b[4] for w in ['រាជធ្នៃី', 'រាជធានី', 'ព.ស.', '្បធាន្កុេ', 'ប្រធានក្រុម', 'នាយករងទទួល', 'ជំនួយការ', 'គណិែ', 'បូណង'])]
        _, s_path = get_banners_for_index(13 + i)
        if blocks:
            min_y = min(b[1] for b in blocks)
            max_y = max(b[3] for b in blocks)
            p.add_redact_annot(fitz.Rect(65, min_y, 565, max_y + 8), fill=(1, 1, 1))
            p.apply_redactions()
            p.draw_line(fitz.Point(71.1, min_y - 0.7), fitz.Point(538.5, min_y - 0.7), color=(0, 0, 0), width=0.6)
            p.insert_image(fitz.Rect(300, min_y + 5, 555, min_y + 5 + 20), filename=s_path)
            p.insert_image(fitz.Rect(65, min_y + 27, 565, min_y + 27 + 110.5), filename=sig_columns_img)

    # Assemble Chapter 2 enforcing ODD PAGE START
    doc_l_out = fitz.open()
    p_w, p_h = doc_l[0].rect.width, doc_l[0].rect.height

    for i in range(len(cover_pages_l)):
        start = cover_pages_l[i]
        end = cover_pages_l[i+1] - 1 if i+1 < len(cover_pages_l) else len(doc_l) - 1
        sig_offset = sig_pages_l[i] - start

        if len(doc_l_out) % 2 == 1:
            doc_l_out.new_page(width=p_w, height=p_h)

        new_cover = len(doc_l_out)
        new_sig = new_cover + sig_offset
        new_indices_map[f"plan_{14 + i}"] = {"cover": new_cover, "sig": new_sig}

        for pno in range(start, end + 1):
            doc_l_out.insert_pdf(doc_l, from_page=pno, to_page=pno)

    doc_l_out.save('ជំពូកទី_2_លីមីត_ព្រះយុគន្ធរ_NGS.pdf')
    doc_l_out.close()
    doc_l.close()
    print(f"✓ Chapter 2 PDF Updated successfully (All {len(cover_pages_l)} plans start on ODD pages).")

    # ==========================
    # CHAPTER 5: VECTORS (11 PLANS)
    # ==========================
    doc_v = fitz.open('ជំពូកទី_5_វ៉ិចទ័រក្នុងលំហ.pdf')
    for p in doc_v:
        p.add_redact_annot(fitz.Rect(70, 20, 550, 62.5), fill=(1, 1, 1))
        p.apply_redactions()
        p.insert_image(fitz.Rect(70.9, 27.35, 104.9, 61.35), filename=logo_img)
        p.insert_image(fitz.Rect(112.0, 36.0, 112.0 + 237.8, 36.0 + 20.3), filename=text_img)

    cover_pages_v = [0, 6, 16, 23, 29, 33, 39, 44, 51, 55, 60]
    sig_pages_v = [4, 14, 22, 27, 31, 37, 42, 49, 53, 58, 63]

    for i, pno in enumerate(cover_pages_v):
        p = doc_v[pno]
        b_date = [b for b in p.get_text('blocks') if 'កាលបរិ' in b[4]]
        c_path, _ = get_banners_for_index(26 + i)
        y0_d = b_date[0][1] if b_date else 161.81
        p.add_redact_annot(fitz.Rect(130, y0_d - 1, 450, y0_d + 37.0), fill=(1, 1, 1))
        p.apply_redactions()
        p.insert_image(fitz.Rect(130.93, y0_d, 130.93 + 285.0, y0_d + 36.14), filename=c_path)

    for i, pno in enumerate(sig_pages_v):
        p = doc_v[pno]
        blocks = [b for b in p.get_text('blocks') if any(w in b[4] for w in ['រាជធ្នៃី', 'រាជធានី', 'ព.ស.', '្បធាន្កុេ', 'ប្រធានក្រុម', 'នាយករងទទួល', 'ជំនួយការ', 'គណិែ', 'បូណង'])]
        _, s_path = get_banners_for_index(26 + i)
        if blocks:
            min_y = min(b[1] for b in blocks)
            max_y = max(b[3] for b in blocks)
            p.add_redact_annot(fitz.Rect(65, min_y, 565, max_y + 8), fill=(1, 1, 1))
            p.apply_redactions()
            p.draw_line(fitz.Point(70.9, min_y - 0.7), fitz.Point(565.4, min_y - 0.7), color=(0, 0, 0), width=0.6)
            p.insert_image(fitz.Rect(300, min_y + 5, 555, min_y + 5 + 20), filename=s_path)
            p.insert_image(fitz.Rect(65, min_y + 27, 565, min_y + 27 + 110.5), filename=sig_columns_img)

    # Assemble Chapter 5 enforcing ODD PAGE START
    doc_v_out = fitz.open()
    p_w, p_h = doc_v[0].rect.width, doc_v[0].rect.height

    for i in range(len(cover_pages_v)):
        start = cover_pages_v[i]
        end = cover_pages_v[i+1] - 1 if i+1 < len(cover_pages_v) else len(doc_v) - 1
        sig_offset = sig_pages_v[i] - start

        if len(doc_v_out) % 2 == 1:
            doc_v_out.new_page(width=p_w, height=p_h)

        new_cover = len(doc_v_out)
        new_sig = new_cover + sig_offset
        new_indices_map[f"plan_{27 + i}"] = {"cover": new_cover, "sig": new_sig}

        for pno in range(start, end + 1):
            doc_v_out.insert_pdf(doc_v, from_page=pno, to_page=pno)

    doc_v_out.save('ជំពូកទី_5_វ៉ិចទ័រក្នុងលំហ_ព្រះយុគន្ធរ_NGS.pdf')
    doc_v_out.close()
    doc_v.close()
    print(f"✓ Chapter 5 PDF Updated successfully (All {len(cover_pages_v)} plans start on ODD pages).")

    # Update js/lesson-plans-data.js with new page indices
    with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
        data_text = f.read()

    match = re.search(r'window\.NGS_LESSON_PLANS_DATA\s*=\s*(\[[\s\S]*\]);?', data_text)
    if match:
        plans_data = json.loads(match.group(1))
        for p in plans_data:
            pid = p.get('id')
            if pid in new_indices_map:
                p['cover_page_index'] = new_indices_map[pid]['cover']
                p['sig_page_index'] = new_indices_map[pid]['sig']
        
        new_js = 'window.NGS_LESSON_PLANS_DATA = ' + json.dumps(plans_data, ensure_ascii=False, indent=2) + ';\n'
        with open('js/lesson-plans-data.js', 'w', encoding='utf-8') as f:
            f.write(new_js)
        print("✓ Synchronized js/lesson-plans-data.js with new cover & signature page indices!")

if __name__ == '__main__':
    update_all_pdfs()
