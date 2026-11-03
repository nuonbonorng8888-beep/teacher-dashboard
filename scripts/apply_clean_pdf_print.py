# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update downloadCustomPdf signature & body
idx1 = content.find('    async downloadCustomPdf(planId) {')
idx2 = content.find('    render() {', idx1)

new_dl_custom = """    async downloadCustomPdf(planId, openInNewTab = false) {
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

        let res = null;
        try {
          res = await fetch(encodeURI(plan.pdf_file));
        } catch (e1) {
          try { res = await fetch(plan.pdf_file); } catch (e2) {}
        }
        if (!res || !res.ok) {
          try { res = await fetch(plan.pdf_file); } catch (e3) {}
        }
        if (!res || !res.ok) throw new Error('Network error loading PDF: ' + plan.pdf_file);
        const existingPdfBytes = await res.arrayBuffer();

        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
        
        // Apply unified custom stamps to header (class, date, teacher) and signatures
        await this.applyPdfCustomStamps(pdfDoc, plan);

        const modifiedBytes = await pdfDoc.save();
        const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const filename = `កិច្ចតែងការ_${plan.lesson_title}_ថ្នាក់_${plan.class_name}_${plan.date}.pdf`;

        if (openInNewTab) {
          const win = window.open(blobUrl, '_blank');
          if (!win) {
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          if (window.showToast) {
            window.showToast(`បានបើក PDF ថ្នាក់ ${plan.class_name} · ${plan.date_khmer} រួចរាល់សម្រាប់បោះពុម្ព! 🖨️`, 'success');
          }
        } else {
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          if (window.showToast) {
            window.showToast(`ទាញយក PDF ជោគជ័យ៖ ថ្នាក់ ${plan.class_name} · ${plan.date_khmer}! 🎉`, 'success');
          }
        }
      } catch (err) {
        console.warn('PDF modification error, opening directly:', err);
        window.open(plan.pdf_file, '_blank');
      }
    }

"""

content = content[:idx1] + new_dl_custom + content[idx2:]

# 2. Update printCurrentPlan
old_print_current = """    printCurrentPlan() {
      const p = this.currentModalPlan;
      if (!p) return;
      this.printPlans([p], p.lesson_title);
    }"""

new_print_current = """    printCurrentPlan() {
      const p = this.currentModalPlan;
      if (!p) return;
      this.downloadCustomPdf(p.id, true);
    }"""

assert old_print_current in content, "old_print_current not matched"
content = content.replace(old_print_current, new_print_current)

# 3. Update executePrint
old_exec_print = """    executePrint(scope, targetCode = null) {
      const plans = this.getPlansForScope(scope, targetCode);
      if (!plans || plans.length === 0) {
        alert('សូមជ្រើសរើសមេរៀនយ៉ាងហោចណាស់ ១!');
        return;
      }
      let title = `កិច្ចតែងការ_${this.selectedGrade}`;
      if (scope === 'single') {
        title += `_${plans[0].chapter}`;
      } else if (scope === 'multiple') {
        title += `_ជ្រើសរើស_${toKhmerNum(plans.length)}ម៉ោង`;
      } else if (scope === 'grade') {
        title += `_ពេញលេញ_${toKhmerNum(plans.length)}ម៉ោង`;
      }
      this.printPlans(plans, title);
    }"""

new_exec_print = """    executePrint(scope, targetCode = null) {
      const plans = this.getPlansForScope(scope, targetCode);
      if (!plans || plans.length === 0) {
        alert('សូមជ្រើសរើសមេរៀនយ៉ាងហោចណាស់ ១!');
        return;
      }
      let filename = `កិច្ចតែងការ_${this.selectedGrade.replace(/\\s+/g, '')}`;
      if (scope === 'single') {
        const chClean = plans[0].chapter.replace(/[^a-zA-Z0-9\\u1780-\\u17D2]/g, '_').replace(/_+/g, '_').substring(0, 45);
        filename += `_${chClean}_(${toKhmerNum(plans.length)}ម៉ោង)`;
      } else if (scope === 'multiple') {
        filename += `_មេរៀនជ្រើសរើស_${toKhmerNum(plans.length)}ម៉ោង`;
      } else {
        filename += `_ពេញលេញ_${toKhmerNum(plans.length)}ម៉ោង`;
      }
      if (this.savedClass) {
        const classClean = this.savedClass.replace(/[^a-zA-Z0-9\\u1780-\\u17D2]/g, '_');
        filename += `_${classClean}`;
      }
      filename += '.pdf';
      this.downloadMergedPdf(plans, filename, true);
    }"""

