# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

# 1. Update js/lesson-plans-data.js
with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = '"id": "plan_g8_1",'
idx = content.find(target)
if idx != -1:
    sub = content[idx:idx+1000]
    sub_new = sub.replace('"sig_y0": 32.6,', '"sig_y0": 145.0,', 1)
    if sub != sub_new:
        content = content[:idx] + sub_new + content[idx+1000:]
        with open('js/lesson-plans-data.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated plan_g8_1 sig_y0 to 145.0')
    else:
        print('Target string not found inside block')
else:
    print('plan_g8_1 not found')

# 2. Update js/lesson-plans.js
with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    js_text = f.read()

# Update footer canvas in js/lesson-plans.js
old_footer = """        // --- B. RUNNING FOOTER ---
        // Redact / Whiteout old footer zone at bottom
        p.drawRectangle({
          x: 60.0,
          y: 8.0,
          width: 495.0,
          height: 30.0,
          color: PDFLib.rgb(1, 1, 1),
        });

        // Horizontal Line above Footer
        p.drawLine({
          start: { x: 65.0, y: 34.0 },
          end: { x: 547.0, y: 34.0 },
          thickness: 0.8,
          color: PDFLib.rgb(0, 0, 0),
        });

        // Render page-specific Footer Canvas (Left: Teacher, Center: Page Num, Right: Phone)
        try {
          const fCanvas = document.createElement('canvas');
          fCanvas.width = 1400;
          fCanvas.height = 70;
          const fctx = fCanvas.getContext('2d');
          fctx.fillStyle = '#ffffff';
          fctx.fillRect(0, 0, fCanvas.width, fCanvas.height);
          fctx.fillStyle = '#000000';
          fctx.font = '24px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';

          // Left: Teacher Name
          fctx.textAlign = 'left';
          fctx.fillText(`បង្រៀនដោយ៖ ${teacherFullName}`, 10, 48);

          // Center: Page number
          fctx.textAlign = 'center';
          fctx.fillText(`- ${toKhmerNum(pIdx + 1)} -`, 700, 48);

          // Right: Phone number
          fctx.textAlign = 'right';
          fctx.fillText(`លេខទូរស័ព្ទ៖ ${teacherPhone}`, 1390, 48);

          const footerImg = await doc.embedPng(b64ToUint8(fCanvas.toDataURL('image/png')));

          p.drawImage(footerImg, {
            x: 65.0,
            y: 15.0,
            width: 482.0,
            height: 16.0,
          });
        } catch (fErr) {
          console.warn('Error stamping footer:', fErr);
        }"""

new_footer = """        // --- B. RUNNING FOOTER ---
        // Redact / Whiteout old footer zone at bottom
        p.drawRectangle({
          x: 60.0,
          y: 8.0,
          width: 495.0,
          height: 25.0,
          color: PDFLib.rgb(1, 1, 1),
        });

        // Horizontal Line above Footer
        p.drawLine({
          start: { x: 65.0, y: 34.0 },
          end: { x: 547.0, y: 34.0 },
          thickness: 0.8,
          color: PDFLib.rgb(0, 0, 0),
        });

        // Render page-specific Footer Canvas (Left: Teacher, Center: Page Num, Right: Phone)
        try {
          const fCanvas = document.createElement('canvas');
          fCanvas.width = 1446;
          fCanvas.height = 48;
          const fctx = fCanvas.getContext('2d');
          fctx.fillStyle = '#ffffff';
          fctx.fillRect(0, 0, fCanvas.width, fCanvas.height);
          fctx.fillStyle = '#000000';
          fctx.font = '24px "Khmer OS Siemreap", "Khmer OS", "Noto Sans Khmer", "Kantumruy Pro", sans-serif';
          fctx.textBaseline = 'middle';
          const midY = 24;

          // Left: Teacher Name
          fctx.textAlign = 'left';
          fctx.fillText(`បង្រៀនដោយ៖ ${teacherFullName}`, 15, midY);

          // Center: Page number
          fctx.textAlign = 'center';
          fctx.fillText(`- ${toKhmerNum(pIdx + 1)} -`, 723, midY);

          // Right: Phone number
          fctx.textAlign = 'right';
          fctx.fillText(`លេខទូរស័ព្ទ៖ ${teacherPhone}`, 1431, midY);

          const footerImg = await doc.embedPng(b64ToUint8(fCanvas.toDataURL('image/png')));

          p.drawImage(footerImg, {
            x: 65.0,
            y: 15.0,
            width: 482.0,
            height: 16.0,
          });
        } catch (fErr) {
          console.warn('Error stamping footer:', fErr);
        }"""

# Normalize CRLF in strings before replace
old_footer_norm = old_footer.replace('\r\n', '\n')
new_footer_norm = new_footer.replace('\r\n', '\n')
js_text_norm = js_text.replace('\r\n', '\n')

if old_footer_norm in js_text_norm:
    js_text_norm = js_text_norm.replace(old_footer_norm, new_footer_norm, 1)
    print('Updated running footer in js/lesson-plans.js')
else:
    print('Warning: old_footer not found in js/lesson-plans.js')

# Update Cover Teacher Name to match Cover Date
old_teacher_draw = """        // C. Teacher Name (Line 5: បង្រៀនដោយ : <value>)
        if (plan.teacher) {
          const teacherImg = await makeTextImg(teacherFullName, '30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 600, 70);
          const teacher_y_top = plan.teacher_y0 || (isGrade8 ? 162.1 : 190.5);
          const teacher_h = 20.0;
          const teacher_y_bottom = pageH - teacher_y_top - teacher_h;
          const teacher_x = 238.0;

          // Whiteout old dots after the colon (x >= 238.0)
          coverPage.drawRectangle({
            x: teacher_x,
            y: teacher_y_bottom,
            width: 320.0,
            height: teacher_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          coverPage.drawImage(teacherImg, {
            x: teacher_x,
            y: teacher_y_bottom,
            width: 220.0,
            height: teacher_h,
          });
        }"""

new_teacher_draw = """        // C. Teacher Name (Line 5: បង្រៀនដោយ : <value>)
        if (plan.teacher) {
          const teacherImg = await makeTextImg(teacherFullName, '30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 900, 70);
          const teacher_y_top = plan.teacher_y0 || (isGrade8 ? 162.1 : 190.5);
          const teacher_h = 20.0;
          const teacher_y_bottom = pageH - teacher_y_top - teacher_h;
          const teacher_x = 238.0;

          // Whiteout old dots after the colon (x >= 238.0)
          coverPage.drawRectangle({
            x: teacher_x,
            y: teacher_y_bottom,
            width: 320.0,
            height: teacher_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          coverPage.drawImage(teacherImg, {
            x: teacher_x,
            y: teacher_y_bottom,
            width: 290.0,
            height: teacher_h,
          });
        }"""

old_teacher_norm = old_teacher_draw.replace('\r\n', '\n')
new_teacher_norm = new_teacher_draw.replace('\r\n', '\n')

if old_teacher_norm in js_text_norm:
    js_text_norm = js_text_norm.replace(old_teacher_norm, new_teacher_norm, 1)
    print('Updated cover teacher stamping to match date scale in js/lesson-plans.js')
else:
    print('Warning: old_teacher_draw not found in js/lesson-plans.js')

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(js_text_norm)
print('Successfully saved js/lesson-plans.js')

