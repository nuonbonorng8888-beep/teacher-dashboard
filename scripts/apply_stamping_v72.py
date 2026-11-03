# -*- coding: utf-8 -*-
"""
Update js/lesson-plans.js to fix top and bottom stamping coordinates,
and enforce that every new lesson/plan/section starts on an ODD page (ទំព័រសេស).
"""
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Replace downloadCustomPdf with cleaner method calling applyPdfCustomStamps
target_download_custom = """    // Dynamic Client-side PDF Generation with custom Date and Class
    async downloadCustomPdf(planId) {"""

# Let's inspect from downloadCustomPdf to render()
end_idx = code.find("    render() {", code.find("async downloadCustomPdf(planId)"))
if end_idx == -1:
    print("Could not find render() boundary!")
    sys.exit(1)

start_idx = code.find("    // Dynamic Client-side PDF Generation with custom Date and Class\n    async downloadCustomPdf(planId) {")
if start_idx == -1:
    start_idx = code.find("    async downloadCustomPdf(planId) {")

print(f"Found downloadCustomPdf from {start_idx} to {end_idx}")

new_stamping_methods = """    // Unified Dynamic PDF Custom Stamper (Header, Class, Date, Teacher, Signatures)
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
          const class_y0 = isGrade8 ? (plan.class_y0 || 78.1) : (plan.class_y0 || 99.2);
          const class_y_bottom = pageH - class_y0 - 18.0;

          const classImg = await makeTextImg(':   ' + plan.class_name, 'bold 32px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 450, 70);

          // Whiteout only value after ":", leaving "ថ្នាក់ទី" untouched
          coverPage.drawRectangle({
            x: 235,
            y: class_y_bottom - 2,
            width: 190,
            height: 20.0,
            color: PDFLib.rgb(1, 1, 1),
          });

          // Draw customized class
          coverPage.drawImage(classImg, {
            x: 226,
            y: class_y_bottom - 2,
            width: 140.0,
            height: 19.0,
          });
        }

        // B. Lesson Date (Line 4 in Grade 8: កាលបរិច្ឆេទ : ...)
        if (plan.date_khmer) {
          const date_y0 = isGrade8 ? (plan.box_y0 || 141.1) : (plan.box_y0 || 172.2);
          const date_y_bottom = pageH - date_y0 - 18.0;

          const dateImg = await makeTextImg(':   ' + plan.date_khmer, 'bold 30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 900, 70);

          // Whiteout value after ":", leaving "កាលបរិច្ឆេទ" untouched
          coverPage.drawRectangle({
            x: 235,
            y: date_y_bottom - 2,
            width: 320,
            height: 20.0,
            color: PDFLib.rgb(1, 1, 1),
          });

          coverPage.drawImage(dateImg, {
            x: 226,
            y: date_y_bottom - 2,
            width: 286.0,
            height: 19.0,
          });
        }

        // C. Teacher Name (Line 5 in Grade 8: បង្រៀនដោយ : ...)
        if (plan.teacher) {
          const teach_y0 = isGrade8 ? (plan.teacher_y0 || 162.1) : (plan.teacher_y0 || 190.5);
          const teach_y_bottom = pageH - teach_y0 - 18.0;

          const teachImg = await makeTextImg(':   ' + teacherFullName, 'bold 30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 600, 70);

          coverPage.drawRectangle({
            x: 235,
            y: teach_y_bottom - 2,
            width: 320,
            height: 20.0,
            color: PDFLib.rgb(1, 1, 1),
          });

          coverPage.drawImage(teachImg, {
            x: 226,
            y: teach_y_bottom - 2,
            width: 210.0,
            height: 19.0,
          });
        }
      }

      // 2. BOTTOM PART (Signature Page)
      let sigPageIdx = (typeof plan.sig_page_index === 'number') ? plan.sig_page_index : null;
      if (sigPageIdx === null || sigPageIdx >= pages.length) {
        sigPageIdx = isGrade8 ? (pages.length > 2 ? pages.length - 2 : pages.length - 1) : 2;
      }

      if (sigPageIdx < pages.length) {
        const sigPage = pages[sigPageIdx];
        const sigPageH = sigPage.getHeight();

        // A. Signature Date (រាជធានីភ្នំពេញ, ថ្ងៃទី... ខែ... ឆ្នាំ...)
        const sig_y0 = isGrade8 ? (plan.sig_y0 || 32.6) : (plan.sig_y0 || 583.9);
        const sig_date_bottom = sigPageH - sig_y0 - 18.0;
        const sigDateText = plan.sig_date_khmer || 'ថ្ងៃទី ២៩ ខែ តុលា ឆ្នាំ ២០២៦';

        const sigDateImg = await makeTextImg(sigDateText, 'bold 28px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 500, 70);

        const sigDateX = isGrade8 ? 440 : 445;
        sigPage.drawRectangle({
          x: sigDateX - 2,
          y: sig_date_bottom - 2,
          width: 145,
          height: 20.0,
          color: PDFLib.rgb(1, 1, 1),
        });
        sigPage.drawImage(sigDateImg, {
          x: sigDateX - 2,
          y: sig_date_bottom - 2,
          width: 135.0,
          height: 19.0,
        });

        // B. Teacher Name under 'គ្រូបង្រៀន'
        if (plan.teacher) {
          const sig_teacher_y0 = isGrade8 ? (plan.sig_teacher_y0 || (sig_y0 + 75.0)) : (sig_y0 + 75.0);
          const sig_teacher_bottom = sigPageH - sig_teacher_y0 - 20.0;
          const sig_teacher_x0 = isGrade8 ? (plan.sig_teacher_x0 || 430.0) : 410.0;

          const tNameImg = await makeTextImg(teacherFullName, 'bold 30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 500, 70);

          sigPage.drawRectangle({
            x: sig_teacher_x0 - 5,
            y: sig_teacher_bottom - 2,
            width: 155,
            height: 22.0,
            color: PDFLib.rgb(1, 1, 1),
          });
          sigPage.drawImage(tNameImg, {
            x: sig_teacher_x0 - 5,
            y: sig_teacher_bottom - 2,
            width: 140.0,
            height: 20.0,
          });
        }
      }
    }

    // Dynamic Client-side PDF Generation with custom Date and Class
    async downloadCustomPdf(planId) {
      const plan = this.plans.find(item => item.id === planId);
      if (!plan) return;

      if (window.showToast) {
        window.showToast(`កំពុងរៀបចំ PDF កិច្ចតែងការ ${plan.lesson_title} ជាមួយកាលបរិច្ឆេទ & ថ្នាក់បង្រៀន...`, 'info');
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

        // Apply clean header and signature stamps
        await this.applyPdfCustomStamps(pdfDoc, plan);

        const modifiedBytes = await pdfDoc.save();
        const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const cleanTitle = (plan.lesson_title || 'មេរៀន').replace(/[^a-zA-Z0-9\\u1780-\\u17D2]/g, '_');
        const cleanClass = (plan.class_name || 'ថ្នាក់').replace(/[^a-zA-Z0-9\\u1780-\\u17D2]/g, '_');
        link.download = `កិច្ចតែងការ_${cleanTitle}_ថ្នាក់_${cleanClass}_${plan.date}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (window.showToast) {
          window.showToast(`ទាញយក PDF កិច្ចតែងការ ថ្នាក់ ${plan.class_name} ៖ ${plan.date_khmer} បានជោគជ័យ! 🎉`, 'success');
        }
      } catch (err) {
        console.warn('PDF modification error, opening directly:', err);
        window.open(plan.pdf_file, '_blank');
      }
    }

"""

