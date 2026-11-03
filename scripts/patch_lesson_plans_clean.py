# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    code = f.read()

custom_pdf_start = code.find('    // Dynamic Client-side PDF Generation with custom Date and Class\n    async downloadCustomPdf(planId) {')
if custom_pdf_start == -1:
    print("Could not find downloadCustomPdf start")
    sys.exit(1)

custom_pdf_end = code.find('    render() {', custom_pdf_start)
if custom_pdf_end == -1:
    print("Could not find render() boundary")
    sys.exit(1)

replacement_1 = """    // Unified Dynamic PDF Custom Stamper (Header, Class, Date, Teacher, Signatures)
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
        ctx.fillText(text, 10, 48);
        const pngUrl = canvas.toDataURL('image/png');
        const bytes = await fetch(pngUrl).then(r => r.arrayBuffer());
        return await doc.embedPng(bytes);
      };

      // 1. TOP PART (Cover Page - Header Info)
      const coverPage = pages[plan.cover_page_index || 0];
      if (coverPage) {
        const pageH = coverPage.getHeight();

        // A. Class Name (Line 1: ថ្នាក់ទី : ...)
        if (plan.class_name) {
          const classImg = await makeTextImg(':   ' + plan.class_name, 'bold 34px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 450, 70);
          const class_y_top = plan.class_y0 || (isGrade8 ? 78.1 : 77.9);
          const class_h = 20.0;
          const class_y_bottom = pageH - class_y_top - class_h;
          const class_x = isGrade8 ? 235.0 : 226.0;

          // Whiteout only the value slot after :
          coverPage.drawRectangle({
            x: class_x,
            y: class_y_bottom,
            width: 190.0,
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

        // B. Date (Line 4: កាលបរិច្ឆេទ : ...)
        if (plan.date_khmer) {
          const dateImg = await makeTextImg(':   ' + plan.date_khmer, 'bold 30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 900, 70);
          const date_y_top = plan.box_y0 || (isGrade8 ? 141.1 : 172.0);
          const date_h = 20.0;
          const date_y_bottom = pageH - date_y_top - date_h;
          const date_x = isGrade8 ? 235.0 : 130.92;

          // Whiteout old date dots
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

        // C. Teacher Name (Line 5: បង្រៀនដោយ : ...)
        if (plan.teacher) {
          const teacherImg = await makeTextImg(':   ' + teacherFullName, 'bold 30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 600, 70);
          const teacher_y_top = plan.teacher_y0 || (isGrade8 ? 162.1 : 194.0);
          const teacher_h = 20.0;
          const teacher_y_bottom = pageH - teacher_y_top - teacher_h;
          const teacher_x = isGrade8 ? 235.0 : 130.92;

          // Whiteout old dots
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

      // 2. BOTTOM PART (Signature Page - Signatures and Date)
      const sigPageIdx = (typeof plan.sig_page_index === 'number' && plan.sig_page_index < pages.length)
        ? plan.sig_page_index
        : (pages.length - 1);
      const sigPage = pages[sigPageIdx];

      if (sigPage && plan.sig_y0) {
        const pageH = sigPage.getHeight();

        // A. Signature Date: "រាជធានីភ្នំពេញ, ថ្ងៃទី... ខែ... ឆ្នាំ..."
        const sigDateText = plan.sig_date_khmer
          ? `រាជធានីភ្នំពេញ, ${plan.sig_date_khmer}`
          : (plan.date_khmer ? `រាជធានីភ្នំពេញ, ${plan.date_khmer}` : '');

        if (sigDateText) {
          const sigDateImg = await makeTextImg(sigDateText, '24px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 700, 60);
          const sig_y_top = plan.sig_y0;
          const sig_h = 20.0;
          const sig_y_bottom = pageH - sig_y_top - sig_h;
          const sig_x = 438.0;

          // Whiteout old blank date
          sigPage.drawRectangle({
            x: sig_x,
            y: sig_y_bottom,
            width: 145.0,
            height: sig_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          sigPage.drawImage(sigDateImg, {
            x: sig_x,
            y: sig_y_bottom,
            width: 145.0,
            height: sig_h,
          });
        }

        // B. Teacher signature name under "គ្រូបង្រៀន"
        if (plan.teacher) {
          const sigTeacherImg = await makeTextImg(teacherFullName, 'bold 26px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 500, 60);
          const sig_t_y_top = plan.sig_teacher_y0 || (plan.sig_y0 + 75.0);
          const sig_t_h = 22.0;
          const sig_t_y_bottom = pageH - sig_t_y_top - sig_t_h;
          const sig_t_x = plan.sig_teacher_x0 || 435.0;

          // Whiteout old blank line/dots
          sigPage.drawRectangle({
            x: sig_t_x - 5.0,
            y: sig_t_y_bottom,
            width: 155.0,
            height: sig_t_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          sigPage.drawImage(sigTeacherImg, {
            x: sig_t_x - 5.0,
            y: sig_t_y_bottom,
            width: 145.0,
            height: sig_t_h,
          });
        }
      }
    }

    // Dynamic Client-side PDF Generation with custom Date and Class
    async downloadCustomPdf(planId) {
      const plan = this.plans.find(item => item.id === planId);
      if (!plan) return;

      if (window.showToast) {
        window.showToast(`កំពុងរៀបចំ PDF សម្រាប់ ${plan.lesson_title} ជាមួយកាលបរិច្ឆេទ & ថ្នាក់ថ្មី...`, 'info');
      }

      try {
        if (typeof PDFLib === 'undefined') {
          console.warn('PDFLib not loaded, falling back to direct download');
          window.open(plan.pdf_file, '_blank');
          return;
        }

        const existingPdfBytes = await fetch(plan.pdf_file).then(res => {
          if (!res.ok) throw new Error('Network error loading PDF');
          return res.arrayBuffer();
        });

        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
        
        // Apply unified custom stamps to header (class, date, teacher) and signatures
        await this.applyPdfCustomStamps(pdfDoc, plan);

        const modifiedBytes = await pdfDoc.save();
        const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `កិច្ចតែងការ_${plan.lesson_title}_ថ្នាក់_${plan.class_name}_${plan.date}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (window.showToast) {
          window.showToast(`ទាញយក PDF ជោគជ័យ៖ ថ្នាក់ ${plan.class_name} · ${plan.date_khmer}! 🎉`, 'success');
        }
      } catch (err) {
        console.warn('PDF modification error, opening directly:', err);
        window.open(plan.pdf_file, '_blank');
      }
    }

"""

