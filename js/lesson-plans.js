/**
 * NGS Lesson Plans Management Hub
 * Teachers:
 *   - Nuon Bonorng (លោកគ្រូ នួន បូណង)
 *   - Thaong Sophary (អ្នកគ្រូ ថោង សុភារី)
 * School: Preah Yukunthor High School - New Generation School (NGS)
 * Supporting Grades 7 to 12 (Fully populated for Grade 8 and Grade 12)
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
      this.selectedGrade = localStorage.getItem('ngs_lp_active_grade') || 'ថ្នាក់ទី ៨';
      this.activeChapter = 'all';
      this.searchQuery = '';
      this.plans = [];
      this.storageKey = 'ngs_custom_lesson_plans_v6';

      // Co-teaching support: Nuon Bonorng or Thaong Sophary
      this.savedTeacher = localStorage.getItem('ngs_custom_teacher') || 'នួន បូណង';

      // Schedule settings
      this.savedStartDate = localStorage.getItem('ngs_custom_start_date') || '2026-11-05';
      this.savedSigDate = localStorage.getItem('ngs_custom_sig_date') || '2026-10-29';
      this.savedClass = localStorage.getItem('ngs_custom_class') || (this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_C1 & 8NGS_C2' : '១២A');
      this.savedCadence = localStorage.getItem('ngs_custom_cadence') || '2_days_skip_weekend';
      this.selectedWeekdays = JSON.parse(localStorage.getItem('ngs_custom_weekdays') || '[1, 3, 5]'); // Mon, Wed, Fri
    }

    init() {
      const defaultData = window.NGS_LESSON_PLANS_DATA || [];
      // Deep clone default data
      this.plans = JSON.parse(JSON.stringify(defaultData));

      // Load saved settings & customizations from localStorage
      try {
        this.selectedGrade = localStorage.getItem('ngs_lp_active_grade') || 'ថ្នាក់ទី ៨';
        this.savedTeacher = localStorage.getItem('ngs_custom_teacher') || 'នួន បូណង';
        this.savedStartDate = localStorage.getItem('ngs_custom_start_date') || '2026-11-05';
        this.savedSigDate = localStorage.getItem('ngs_custom_sig_date') || '2026-10-29';
        this.savedClass = localStorage.getItem('ngs_custom_class') || (this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_C1 & 8NGS_C2' : '១២A');
        this.savedCadence = localStorage.getItem('ngs_custom_cadence') || '2_days_skip_weekend';

        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          const customMap = JSON.parse(saved);
          this.plans.forEach(p => {
            if (customMap[p.id]) {
              if (customMap[p.id].date) {
                p.date = customMap[p.id].date;
                p.date_khmer = formatKhmerDate(p.date, true);
              }
              if (customMap[p.id].sig_date) {
                p.sig_date = customMap[p.id].sig_date;
                p.sig_date_khmer = formatKhmerDate(p.sig_date, false);
              }
              if (customMap[p.id].class_name) {
                p.class_name = customMap[p.id].class_name;
              }
              if (customMap[p.id].teacher) {
                p.teacher = customMap[p.id].teacher;
              }
            } else if (this.savedTeacher) {
              p.teacher = this.savedTeacher;
            }
          });
        } else if (this.savedTeacher) {
          this.plans.forEach(p => {
            p.teacher = this.savedTeacher;
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

    setGrade(grade) {
      this.selectedGrade = grade;
      try {
        localStorage.setItem('ngs_lp_active_grade', grade);
      } catch (e) {}
      this.activeChapter = 'all';
      this.searchQuery = '';
      
      // Update default class based on grade
      if (grade === 'ថ្នាក់ទី ៨') {
        this.savedClass = localStorage.getItem('ngs_custom_class_g8') || '8NGS_C1 & 8NGS_C2';
      } else if (grade === 'ថ្នាក់ទី ១២') {
        this.savedClass = localStorage.getItem('ngs_custom_class_g12') || '១២A';
      } else {
        this.savedClass = grade.replace('ថ្នាក់ទី ', '') + 'A';
      }

      this.render();
      if (window.showToast) {
        window.showToast(`បានប្តូរទៅកាន់៖ ${grade}`, 'info');
      }
    }

    setTeacher(teacherName) {
      if (!teacherName) return;
      this.savedTeacher = teacherName;
      try {
        localStorage.setItem('ngs_custom_teacher', teacherName);
      } catch (e) {}

      // Update in memory plans
      this.plans.forEach(p => {
        p.teacher = teacherName;
      });
      this.saveCustomizations(false);
      this.render();

      if (window.showToast) {
        window.showToast(`✓ បានប្តូរឈ្មោះគ្រូបង្រៀនទៅ «${teacherName}» រួចរាល់! 🎉`, 'success');
      }
    }

    onStartDateChange(val) {
      if (!val) return;
      this.savedStartDate = val;
      const parts = val.split('-');
      const dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) - 7);
      const sy = dt.getFullYear();
      const sm = String(dt.getMonth() + 1).padStart(2, '0');
      const sd = String(dt.getDate()).padStart(2, '0');
      const sigInput = document.getElementById('batchSigDate');
      if (sigInput) {
        sigInput.value = `${sy}-${sm}-${sd}`;
      }
    }

    saveCustomizations(showNotification = true) {
      const customMap = {};
      this.plans.forEach(p => {
        customMap[p.id] = {
          date: p.date,
          sig_date: p.sig_date,
          class_name: p.class_name,
          teacher: p.teacher
        };
      });
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(customMap));
        if (this.savedStartDate) {
          localStorage.setItem('ngs_custom_start_date', this.savedStartDate);
        }
        if (this.savedSigDate) {
          localStorage.setItem('ngs_custom_sig_date', this.savedSigDate);
        }
        if (this.savedClass) {
          localStorage.setItem('ngs_custom_class', this.savedClass);
          if (this.selectedGrade === 'ថ្នាក់ទី ៨') {
            localStorage.setItem('ngs_custom_class_g8', this.savedClass);
          } else if (this.selectedGrade === 'ថ្នាក់ទី ១២') {
            localStorage.setItem('ngs_custom_class_g12', this.savedClass);
          }
        }
        if (this.savedCadence) {
          localStorage.setItem('ngs_custom_cadence', this.savedCadence);
        }
        if (this.savedTeacher) {
          localStorage.setItem('ngs_custom_teacher', this.savedTeacher);
        }
        if (showNotification) {
          if (window.showToast) {
            window.showToast('បានរក្សាទុកកាលបរិច្ឆេទ ថ្នាក់ និងគ្រូបង្រៀនដោយជោគជ័យ! 🎉', 'success');
          } else {
            alert('បានរក្សាទុកកាលបរិច្ឆេទ ថ្នាក់ និងគ្រូបង្រៀនដោយជោគជ័យ!');
          }
        }
      } catch (err) {
        console.error('Save failed:', err);
      }
    }

    resetCustomizations() {
      if (confirm('តើអ្នកពិតជាចង់កំណត់កាលបរិច្ឆេទ ថ្នាក់ និងគ្រូឡើងវិញទៅកាន់ទិន្នន័យដើមមែនទេ?')) {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem('ngs_custom_start_date');
        localStorage.removeItem('ngs_custom_sig_date');
        localStorage.removeItem('ngs_custom_class');
        localStorage.removeItem('ngs_custom_class_g8');
        localStorage.removeItem('ngs_custom_class_g12');
        localStorage.removeItem('ngs_custom_cadence');
        this.savedStartDate = '2026-11-05';
        this.savedSigDate = '2026-10-29';
        this.savedCadence = '2_days_skip_weekend';
        this.savedClass = this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_C1 & 8NGS_C2' : '១២A';
        this.plans = JSON.parse(JSON.stringify(window.NGS_LESSON_PLANS_DATA || []));
        this.render();
        if (window.showToast) {
          window.showToast('បានកំណត់ឡើងវិញរួចរាល់!', 'info');
        }
      }
    }

    setChapterFilter(ch) {
      this.activeChapter = ch;
      this.renderPlansList();
      // Update active pill style
      document.querySelectorAll('.chapter-filter-btn').forEach(btn => {
        const targetCh = btn.getAttribute('data-chapter');
        if (targetCh === ch) {
          btn.className = 'chapter-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 bg-purple-600 text-white shadow-purple-500/30';
        } else {
          btn.className = 'chapter-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100';
        }
      });
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
        this.saveCustomizations(false);
      }
    }

    updateClass(id, newClass) {
      const p = this.plans.find(item => item.id === id);
      if (p) {
        p.class_name = newClass;
        this.saveCustomizations(false);
      }
    }

    // Quick toggle for class checkboxes (e.g. 8NGS_C1, 8NGS_C2, 8NGS_B)
    toggleClassCheckbox(clsName) {
      const input = document.getElementById('batchClassInput');
      if (!input) return;
      const checkedBoxes = Array.from(document.querySelectorAll('.class-toggle-checkbox:checked')).map(cb => cb.value);
      if (checkedBoxes.length > 0) {
        if (checkedBoxes.length === 1) {
          input.value = checkedBoxes[0];
        } else if (checkedBoxes.length === 2) {
          input.value = `${checkedBoxes[0]} & ${checkedBoxes[1]}`;
        } else {
          input.value = `${checkedBoxes.slice(0, -1).join(', ')} & ${checkedBoxes[checkedBoxes.length - 1]}`;
        }
      }
      this.savedClass = input.value;
    }

    setClassPreset(clsStr) {
      const input = document.getElementById('batchClassInput');
      if (input) {
        input.value = clsStr;
        this.savedClass = clsStr;
      }
      // Sync checkboxes if matched
      document.querySelectorAll('.class-toggle-checkbox').forEach(cb => {
        cb.checked = clsStr.includes(cb.value);
      });
    }

    // Batch update dates, cadence, weekend exclusions, class, and teacher
    applyBatchSchedule() {
      const classInput = document.getElementById('batchClassInput');
      const dateInput = document.getElementById('batchStartDate');
      const sigInput = document.getElementById('batchSigDate');
      const stepInput = document.getElementById('batchStepDays');
      const teacherInput = document.getElementById('batchTeacherSelect');

      const selectedClass = classInput ? classInput.value.trim() : (this.savedClass || '8NGS_C1 & 8NGS_C2');
      const startDateStr = dateInput ? dateInput.value : (this.savedStartDate || '2026-11-05');
      const cadenceMode = stepInput ? stepInput.value : (this.savedCadence || '2_days_skip_weekend');
      const teacherName = teacherInput ? teacherInput.value : (this.savedTeacher || 'នួន បូណង');

      let selectedSigDate = sigInput ? sigInput.value : (this.savedSigDate || '2026-10-29');
      if (!selectedSigDate && startDateStr) {
        const p = startDateStr.split('-');
        const sD = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10) - 7);
        const sy = sD.getFullYear();
        const sm = String(sD.getMonth() + 1).padStart(2, '0');
        const sd = String(sD.getDate()).padStart(2, '0');
        selectedSigDate = `${sy}-${sm}-${sd}`;
      }

      if (!startDateStr) {
        alert('សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម!');
        return;
      }

      const visiblePlans = this.getFilteredPlans();
      if (visiblePlans.length === 0) {
        alert('មិនមានកិច្ចតែងការដើម្បីកំណត់!');
        return;
      }

      // Save custom start date, signature date, class, teacher, and cadence into memory & localStorage
      this.savedStartDate = startDateStr;
      this.savedSigDate = selectedSigDate;
      this.savedClass = selectedClass;
      this.savedCadence = cadenceMode;
      this.savedTeacher = teacherName;

      try {
        localStorage.setItem('ngs_custom_start_date', startDateStr);
        localStorage.setItem('ngs_custom_sig_date', selectedSigDate);
        localStorage.setItem('ngs_custom_class', selectedClass);
        if (this.selectedGrade === 'ថ្នាក់ទី ៨') {
          localStorage.setItem('ngs_custom_class_g8', selectedClass);
        } else if (this.selectedGrade === 'ថ្នាក់ទី ១២') {
          localStorage.setItem('ngs_custom_class_g12', selectedClass);
        }
        localStorage.setItem('ngs_custom_cadence', cadenceMode);
        localStorage.setItem('ngs_custom_teacher', teacherName);
      } catch (e) {}

      const parts = startDateStr.split('-');
      let curDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

      // Rule: STRICTLY EXCLUDE SATURDAY (6) AND SUNDAY (0)
      // If start date is Saturday (6), advance +2 to Monday (1)
      if (curDate.getDay() === 6) {
        curDate.setDate(curDate.getDate() + 2);
      }
      // If start date is Sunday (0), advance +1 to Monday (1)
      else if (curDate.getDay() === 0) {
        curDate.setDate(curDate.getDate() + 1);
      }

      let stepToggle = 0;

      visiblePlans.forEach((p, idx) => {
        p.class_name = selectedClass;
        p.teacher = teacherName;
        const y = curDate.getFullYear();
        const m = String(curDate.getMonth() + 1).padStart(2, '0');
        const d = String(curDate.getDate()).padStart(2, '0');
        p.date = `${y}-${m}-${d}`;
        p.date_khmer = formatKhmerDate(p.date, true);
        p.sig_date = selectedSigDate;
        p.sig_date_khmer = formatKhmerDate(selectedSigDate, false);

        // Advance date with STRICT Weekend Exclusion (Saturday & Sunday skipped)
        if (cadenceMode === '2_days_skip_weekend') {
          // Add 2 days: Friday -> Sunday(+2) -> Monday(+1). Skip Sat & Sun!
          curDate.setDate(curDate.getDate() + 2);
          if (curDate.getDay() === 6) {
            curDate.setDate(curDate.getDate() + 2); // Sat -> Mon (+2)
          } else if (curDate.getDay() === 0) {
            curDate.setDate(curDate.getDate() + 1); // Sun -> Mon (+1)
          }
        } else if (cadenceMode === 'alt_1_2_days') {
          // Alternating 1 school day and 2 school days in a week
          // e.g. Mon -> Tue (+1), Tue -> Thu (+2), Thu -> Fri (+1), Fri -> Mon (+3)
          const step = (stepToggle % 2 === 0) ? 1 : 2;
          stepToggle++;
          curDate.setDate(curDate.getDate() + step);
          if (curDate.getDay() === 6) {
            curDate.setDate(curDate.getDate() + 2); // Sat -> Mon
          } else if (curDate.getDay() === 0) {
            curDate.setDate(curDate.getDate() + 1); // Sun -> Mon
          }
        } else if (cadenceMode === 'mon_wed_fri') {
          // Target days: Monday(1), Wednesday(3), Friday(5)
          do {
            curDate.setDate(curDate.getDate() + 1);
          } while (![1, 3, 5].includes(curDate.getDay()));
        } else if (cadenceMode === 'tue_thu') {
          // Target days: Tuesday(2), Thursday(4)
          do {
            curDate.setDate(curDate.getDate() + 1);
          } while (![2, 4].includes(curDate.getDay()));
        } else if (cadenceMode === 'daily_weekdays') {
          // Daily Mon-Fri (Skip Sat & Sun)
          curDate.setDate(curDate.getDate() + 1);
          if (curDate.getDay() === 6) {
            curDate.setDate(curDate.getDate() + 2);
          } else if (curDate.getDay() === 0) {
            curDate.setDate(curDate.getDate() + 1);
          }
        } else if (cadenceMode === 'weekly') {
          // Weekly (+7 days)
          curDate.setDate(curDate.getDate() + 7);
          if (curDate.getDay() === 6) {
            curDate.setDate(curDate.getDate() + 2);
          } else if (curDate.getDay() === 0) {
            curDate.setDate(curDate.getDate() + 1);
          }
        } else {
          // Fallback interval
          curDate.setDate(curDate.getDate() + 2);
          if (curDate.getDay() === 6) curDate.setDate(curDate.getDate() + 2);
          else if (curDate.getDay() === 0) curDate.setDate(curDate.getDate() + 1);
        }
      });

      this.saveCustomizations(false);
      this.render();
      if (window.showToast) {
        window.showToast(`✓ បានកំណត់កាលវិភាគ ${formatKhmerDate(startDateStr)} (លើកលែងសៅរ៍-អាទិត្យ) ជូន ${visiblePlans.length} មេរៀន សម្រាប់ ${selectedClass} (${teacherName}) រួចរាល់! 🎉`, 'success');
      }
    }

    getFilteredPlans() {
      return this.plans.filter(p => {
        const matchesGrade = p.grade === this.selectedGrade;
        const matchesChapter = this.activeChapter === 'all' || p.chapter_code === this.activeChapter;
        const matchesSearch = !this.searchQuery ||
          (p.lesson_title && p.lesson_title.toLowerCase().includes(this.searchQuery)) ||
          (p.topic && p.topic.toLowerCase().includes(this.searchQuery)) ||
          (p.chapter && p.chapter.toLowerCase().includes(this.searchQuery)) ||
          (p.class_name && p.class_name.toLowerCase().includes(this.searchQuery));
        return matchesGrade && matchesChapter && matchesSearch;
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

        const existingPdfBytes = await fetch(plan.pdf_file).then(res => {
          if (!res.ok) throw new Error('Network error loading PDF');
          return res.arrayBuffer();
        });

        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
        const pages = pdfDoc.getPages();

        if (pages.length > 0) {
          const page = pages[plan.cover_page_index || 0];
          const pageH = page.getHeight();
          const y_top = plan.box_y0 || 172.0;
          const box_h = 24.0;
          const y_bottom = pageH - y_top - box_h;

          // Render dynamic Khmer date via Canvas for crisp Khmer font
          const dateCanvas = document.createElement('canvas');
          dateCanvas.width = 900;
          dateCanvas.height = 70;
          const ctx = dateCanvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, dateCanvas.width, dateCanvas.height);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 36px "Khmer OS Siemreap", "Noto Sans Khmer", "Khmer OS", sans-serif';
          ctx.fillText(':   ' + plan.date_khmer, 10, 50);

          const datePngUrl = dateCanvas.toDataURL('image/png');
          const datePngBytes = await fetch(datePngUrl).then(res => res.arrayBuffer());
          const dateImg = await pdfDoc.embedPng(datePngBytes);

          // Whiteout old date box
          page.drawRectangle({
            x: 130.92,
            y: y_bottom,
            width: 320,
            height: box_h,
            color: PDFLib.rgb(1, 1, 1),
          });

          // Draw customized date
          page.drawImage(dateImg, {
            x: 130.92,
            y: y_bottom,
            width: 286.0,
            height: box_h,
          });

          // Also update Class if customized
          if (plan.class_name) {
            const classCanvas = document.createElement('canvas');
            classCanvas.width = 400;
            classCanvas.height = 80;
            const cctx = classCanvas.getContext('2d');
            cctx.fillStyle = '#ffffff';
            cctx.fillRect(0, 0, classCanvas.width, classCanvas.height);
            cctx.fillStyle = '#000000';
            cctx.font = 'bold 34px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
            cctx.fillText(':   ' + plan.class_name, 10, 55);

            const classPngUrl = classCanvas.toDataURL('image/png');
            const classPngBytes = await fetch(classPngUrl).then(res => res.arrayBuffer());
            const classImg = await pdfDoc.embedPng(classPngBytes);

            const class_y_top = plan.class_y0 || 77.9;
            const class_y_bottom = pageH - class_y_top - 18.0;

            page.drawRectangle({
              x: 226,
              y: class_y_bottom,
              width: 120,
              height: 18.0,
              color: PDFLib.rgb(1, 1, 1),
            });
            page.drawImage(classImg, {
              x: 226,
              y: class_y_bottom,
              width: 100.0,
              height: 18.0,
            });
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
        console.warn('PDF modification error, opening directly:', err);
        window.open(plan.pdf_file, '_blank');
      }
    }

    render() {
      const container = document.getElementById('tab-lessonplans');
      if (!container) return;

      const currentGrade = this.selectedGrade || 'ថ្នាក់ទី ៨';
      const gradePlans = this.plans.filter(p => p.grade === currentGrade);
      const totalGradePlans = gradePlans.length;

      // Extract unique chapters for current grade
      const chapterMap = {};
      gradePlans.forEach(p => {
        if (!chapterMap[p.chapter_code]) {
          chapterMap[p.chapter_code] = {
            code: p.chapter_code,
            title: p.chapter,
            count: 0
          };
        }
        chapterMap[p.chapter_code].count++;
      });
      const gradeChapters = Object.values(chapterMap);

      // Define grades for navigation
      const gradesList = [
        { id: 'ថ្នាក់ទី ៧', label: 'ថ្នាក់ទី ៧', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ៨', label: 'ថ្នាក់ទី ៨', count: 72, status: 'active', icon: '⚡' },
        { id: 'ថ្នាក់ទី ៩', label: 'ថ្នាក់ទី ៩', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ១០', label: 'ថ្នាក់ទី ១០', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ១១', label: 'ថ្នាក់ទី ១១', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ១២', label: 'ថ្នាក់ទី ១២', count: 37, status: 'active', icon: '⭐' }
      ];

      // Available classes and terminology based on grade
      const isGrade8 = currentGrade === 'ថ្នាក់ទី ៨';
      const unitLabel = isGrade8 ? 'មេរៀន' : 'ជំពូក';
      const defaultClasses = isGrade8
        ? ['8NGS_C1', '8NGS_C2', '8NGS_B']
        : ['១២A', '១២B', '១២C', '១២D'];

      container.innerHTML = `
        <!-- Grade Navigation Selector Bar -->
        <div class="card-soft p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm border border-slate-200/80 dark:border-slate-700/80">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <i class="fa-solid fa-layer-group text-purple-600"></i> កម្រិតថ្នាក់បង្រៀន៖
              </span>
            </div>

            <!-- Grade Pills -->
            <div class="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              ${gradesList.map(g => {
                const isSelected = currentGrade === g.id;
                const hasPlans = g.count > 0;
                return `
                  <button onclick="window.lessonPlansManager.setGrade('${g.id}')"
                    class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 scale-105'
                        : hasPlans
                          ? 'bg-purple-50 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-slate-600 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-slate-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 border border-transparent'
                    }">
                    <span>${g.label}</span>
                    ${hasPlans
                      ? `<span class="px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/30 text-white' : 'bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200'}">${toKhmerNum(g.count)}</span>`
                      : `<span class="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-500">ឆាប់ៗ</span>`
                    }
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Top Banner: School & Co-Teaching Profiles -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-sky-900 p-6 md:p-8 text-white shadow-xl">
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
                  កិច្ចតែងការបង្រៀនគណិតវិទ្យា${currentGrade}
                </h1>
                <p class="text-xs md:text-sm text-purple-100 max-w-2xl leading-relaxed">
                  រៀបចំនិងបង្រៀនដោយ <strong>${this.savedTeacher.includes('សុភារី') ? 'អ្នកគ្រូ ថោង សុភារី' : 'លោកគ្រូ នួន បូណង'}</strong> តាមស្តង់ដារគុណវុឌ្ឍិ ៥ ជំហានបង្រៀន NGS
                  (៥០/៥០ ពិន្ទុ) ពេញលេញចំនួន ${toKhmerNum(gradeChapters.length)} ${unitLabel} ស្របតាមសៀវភៅសិក្សាគោល និងកម្រងសំណួរ MoEYS។
                </p>
              </div>
            </div>

            <!-- Statistics Badges & Teacher Switcher Quick Pill -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 self-end md:self-center">
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center min-w-[85px]">
                <span class="block text-2xl font-black text-amber-300">${toKhmerNum(totalGradePlans)}</span>
                <span class="text-[11px] text-purple-200 uppercase tracking-wider">កិច្ចតែងការ</span>
              </div>
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center min-w-[85px]">
                <span class="block text-2xl font-black text-emerald-300">${toKhmerNum(gradeChapters.length)}</span>
                <span class="text-[11px] text-purple-200 uppercase tracking-wider">${unitLabel}</span>
              </div>
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center min-w-[85px]">
                <span class="block text-2xl font-black text-sky-300">100%</span>
                <span class="text-[11px] text-purple-200 uppercase tracking-wider">បានឯកភាព</span>
              </div>
            </div>
          </div>
        </div>

        ${totalGradePlans === 0 ? `
          <!-- Placeholder State for Grades without uploaded plans yet -->
          <div class="card-soft p-12 text-center space-y-4 bg-white dark:bg-slate-800 border-2 border-dashed border-purple-200 dark:border-slate-700">
            <div class="w-20 h-20 mx-auto rounded-3xl bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-300 flex items-center justify-center text-4xl shadow-inner">
              📚
            </div>
            <div class="space-y-1">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white">
                កិច្ចតែងការបង្រៀនគណិតវិទ្យា ${currentGrade}
              </h3>
              <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                ចំណងជើង និងទម្រង់កិច្ចតែងការសម្រាប់ ${currentGrade} ត្រូវបានរៀបចំរួចរាល់។ ឯកសារលម្អិតកំពុងត្រូវបាន Update បន្ថែមស្របតាមកម្មវិធីសិក្សា MoEYS។
              </p>
            </div>
            <div class="flex items-center justify-center gap-3 pt-2">
              <button onclick="window.lessonPlansManager.setGrade('ថ្នាក់ទី ៨')" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2">
                <span>⚡ ចូលមើល ថ្នាក់ទី ៨ (៧២ កិច្ចតែងការ)</span>
              </button>
              <button onclick="window.lessonPlansManager.setGrade('ថ្នាក់ទី ១២')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2">
                <span>⭐ ចូលមើល ថ្នាក់ទី ១២ (៣៧ កិច្ចតែងការ)</span>
              </button>
            </div>
          </div>
        ` : `
          <!-- Chapter Filter Tabs & Download Hub -->
          <div class="card-soft p-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2 max-w-4xl">
              <button onclick="window.lessonPlansManager.setChapterFilter('all')" data-chapter="all"
                class="chapter-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${this.activeChapter === 'all' ? 'bg-purple-600 text-white shadow-purple-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100'}">
                <span>🌟 ទាំងអស់</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] ${this.activeChapter === 'all' ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700'}">${toKhmerNum(totalGradePlans)}</span>
              </button>
              ${gradeChapters.map(ch => `
                <button onclick="window.lessonPlansManager.setChapterFilter('${ch.code}')" data-chapter="${ch.code}"
                  class="chapter-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 ${this.activeChapter === ch.code ? 'bg-purple-600 text-white shadow-purple-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100'}">
                  <span>${ch.title.split(' ៖ ')[0] || ch.title}</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] ${this.activeChapter === ch.code ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700'}">${toKhmerNum(ch.count)}</span>
                </button>
              `).join('')}
            </div>

            <!-- Official Chapter Files Download Hub -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-slate-400 font-bold hidden sm:inline">ឯកសារដើម NGS:</span>
              ${isGrade8 ? `
                <div class="dropdown relative group">
                  <button class="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 border border-purple-200 dark:border-slate-700 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition">
                    <i class="fa-solid fa-book-open text-purple-600"></i> សៀវភៅថ្នាក់ទី៨ ពេញ <i class="fa-solid fa-chevron-down text-[10px]"></i>
                  </button>
                  <div class="absolute right-0 top-full mt-1 hidden group-hover:block bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-2 z-30 min-w-[270px]">
                    <a href="កិច្ចការតែងការទី៨/សៀវភៅកិច្ចតែងការបង្រៀនគណិតវិទ្យាថ្នាក់ទី៨ all.docx" download class="block px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
                      📝 សៀវភៅកិច្ចតែងការថ្នាក់ទី៨ ពេញ (Word all)
                    </a>
                    <a href="កិច្ចការតែងការទី៨/សៀវភៅកិច្ចតែងការបង្រៀនគណិតវិទ្យាថ្នាក់ទី៨.pdf" target="_blank" download class="block px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
                      📄 សៀវភៅកិច្ចតែងការថ្នាក់ទី៨ ពេញ (PDF)
                    </a>
                    <div class="my-1 border-t border-slate-100 dark:border-slate-700"></div>
                    <a href="កិច្ចការតែងការទី៨/សៀវភៅកិច្ចតែងការបង្រៀនគណិតវិទ្យាថ្នាក់ទី៨ 1.docx" download class="block px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                      📝 ភាគទី ១ (Word)
                    </a>
                    <a href="កិច្ចការតែងការទី៨/សៀវភៅកិច្ចតែងការបង្រៀនគណិតវិទ្យាថ្នាក់ទី៨ 2.docx" download class="block px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                      📝 ភាគទី ២ (Word)
                    </a>
                    <a href="កិច្ចការតែងការទី៨/សៀវភៅកិច្ចតែងការបង្រៀនគណិតវិទ្យាថ្នាក់ទី៨ 3.docx" download class="block px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                      📝 ភាគទី ៣ (Word)
                    </a>
                  </div>
                </div>
              ` : `
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
              `}
            </div>
          </div>

          <!-- Interactive Batch Editor & Schedule Toolbar -->
          <div class="card-soft p-5 bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-pink-50/60 dark:from-slate-800 dark:to-slate-800/80 border-purple-200 dark:border-slate-700 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="text-sm font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                  <i class="fa-solid fa-calendar-days text-purple-600"></i> កំណត់កាលវិភាគ គ្រូបង្រៀន & ថ្នាក់បង្រៀនរហ័ស (Batch Customizer)
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

            <!-- Controls Grid: Teacher, Multi-Class, Start Date, Signature Date, Cadence -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end pt-1">
              
              <!-- 1. Teacher Selector (Nuon Bonorng or Thaong Sophary) -->
              <div>
                <label class="block text-[11px] font-bold text-purple-800 dark:text-purple-300 mb-1">
                  👨‍🏫 គ្រូបង្រៀន (Teacher Switcher):
                </label>
                <select id="batchTeacherSelect" onchange="window.lessonPlansManager.setTeacher(this.value)"
                  class="w-full px-3 py-2 rounded-xl border border-purple-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-sm focus:outline-none focus:border-purple-500">
                  <option value="នួន បូណង" ${this.savedTeacher === 'នួន បូណង' ? 'selected' : ''}>👨‍🏫 លោកគ្រូ នួន បូណង</option>
                  <option value="ថោង សុភារី" ${this.savedTeacher === 'ថោង សុភារី' ? 'selected' : ''}>👩‍🏫 អ្នកគ្រូ ថោង សុភារី</option>
                </select>
              </div>

              <!-- 2. Class Selector & Multi-Class Customizer -->
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  🎓 ថ្នាក់បង្រៀន (១, ២ ឬ ៣ ថ្នាក់):
                </label>
                <div class="relative">
                  <input type="text" id="batchClassInput" value="${this.savedClass || (isGrade8 ? '8NGS_C1 & 8NGS_C2' : '១២A')}"
                    class="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500"
                    placeholder="ឧ. 8NGS_C1 & 8NGS_C2">
                </div>
              </div>

              <!-- 3. Start Date Picker (Cover) -->
              <div>
                <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  📅 ថ្ងៃចាប់ផ្តើម (ក្បាលកិច្ច - លើ):
                </label>
                <input type="date" id="batchStartDate" value="${this.savedStartDate || '2026-11-05'}"
                  onchange="window.lessonPlansManager.onStartDateChange(this.value)"
                  class="w-full px-3 py-1.5 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
              </div>

              <!-- 4. Signature Date Picker (Bottom - identical for all) -->
              <div>
                <label class="block text-[11px] font-bold text-purple-700 dark:text-purple-300 mb-1">
                  ✍️ ថ្ងៃចុះហត្ថលេខា (ផ្នែកក្រោម):
                </label>
                <input type="date" id="batchSigDate" value="${this.savedSigDate || '2026-10-29'}"
                  class="w-full px-3 py-1.5 rounded-xl border border-purple-300 dark:border-slate-600 bg-purple-50/50 dark:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-sm focus:outline-none focus:border-purple-500">
              </div>

              <!-- 5. Cadence Step with Weekend Exclusions -->
              <div>
                <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  ⏱️ គម្លាតថ្ងៃ (Cadence & លើកលែង):
                </label>
                <select id="batchStepDays" class="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
                  <option value="2_days_skip_weekend" ${this.savedCadence === '2_days_skip_weekend' ? 'selected' : ''}>
                    ២ ថ្ងៃម្តង (លើកលែង សៅរ៍-អាទិត្យ · សុក្រទៅចន្ទ)
                  </option>
                  <option value="alt_1_2_days" ${this.savedCadence === 'alt_1_2_days' ? 'selected' : ''}>
                    រំលង ១ថ្ងៃ ផង ២ថ្ងៃ ផង (លើកលែង សៅរ៍-អាទិត្យ)
                  </option>
                  <option value="mon_wed_fri" ${this.savedCadence === 'mon_wed_fri' ? 'selected' : ''}>
                    ចន្ទ - ពុធ - សុក្រ (៣ ថ្ងៃ/សប្តាហ៍)
                  </option>
                  <option value="tue_thu" ${this.savedCadence === 'tue_thu' ? 'selected' : ''}>
                    អង្គារ - ព្រហស្បតិ៍ (២ ថ្ងៃ/សប្តាហ៍)
                  </option>
                  <option value="daily_weekdays" ${this.savedCadence === 'daily_weekdays' ? 'selected' : ''}>
                    រាល់ថ្ងៃចន្ទ ដល់ សុក្រ (លើកលែង សៅរ៍-អាទិត្យ)
                  </option>
                  <option value="weekly" ${this.savedCadence === 'weekly' ? 'selected' : ''}>
                    រៀងរាល់ ១ សប្តាហ៍ម្តង (+៧ ថ្ងៃ)
                  </option>
                </select>
              </div>
            </div>

            <!-- Quick Class Selectors & Apply Action -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
              <!-- Class Toggle Pills -->
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <span class="font-bold text-slate-500 dark:text-slate-400 text-[11px]">ជ្រើសរើសរហ័ស៖</span>
                ${isGrade8 ? `
                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                    8NGS_C1
                  </button>
                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                    8NGS_C2
                  </button>
                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                    8NGS_B
                  </button>
                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1 & 8NGS_C2')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">
                    8NGS_C1 & 8NGS_C2 (២ ថ្នាក់)
                  </button>
                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1, 8NGS_C2 & 8NGS_B')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">
                    8NGS_C1, 8NGS_C2 & 8NGS_B (៣ ថ្នាក់)
                  </button>
                ` : `
                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២A')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                    ១២A
                  </button>
                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                    ១២B
                  </button>
                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២A & ១២B')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">
                    ១២A & ១២B (២ ថ្នាក់)
                  </button>
                `}
              </div>

              <!-- Apply Button -->
              <div>
                <button onclick="window.lessonPlansManager.applyBatchSchedule()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> បំពេញស្វ័យប្រវត្តិតាមកាលវិភាគ
                </button>
              </div>
            </div>

            <!-- Helpful Information Badge -->
            <div class="mt-2 pt-2 border-t border-purple-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
              <span>💡 <strong>របៀបគណនា៖</strong> លើកលែងថ្ងៃសៅរ៍ និងអាទិត្យដោយស្វ័យប្រវត្តិ (ថ្ងៃសុក្រ នឹងរំលងទៅថ្ងៃចន្ទវិញ រួចទៅពុធ...)។ ឈ្មោះគ្រូ៖ <strong>${this.savedTeacher}</strong>។</span>
              ${this.savedStartDate ? `<span class="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold px-2.5 py-0.5 rounded-lg border border-purple-200">📌 ចាប់ផ្តើម៖ ${formatKhmerDate(this.savedStartDate)} · ចុះហត្ថលេខា៖ ${formatKhmerDate(this.savedSigDate || '2026-10-29', false)}</span>` : ''}
            </div>
          </div>

          <!-- Search Bar -->
          <div class="relative">
            <input type="text"
              oninput="window.lessonPlansManager.setSearchQuery(this.value)"
              placeholder="🔍 ស្វែងរកកិច្ចតែងការ ${currentGrade} តាមចំណងជើង ខ្លឹមសារ ឬ${unitLabel}..."
              class="w-full px-4 py-2.5 pl-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
          </div>

          <!-- Lesson Plans Cards Container -->
          <div id="lessonPlansListContainer" class="space-y-4">
            <!-- Populated by renderPlansList -->
          </div>
        `}

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
                  <i class="fa-solid fa-file-arrow-down"></i> ទាញយក PDF
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

      if (totalGradePlans > 0) {
        this.renderPlansList();
      }
    }

    renderPlansList() {
      const container = document.getElementById('lessonPlansListContainer');
      if (!container) return;

      const currentGrade = this.selectedGrade || 'ថ្នាក់ទី ៨';
      const unitLabel = currentGrade === 'ថ្នាក់ទី ៨' ? 'មេរៀន' : 'ជំពូក';
      const filtered = this.getFilteredPlans();

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="card-soft p-12 text-center text-slate-400 space-y-2">
            <div class="text-4xl">🔍</div>
            <p class="font-bold text-sm">រកមិនឃើញកិច្ចតែងការដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ</p>
            <p class="text-xs">សូមសាកល្បងពាក្យគន្លឹះផ្សេង ឬចុចមើលគ្រប់${unitLabel}</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(p => {
        const chColor = 'purple';
        return `
          <div class="card-soft p-5 border-l-4 border-l-purple-500 hover:shadow-md transition space-y-3">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <!-- Left Info -->
              <div class="flex items-start gap-3.5">
                <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-lg font-black shrink-0">
                  ${toKhmerNum(p.ch_lesson_num)}
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                      ${p.chapter}
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                      ✓ ${p.status}
                    </span>
                    <span class="text-[11px] text-slate-400 font-mono">
                      ⏱️ ${p.duration} · ${p.grade === 'ថ្នាក់ទី ៨' ? 'ម៉ោងទី ' + toKhmerNum(p.ch_lesson_num) : 'ស្តង់ដារ ៥ ជំហាន NGS'} (ពិន្ទុ ${p.score}/50)
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
                ${this.hasMatchingSlide(p) ? `
                <button onclick="window.lessonPlansManager.openSlideForPlan('${p.id}')"
                  class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition" title="ចាក់ស្លាយបង្រៀនសម្រាប់មេរៀននេះ">
                  <i class="fa-solid fa-person-chalkboard"></i> <span class="hidden sm:inline">ស្លាយ</span>
                </button>
                ` : ''}
                <button onclick="window.lessonPlansManager.downloadCustomPdf('${p.id}')"
                  class="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm" title="ទាញយក PDF">
                  <i class="fa-solid fa-file-arrow-down"></i> <span class="hidden sm:inline">ទាញយក PDF</span>
                </button>
                <a href="${p.docx_file}" download
                  class="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold transition flex items-center gap-1" title="ទាញយកឯកសារ Word">
                  <i class="fa-solid fa-file-word"></i>
                </a>
              </div>
            </div>

            <!-- Inline Editable Date & Class Row -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/60 dark:bg-slate-800/40 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
              <div class="flex flex-wrap items-center gap-4">
                <!-- Editable Class Field -->
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-slate-600 dark:text-slate-400">🎓 ថ្នាក់៖</span>
                  <input type="text" value="${p.class_name}"
                    onchange="window.lessonPlansManager.updateClass('${p.id}', this.value)"
                    class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 font-extrabold text-purple-700 dark:text-purple-300 text-xs focus:outline-none focus:border-purple-500 w-36 sm:w-44">
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

              <!-- Teacher Display & Switcher -->
              <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <i class="fa-solid fa-user-tie text-purple-600"></i>
                <span>គ្រូបង្រៀន៖ <strong class="text-slate-800 dark:text-slate-200">${p.teacher}</strong></span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    hasMatchingSlide(plan) {
      if (!window.NGS_TEACHING_SLIDES_DATA) return false;
      return (plan && (plan.grade === 'ថ្នាក់ទី ១២' || plan.grade === 'ថ្នាក់ទី 12') && (plan.chapter_code === 'ch1' || plan.chapter_code === 'ch2'));
    }

    openSlideForPlan(planId) {
      const plan = this.plans.find(p => p.id === planId);
      if (!plan) return;
      let targetSlideId = 'ch1_l1';
      if (plan.chapter_code === 'ch1') {
        if (plan.ch_lesson_num <= 4) targetSlideId = 'ch1_l1';
        else if (plan.ch_lesson_num <= 8) targetSlideId = 'ch1_l2';
        else targetSlideId = 'ch1_l3';
      } else if (plan.chapter_code === 'ch2') {
        if (plan.ch_lesson_num <= 6) targetSlideId = 'ch2_l1';
        else targetSlideId = 'ch2_l2';
      }
      if (window.teachingSlidesManager) {
        window.teachingSlidesManager.openPresenter(targetSlideId);
      }
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

      const teacherTitle = p.teacher.includes('សុភារី') ? 'អ្នកគ្រូ' : 'លោកគ្រូ';

      titleEl.innerText = `${p.chapter} ៖ ${p.lesson_title}`;
      subEl.innerText = `${p.grade} · ថ្នាក់ ${p.class_name} · ${p.date_khmer} · គ្រូបង្រៀន៖ ${teacherTitle} ${p.teacher} · វិទ្យាល័យព្រះយុគន្ធរ NGS`;

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
                កិច្ចតែងការបង្រៀនគណិតវិទ្យា (${p.grade} · ស្តង់ដារ ៥ ជំហាន NGS)
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
              <span class="block text-slate-400 font-bold">${p.grade === 'ថ្នាក់ទី ៨' ? 'មេរៀន ៖' : 'ជំពូក & មេរៀន៖'}</span>
              <strong class="text-slate-800 dark:text-slate-200">${p.chapter}</strong>
            </div>
            <div class="bg-white dark:bg-slate-700 p-2.5 rounded-xl border border-purple-100 dark:border-slate-600 md:col-span-2">
              <span class="block text-slate-400 font-bold">គ្រូបង្រៀនទទួលបន្ទុក៖</span>
              <strong class="text-slate-800 dark:text-slate-200">${teacherTitle} ${p.teacher}</strong>
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

        <!-- Official Signatures Block -->
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

            <!-- Right: Assigned Teacher -->
            <div class="space-y-10 col-span-2 md:col-span-1">
              <div>
                <p class="font-extrabold text-slate-800 dark:text-white">គ្រូបង្រៀនគណិតវិទ្យា</p>
                <p class="text-purple-600 font-bold">វិទ្យាល័យព្រះយុគន្ធរ NGS</p>
              </div>
              <div>
                <strong class="text-purple-800 dark:text-purple-300 text-sm">${teacherTitle} ${p.teacher}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Embedded PDF Viewer Option -->
        <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
          <details class="group bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-600">
            <summary class="font-bold text-xs text-purple-700 dark:text-purple-300 cursor-pointer flex items-center justify-between">
              <span>📄 មើលឯកសារ PDF ដើម (${p.pdf_file})</span>
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
