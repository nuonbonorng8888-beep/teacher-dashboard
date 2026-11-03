# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Helper methods to add to NGSLessonPlansManager
# Find start of class NGSLessonPlansManager
class_start = code.find('class NGSLessonPlansManager {')
if class_start == -1:
    print("Could not find class NGSLessonPlansManager")
    sys.exit(1)

# Let's inspect where applyPdfCustomStamps starts and ends
stamp_start = code.find('    // Unified Dynamic PDF Custom Stamper (Header, Class, Date, Teacher, Signatures)\n    async applyPdfCustomStamps(doc, plan) {')
if stamp_start == -1:
    print("Could not find applyPdfCustomStamps")
    sys.exit(1)

stamp_end = code.find('    // Dynamic Client-side PDF Generation with custom Date and Class\n    async downloadCustomPdf(planId) {', stamp_start)
if stamp_end == -1:
    print("Could not find downloadCustomPdf")
    sys.exit(1)

new_stamping_code = """    // Helper: Get Teacher Phone number
    getTeacherPhone(teacherName) {
      const t = teacherName || this.savedTeacher || 'នួន បូណង';
      if (t.includes('សុភារី')) return '096 75 74 005';
      return '070 794 729';
    }

    // Helper: Get Teacher Full Title
    getTeacherFullTitle(teacherName) {
      const t = teacherName || this.savedTeacher || 'នួន បូណង';
      if (t.includes('សុភារី')) return 'អ្នកគ្រូ ថោង សុភារី';
      return 'លោកគ្រូ នួន បូណង';
    }

    // Unified Dynamic PDF Custom Stamper (Running Header & Footer, Cover Header, Signatures)
    async applyPdfCustomStamps(doc, plan) {
      const pages = doc.getPages();
      if (!pages || pages.length === 0) return;

      const isGrade8 = (plan.grade === 'ថ្នាក់ទី ៨' || plan.grade === 'ថ្នាក់ទី 8');
      const teacherFullName = this.getTeacherFullTitle(plan.teacher);
      const teacherPhone = this.getTeacherPhone(plan.teacher);

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

      // Load Yukunthor round Logo for Running Header
      let logoImg = null;
      try {
        const logoRes = await fetch('images/yukunthor-logo.jpg');
        if (logoRes.ok) {
          const logoBytes = await logoRes.arrayBuffer();
          logoImg = await doc.embedJpg(logoBytes);
        }
      } catch (e) {
        console.warn('Could not load yukunthor-logo.jpg:', e);
      }

      // Pre-render Running Header Text (Khmer OS Muol Light)
      let headerTextImg = null;
      try {
        const hCanvas = document.createElement('canvas');
        hCanvas.width = 1200;
        hCanvas.height = 90;
        const hctx = hCanvas.getContext('2d');
        hctx.fillStyle = '#ffffff';
        hctx.fillRect(0, 0, hCanvas.width, hCanvas.height);
        hctx.fillStyle = '#000000';
        hctx.font = 'bold 34px "Khmer OS Muol Light", "Khmer OS Muol", "Khmer OS Siemreap", sans-serif';
        hctx.fillText('វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)', 5, 60);
        const hPngUrl = hCanvas.toDataURL('image/png');
        const hBytes = await fetch(hPngUrl).then(r => r.arrayBuffer());
        headerTextImg = await doc.embedPng(hBytes);
      } catch (e) {}

      // ========================================================
      // 1. RUNNING HEADER & RUNNING FOOTER ON EVERY PAGE
      // ========================================================
      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const p = pages[pIdx];
        const pageH = p.getHeight();
        const pageW = p.getWidth();

        // --- A. RUNNING HEADER ---
        // Redact / Whiteout old header zone at top
        p.drawRectangle({
          x: 60.0,
          y: pageH - 49.0,
          width: 495.0,
          height: 44.0,
          color: PDFLib.rgb(1, 1, 1),
        });

        // Yukunthor Logo
        if (logoImg) {
          p.drawImage(logoImg, {
            x: 65.0,
            y: pageH - 43.0,
            width: 27.0,
            height: 27.0,
          });
        }

        // Yukunthor School Title
        if (headerTextImg) {
          p.drawImage(headerTextImg, {
            x: logoImg ? 98.0 : 65.0,
            y: pageH - 40.0,
            width: 250.0,
            height: 20.0,
          });
        }

        // Horizontal Line below Header
        p.drawLine({
          start: { x: 65.0, y: pageH - 47.0 },
          end: { x: 547.0, y: pageH - 47.0 },
          thickness: 0.8,
          color: PDFLib.rgb(0, 0, 0),
        });

        // --- B. RUNNING FOOTER ---
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

          const fPngUrl = fCanvas.toDataURL('image/png');
          const fBytes = await fetch(fPngUrl).then(r => r.arrayBuffer());
          const footerImg = await doc.embedPng(fBytes);

          p.drawImage(footerImg, {
            x: 65.0,
            y: 15.0,
            width: 482.0,
            height: 16.0,
          });
        } catch (fErr) {
          console.warn('Error stamping footer:', fErr);
        }
      }

      // ========================================================
      // 2. COVER PAGE (Page 0 Header Info Stamping)
      // ========================================================
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

      // ========================================================
      // 3. SIGNATURE PAGE (Authentic 3-Column Signature Block)
      // ========================================================
      const sigPageIdx = (typeof plan.sig_page_index === 'number' && plan.sig_page_index < pages.length)
        ? plan.sig_page_index
        : (pages.length - 1);
      const sigPage = pages[sigPageIdx];

      if (sigPage && typeof plan.sig_y0 === 'number') {
        const pageH = sigPage.getHeight();
        const min_y = Math.max(plan.sig_y0, 52.0);
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
          ? plan.sig_date_khmer.replace(/^(\u179a\u17b6\u1787\u1792\u17b6\u1793\u17b8\u1797\u17d2\u1793\u17c6\u1796\u17c1\u1789[\s,]*)?/, '')
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

code = code[:stamp_start] + new_stamping_code + code[stamp_end:]

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: Patched running header & footer into applyPdfCustomStamps!")