code = code[:custom_pdf_start] + replacement_1 + code[custom_pdf_end:]

merged_pdf_start = code.find('    async downloadMergedPdf(plans, filename) {')
if merged_pdf_start == -1:
    print("Could not find downloadMergedPdf start")
    sys.exit(1)

merged_pdf_end = code.find('    renderPrintHubModal() {', merged_pdf_start)
if merged_pdf_end == -1:
    print("Could not find renderPrintHubModal boundary")
    sys.exit(1)

replacement_2 = """    async downloadMergedPdf(plans, filename) {
      if (!plans || plans.length === 0) return;
      if (typeof PDFLib === 'undefined') {
        alert('PDFLib មិនទាន់ត្រូវបាន Load រួចរាល់ឡើយ។ សូមប្រើមុខងារ Print / Save as PDF ជំនួសវិញ!');
        this.printPlans(plans, filename);
        return;
      }

      const progressToast = (msg, type = 'info') => {
        if (window.showToast) window.showToast(msg, type);
      };

      progressToast(`កំពុងបញ្ចូលឯកសារ PDF ចំនួន ${toKhmerNum(plans.length)} កិច្ចតែងការ (រៀបចំទំព័រសេសសម្រាប់ Duplex Print)...`);

      try {
        const mergedPdf = await PDFLib.PDFDocument.create();
        let successfulCount = 0;

        for (let i = 0; i < plans.length; i++) {
          const plan = plans[i];
          try {
            const res = await fetch(plan.pdf_file);
            if (!res.ok) {
              console.warn(`Could not load ${plan.pdf_file} (${res.status})`);
              continue;
            }
            const pdfBytes = await res.arrayBuffer();
            const doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });

            // Apply unified custom stamps to header (class, date, teacher) and signatures
            await this.applyPdfCustomStamps(doc, plan);

            // Copy all pages into merged PDF
            const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
            copiedPages.forEach(p => mergedPdf.addPage(p));
            successfulCount++;

            // DUPLEX PRINTING ENFORCEMENT:
            // "មួយទៀតរាល់ចូលចំណុចថ្មីឬមេរៀនថ្មី ឬកិច្ចថ្មី ត្រូវតែទំព័រសេស" (Every new plan/lesson MUST start on an ODD page)
            // If the merged document currently has an ODD number of pages (e.g. 5 pages),
            // we MUST append a blank padding page (Page 6) so the NEXT plan starts on Page 7 (an ODD page)!
            if (i < plans.length - 1) {
              const currentTotalPages = mergedPdf.getPageCount();
              if (currentTotalPages % 2 === 1) {
                const firstPage = copiedPages[0];
                const pWidth = firstPage ? firstPage.getWidth() : 612.0;
                const pHeight = firstPage ? firstPage.getHeight() : 792.0;
                mergedPdf.addPage([pWidth, pHeight]);
              }
            }
          } catch (docErr) {
            console.warn(`Error processing ${plan.pdf_file}:`, docErr);
          }
        }

        if (successfulCount === 0) {
          progressToast('មិនអាចទាញយក PDF ដើមបានទេ។ កំពុងបើកមុខងារ Print / Save as PDF ជំនួសវិញ...', 'warning');
          this.printPlans(plans, filename);
          return;
        }

        const mergedBytes = await mergedPdf.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        progressToast(`ទាញយកបានជោគជ័យចំនួន ${toKhmerNum(successfulCount)} កិច្ចតែងការ (រៀបចំទំព័រសេសរួចរាល់)! 🎉`, 'success');
      } catch (err) {
        console.error('Merged PDF generation error:', err);
        progressToast('មានបញ្ហាក្នុងការ Save PDF បញ្ចូលគ្នា។ កំពុងបើកមុខងារ Print ជំនួសវិញ...', 'warning');
        this.printPlans(plans, filename);
      }
    }

"""

code = code[:merged_pdf_start] + replacement_2 + code[merged_pdf_end:]

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: Patched js/lesson-plans.js cleanly!")