assert old_exec_print in content, "old_exec_print not matched"
content = content.replace(old_exec_print, new_exec_print)

# 4. Update printPlans
old_print_plans = """    printPlans(plans, title) {
      if (!plans || plans.length === 0) return;
      const printArea = document.getElementById('printableLessonPlansArea');
      if (!printArea) {
        console.error('Printable area element #printableLessonPlansArea not found!');
        return;
      }

      printArea.innerHTML = this.generatePrintableHtml(plans);
      document.body.classList.add('printing-lesson-plans');

      const cleanup = () => {
        document.body.classList.remove('printing-lesson-plans');
        printArea.innerHTML = '';
        window.removeEventListener('afterprint', cleanup);
      };

      window.addEventListener('afterprint', cleanup);
      setTimeout(() => {
        window.print();
        setTimeout(cleanup, 2500);
      }, 100);
    }"""

new_print_plans = """    async printPlans(plans, title) {
      if (!plans || plans.length === 0) return;
      const filename = (title.endsWith('.pdf') ? title : `${title}.pdf`).replace(/\\s+/g, '_');
      await this.downloadMergedPdf(plans, filename, true);
    }"""

assert old_print_plans in content, "old_print_plans not matched"
content = content.replace(old_print_plans, new_print_plans)

# 5. Update downloadMergedPdf signature & body
old_dl_merged_start = "    async downloadMergedPdf(plans, filename) {"
new_dl_merged_start = "    async downloadMergedPdf(plans, filename, openInNewTab = false) {"
assert old_dl_merged_start in content, "old_dl_merged_start not matched"
content = content.replace(old_dl_merged_start, new_dl_merged_start, 1)

old_dl_fallback = """        if (successfulCount === 0) {
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
      }"""

new_dl_fallback = """        if (successfulCount === 0) {
          progressToast('មិនអាចទាញយក PDF ដើមបានឡើយ។ សូមពិនិត្យមើលការតភ្ជាប់អ៊ីនធឺណិត!', 'error');
          return;
        }

        const mergedBytes = await mergedPdf.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        if (openInNewTab) {
          const win = window.open(blobUrl, '_blank');
          if (!win) {
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          progressToast(`បានបើកឯកសារ PDF រួមចំនួន ${toKhmerNum(successfulCount)} កិច្ចតែងការ រួចរាល់សម្រាប់បោះពុម្ព (Print) និងរក្សាទុក! 🖨️`, 'success');
        } else {
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          progressToast(`ទាញយកបានជោគជ័យចំនួន ${toKhmerNum(successfulCount)} កិច្ចតែងការ (រៀបចំទំព័រសេសរួចរាល់)! 🎉`, 'success');
        }
      } catch (err) {
        console.error('Merged PDF generation error:', err);
        progressToast('មានបញ្ហាក្នុងការបង្កើត PDF រួមបញ្ចូលគ្នា។ សូមសាកល្បងម្តងទៀត!', 'error');
      }"""

assert old_dl_fallback in content, "old_dl_fallback not matched"
content = content.replace(old_dl_fallback, new_dl_fallback)

# Also ensure in downloadMergedPdf that fetch uses encodeURI
old_fetch_block = """            let res = null;
            try {
              res = await fetch(plan.pdf_file);
            } catch (e1) {
              try { res = await fetch(encodeURI(plan.pdf_file)); } catch (e2) {}
            }
            if (!res || !res.ok) {
              try { res = await fetch(encodeURI(plan.pdf_file)); } catch (e3) {}
            }"""

new_fetch_block = """            let res = null;
            try {
              res = await fetch(encodeURI(plan.pdf_file));
            } catch (e1) {
              try { res = await fetch(plan.pdf_file); } catch (e2) {}
            }
            if (!res || !res.ok) {
              try { res = await fetch(plan.pdf_file); } catch (e3) {}
            }"""

if old_fetch_block in content:
    content = content.replace(old_fetch_block, new_fetch_block)

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated js/lesson-plans.js!")
