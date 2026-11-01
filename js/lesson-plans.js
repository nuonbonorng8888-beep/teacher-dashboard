/**
 * NGS Lesson Plans Management Hub
 * Teacher: Nuon Bonorng (នួន បូណង)
 * School: Preah Yukunthor High School - New Generation School (NGS)
 */

(function () {
  'use strict';

  // Khmer numbers and months mapping
  const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  const KHMER_MONTHS = [
    'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
    'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
  ];
  const KHMER_DAYS = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];

  function toKhmerNum(num) {
    if (num === null || num === undefined) return '';
    return String(num).replace(/[0-9]/g, d => KHMER_DIGITS[parseInt(d, 10)]);
  }

  function formatKhmerDate(isoDateStr, includeDayName = true) {
    if (!isoDateStr) return '';
    const parts = isoDateStr.split('-');
    if (parts.length !== 3) return isoDateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const dObj = new Date(year, month - 1, day);
    const dayName = KHMER_DAYS[dObj.getDay()];
    const khDay = toKhmerNum(day);
    const khMonth = KHMER_MONTHS[month - 1] || '';
    const khYear = toKhmerNum(year);

    if (includeDayName) {
      return `ថ្ងៃ${dayName} ទី${khDay} ខែ${khMonth} ឆ្នាំ${khYear}`;
    }
    return `ថ្ងៃទី ${khDay} ខែ ${khMonth} ឆ្នាំ ${khYear}`;
  }

  class LessonPlansManager {
    constructor() {
      this.activeChapter = 'all';
      this.searchQuery = '';
      this.plans = [];
      this.storageKey = 'ngs_custom_lesson_plans_v3';
      this.savedStartDate = '2026-11-05';
      this.savedClass = '១២A';
      this.savedCadence = '2';
    }

    init() {
      const defaultData = window.NGS_LESSON_PLANS_DATA || [];
      // Deep clone default data
      this.plans = JSON.parse(JSON.stringify(defaultData));

      // Load saved settings & customizations from localStorage
      try {
        this.savedStartDate = localStorage.getItem('ngs_custom_start_date') || '2026-11-05';
        this.savedClass = localStorage.getItem('ngs_custom_class') || '១២A';
        this.savedCadence = localStorage.getItem('ngs_custom_cadence') || '2';

        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          const customMap = JSON.parse(saved);
          this.plans.forEach(p => {
            if (customMap[p.id]) {
              if (customMap[p.id].date) {
                p.date = customMap[p.id].date;
                p.date_khmer = formatKhmerDate(p.date, true);
              }
              if (customMap[p.id].class_name) {
                p.class_name = customMap[p.id].class_name;
              }
              if (customMap[p.id].teacher) {
                p.teacher = customMap[p.id].teacher;
              }
            }
          });
        }
      } catch (err) {
        console.warn('Failed to load saved lesson plan customizations:', err);
      }

      this.render();
      this.bindEvents();
    }

    bindEvents() {
      document.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('[data-tab="lessonplans"]');
        if (tabBtn) {
          setTimeout(() => this.render(), 50);
        }
      });
    }

    saveCustomizations() {
      const customMap = {};
      this.plans.forEach(p => {
        customMap[p.id] = {
          date: p.date,
          class_name: p.class_name,
          teacher: p.teacher
        };
      });
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(customMap));
        if (this.savedStartDate) {
          localStorage.setItem('ngs_custom_start_date', this.savedStartDate);
        }
        if (this.savedClass) {
          localStorage.setItem('ngs_custom_class', this.savedClass);
        }
        if (this.savedCadence) {
          localStorage.setItem('ngs_custom_cadence', this.savedCadence);
        }
        if (window.showToast) {
          window.showToast('បានរក្សាទុកកាលបរិច្ឆេទ និងថ្នាក់ដោយជោគជ័យ! 🎉', 'success');
        } else {
          alert('បានរក្សាទុកកាលបរិច្ឆេទ និងថ្នាក់ដោយជោគជ័យ!');
        }
      } catch (err) {
        console.error('Save failed:', err);
      }
    }

    resetCustomizations() {
      if (confirm('តើអ្នកពិតជាចង់កំណត់កាលបរិច្ឆេទ និងថ្នាក់ឡើងវិញទៅកាន់ទិន្នន័យដើមមែនទេ?')) {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem('ngs_custom_start_date');
        localStorage.removeItem('ngs_custom_class');
        localStorage.removeItem('ngs_custom_cadence');
        this.savedStartDate = '2026-11-05';
        this.savedClass = '១២A';
        this.savedCadence = '2';
        this.plans = JSON.parse(JSON.stringify(window.NGS_LESSON_PLANS_DATA || []));
        this.render();
        if (window.showToast) {
          window.showToast('បានកំណត់ឡើងវិញរួចរាល់!', 'info');
        }
      }
    }

    setChapterFilter(ch) {
      this.activeChapter = ch;
      this.render();
    }

    setSearchQuery(q) {
      this.searchQuery = q.toLowerCase().trim();
      this.renderPlansList();
    }

    updateDate(id, newDate) {
      const p = this.plans.find(item => item.id === id);
      if (p) {
        p.date = newDate;
        p.date_khmer = formatKhmerDate(newDate, true);
        const khSpan = document.getElementById(`khDate-${id}`);
        if (khSpan) {
          khSpan.innerText = p.date_khmer;
        }
        this.saveCustomizations();
      }
    }

    updateClass(id, newClass) {
      const p = this.plans.find(item => item.id === id);
      if (p) {
        p.class_name = newClass;
        this.saveCustomizations();
      }
    }

    // Batch update dates and class
    applyBatchSchedule() {
      const classInput = document.getElementById('batchClassSelect');
      const dateInput = document.getElementById('batchStartDate');
      const stepInput = document.getElementById('batchStepDays');

      const selectedClass = classInput ? classInput.value : (this.savedClass || '១២A');
      const startDateStr = dateInput ? dateInput.value : (this.savedStartDate || '2026-11-05');
      const cadenceMode = stepInput ? stepInput.value : (this.savedCadence || '2');

      if (!startDateStr) {
        alert('សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម!');
        return;
      }

      const visiblePlans = this.getFilteredPlans();
      if (visiblePlans.length === 0) {
        alert('មិនមានកិច្ចតែងការដើម្បីកំណត់!');
        return;
      }

      // Save custom start date, class, and cadence into memory & localStorage
      this.savedStartDate = startDateStr;
      this.savedClass = selectedClass;
      this.savedCadence = cadenceMode;
      try {
        localStorage.setItem('ngs_custom_start_date', startDateStr);
        localStorage.setItem('ngs_custom_class', selectedClass);
        localStorage.setItem('ngs_custom_cadence', cadenceMode);
      } catch (e) {}

      const parts = startDateStr.split('-');
      let curDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

      // If start date is Sunday (0), shift to Monday (1)
      if (curDate.getDay() === 0) {
        curDate.setDate(curDate.getDate() + 1);
      }

      visiblePlans.forEach((p) => {
        p.class_name = selectedClass;
        const y = curDate.getFullYear();
        const m = String(curDate.getMonth() + 1).padStart(2, '0');
        const d = String(curDate.getDate()).padStart(2, '0');
        p.date = `${y}-${m}-${d}`;
        p.date_khmer = formatKhmerDate(p.date, true);

        // Advance date with Sunday exclusion
        if (cadenceMode === 'mon_wed_fri') {
          // Target days: Monday(1), Wednesday(3), Friday(5)
          do {
            curDate.setDate(curDate.getDate() + 1);
          } while (![1, 3, 5].includes(curDate.getDay()));
        } else if (cadenceMode === 'tue_thu_sat') {
          // Target days: Tuesday(2), Thursday(4), Saturday(6)
          do {
            curDate.setDate(curDate.getDate() + 1);
          } while (![2, 4, 6].includes(curDate.getDay()));
        } else if (cadenceMode === 'daily') {
          // Daily (Mon to Sat, skip Sunday)
          curDate.setDate(curDate.getDate() + 1);
          if (curDate.getDay() === 0) {
            curDate.setDate(curDate.getDate() + 1);
          }
        } else if (cadenceMode === '7') {
          // Weekly
          curDate.setDate(curDate.getDate() + 7);
          if (curDate.getDay() === 0) {
            curDate.setDate(curDate.getDate() + 1);
          }
        } else {
          // 2 days interval: skip Sunday
          const step = parseInt(cadenceMode, 10) || 2;
          curDate.setDate(curDate.getDate() + step);
          if (curDate.getDay() === 0) {
            curDate.setDate(curDate.getDate() + 1);
          }
        }
      });

      this.saveCustomizations();
      this.render();
      if (window.showToast) {
        window.showToast(`✓ បានកំណត់កាលវិភាគចាប់ផ្តើមពីថ្ងៃ ${formatKhmerDate(startDateStr)} (លើកលែងថ្ងៃអាទិត្យ) ជូន ${visiblePlans.length} មេរៀន និងរក្សាទុកក្នុងប្រព័ន្ធដោយជោគជ័យ! 🎉`, 'success');
      }
    }

    getFilteredPlans() {
      return this.plans.filter(p => {
        const matchesChapter = this.activeChapter === 'all' || p.chapter_code === this.activeChapter;
        const matchesSearch = !this.searchQuery ||
          p.lesson_title.toLowerCase().includes(this.searchQuery) ||
          p.topic.toLowerCase().includes(this.searchQuery) ||
          p.chapter.toLowerCase().includes(this.searchQuery) ||
          p.class_name.toLowerCase().includes(this.searchQuery);
        return matchesChapter && matchesSearch;
      });
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

        const existingPdfBytes = await fetch(plan.pdf_file).then(res => res.arrayBuffer());
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

        // Create high-res canvas for Date and Teacher (Clean typography without dots, bigger font)
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 34px "Khmer OS Muol Light", "Khmer OS Muol", "Khmer OS", sans-serif';

        const khmerDateClean = formatKhmerDate(plan.date, false);
        ctx.fillText('កាលបរិច្ឆេទ   :   ' + khmerDateClean, 10, 52);
        ctx.fillText('បង្រៀនដោយ   :   ' + plan.teacher, 10, 112);

        const datePngUrl = canvas.toDataURL('image/png');
        const datePngBytes = await fetch(datePngUrl).then(res => res.arrayBuffer());
        const dateImg = await pdfDoc.embedPng(datePngBytes);

        // Target cover page
        const pIdx = plan.cover_page_index !== undefined ? plan.cover_page_index : 0;
        if (pIdx < pdfDoc.getPageCount()) {
          const page = pdfDoc.getPage(pIdx);
          const pageH = page.getHeight();
          const y_top = plan.box_y0 || 161.8;
          const box_h = 36.0;
          // In pdf-lib y=0 is at bottom
          const y_bottom = pageH - y_top - box_h;

          // Mask old date and teacher
          page.drawRectangle({
            x: 130,
            y: y_bottom,
            width: 320,
            height: box_h,
            color: PDFLib.rgb(1, 1, 1),
          });

          // Draw customized date & teacher
          page.drawImage(dateImg, {
            x: 130.92,
            y: y_bottom,
            width: 286.0,
            height: box_h,
          });

          // Also update Class if customized
          if (plan.class_name) {
            const classCanvas = document.createElement('canvas');
            classCanvas.width = 300;
            classCanvas.height = 80;
            const cctx = classCanvas.getContext('2d');
            cctx.fillStyle = '#ffffff';
            cctx.fillRect(0, 0, classCanvas.width, classCanvas.height);
            cctx.fillStyle = '#000000';
            cctx.font = 'bold 36px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
            cctx.fillText(':   ' + plan.class_name, 10, 55);

            const classPngUrl = classCanvas.toDataURL('image/png');
            const classPngBytes = await fetch(classPngUrl).then(res => res.arrayBuffer());
            const classImg = await pdfDoc.embedPng(classPngBytes);

            const class_y_top = plan.class_y0 || 77.9;
            const class_y_bottom = pageH - class_y_top - 18.0;

            page.drawRectangle({
              x: 226,
              y: class_y_bottom,
              width: 80,
              height: 18.0,
              color: PDFLib.rgb(1, 1, 1),
            });
            page.drawImage(classImg, {
              x: 226,
              y: class_y_bottom,
              width: 65.0,
              height: 18.0,
            });
          }

          // Also update Signature Page if available (Wipes old text, closes box, inserts date without dots + clean columns)
          const sIdx = plan.sig_page_index !== undefined ? plan.sig_page_index : null;
          if (sIdx !== null && sIdx < pdfDoc.getPageCount()) {
            const sigPage = pdfDoc.getPage(sIdx);
            const sigPageH = sigPage.getHeight();
            const sig_y_top = plan.sig_y0 || 320.0;
            const sig_box_h = plan.sig_h || 156.0;
            // In pdf-lib y=0 is at bottom
            const sig_y_bottom = sigPageH - sig_y_top - sig_box_h;

            // 1. Wipe out old signature text completely (full-height pure white mask)
            sigPage.drawRectangle({
              x: 65,
              y: Math.max(0, sig_y_bottom - 8),
              width: 505,
              height: sig_box_h + 16,
              color: PDFLib.rgb(1, 1, 1),
            });

            // 2. CLOSE THE TABLE BOX AT THE TOP with crisp horizontal line!
            const tableXEnd = plan.chapter_code === 'ch5' ? 565.4 : 538.5;
            sigPage.drawLine({
              start: { x: 71.0, y: sigPageH - sig_y_top },
              end: { x: tableXEnd, y: sigPageH - sig_y_top },
              thickness: 0.6,
              color: PDFLib.rgb(0, 0, 0),
            });

            // 3. Render dynamic signature date via canvas (Clean without dots, bigger font)
            const sigDateCanvas = document.createElement('canvas');
            sigDateCanvas.width = 1000;
            sigDateCanvas.height = 70;
            const sctx = sigDateCanvas.getContext('2d');
            sctx.fillStyle = '#ffffff';
            sctx.fillRect(0, 0, sigDateCanvas.width, sigDateCanvas.height);
            sctx.fillStyle = '#000000';
            sctx.font = 'bold 34px "Khmer OS Siemreap", "Noto Sans Khmer", "Khmer OS", sans-serif';
            sctx.textAlign = 'right';
            sctx.fillText('រាជធានីភ្នំពេញ ' + khmerDateClean, 980, 48);

            const sigDatePngUrl = sigDateCanvas.toDataURL('image/png');
            const sigDatePngBytes = await fetch(sigDatePngUrl).then(res => res.arrayBuffer());
            const sigDateImg = await pdfDoc.embedPng(sigDatePngBytes);

            const sigDateYBottom = sigPageH - sig_y_top - 24.0;
            sigPage.drawImage(sigDateImg, {
              x: 300,
              y: sigDateYBottom,
              width: 255.0,
              height: 20.0,
            });

            // 4. Render clean 3 columns (Teacher Bonorng, Tech Head, NGS Assistant)
            try {
              const colsBytes = await fetch('images/sample_sig_columns_clean.png').then(res => res.arrayBuffer());
              const colsImg = await pdfDoc.embedPng(colsBytes);
              const colsYBottom = sigPageH - sig_y_top - 27.0 - 110.5;
              sigPage.drawImage(colsImg, {
                x: 65,
                y: colsYBottom,
                width: 500.0,
                height: 110.5,
              });
            } catch (errCols) {
              console.warn('Could not embed signature columns image:', errCols);
            }
          }
        }

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
        console.error('PDF modification error:', err);
        window.open(plan.pdf_file, '_blank');
      }
    }

    render() {
      const container = document.getElementById('tab-lessonplans');
      if (!container) return;

      const totalPlans = this.plans.length;
      const ch1Count = this.plans.filter(p => p.chapter_code === 'ch1').length;
      const ch2Count = this.plans.filter(p => p.chapter_code === 'ch2').length;
      const ch5Count = this.plans.filter(p => p.chapter_code === 'ch5').length;

      container.innerHTML = `
        <!-- Top Banner: School & Teacher Profile -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-800 to-sky-800 p-6 md:p-8 text-white shadow-xl">
          <div class="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="flex items-start gap-4">
              <!-- Official School Logo in Banner Header -->
              <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white p-1.5 shadow-lg border-2 border-amber-300 shrink-0 flex items-center justify-center">
                <img src="images/yukunthor-logo.jpg" alt="Preah Yukunthor NGS Logo" class="w-full h-full object-contain rounded-xl">
              </div>
              <div class="space-y-1.5">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-amber-300">
                  <i class="fa-solid fa-school"></i> វិទ្យាល័យព្រះយុគន្ធរ · សាលារៀនជំនាន់ថ្មី (NGS)
                </div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">
                  កិច្ចតែងការបង្រៀនគណិតវិទ្យាថ្នាក់ទី ១២
                </h1>
                <p class="text-xs md:text-sm text-purple-100 max-w-2xl leading-relaxed">
                  រៀបចំនិងបង្រៀនដោយ <strong>លោកគ្រូ នួន បូណង</strong> តាមស្តង់ដារគុណវុឌ្ឍិ ៥ ជំហានបង្រៀន NGS
                  (៥០/៥០ ពិន្ទុ) ពេញលេញចំនួន ៣ ជំពូកធំៗ ស្របតាមសៀវភៅសិក្សាគោល និងកម្រងសំណួរ MoEYS។
                </p>
              </div>
            </div>
            <!-- Statistics Badges -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 self-end md:self-center">
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
                <span class="block text-2xl font-black text-amber-300">${totalPlans}</span>
                <span class="text-[11px] text-purple-200 uppercase tracking-wider">កិច្ចតែងការ</span>
              </div>
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
                <span class="block text-2xl font-black text-emerald-300">១៩១</span>
                <span class="text-[11px] text-purple-200 uppercase tracking-wider">ទំព័រឯកសារ</span>
              </div>
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
                <span class="block text-2xl font-black text-sky-300">១០០%</span>
                <span class="text-[11px] text-purple-200 uppercase tracking-wider">បានឯកភាព</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chapter Filter Tabs & Download Hub -->
        <div class="card-soft p-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="window.lessonPlansManager.setChapterFilter('all')"
              class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${this.activeChapter === 'all' ? 'bg-purple-600 text-white shadow-purple-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100'}">
              <span>🌟 ទាំងអស់</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] ${this.activeChapter === 'all' ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700'}">${totalPlans}</span>
            </button>
            <button onclick="window.lessonPlansManager.setChapterFilter('ch1')"
              class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${this.activeChapter === 'ch1' ? 'bg-purple-600 text-white shadow-purple-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100'}">
              <span>🔵 ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] ${this.activeChapter === 'ch1' ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700'}">${ch1Count}</span>
            </button>
            <button onclick="window.lessonPlansManager.setChapterFilter('ch2')"
              class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${this.activeChapter === 'ch2' ? 'bg-purple-600 text-white shadow-purple-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100'}">
              <span>🟣 ជំពូកទី ២ ៖ លីមីត</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] ${this.activeChapter === 'ch2' ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700'}">${ch2Count}</span>
            </button>
            <button onclick="window.lessonPlansManager.setChapterFilter('ch5')"
              class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${this.activeChapter === 'ch5' ? 'bg-purple-600 text-white shadow-purple-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100'}">
              <span>🟢 ជំពូកទី ៥ ៖ វ៉ិចទ័រក្នុងលំហ</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] ${this.activeChapter === 'ch5' ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700'}">${ch5Count}</span>
            </button>
          </div>

          <!-- Official Chapter Files Download Pills -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-bold hidden sm:inline">ឯកសារដើម NGS:</span>
            <div class="dropdown relative group">
              <button class="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 border border-purple-200 dark:border-slate-700 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition">
                <i class="fa-solid fa-file-pdf text-red-500"></i> PDF ជំពូកទាំងមូល <i class="fa-solid fa-chevron-down text-[10px]"></i>
              </button>
              <div class="absolute right-0 top-full mt-1 hidden group-hover:block bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-2 z-30 min-w-[240px]">
                <a href="ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf" target="_blank" download class="block px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
                  📄 ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច (73 ទំព័រ)
                </a>
                <a href="ជំពូកទី_2_លីមីត_ព្រះយុគន្ធរ_NGS.pdf" target="_blank" download class="block px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
                  📄 ជំពូកទី ២ ៖ លីមីត (53 ទំព័រ)
                </a>
                <a href="ជំពូកទី_5_វ៉ិចទ័រក្នុងលំហ_ព្រះយុគន្ធរ_NGS.pdf" target="_blank" download class="block px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
                  📄 ជំពូកទី ៥ ៖ វ៉ិចទ័រក្នុងលំហ (65 ទំព័រ)
                </a>
              </div>
            </div>

            <div class="dropdown relative group">
              <button class="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition">
                <i class="fa-solid fa-file-word text-blue-500"></i> Word (.docx) <i class="fa-solid fa-chevron-down text-[10px]"></i>
              </button>
              <div class="absolute right-0 top-full mt-1 hidden group-hover:block bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-2 z-30 min-w-[240px]">
                <a href="ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.docx" download class="block px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
                  📝 ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច (Word)
                </a>
                <a href="ជំពូកទី_2_លីមីត_ព្រះយុគន្ធរ_NGS.docx" download class="block px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
                  📝 ជំពូកទី ២ ៖ លីមីត (Word)
                </a>
                <a href="ជំពូកទី_5_វ៉ិចទ័រក្នុងលំហ_ព្រះយុគន្ធរ_NGS.docx" download class="block px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
                  📝 ជំពូកទី ៥ ៖ វ៉ិចទ័រក្នុងលំហ (Word)
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Batch Editor Toolbar -->
        <div class="card-soft p-5 bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-pink-50/60 dark:from-slate-800 dark:to-slate-800/80 border-purple-200 dark:border-slate-700 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="text-sm font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                <i class="fa-solid fa-calendar-days text-purple-600"></i> កំណត់កាលបរិច្ឆេទ & ថ្នាក់បង្រៀនរហ័ស (Batch Customizer)
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.lessonPlansManager.saveCustomizations()" class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow flex items-center gap-1.5 transition">
                <i class="fa-solid fa-floppy-disk"></i> រក្សាទុក
              </button>
              <button onclick="window.lessonPlansManager.resetCustomizations()" class="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold text-xs transition">
                <i class="fa-solid fa-rotate-left"></i> កំណត់ឡើងវិញ
              </button>
            </div>
          </div>

          <!-- Controls Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end pt-1">
            <!-- Class Selector -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                🎓 ថ្នាក់បង្រៀន (Grade / Class):
              </label>
              <select id="batchClassSelect" class="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
                <option value="១២A" ${this.savedClass === '១២A' ? 'selected' : ''}>ថ្នាក់ទី ១២A (វិទ្យាសាស្ត្រពិត)</option>
                <option value="១២B" ${this.savedClass === '១២B' ? 'selected' : ''}>ថ្នាក់ទី ១២B</option>
                <option value="១២C" ${this.savedClass === '១២C' ? 'selected' : ''}>ថ្នាក់ទី ១២C</option>
                <option value="១២D" ${this.savedClass === '១២D' ? 'selected' : ''}>ថ្នាក់ទី ១២D</option>
                <option value="១២E" ${this.savedClass === '១២E' ? 'selected' : ''}>ថ្នាក់ទី ១២E</option>
                <option value="១២F" ${this.savedClass === '១២F' ? 'selected' : ''}>ថ្នាក់ទី ១២F</option>
              </select>
            </div>

            <!-- Start Date Picker -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                📅 ថ្ងៃចាប់ផ្តើមបង្រៀនដំបូង:
              </label>
              <input type="date" id="batchStartDate" value="${this.savedStartDate || '2026-11-05'}" class="w-full px-3 py-1.5 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
            </div>

            <!-- Cadence Step -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                ⏱️ គម្លាតថ្ងៃ (Cadence):
              </label>
              <select id="batchStepDays" class="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
                <option value="2" ${this.savedCadence === '2' ? 'selected' : ''}>រៀងរាល់ ២ ថ្ងៃម្តង (លើកលែងថ្ងៃអាទិត្យ)</option>
                <option value="mon_wed_fri" ${this.savedCadence === 'mon_wed_fri' ? 'selected' : ''}>ចន្ទ - ពុធ - សុក្រ (៣ ថ្ងៃ/សប្តាហ៍)</option>
                <option value="tue_thu_sat" ${this.savedCadence === 'tue_thu_sat' ? 'selected' : ''}>អង្គារ - ព្រហស្បតិ៍ - សៅរ៍ (៣ ថ្ងៃ/សប្តាហ៍)</option>
                <option value="daily" ${this.savedCadence === 'daily' ? 'selected' : ''}>រាល់ថ្ងៃសិក្សា (ចន្ទ ដល់ សៅរ៍ - គ្មានថ្ងៃអាទិត្យ)</option>
                <option value="7" ${this.savedCadence === '7' ? 'selected' : ''}>រៀងរាល់ ១ សប្តាហ៍ម្តង (+៧ ថ្ងៃ)</option>
              </select>
            </div>

            <!-- Apply Button -->
            <div>
              <button onclick="window.lessonPlansManager.applyBatchSchedule()" class="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-wand-magic-sparkles"></i> បំពេញស្វ័យប្រវត្តិតាមកាលវិភាគ
              </button>
            </div>
          </div>

          <!-- Helpful Instructions & Current Active Schedule Indicator -->
          <div class="mt-3 pt-2.5 border-t border-purple-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
            <span>💡 <strong>របៀបកំណត់៖</strong> ជ្រើសរើសថ្ងៃចាប់ផ្តើម រួចចុច <strong>«បំពេញស្វ័យប្រវត្តិតាមកាលវិភាគ»</strong> ដើម្បីកំណត់គ្រប់មេរៀន និងចងចាំកាលវិភាគជានិច្ច (មិនត្រឡប់ទៅ ១៩ តុលា វិញឡើយ)។</span>
            ${this.savedStartDate ? `<span class="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold px-2.5 py-0.5 rounded-lg border border-purple-200">📌 កាលវិភាគបច្ចុប្បន្នចាប់ផ្តើមពី៖ ${formatKhmerDate(this.savedStartDate)}</span>` : ''}
          </div>
        </div>

        <!-- Search Bar -->
        <div class="relative">
          <input type="text"
            oninput="window.lessonPlansManager.setSearchQuery(this.value)"
            placeholder="🔍 ស្វែងរកកិច្ចតែងការ តាមចំណងជើង ខ្លឹមសារ ឬជំពូក..."
            class="w-full px-4 py-2.5 pl-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
        </div>

        <!-- Lesson Plans Cards Container -->
        <div id="lessonPlansListContainer" class="space-y-4">
          <!-- Populated by renderPlansList -->
        </div>

        <!-- Modal Viewer for Lesson Plan -->
        <div id="lessonPlanModal" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm hidden flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="p-4 md:p-5 bg-gradient-to-r from-purple-800 via-indigo-800 to-sky-800 text-white flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow">
                  <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-full h-full object-contain rounded-lg">
                </div>
                <div>
                  <h3 id="modalPlanTitle" class="font-extrabold text-sm md:text-base leading-tight">កិច្ចតែងការបង្រៀន</h3>
                  <p id="modalPlanSubtitle" class="text-xs text-purple-200">វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button id="modalBtnCustomPdf" onclick="window.lessonPlansManager.downloadCurrentModalPdf()" class="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition flex items-center gap-1.5 shadow">
                  <i class="fa-solid fa-file-arrow-down"></i> ទាញយក PDF ថ្មី
                </button>
                <button id="modalBtnPrint" onclick="window.lessonPlansManager.printCurrentPlan()" class="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition flex items-center gap-1.5">
                  <i class="fa-solid fa-print"></i> បោះពុម្ព
                </button>
                <button onclick="document.getElementById('lessonPlanModal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm transition">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <!-- Modal Body (Printable Lesson Plan Layout) -->
            <div id="modalPlanBody" class="p-6 pb-12 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>
      `;

      this.renderPlansList();
    }

    renderPlansList() {
      const container = document.getElementById('lessonPlansListContainer');
      if (!container) return;

      const filtered = this.getFilteredPlans();

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="card-soft p-12 text-center text-slate-400 space-y-2">
            <div class="text-4xl">🔍</div>
            <p class="font-bold text-sm">រកមិនឃើញកិច្ចតែងការដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ</p>
            <p class="text-xs">សូមសាកល្បងពាក្យគន្លឹះផ្សេង ឬចុចមើលគ្រប់ជំពូក</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(p => {
        const chColor = p.chapter_code === 'ch1' ? 'purple' : p.chapter_code === 'ch2' ? 'indigo' : 'emerald';
        return `
          <div class="card-soft p-5 border-l-4 border-l-${chColor}-500 hover:shadow-md transition space-y-3">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <!-- Left Info -->
              <div class="flex items-start gap-3.5">
                <div class="w-12 h-12 rounded-2xl bg-${chColor}-100 dark:bg-${chColor}-900/40 text-${chColor}-700 dark:text-${chColor}-300 flex items-center justify-center text-lg font-black shrink-0">
                  ${toKhmerNum(p.ch_lesson_num)}
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-${chColor}-100 dark:bg-${chColor}-900/50 text-${chColor}-700 dark:text-${chColor}-300">
                      ${p.chapter}
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                      ✓ ${p.status}
                    </span>
                    <span class="text-[11px] text-slate-400 font-mono">
                      ⏱️ ${p.duration} · ស្តង់ដារ ៥ ជំហាន NGS (ពិន្ទុ ${p.score}/50)
                    </span>
                  </div>
                  <h3 class="font-extrabold text-base text-slate-900 dark:text-white">
                    ${p.lesson_title}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    <strong>ខ្លឹមសារ៖</strong> ${p.topic}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button onclick="window.lessonPlansManager.openModal('${p.id}')"
                  class="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                  <i class="fa-solid fa-eye"></i> មើលកិច្ចតែងការ
                </button>
                <button onclick="window.lessonPlansManager.downloadCustomPdf('${p.id}')"
                  class="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm" title="ទាញយក PDF ជាមួយកាលបរិច្ឆេទ & ថ្នាក់ថ្មី">
                  <i class="fa-solid fa-file-arrow-down"></i> <span class="hidden sm:inline">ទាញយក PDF</span>
                </button>
                <a href="${p.docx_file}" download
                  class="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold transition flex items-center gap-1" title="ទាញយក Word ជំពូក">
                  <i class="fa-solid fa-file-word"></i>
                </a>
              </div>
            </div>

            <!-- Inline Editable Date & Class Row -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/60 dark:bg-slate-800/40 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
              <div class="flex flex-wrap items-center gap-4">
                <!-- Editable Class Dropdown -->
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-slate-600 dark:text-slate-400">🎓 ថ្នាក់៖</span>
                  <select onchange="window.lessonPlansManager.updateClass('${p.id}', this.value)"
                    class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 font-extrabold text-purple-700 dark:text-purple-300 text-xs focus:outline-none focus:border-purple-500">
                    <option value="១២A" ${p.class_name === '១២A' ? 'selected' : ''}>១២A</option>
                    <option value="១២B" ${p.class_name === '១២B' ? 'selected' : ''}>១២B</option>
                    <option value="១២C" ${p.class_name === '១២C' ? 'selected' : ''}>១២C</option>
                    <option value="១២D" ${p.class_name === '១២D' ? 'selected' : ''}>១២D</option>
                    <option value="១២E" ${p.class_name === '១២E' ? 'selected' : ''}>១២E</option>
                    <option value="១២F" ${p.class_name === '១២F' ? 'selected' : ''}>១២F</option>
                  </select>
                </div>

                <!-- Editable Date Input -->
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-600 dark:text-slate-400">📅 កាលបរិច្ឆេទ៖</span>
                  <input type="date" value="${p.date}"
                    onchange="window.lessonPlansManager.updateDate('${p.id}', this.value)"
                    class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-purple-500">
                  <span id="khDate-${p.id}" class="text-purple-700 dark:text-purple-300 font-bold hidden sm:inline">
                    ${p.date_khmer}
                  </span>
                </div>
              </div>

              <!-- Teacher Badge -->
              <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <i class="fa-solid fa-user-tie text-purple-600"></i>
                <span>គ្រូបង្រៀន៖ <strong class="text-slate-800 dark:text-slate-200">${p.teacher}</strong></span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    openModal(planId) {
      const p = this.plans.find(item => item.id === planId);
      if (!p) return;

      this.currentModalPlan = p;

      const modal = document.getElementById('lessonPlanModal');
      const titleEl = document.getElementById('modalPlanTitle');
      const subEl = document.getElementById('modalPlanSubtitle');
      const bodyEl = document.getElementById('modalPlanBody');

      if (!modal || !bodyEl) return;

      titleEl.innerText = `${p.chapter} ៖ ${p.lesson_title}`;
      subEl.innerText = `ថ្នាក់ទី ${p.class_name} · ${p.date_khmer} · គ្រូបង្រៀន៖ ${p.teacher} · វិទ្យាល័យព្រះយុគន្ធរ NGS`;

      bodyEl.innerHTML = `
        <!-- Official Document Header Box -->
        <div class="border-2 border-purple-300 dark:border-purple-700 rounded-2xl p-5 bg-purple-50/40 dark:bg-slate-800/80 space-y-3">
          <div class="flex items-center justify-between pb-3 border-b border-purple-200 dark:border-slate-700">
            <!-- Left School Logo -->
            <div class="w-16 h-16 rounded-xl bg-white p-1 border border-purple-200 shadow-sm shrink-0 flex items-center justify-center">
              <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-full h-full object-contain">
            </div>

            <!-- Kingdom & Ministry Title -->
            <div class="text-center flex-1 px-2 space-y-1">
              <p class="font-bold text-xs uppercase tracking-wider text-slate-500">ព្រះរាជាណាចក្រកម្ពុជា · ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
              <p class="font-bold text-xs text-purple-800 dark:text-purple-300">ក្រសួងអប់រំ យុវជន និងកីឡា · វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)</p>
              <h2 class="text-base md:text-lg font-extrabold text-slate-900 dark:text-white pt-1">
                កិច្ចតែងការបង្រៀនគណិតវិទ្យា (ស្តង់ដារ ៥ ជំហាន NGS)
              </h2>
            </div>

            <!-- Right Spacer / Badge -->
            <div class="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex flex-col items-center justify-center text-xs font-black shrink-0 border border-purple-200">
              <span class="text-[10px]">ពិន្ទុ</span>
              <span class="text-sm">៥០/៥០</span>
            </div>
          </div>

          <!-- Document Info Matrix -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
            <div class="bg-white dark:bg-slate-700 p-2.5 rounded-xl border border-purple-100 dark:border-slate-600">
              <span class="block text-slate-400 font-bold">ថ្នាក់បង្រៀន៖</span>
              <strong class="text-purple-700 dark:text-purple-300 text-sm">ថ្នាក់ទី ${p.class_name}</strong>
            </div>
            <div class="bg-white dark:bg-slate-700 p-2.5 rounded-xl border border-purple-100 dark:border-slate-600">
              <span class="block text-slate-400 font-bold">រយៈពេលបង្រៀន៖</span>
              <strong class="text-slate-800 dark:text-slate-200 text-sm">${p.duration}</strong>
            </div>
            <div class="bg-white dark:bg-slate-700 p-2.5 rounded-xl border border-purple-100 dark:border-slate-600 md:col-span-2">
              <span class="block text-slate-400 font-bold">កាលបរិច្ឆេទបង្រៀន៖</span>
              <strong class="text-purple-700 dark:text-purple-300 text-sm">${p.date_khmer}</strong>
            </div>
            <div class="bg-white dark:bg-slate-700 p-2.5 rounded-xl border border-purple-100 dark:border-slate-600 md:col-span-2">
              <span class="block text-slate-400 font-bold">ជំពូក & មេរៀន៖</span>
              <strong class="text-slate-800 dark:text-slate-200">${p.chapter}</strong>
            </div>
            <div class="bg-white dark:bg-slate-700 p-2.5 rounded-xl border border-purple-100 dark:border-slate-600 md:col-span-2">
              <span class="block text-slate-400 font-bold">គ្រូបង្រៀនទទួលបន្ទុក៖</span>
              <strong class="text-slate-800 dark:text-slate-200">លោកគ្រូ ${p.teacher}</strong>
            </div>
          </div>
        </div>

        <!-- 1. Objectives Section -->
        <div class="space-y-2">
          <h4 class="font-extrabold text-sm text-purple-900 dark:text-purple-300 flex items-center gap-2 border-b border-purple-200 dark:border-slate-700 pb-1.5">
            <span>🎯 ១. វត្ថុបំណងមេរៀន (ក្រោយរៀនខ្លឹមសារនេះចប់ សិស្សអាច)</span>
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div class="bg-slate-50 dark:bg-slate-700/60 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
              <span class="font-bold text-purple-700 dark:text-purple-300 block mb-1">🧠 វិជ្ជាសម្បទា (Knowledge):</span>
              <ul class="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                ${(p.objectives && p.objectives.knowledge && p.objectives.knowledge.length > 0)
                  ? p.objectives.knowledge.map(k => `<li>${k}</li>`).join('')
                  : `<li>កំណត់ និងយល់ច្បាស់ពីខ្លឹមសារមេរៀន ${p.lesson_title} តាមការណែនាំរបស់គ្រូ។</li>`}
              </ul>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700/60 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
              <span class="font-bold text-sky-700 dark:text-sky-300 block mb-1">🛠️ បំណិនសម្បទា (Skills):</span>
              <ul class="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                ${(p.objectives && p.objectives.skills && p.objectives.skills.length > 0)
                  ? p.objectives.skills.map(s => `<li>${s}</li>`).join('')
                  : `<li>អនុវត្តដោះស្រាយលំហាត់ និងប្រើប្រាស់រូបមន្តបានត្រឹមត្រូវតាមរយៈការពិភាក្សាក្រុម។</li>`}
              </ul>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700/60 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
              <span class="font-bold text-emerald-700 dark:text-emerald-300 block mb-1">💖 ចរិយាសម្បទា (Attitude):</span>
              <p class="text-slate-700 dark:text-slate-300 leading-relaxed">
                ${(p.objectives && p.objectives.attitude)
                  ? p.objectives.attitude
                  : 'បណ្តុះស្មារតីស្រឡាញ់គណិតវិទ្យា ភាពស្មោះត្រង់ កិច្ចសហការ និងការទទួលខុសត្រូវខ្ពស់។'}
              </p>
            </div>
          </div>
        </div>

        <!-- 2. Teaching Materials & Strategies -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="bg-slate-50 dark:bg-slate-700/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-600 space-y-1.5">
            <h5 class="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
              <i class="fa-solid fa-toolbox"></i> ២. សម្ភារឧបទេស
            </h5>
            <p><strong>សម្រាប់គ្រូ៖</strong> ${p.materials.teacher}</p>
            <p><strong>សម្រាប់សិស្ស៖</strong> ${p.materials.student}</p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-600 space-y-1.5">
            <h5 class="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
              <i class="fa-solid fa-chalkboard-user"></i> ៣. វិធីសាស្ត្របង្រៀន
            </h5>
            <p>${p.methods}</p>
          </div>
        </div>

        <!-- 3. The 5 Steps of NGS Standard -->
        <div class="space-y-2">
          <h4 class="font-extrabold text-sm text-purple-900 dark:text-purple-300 flex items-center gap-2 border-b border-purple-200 dark:border-slate-700 pb-1.5">
            <span>📋 ៤. ដំណើរការបង្រៀនតាម ៥ ជំហាន NGS (៥០ ពិន្ទុ)</span>
          </h4>
          <div class="space-y-2 text-xs">
            <div class="p-3 rounded-xl bg-purple-50/80 dark:bg-slate-700/80 border border-purple-200 dark:border-slate-600 flex items-start gap-3">
              <span class="px-2 py-1 rounded bg-purple-600 text-white font-black shrink-0 text-[11px]">ជំហានទី ១</span>
              <div>
                <strong>រដ្ឋបាលថ្នាក់ (៣ នាទី)៖</strong>
                <p class="text-slate-600 dark:text-slate-300 mt-0.5">${p.steps.step1}</p>
              </div>
            </div>
            <div class="p-3 rounded-xl bg-indigo-50/80 dark:bg-slate-700/80 border border-indigo-200 dark:border-slate-600 flex items-start gap-3">
              <span class="px-2 py-1 rounded bg-indigo-600 text-white font-black shrink-0 text-[11px]">ជំហានទី ២</span>
              <div>
                <strong>រំឭកមេរៀនចាស់ (១០ នាទី)៖</strong>
                <p class="text-slate-600 dark:text-slate-300 mt-0.5">${p.steps.step2}</p>
              </div>
            </div>
            <div class="p-3 rounded-xl bg-sky-50/80 dark:bg-slate-700/80 border border-sky-200 dark:border-slate-600 flex items-start gap-3">
              <span class="px-2 py-1 rounded bg-sky-600 text-white font-black shrink-0 text-[11px]">ជំហានទី ៣</span>
              <div>
                <strong>មេរៀនថ្មី (២២ នាទី)៖</strong>
                <p class="text-slate-600 dark:text-slate-300 mt-0.5">${p.steps.step3}</p>
              </div>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50/80 dark:bg-slate-700/80 border border-emerald-200 dark:border-slate-600 flex items-start gap-3">
              <span class="px-2 py-1 rounded bg-emerald-600 text-white font-black shrink-0 text-[11px]">ជំហានទី ៤</span>
              <div>
                <strong>ពង្រឹងចំណេះដឹង (៨ នាទី)៖</strong>
                <p class="text-slate-600 dark:text-slate-300 mt-0.5">${p.steps.step4}</p>
              </div>
            </div>
            <div class="p-3 rounded-xl bg-amber-50/80 dark:bg-slate-700/80 border border-amber-200 dark:border-slate-600 flex items-start gap-3">
              <span class="px-2 py-1 rounded bg-amber-600 text-white font-black shrink-0 text-[11px]">ជំហានទី ៥</span>
              <div>
                <strong>បណ្តាំផ្ញើ & កិច្ចការផ្ទះ (២ នាទី)៖</strong>
                <p class="text-slate-600 dark:text-slate-300 mt-0.5">${p.steps.step5}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Official Signatures Block with safe bottom margin -->
        <div class="border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-5 pb-4 space-y-4">
          <div class="flex justify-end text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>រាជធានីភ្នំពេញ, ${p.date_khmer}</span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-6 text-center text-xs pt-2">
            <!-- Left: Technical Head -->
            <div class="space-y-10">
              <div>
                <p class="font-extrabold text-slate-800 dark:text-white">បានឃើញ និងពិនិត្យ</p>
                <p class="text-slate-500 font-bold">ប្រធានក្រុមបច្ចេកទេស</p>
              </div>
              <div class="text-slate-400 font-mono text-[11px]">[ ហត្ថលេខា ]</div>
            </div>

            <!-- Middle: Management Assistant -->
            <div class="space-y-10">
              <div>
                <p class="font-extrabold text-slate-800 dark:text-white">បានឃើញ និងឯកភាព</p>
                <p class="text-slate-500 font-bold">នាយករងទទួលបន្ទុក NGS / ជំនួយការគ្រប់គ្រង</p>
              </div>
              <div class="text-slate-400 font-mono text-[11px]">[ ហត្ថលេខា ]</div>
            </div>

            <!-- Right: Teacher Bonorng -->
            <div class="space-y-10 col-span-2 md:col-span-1">
              <div>
                <p class="font-extrabold text-slate-800 dark:text-white">គ្រូបង្រៀនគណិតវិទ្យា</p>
                <p class="text-purple-600 font-bold">វិទ្យាល័យព្រះយុគន្ធរ NGS</p>
              </div>
              <div>
                <strong class="text-purple-800 dark:text-purple-300 text-sm">${p.teacher}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Embedded PDF Viewer Option -->
        <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
          <details class="group bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-600">
            <summary class="font-bold text-xs text-purple-700 dark:text-purple-300 cursor-pointer flex items-center justify-between">
              <span>📄 មើលឯកសារ PDF ពេញលេញនៃជំពូកនេះ (${p.pdf_file})</span>
              <i class="fa-solid fa-chevron-down text-xs group-open:rotate-180 transition"></i>
            </summary>
            <div class="mt-3 h-[500px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-white">
              <iframe src="${p.pdf_file}" class="w-full h-full" frameborder="0"></iframe>
            </div>
          </details>
        </div>
      `;

      modal.classList.remove('hidden');
    }

    downloadCurrentModalPdf() {
      if (this.currentModalPlan) {
        this.downloadCustomPdf(this.currentModalPlan.id);
      }
    }

    printCurrentPlan() {
      const p = this.currentModalPlan;
      if (!p) return;
      window.print();
    }
  }

  // Initialize and mount on window
  window.lessonPlansManager = new LessonPlansManager();

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.lessonPlansManager.init());
  } else {
    window.lessonPlansManager.init();
  }
})();
