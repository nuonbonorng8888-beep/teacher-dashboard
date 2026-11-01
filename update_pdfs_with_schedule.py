#!/usr/bin/env python3
"""
NGS Lesson Plans PDF Generator & Synchronizer
Teacher: Nuon Bonorng (នួន បូណង)
School: Preah Yukunthor High School - New Generation School (NGS)
"""

import fitz, os, sys, argparse
from datetime import datetime, timedelta

sys.stdout.reconfigure(encoding='utf-8')

KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
KHMER_MONTHS = [
    'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
    'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
]

def to_khmer_num(num):
    return ''.join(KHMER_DIGITS[int(d)] if d.isdigit() else d for d in str(num))

def format_khmer_date(dt):
    d = to_khmer_num(dt.day)
    m = KHMER_MONTHS[dt.month - 1]
    y = to_khmer_num(dt.year)
    return f"ថ្ងៃទី...{d}.....ខែ ...{m}.....ឆ្នាំ...{y}....."

def format_khmer_sig_date(dt):
    d = to_khmer_num(dt.day)
    m = KHMER_MONTHS[dt.month - 1]
    y = to_khmer_num(dt.year)
    return f"រាជធានីភ្នំពេញ ថ្ងៃទី   {d}   ខែ  {m}  ឆ្នាំ {y}"

def update_all_pdfs(start_date_str='2026-10-19', class_name='១២A', step_days=2):
    cur_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    print(f"=== Synchronizing NGS PDFs with Start Date: {start_date_str}, Class: {class_name} ===")

    logo_img = 'scratch/yukunthor_logo.jpg'
    text_img = 'scratch/yukunthor_header_text.png'
    date_teacher_img = 'scratch/sample_date_teacher_tight.png'
    sig_img = 'scratch/sample_sig_block_tight.png'

    # Chapter 2: Limits
    doc_l = fitz.open('ជំពូកទី 2 លីមីត (2).pdf')
    for p in doc_l:
        p.draw_rect(fitz.Rect(70, 9, 550, 46.5), color=(1, 1, 1), fill=(1, 1, 1))
        p.insert_image(fitz.Rect(70.9, 11.2, 104.9, 45.2), filename=logo_img)
        p.insert_image(fitz.Rect(112.0, 22.0, 112.0 + 237.8, 22.0 + 20.3), filename=text_img)

    cover_pages_l = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 45, 49]
    for pno in cover_pages_l:
        p = doc_l[pno]
        b_date = [b for b in p.get_text('blocks') if 'កាលបរិ' in b[4]]
        b_obj = [b for b in p.get_text('blocks') if '១. វ' in b[4] or '១.' in b[4]]
        if b_date and b_obj:
            y0_d = b_date[0][1]
            y0_o = b_obj[0][1]
            p.draw_rect(fitz.Rect(130, y0_d - 1, 450, y0_o - 1.5), color=(1, 1, 1), fill=(1, 1, 1))
            img_h = (y0_o - 1.5) - y0_d
            img_w = img_h * 8.039
            p.insert_image(fitz.Rect(130.92, y0_d, 130.92 + min(285.0, img_w), y0_d + img_h), filename=date_teacher_img)

    sig_pages_l = [3, 7, 11, 15, 19, 22, 26, 30, 34, 38, 43, 47, 51]
    for pno in sig_pages_l:
        p = doc_l[pno]
        sig_blocks = [b for b in p.get_text('blocks') if any(w in b[4] for w in ['រាជធ្នៃី', 'រាជធានី', 'ព.ស.', '្បធាន្កុេ', 'ប្រធានក្រុម', 'នាយករងទទួល', 'ជំនួយការ'])]
        if sig_blocks:
            min_y = min(b[1] for b in sig_blocks)
            p.draw_rect(fitz.Rect(70, min_y - 2, 550, min_y + 128), color=(1, 1, 1), fill=(1, 1, 1))
            p.insert_image(fitz.Rect(70, min_y, 70 + 495, min_y + 126), filename=sig_img)

    doc_l.save('ជំពូកទី_2_លីមីត_ព្រះយុគន្ធរ_NGS.pdf')
    doc_l.close()
    print("✓ Chapter 2 PDF Updated successfully.")

    # Chapter 5: Vectors
    doc_v = fitz.open('ជំពូកទី_5_វ៉ិចទ័រក្នុងលំហ.pdf')
    for p in doc_v:
        p.draw_rect(fitz.Rect(70, 20, 550, 62.5), color=(1, 1, 1), fill=(1, 1, 1))
        p.insert_image(fitz.Rect(70.9, 27.35, 104.9, 61.35), filename=logo_img)
        p.insert_image(fitz.Rect(112.0, 36.0, 112.0 + 237.8, 36.0 + 20.3), filename=text_img)

    cover_pages_v = [0, 6, 16, 23, 29, 33, 39, 44, 51, 55, 60]
    for pno in cover_pages_v:
        p = doc_v[pno]
        b_date = [b for b in p.get_text('blocks') if 'កាលបរិ' in b[4]]
        b_obj = [b for b in p.get_text('blocks') if '១. វ' in b[4] or '១.' in b[4]]
        if b_date and b_obj:
            y0_d = b_date[0][1]
            y0_o = b_obj[0][1]
            p.draw_rect(fitz.Rect(130, y0_d - 1, 450, y0_o - 1.5), color=(1, 1, 1), fill=(1, 1, 1))
            img_h = (y0_o - 1.5) - y0_d
            img_w = img_h * 8.039
            p.insert_image(fitz.Rect(130.92, y0_d, 130.92 + min(285.0, img_w), y0_d + img_h), filename=date_teacher_img)

    sig_pages_v = [4, 14, 22, 27, 31, 37, 42, 49, 53, 58, 63]
    for pno in sig_pages_v:
        p = doc_v[pno]
        sig_blocks = [b for b in p.get_text('blocks') if any(w in b[4] for w in ['រាជធ្នៃី', 'រាជធានី', 'ព.ស.', '្បធាន្កុេ', 'ប្រធានក្រុម', 'នាយករងទទួល', 'ជំនួយការ'])]
        if sig_blocks:
            min_y = min(b[1] for b in sig_blocks)
            p.draw_rect(fitz.Rect(70, min_y - 2, 550, min_y + 128), color=(1, 1, 1), fill=(1, 1, 1))
            p.insert_image(fitz.Rect(70, min_y, 70 + 495, min_y + 126), filename=sig_img)

    doc_v.save('ជំពូកទី_5_វ៉ិចទ័រក្នុងលំហ_ព្រះយុគន្ធរ_NGS.pdf')
    doc_v.close()
    print("✓ Chapter 5 PDF Updated successfully.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Update NGS PDFs with schedule")
    parser.add_argument('--start-date', default='2026-10-19', help='Start date YYYY-MM-DD')
    parser.add_argument('--class-name', default='១២A', help='Class name e.g. ១២A')
    parser.add_argument('--step-days', type=int, default=2, help='Days between lessons')
    args = parser.parse_args()
    update_all_pdfs(args.start_date, args.class_name, args.step_days)