code = code[:start_idx] + new_stamping_methods + code[end_idx:]
print("Updated downloadCustomPdf and added applyPdfCustomStamps.")

# 2. Update downloadMergedPdf to use applyPdfCustomStamps and enforce odd page start
old_merged_start = code.find("    async downloadMergedPdf(plans, filename) {")
old_merged_end = code.find("    renderPrintHubModal() {", old_merged_start)

if old_merged_start != -1 and old_merged_end != -1:
    new_download_merged = """    async downloadMergedPdf(plans, filename) {
      if (!plans || plans.length === 0) return;
      if (typeof PDFLib === 'undefined') {
        alert('PDFLib មិនទាន់ត្រូវបាន Load រួចរាល់ឡើយ។ សូមប្រើមុខងារ Print / Save as PDF ជំនួសវិញ!');
        this.printPlans(plans, filename);
        return;
      }

      const progressToast = (msg, type = 'info') => {
        if (window.showToast) window.showToast(msg, type);
      };

      progressToast(`កំពុងបញ្ចូលឯកសារ PDF ចំនួន ${toKhmerNum(plans.length)} កិច្ចតែងការ (ធានារាល់កិច្ចថ្មី/មេរៀនថ្មី នៅទំព័រសេស)...`);

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
    code = code[:old_merged_start] + new_download_merged + code[old_merged_end:]
    print("Updated downloadMergedPdf with duplex odd-page enforcement.")
else:
    print("WARNING: Could not find downloadMergedPdf boundaries!")

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved js/lesson-plans.js successfully!")
