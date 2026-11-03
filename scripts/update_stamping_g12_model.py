# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    code = f.read()

start_idx = code.find('    // Unified Dynamic PDF Custom Stamper (Header, Class, Date, Teacher, Signatures)\n    async applyPdfCustomStamps(doc, plan) {')
if start_idx == -1:
    print("Could not find applyPdfCustomStamps start")
    sys.exit(1)

end_idx = code.find('    // Dynamic Client-side PDF Generation with custom Date and Class\n    async downloadCustomPdf(planId) {', start_idx)
if end_idx == -1:
    print("Could not find downloadCustomPdf start")
    sys.exit(1)

new_method = """    // Unified Dynamic PDF Custom Stamper (Header, Class, Date, Teacher, Signatures)
    async applyPdfCustomStamps(doc, plan) {
      const pages = doc.getPages();
      if (!pages || pages.length === 0) return;

      const isGrade8 = (plan.grade === 'ថ្នាក់ទី ៨' || plan.grade === 'ថ្នាក់ទី 8');
      const teacherTitle = (plan.teacher && plan.teacher.includes('សុភារី')) ? 'អ្នកគ្រូ' : 'លោកគ្រូ';
      const teacherFullName = `${teacherTitle} ${plan.teacher}`;

      // Helper to generate crisp Khmer text via Canvas
      const makeTextImg = async (text, fontStyle = 'bold 30px "Khmer OS Siemreap", "Noto Sans Khmer", "Khmer OS", sans-serif', width = 600, height = 70, color = '#000000') => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = color;
        ctx.font = fontStyle;
        ctx.fillText(text, 5, 48);
        const pngUrl = canvas.toDataURL('image/png');
        const bytes = await fetch(pngUrl).then(r => r.arrayBuffer());
        return await doc.embedPng(bytes);
      };

      // 1. TOP PART (Cover Page - Header Info)
      // Matching Grade 12 model: colon ':' is at x=226.8pt in PDF. Value starts at x=238pt.
      const coverPage = pages[plan.cover_page_index || 0];
      if (coverPage) {
        const pageH = coverPage.getHeight();

        // A. Class Name (Line 1: ថ្នាក់ទី : <value>)
        if (plan.class_name) {
          const classImg = await makeTextImg(plan.class_name, 'bold 32px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 400, 70);
          const class_y_top = plan.class_y0 || (isGrade8 ? 78.1 : 99.2);
          const class_h = 20.0;
          const class_y_bottom = pageH - class_y_top - class_h;
          const class_x = 238.0;

          // Whiteout only the value slot after the colon (x >= 238.0)
          coverPage.drawRectangle({
            x: class_x,
            y: class_y_bottom,
            width: 200.0,
            height: class_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          coverPage.drawImage(classImg, {
            x: class_x,
            y: class_y_bottom,
            width: 140.0,
            height: class_h,
          });
        }

        // B. Date (Line 4: កាលបរិច្ឆេទ : <value>)
        if (plan.date_khmer) {
          const dateImg = await makeTextImg(plan.date_khmer, '30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 900, 70);
          const date_y_top = plan.box_y0 || (isGrade8 ? 141.1 : 172.0);
          const date_h = 20.0;
          const date_y_bottom = pageH - date_y_top - date_h;
          const date_x = 238.0;

          // Whiteout old date dots after the colon (x >= 238.0)
          coverPage.drawRectangle({
            x: date_x,
            y: date_y_bottom,
            width: 320.0,
            height: date_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          coverPage.drawImage(dateImg, {
            x: date_x,
            y: date_y_bottom,
            width: 290.0,
            height: date_h,
          });
        }

        // C. Teacher Name (Line 5: បង្រៀនដោយ : <value>)
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
        }
      }

      // 2. BOTTOM PART (Signature Page - Clean 3-Column Authentic Signature Block)
      // Matching Grade 12 model: Full whiteout of signature area, followed by clean 3-column table
      const sigPageIdx = (typeof plan.sig_page_index === 'number' && plan.sig_page_index < pages.length)
        ? plan.sig_page_index
        : (pages.length - 1);
      const sigPage = pages[sigPageIdx];

      if (sigPage && typeof plan.sig_y0 === 'number') {
        const pageH = sigPage.getHeight();
        const min_y = plan.sig_y0;
        const sig_w = 500.0;
        const sig_h = 145.0;
        const sig_y_bottom = pageH - min_y - sig_h;
        const sig_x = 65.0;

        // 1. Redact / Whiteout the ENTIRE old signature region cleanly
        sigPage.drawRectangle({
          x: sig_x,
          y: sig_y_bottom,
          width: sig_w,
          height: sig_h,
          color: PDFLib.rgb(1, 1, 1),
        });

        // 2. Render dynamic high-res 3-column signature block via Canvas
        const sigCanvas = document.createElement('canvas');
        sigCanvas.width = 1200;
        sigCanvas.height = 360;
        const sctx = sigCanvas.getContext('2d');
        sctx.fillStyle = '#ffffff';
        sctx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);

        // Date text
        const cleanSigDate = plan.sig_date_khmer
          ? plan.sig_date_khmer.replace(/^(រាជធានីភ្នំពេញ[\s,]*)?/, '')
          : (plan.date_khmer ? plan.date_khmer : '');
        const sigDateText = cleanSigDate.startsWith('ថ្ងៃទី')
          ? `រាជធានីភ្នំពេញ ${cleanSigDate}`
          : `រាជធានីភ្នំពេញ ថ្ងៃទី ${cleanSigDate}`;

        const colLeft = 200;
        const colMid = 600;
        const colRight = 980;

        // A. Date above teacher signature (Right column)
        sctx.fillStyle = '#000000';
        sctx.textAlign = 'center';
        sctx.font = '24px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
        sctx.fillText(sigDateText, colRight, 38);

        // B. Column Titles (Khmer OS Muol Light)
        sctx.font = 'bold 26px "Khmer OS Muol Light", "Khmer OS Muol", "Khmer OS Siemreap", sans-serif';
        sctx.fillText('បានឃើញ និងឯកភាព', colLeft, 80);
        sctx.fillText('បានឃើញ និងពិនិត្យ', colMid, 80);
        sctx.fillText(isGrade8 ? 'គ្រូបង្រៀន' : 'គ្រូបង្រៀនគណិតវិទ្យា', colRight, 80);

        // C. Roles & Subtitles
        sctx.font = '22px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
        sctx.fillText(isGrade8 ? 'ជ.គណៈគ្រប់គ្រងសាលារៀនជំនាន់ថ្មី' : 'នាយករងទទួលបន្ទុកសាលារៀនជំនាន់ថ្មី', colLeft, 118);
        sctx.fillText('ប្រធានក្រុមបច្ចេកទេស', colMid, 118);

        // D. Teacher Name (Under signature space)
        if (plan.teacher) {
          sctx.font = 'bold 26px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
          sctx.fillText(teacherFullName, colRight, 310);
        }

        const sigPngUrl = sigCanvas.toDataURL('image/png');
        const sigPngBytes = await fetch(sigPngUrl).then(r => r.arrayBuffer());
        const sigBlockImg = await doc.embedPng(sigPngBytes);

        // Stamp clean authentic signature block onto the page
        sigPage.drawImage(sigBlockImg, {
          x: sig_x,
          y: sig_y_bottom,
          width: sig_w,
          height: sig_h,
        });
      }
    }

"""

code = code[:start_idx] + new_method + code[end_idx:]

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: Updated applyPdfCustomStamps in js/lesson-plans.js!")

