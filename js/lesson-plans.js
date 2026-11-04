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

  // Base64-embedded Yukunthor School Logo (Offline, 100% reliable)
  const YUKUNTHOR_LOGO_B64 = "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";

  // Helper to convert Base64 string to Uint8Array synchronously (no fetch needed)
  function b64ToUint8(b64) {
    const cleanB64 = b64.includes(',') ? b64.split(',')[1] : b64;
    const bin = atob(cleanB64);
    const len = bin.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);
    return u8;
  }

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
      this.storageKey = 'ngs_custom_lesson_plans_v8_2';

      // Co-teaching support: Nuon Bonorng or Thaong Sophary
      this.savedTeacher = localStorage.getItem('ngs_custom_teacher') || 'នួន បូណង';

      // Schedule settings (Defaulting to Semester 1: 19 Oct 2026 to 20 Feb 2027)
      const rawStart = localStorage.getItem('ngs_custom_start_date');
      this.savedStartDate = (!rawStart || rawStart === '2026-11-05') ? '2026-10-19' : rawStart;
      this.savedEndDate = localStorage.getItem('ngs_custom_end_date') || '2027-02-20';
      const rawSig = localStorage.getItem('ngs_custom_sig_date');
      this.savedSigDate = (!rawSig || rawSig === '2026-10-29') ? '2026-10-12' : rawSig;
      const defaultClassForGrade = (g) => {
        if (g === 'ថ្នាក់ទី ៨') return '8NGS_B2';
        if (g === 'ថ្នាក់ទី ១១') return '11NGS_P1 & 11NGS_C2';
        return '១២A & ១២B';
      };
      const gradeClassKey = 'ngs_custom_class_' + (this.selectedGrade === 'ថ្នាក់ទី ៨' ? 'g8' : (this.selectedGrade === 'ថ្នាក់ទី ១១' ? 'g11' : 'g12'));
      this.savedClass = localStorage.getItem(gradeClassKey) || localStorage.getItem('ngs_custom_class') || defaultClassForGrade(this.selectedGrade);
      this.savedCadence = localStorage.getItem('ngs_custom_cadence') || 'auto_fit_range';
      this.selectedWeekdays = JSON.parse(localStorage.getItem('ngs_custom_weekdays') || '[1, 3, 5]'); // Mon, Wed, Fri

      // Print & Save PDF Hub state
      this.printHubActiveTab = 'single';
      this.printHubSelectedSingleChapter = null;
      this.printHubSelectedChapters = new Set();
    }

    init() {
      const defaultData = window.NGS_LESSON_PLANS_DATA || [];
      // Deep clone default data
      this.plans = JSON.parse(JSON.stringify(defaultData));

      // Load saved settings & customizations from localStorage
      try {
        this.selectedGrade = localStorage.getItem('ngs_lp_active_grade') || 'ថ្នាក់ទី ៨';
        this.savedTeacher = localStorage.getItem('ngs_custom_teacher') || 'នួន បូណង';
        const rawStart = localStorage.getItem('ngs_custom_start_date');
        this.savedStartDate = (!rawStart || rawStart === '2026-11-05') ? '2026-10-19' : rawStart;
        this.savedEndDate = localStorage.getItem('ngs_custom_end_date') || '2027-02-20';
        const rawSig = localStorage.getItem('ngs_custom_sig_date');
        this.savedSigDate = (!rawSig || rawSig === '2026-10-29') ? '2026-10-12' : rawSig;
        const defaultClassForGrade = (g) => {
        if (g === 'ថ្នាក់ទី ៨') return '8NGS_B2';
        if (g === 'ថ្នាក់ទី ១១') return '11NGS_P1 & 11NGS_C2';
        return '១២A & ១២B';
      };
      const gradeClassKey = 'ngs_custom_class_' + (this.selectedGrade === 'ថ្នាក់ទី ៨' ? 'g8' : (this.selectedGrade === 'ថ្នាក់ទី ១១' ? 'g11' : 'g12'));
      this.savedClass = localStorage.getItem(gradeClassKey) || localStorage.getItem('ngs_custom_class') || defaultClassForGrade(this.selectedGrade);
        this.savedCadence = localStorage.getItem('ngs_custom_cadence') || 'auto_fit_range';

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

        // Sync default grade classes if not customized
        const savedG8Class = localStorage.getItem('ngs_custom_class_g8');
        const savedG12Class = localStorage.getItem('ngs_custom_class_g12');
        this.plans.forEach(p => {
          if (p.grade === 'ថ្នាក់ទី ៨' && savedG8Class) {
            if (!customMap || !customMap[p.id] || !customMap[p.id].class_name) {
              p.class_name = savedG8Class;
            }
          } else if (p.grade === 'ថ្នាក់ទី ១២' && savedG12Class) {
            if (!customMap || !customMap[p.id] || !customMap[p.id].class_name) {
              p.class_name = savedG12Class;
            }
          }
        });
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
        this.savedClass = localStorage.getItem('ngs_custom_class_g8') || '8NGS_B2';
      } else if (grade === 'ថ្នាក់ទី ១១') {
        this.savedClass = localStorage.getItem('ngs_custom_class_g11') || '11NGS_P1 & 11NGS_C2';
      } else if (grade === 'ថ្នាក់ទី ១២') {
        this.savedClass = localStorage.getItem('ngs_custom_class_g12') || '១២A & ១២B';
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
      try {
        localStorage.setItem('ngs_custom_start_date', val);
      } catch (e) {}
      const parts = val.split('-');
      const dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) - 7);
      const sy = dt.getFullYear();
      const sm = String(dt.getMonth() + 1).padStart(2, '0');
      const sd = String(dt.getDate()).padStart(2, '0');
      const sigInput = document.getElementById('batchSigDate');
      if (sigInput) {
        sigInput.value = `${sy}-${sm}-${sd}`;
        this.savedSigDate = sigInput.value;
        try { localStorage.setItem('ngs_custom_sig_date', this.savedSigDate); } catch (e) {}
      }
    }

    onEndDateChange(val) {
      if (!val) return;
      this.savedEndDate = val;
      try {
        localStorage.setItem('ngs_custom_end_date', val);
      } catch (e) {}
    }

    setSemesterPreset(startStr, endStr, cadence = 'auto_fit_range') {
      this.savedStartDate = startStr;
      this.savedEndDate = endStr;
      this.savedCadence = cadence;
      const parts = startStr.split('-');
      const dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) - 7);
      const sy = dt.getFullYear();
      const sm = String(dt.getMonth() + 1).padStart(2, '0');
      const sd = String(dt.getDate()).padStart(2, '0');
      this.savedSigDate = `${sy}-${sm}-${sd}`;

      try {
        localStorage.setItem('ngs_custom_start_date', this.savedStartDate);
        localStorage.setItem('ngs_custom_end_date', this.savedEndDate);
        localStorage.setItem('ngs_custom_sig_date', this.savedSigDate);
        localStorage.setItem('ngs_custom_cadence', this.savedCadence);
      } catch (e) {}
      this.render();
      this.applyBatchSchedule();
    }

    setCadencePreset(cadence) {
      this.savedCadence = cadence;
      try {
        localStorage.setItem('ngs_custom_cadence', cadence);
      } catch (e) {}
      const sel = document.getElementById('batchStepDays');
      if (sel) sel.value = cadence;
      this.applyBatchSchedule();
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
        if (this.savedEndDate) {
          localStorage.setItem('ngs_custom_end_date', this.savedEndDate);
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
        localStorage.removeItem('ngs_custom_end_date');
        localStorage.removeItem('ngs_custom_sig_date');
        localStorage.removeItem('ngs_custom_class');
        localStorage.removeItem('ngs_custom_class_g8');
        localStorage.removeItem('ngs_custom_class_g12');
        localStorage.removeItem('ngs_custom_cadence');
        this.savedStartDate = '2026-10-19';
        this.savedEndDate = '2027-02-20';
        this.savedSigDate = '2026-10-12';
        this.savedCadence = 'auto_fit_range';
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
        p.class_name = (newClass || '').trim();
        this.saveCustomizations(false);
      }
    }

    onBatchClassChange(val) {
      const cleanVal = (val || '').trim();
      this.savedClass = cleanVal;
      try {
        localStorage.setItem('ngs_custom_class', cleanVal);
        if (this.selectedGrade === 'ថ្នាក់ទី ៨') {
          localStorage.setItem('ngs_custom_class_g8', cleanVal);
        } else if (this.selectedGrade === 'ថ្នាក់ទី ១២') {
          localStorage.setItem('ngs_custom_class_g12', cleanVal);
        }
      } catch (e) {}

      // Update in memory plans for current grade
      if (cleanVal) {
        this.plans.forEach(p => {
          if (p.grade === this.selectedGrade) {
            p.class_name = cleanVal;
          }
        });
        this.saveCustomizations(false);

        // Update all visible card class inputs in DOM directly so user sees changes live!
        document.querySelectorAll('.card-class-input').forEach(inp => {
          inp.value = cleanVal;
        });
      }
    }

    // Quick toggle for class checkboxes (e.g. 8NGS_C1, 8NGS_C2, 8NGS_B)
    toggleClassCheckbox(clsName) {
      const input = document.getElementById('batchClassInput');
      if (!input) return;
      const checkedBoxes = Array.from(document.querySelectorAll('.class-toggle-checkbox:checked')).map(cb => cb.value);
      let clsStr = '';
      if (checkedBoxes.length > 0) {
        if (checkedBoxes.length === 1) {
          clsStr = checkedBoxes[0];
        } else if (checkedBoxes.length === 2) {
          clsStr = `${checkedBoxes[0]} & ${checkedBoxes[1]}`;
        } else {
          clsStr = `${checkedBoxes.slice(0, -1).join(', ')} & ${checkedBoxes[checkedBoxes.length - 1]}`;
        }
      } else {
        clsStr = clsName;
      }
      input.value = clsStr;
      this.onBatchClassChange(clsStr);
    }

    setClassPreset(clsStr) {
      const input = document.getElementById('batchClassInput');
      if (input) {
        input.value = clsStr;
      }
      this.onBatchClassChange(clsStr);
      // Sync checkboxes if matched
      document.querySelectorAll('.class-toggle-checkbox').forEach(cb => {
        cb.checked = clsStr.includes(cb.value);
      });
      if (window.showToast) {
        window.showToast(`✓ បានកំណត់ថ្នាក់បង្រៀនទៅ «${clsStr}» រួចរាល់! 🎉`, 'success');
      }
    }

    // Helper: calculate schedule dates strictly excluding weekends (Saturday & Sunday)
    calculateScheduleDates(startDateStr, endDateStr, cadenceMode, count) {
      if (count <= 0) return [];
      const sStr = startDateStr || this.savedStartDate || '2026-10-19';
      const sParts = sStr.split('-');
      let sDate = new Date(parseInt(sParts[0], 10), parseInt(sParts[1], 10) - 1, parseInt(sParts[2], 10));
      // Strict weekend exclusion on start date
      if (sDate.getDay() === 6) sDate.setDate(sDate.getDate() + 2); // Saturday -> Monday
      else if (sDate.getDay() === 0) sDate.setDate(sDate.getDate() + 1); // Sunday -> Monday

      let eDate = null;
      const eStr = endDateStr || this.savedEndDate || '2027-02-20';
      if (eStr) {
        const eParts = eStr.split('-');
        eDate = new Date(parseInt(eParts[0], 10), parseInt(eParts[1], 10) - 1, parseInt(eParts[2], 10));
        if (eDate.getDay() === 6) eDate.setDate(eDate.getDate() - 1); // Saturday -> Friday
        else if (eDate.getDay() === 0) eDate.setDate(eDate.getDate() - 2); // Sunday -> Friday
      }

      const toYMD = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      // 1. Auto-fit Range: spread uniformly across all school days between sDate and eDate
      if (cadenceMode === 'auto_fit_range' && eDate && eDate >= sDate) {
        const schoolDays = [];
        let cur = new Date(sDate);
        while (cur <= eDate) {
          const dow = cur.getDay();
          if (dow !== 0 && dow !== 6) {
            schoolDays.push(toYMD(cur));
          }
          cur.setDate(cur.getDate() + 1);
        }

        if (schoolDays.length === 0) {
          return Array(count).fill(toYMD(sDate));
        }
        if (count === 1) {
          return [schoolDays[0]];
        }
        if (schoolDays.length <= count) {
          const res = [];
          for (let i = 0; i < count; i++) {
            res.push(schoolDays[Math.min(i, schoolDays.length - 1)]);
          }
          return res;
        }

        const res = [];
        for (let i = 0; i < count; i++) {
          const idx = Math.round((i * (schoolDays.length - 1)) / (count - 1));
          res.push(schoolDays[idx]);
        }
        return res;
      }

      // 2. Step-based Cadence (with strict weekend skip)
      const result = [];
      let cur = new Date(sDate);
      let stepToggle = 0;

      for (let i = 0; i < count; i++) {
        result.push(toYMD(cur));
        if (i < count - 1) {
          if (cadenceMode === '1_day_skip_weekend' || cadenceMode === 'daily_weekdays') {
            cur.setDate(cur.getDate() + 1);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          } else if (cadenceMode === '2_days_skip_weekend') {
            cur.setDate(cur.getDate() + 2);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          } else if (cadenceMode === '3_days_skip_weekend') {
            cur.setDate(cur.getDate() + 3);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          } else if (cadenceMode === 'alt_1_2_days') {
            const step = (stepToggle % 2 === 0) ? 1 : 2;
            stepToggle++;
            cur.setDate(cur.getDate() + step);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          } else if (cadenceMode === 'mon_wed_fri') {
            do {
              cur.setDate(cur.getDate() + 1);
            } while (![1, 3, 5].includes(cur.getDay()));
          } else if (cadenceMode === 'tue_thu') {
            do {
              cur.setDate(cur.getDate() + 1);
            } while (![2, 4].includes(cur.getDay()));
          } else if (cadenceMode === 'weekly') {
            cur.setDate(cur.getDate() + 7);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          } else {
            cur.setDate(cur.getDate() + 2);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          }
        }
      }

      return result;
    }

    // Batch update dates, cadence, weekend exclusions, class, and teacher
    applyBatchSchedule() {
      const classInput = document.getElementById('batchClassInput');
      const dateInput = document.getElementById('batchStartDate');
      const endDateInput = document.getElementById('batchEndDate');
      const sigInput = document.getElementById('batchSigDate');
      const stepInput = document.getElementById('batchStepDays');
      const teacherInput = document.getElementById('batchTeacherSelect');

      const selectedClass = classInput ? classInput.value.trim() : (this.savedClass || '8NGS_C1 & 8NGS_C2');
      const startDateStr = dateInput ? dateInput.value : (this.savedStartDate || '2026-10-19');
      const endDateStr = endDateInput ? endDateInput.value : (this.savedEndDate || '2027-02-20');
      const cadenceMode = stepInput ? stepInput.value : (this.savedCadence || 'auto_fit_range');
      const teacherName = teacherInput ? teacherInput.value : (this.savedTeacher || 'នួន បូណង');

      let selectedSigDate = sigInput ? sigInput.value : (this.savedSigDate || '2026-10-12');
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

      // Save custom start date, end date, signature date, class, teacher, and cadence into memory & localStorage
      this.savedStartDate = startDateStr;
      this.savedEndDate = endDateStr;
      this.savedSigDate = selectedSigDate;
      this.savedClass = selectedClass;
      this.savedCadence = cadenceMode;
      this.savedTeacher = teacherName;

      try {
        localStorage.setItem('ngs_custom_start_date', startDateStr);
        localStorage.setItem('ngs_custom_end_date', endDateStr);
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

      // Calculate schedule dates with strict weekend exclusion (Saturday & Sunday skipped)
      const dateList = this.calculateScheduleDates(startDateStr, endDateStr, cadenceMode, visiblePlans.length);

      visiblePlans.forEach((p, idx) => {
        p.class_name = selectedClass;
        p.teacher = teacherName;
        p.date = dateList[idx] || dateList[dateList.length - 1];
        p.date_khmer = formatKhmerDate(p.date, true);
        p.sig_date = selectedSigDate;
        p.sig_date_khmer = formatKhmerDate(selectedSigDate, false);
      });

      this.saveCustomizations(false);
      this.render();
      if (window.showToast) {
        const firstD = dateList[0] ? formatKhmerDate(dateList[0], true) : '';
        const lastD = dateList[dateList.length - 1] ? formatKhmerDate(dateList[dateList.length - 1], true) : '';
        window.showToast(`✓ បានកំណត់កាលវិភាគ ${firstD} ដល់ ${lastD} (លើកលែងសៅរ៍-អាទិត្យ) ជូន ${visiblePlans.length} មេរៀន សម្រាប់ ${selectedClass} (${teacherName}) រួចរាល់! 🎉`, 'success');
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

    // Helper: Get Teacher Phone number
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
      const isGrade11 = (plan.grade === 'ថ្នាក់ទី ១១' || plan.grade === 'ថ្នាក់ទី 11');
      const isGrade12 = (plan.grade === 'ថ្នាក់ទី ១២' || plan.grade === 'ថ្នាក់ទី 12');
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
        return await doc.embedPng(b64ToUint8(canvas.toDataURL('image/png')));
      };

      // 1. Embed Logo directly from Base64 (Zero network request, works offline & on file://)
      let logoImg = null;
      try {
        if (typeof YUKUNTHOR_LOGO_B64 !== 'undefined' && YUKUNTHOR_LOGO_B64) {
          logoImg = await doc.embedJpg(b64ToUint8(YUKUNTHOR_LOGO_B64));
        }
      } catch (err) {
        console.warn('Error embedding base64 logo:', err);
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
        headerTextImg = await doc.embedPng(b64ToUint8(hCanvas.toDataURL('image/png')));
      } catch (e) {
        console.warn('Error pre-rendering header text:', e);
      }

      // ========================================================
      // 1. RUNNING HEADER & RUNNING FOOTER ON EVERY PAGE
      // ========================================================
      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const p = pages[pIdx];
        const pageH = p.getHeight();
        const pageW = p.getWidth();        // --- A. RUNNING HEADER ---
        // In Grade 8, only stamp running header on Page 0 (Cover page) because pages 1..N
        // start their table/lesson content immediately at y = 35..45 pt!
        const shouldStampHeader = (pIdx === 0) || (isGrade11 || isGrade12);

        if (shouldStampHeader) {
          // Redact / Whiteout old header zone at top
          const headerWhiteoutY = (isGrade11 || isGrade12) ? (pageH - 82.0) : (pageH - 62.0);
          const headerWhiteoutH = (isGrade11 || isGrade12) ? 62.0 : 56.0;
          p.drawRectangle({
            x: 50.0,
            y: headerWhiteoutY,
            width: 515.0,
            height: headerWhiteoutH,
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
        }

        // --- B. RUNNING FOOTER ---
        // In Grade 11, redact old Sisowath teacher line at bottom y=60..98
        if (isGrade11) {
          p.drawRectangle({
            x: 60.0,
            y: 60.0,
            width: 495.0,
            height: 38.0,
            color: PDFLib.rgb(1, 1, 1),
          });
        }

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
        }
      }

      // ========================================================
      // 2. COVER PAGE (Page 0 Header Info Stamping)
      // ========================================================
      const coverPage = pages[plan.cover_page_index || 0];
      if (coverPage) {
        const pageH = coverPage.getHeight();

        // A. Class Name
        if (plan.class_name) {
          const classImg = await makeTextImg(plan.class_name, 'bold 32px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 400, 70);
          const class_x = plan.class_x || (isGrade11 ? 210.0 : 238.0);
          const class_y_top = plan.class_y0 || (isGrade8 ? 78.1 : (isGrade11 ? 195.0 : 99.2));
          const class_h = 20.0;
          const class_y_bottom = pageH - class_y_top - class_h;

          // Whiteout only the value slot after the colon
          coverPage.drawRectangle({
            x: class_x,
            y: class_y_bottom,
            width: 240.0,
            height: class_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          coverPage.drawImage(classImg, {
            x: class_x,
            y: class_y_bottom,
            width: 160.0,
            height: class_h,
          });
        }

        // B. Date
        if (plan.date_khmer) {
          const dateImg = await makeTextImg(plan.date_khmer, '30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 900, 70);
          const date_x = plan.date_x || (isGrade11 ? 210.0 : 238.0);
          const date_y_top = plan.box_y0 || (isGrade8 ? 141.1 : (isGrade11 ? 239.0 : 172.0));
          const date_h = 20.0;
          const date_y_bottom = pageH - date_y_top - date_h;

          // Whiteout old date dots after the colon
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

        // C. Teacher Name
        if (plan.teacher) {
          const teacherImg = await makeTextImg(teacherFullName, '30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 900, 70);
          const teacher_x = plan.teacher_x || (isGrade11 ? 210.0 : 238.0);
          const teacher_y_top = plan.teacher_y0 || (isGrade8 ? 162.1 : (isGrade11 ? 217.0 : 190.5));
          const teacher_h = 20.0;
          const teacher_y_bottom = pageH - teacher_y_top - teacher_h;

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
        const min_y = Math.max(plan.sig_y0, 30.0);
        const sig_w = 545.0;
        const sig_h = 145.0;
        const sig_y_bottom = Math.max(pageH - min_y - sig_h, 38.0);
        const sig_x = 28.0;

        // 1. Redact / Whiteout the ENTIRE old signature region cleanly across the page (covers x=28..573)
        sigPage.drawRectangle({
          x: sig_x,
          y: sig_y_bottom,
          width: sig_w,
          height: sig_h,
          color: PDFLib.rgb(1, 1, 1),
        });

        // 2. Render dynamic high-res 3-column signature block via Canvas
        const sigCanvas = document.createElement('canvas');
        sigCanvas.width = 1500;
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

        const colLeft = 250;
        const colMid = 750;
        const colRight = 1250;

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

        const sigBlockImg = await doc.embedPng(b64ToUint8(sigCanvas.toDataURL('image/png')));

        // Stamp clean authentic signature block onto the page
        sigPage.drawImage(sigBlockImg, {
          x: sig_x,
          y: sig_y_bottom,
          width: sig_w,
          height: sig_h,
        });
      }
    }

    // Dynamic Client-side PDF Generation with custom Date and Class
    async downloadCustomPdf(planId, openInNewTab = false) {
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
      const g8Count = this.plans.filter(p => p.grade === 'ថ្នាក់ទី ៨' || p.grade === 'ថ្នាក់ទី 8').length || 78;
      const g11Count = this.plans.filter(p => p.grade === 'ថ្នាក់ទី ១១' || p.grade === 'ថ្នាក់ទី 11').length || 10;
      const g12Count = this.plans.filter(p => p.grade === 'ថ្នាក់ទី ១២' || p.grade === 'ថ្នាក់ទី 12').length || 113;

      const gradesList = [
        { id: 'ថ្នាក់ទី ៧', label: 'ថ្នាក់ទី ៧', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ៨', label: 'ថ្នាក់ទី ៨', count: g8Count, status: 'active', icon: '⚡' },
        { id: 'ថ្នាក់ទី ៩', label: 'ថ្នាក់ទី ៩', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ១០', label: 'ថ្នាក់ទី ១០', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ១១', label: 'ថ្នាក់ទី ១១', count: g11Count, status: 'active', icon: '⭐' },
        { id: 'ថ្នាក់ទី ១២', label: 'ថ្នាក់ទី ១២', count: g12Count, status: 'active', icon: '⭐' }
      ];

      // Available classes and terminology based on grade
      const isGrade8 = currentGrade === 'ថ្នាក់ទី ៨';
      const isGrade11 = currentGrade === 'ថ្នាក់ទី ១១';
      const isGrade12 = currentGrade === 'ថ្នាក់ទី ១២';
      const unitLabel = isGrade12 ? 'ជំពូក' : 'មេរៀន';
      const defaultClasses = isGrade8
        ? ['8NGS_C1', '8NGS_C2', '8NGS_B', '8NGS_B2']
        : (isGrade11 ? ['11NGS_P1', '11NGS_C2', '11NGS_P1 & 11NGS_C2', '១១A', '១១B'] : ['១២A', '១២B', '១២A & ១២B', '12NGS_1', '12NGS_2']);

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

            <!-- Print & Save PDF Hub Trigger Button -->
            <div class="flex items-center gap-2 shrink-0">
              <button onclick="window.lessonPlansManager.openPrintHub()"
                class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition">
                <i class="fa-solid fa-print"></i> <span>🖨️ បោះពុម្ព & Save PDF Hub</span>
              </button>
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

            <!-- Controls Grid: Teacher, Class, Start Date, End Date, Signature Date, Cadence -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end pt-1">
              
              <!-- 1. Teacher Selector (Nuon Bonorng or Thaong Sophary) -->
              <div>
                <label class="block text-[11px] font-bold text-purple-800 dark:text-purple-300 mb-1">
                  👨‍🏫 គ្រូបង្រៀន (Teacher Switcher):
                </label>
                <select id="batchTeacherSelect" onchange="window.lessonPlansManager.setTeacher(this.value)"
                  class="w-full px-3 py-2 rounded-xl border border-purple-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-sm focus:outline-none focus:border-purple-500">
                  <option value="នួន បូណង" ${this.savedTeacher === 'នួន បូណង' ? 'selected' : ''}>👨‍🏫 លោកគ្រូ នួន បូណង (070 794 729)</option>
                  <option value="ថោង សុភារី" ${this.savedTeacher === 'ថោង សុភារី' ? 'selected' : ''}>👩‍🏫 អ្នកគ្រូ ថោង សុភារី (096 75 74 005)</option>
                </select>
                <div class="mt-1 text-[10px] text-purple-700 dark:text-purple-300 font-semibold flex items-center justify-between">
                  <span>📞 <strong class="underline">${this.getTeacherPhone()}</strong></span>
                  <span class="text-slate-400">|</span>
                  <span>${this.getTeacherFullTitle()}</span>
                </div>
              </div>

              <!-- 2. Class Selector & Multi-Class Customizer -->
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  🎓 ថ្នាក់បង្រៀន (១, ២ ឬ ៣ ថ្នាក់):
                </label>
                <div class="relative">
                  <input type="text" id="batchClassInput" value="${this.savedClass || (isGrade8 ? '8NGS_C1 & 8NGS_C2' : '១២A')}"
                    oninput="window.lessonPlansManager.onBatchClassChange(this.value)"
                    onchange="window.lessonPlansManager.onBatchClassChange(this.value)"
                    class="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500"
                    placeholder="ឧ. 8NGS_B2 ឬ 8NGS_C1 & 8NGS_C2">
                </div>
              </div>

              <!-- 3. Start Date Picker -->
              <div>
                <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  📅 ថ្ងៃចាប់ផ្តើម (ក្បាលកិច្ច - លើ):
                </label>
                <input type="date" id="batchStartDate" value="${this.savedStartDate || '2026-10-19'}"
                  onchange="window.lessonPlansManager.onStartDateChange(this.value)"
                  class="w-full px-3 py-1.5 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
              </div>

              <!-- 4. End Date Picker -->
              <div>
                <label class="block text-[11px] font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                  🏁 ថ្ងៃបញ្ចប់ (ចុងកាលវិភាគ):
                </label>
                <input type="date" id="batchEndDate" value="${this.savedEndDate || '2027-02-20'}"
                  onchange="window.lessonPlansManager.onEndDateChange(this.value)"
                  class="w-full px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-slate-600 bg-indigo-50/40 dark:bg-slate-700 text-xs font-bold text-indigo-900 dark:text-indigo-200 shadow-sm focus:outline-none focus:border-indigo-500">
              </div>

              <!-- 5. Signature Date Picker -->
              <div>
                <label class="block text-[11px] font-bold text-purple-700 dark:text-purple-300 mb-1">
                  ✍️ ថ្ងៃចុះហត្ថលេខា (ផ្នែកក្រោម):
                </label>
                <input type="date" id="batchSigDate" value="${this.savedSigDate || '2026-10-12'}"
                  class="w-full px-3 py-1.5 rounded-xl border border-purple-300 dark:border-slate-600 bg-purple-50/50 dark:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-sm focus:outline-none focus:border-purple-500">
              </div>

              <!-- 6. Cadence Step with Weekend Exclusions & Auto-Fit -->
              <div>
                <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  ⏱️ គម្លាតថ្ងៃ (Cadence & លើកលែង):
                </label>
                <select id="batchStepDays" class="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
                  <option value="auto_fit_range" ${this.savedCadence === 'auto_fit_range' ? 'selected' : ''}>
                    🎯 លៃតម្រឹមស្វ័យប្រវត្តិ (Auto-distribute ក្នុងចន្លោះ)
                  </option>
                  <option value="2_days_skip_weekend" ${this.savedCadence === '2_days_skip_weekend' ? 'selected' : ''}>
                    ⚡ ២ ថ្ងៃម្តង (រំលង សៅរ៍-អាទិត្យ · សុក្រទៅចន្ទ)
                  </option>
                  <option value="3_days_skip_weekend" ${this.savedCadence === '3_days_skip_weekend' ? 'selected' : ''}>
                    ⚡ ៣ ថ្ងៃម្តង (រំលង សៅរ៍-អាទិត្យ)
                  </option>
                  <option value="daily_weekdays" ${this.savedCadence === 'daily_weekdays' ? 'selected' : ''}>
                    ⚡ រាល់ថ្ងៃចន្ទ ដល់ សុក្រ (រំលង ១ ថ្ងៃ · គ្មានសៅរ៍-អាទិត្យ)
                  </option>
                  <option value="alt_1_2_days" ${this.savedCadence === 'alt_1_2_days' ? 'selected' : ''}>
                    រំលង ១ថ្ងៃ ផង ២ថ្ងៃ ផង (រំលង សៅរ៍-អាទិត្យ)
                  </option>
                  <option value="mon_wed_fri" ${this.savedCadence === 'mon_wed_fri' ? 'selected' : ''}>
                    ចន្ទ - ពុធ - សុក្រ (៣ ថ្ងៃ/សប្តាហ៍)
                  </option>
                  <option value="tue_thu" ${this.savedCadence === 'tue_thu' ? 'selected' : ''}>
                    អង្គារ - ព្រហស្បតិ៍ (២ ថ្ងៃ/សប្តាហ៍)
                  </option>
                  <option value="weekly" ${this.savedCadence === 'weekly' ? 'selected' : ''}>
                    រៀងរាល់ ១ សប្តាហ៍ម្តង (+៧ ថ្ងៃ)
                  </option>
                </select>
              </div>
            </div>

            <!-- Quick Class Selectors & Preset Action -->
            <div class="space-y-2 pt-1 border-t border-purple-100/80 dark:border-slate-700/60">
              <!-- Row A: Quick Class Pills -->
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-1.5 text-xs">
                  <span class="font-bold text-slate-500 dark:text-slate-400 text-[11px]">ថ្នាក់រហ័ស៖</span>
                  ${isGrade8 ? `
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">8NGS_C1</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">8NGS_C2</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">8NGS_B</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">8NGS_B2</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1 & 8NGS_C2')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">8NGS_C1 & 8NGS_C2 (២ ថ្នាក់)</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1, 8NGS_C2 & 8NGS_B')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">8NGS_C1, 8NGS_C2 & 8NGS_B (៣ ថ្នាក់)</button>
                  ` : (isGrade11 ? `
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('11NGS_P1')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">11NGS_P1</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('11NGS_C2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">11NGS_C2</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('11NGS_P1 & 11NGS_C2')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">11NGS_P1 & 11NGS_C2 (២ ថ្នាក់)</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១១A')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">១១A</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១១B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">១១B</button>
                  ` : `
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២A')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">១២A</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">១២B</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២A & ១២B')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">១២A & ១២B (២ ថ្នាក់)</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('12NGS_1')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">12NGS_1</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('12NGS_2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">12NGS_2</button>
                  `)}
                </div>

                <!-- Apply Button -->
                <div>
                  <button onclick="window.lessonPlansManager.applyBatchSchedule()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> បំពេញស្វ័យប្រវត្តិតាមកាលវិភាគ
                  </button>
                </div>
              </div>

              <!-- Row B: Quick Schedule Presets -->
              <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span class="font-bold text-indigo-700 dark:text-indigo-300 text-[11px] flex items-center gap-1">
                  <i class="fa-solid fa-calendar-check"></i> កាលវិភាគគំរូរហ័ស៖
                </span>
                <button type="button" onclick="window.lessonPlansManager.setSemesterPreset('2026-10-19', '2027-02-20', 'auto_fit_range')"
                  class="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 hover:bg-indigo-200 text-indigo-900 dark:text-indigo-200 border border-indigo-300 font-extrabold text-[11px] transition shadow-xs">
                  🗓️ ឆមាសទី១ (១៩ តុលា ២០២៦ - ២០ កុម្ភៈ ២០២៧)
                </button>
                <button type="button" onclick="window.lessonPlansManager.setCadencePreset('2_days_skip_weekend')"
                  class="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                  ⚡ រំលង ២ ថ្ងៃ (សុក្រ-ចន្ទ)
                </button>
                <button type="button" onclick="window.lessonPlansManager.setCadencePreset('3_days_skip_weekend')"
                  class="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                  ⚡ រំលង ៣ ថ្ងៃ
                </button>
                <button type="button" onclick="window.lessonPlansManager.setCadencePreset('daily_weekdays')"
                  class="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                  ⚡ រំលង ១ ថ្ងៃ (ចន្ទ-សុក្រ)
                </button>
                <button type="button" onclick="window.lessonPlansManager.setCadencePreset('auto_fit_range')"
                  class="px-2 py-1 rounded-lg bg-purple-50 dark:bg-slate-700 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-slate-600 font-bold text-[11px] transition">
                  🎯 Auto-distribute ពេញចន្លោះ
                </button>
              </div>
            </div>

            <!-- Helpful Information Badge -->
            <div class="mt-2 pt-2 border-t border-purple-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
              <span>💡 <strong>របៀបគណនា៖</strong> លើកលែងថ្ងៃសៅរ៍ និងអាទិត្យជាដាច់ខាត (ថ្ងៃសុក្រ នឹងរំលងទៅថ្ងៃចន្ទវិញ)។ រយៈពេលកំណត់៖ <strong>${formatKhmerDate(this.savedStartDate)}</strong> ដល់ <strong>${formatKhmerDate(this.savedEndDate || '2027-02-20')}</strong>。 គ្រូបង្រៀន៖ <strong>${this.savedTeacher}</strong> (${this.getTeacherPhone()})។</span>
              ${this.savedStartDate ? `<span class="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold px-2.5 py-0.5 rounded-lg border border-purple-200">📌 ចាប់ផ្តើម៖ ${formatKhmerDate(this.savedStartDate)} · ចុះហត្ថលេខា៖ ${formatKhmerDate(this.savedSigDate || '2026-10-12', false)}</span>` : ''}
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

        <!-- Print & Save PDF Hub Modal -->
        <div id="printLessonPlansModal" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm hidden flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="p-4 md:p-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg shadow-inner">
                  🖨️
                </div>
                <div>
                  <h3 class="font-extrabold text-sm md:text-base leading-tight">បោះពុម្ព & Save PDF Hub</h3>
                  <p class="text-xs text-emerald-200">ម្តង ១ មេរៀន · លើសពី ១ មេរៀន · ១ កម្រិតថ្នាក់ទាំងមូល</p>
                </div>
              </div>
              <button onclick="window.lessonPlansManager.closePrintHub()" class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm transition">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Modal Content (Dynamically Populated) -->
            <div id="printHubModalContent" class="p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200">
            </div>
          </div>
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

      const chapters = this.getGradeChapters();
      const currentChapterObj = chapters.find(c => c.code === this.activeChapter);

      // Contextual Action Bar for printing / saving current view
      let contextualActionBar = '';
      if (this.activeChapter !== 'all') {
        contextualActionBar = `
          <div class="card-soft p-4 bg-gradient-to-r from-purple-50/80 via-indigo-50/60 to-purple-50/80 dark:from-slate-800 dark:to-slate-800 border-purple-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm font-black shadow-sm">
                📘
              </div>
              <div>
                <div class="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase">
                  កំពុងមើល៖ ${unitLabel}ជ្រើសរើស
                </div>
                <div class="font-extrabold text-xs text-slate-900 dark:text-white">
                  ${currentChapterObj ? currentChapterObj.title : this.activeChapter} (សរុប ${toKhmerNum(filtered.length)} ម៉ោងបង្រៀន)
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button onclick="window.lessonPlansManager.executePrint('single', '${this.activeChapter}')"
                class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ព${unitLabel}នេះ (${toKhmerNum(filtered.length)} ម៉ោង)</span>
              </button>
              <button onclick="window.lessonPlansManager.executeMergedPdf('single', '${this.activeChapter}')"
                class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <i class="fa-solid fa-file-arrow-down"></i> <span>Save PDF ${unitLabel}នេះ</span>
              </button>
              <button onclick="window.lessonPlansManager.openPrintHub('multiple')"
                class="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-700 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-slate-600 font-bold text-xs flex items-center gap-1.5 transition">
                <i class="fa-solid fa-layer-group"></i> <span>ជ្រើសច្រើន${unitLabel}</span>
              </button>
            </div>
          </div>
        `;
      } else {
        contextualActionBar = `
          <div class="card-soft p-4 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-indigo-50/80 dark:from-slate-800 dark:to-slate-800 border-emerald-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-sm">
                🎓
              </div>
              <div>
                <div class="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                  កំពុងមើល៖ គ្រប់${unitLabel}នៃ ${currentGrade}
                </div>
                <div class="font-extrabold text-xs text-slate-900 dark:text-white">
                  សរុប ${toKhmerNum(chapters.length)} ${unitLabel} (${toKhmerNum(filtered.length)} ម៉ោងបង្រៀន / កិច្ចតែងការ)
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button onclick="window.lessonPlansManager.openPrintHub('single')"
                class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <span>📘 ម្តង ១ ${unitLabel}</span>
              </button>
              <button onclick="window.lessonPlansManager.openPrintHub('multiple')"
                class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <span>📑 លើសពី ១ ${unitLabel}</span>
              </button>
              <button onclick="window.lessonPlansManager.executePrint('grade')"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ព${currentGrade} ទាំងមូល (${toKhmerNum(filtered.length)} ម៉ោង)</span>
              </button>
              <button onclick="window.lessonPlansManager.executeMergedPdf('grade')"
                class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <i class="fa-solid fa-file-arrow-down"></i> <span>Save PDF ថ្នាក់ទាំងមូល</span>
              </button>
            </div>
          </div>
        `;
      }

      const cardsHtml = filtered.map(p => {
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
                  <input type="text" id="cardClassInput_${p.id}" value="${p.class_name}"
                    onchange="window.lessonPlansManager.updateClass('${p.id}', this.value)"
                    class="card-class-input px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 font-extrabold text-purple-700 dark:text-purple-300 text-xs focus:outline-none focus:border-purple-500 w-36 sm:w-44">
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
      container.innerHTML = contextualActionBar + cardsHtml;
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
      this.downloadCustomPdf(p.id, true);
    }

    getGradeChapters() {
      const currentGrade = this.selectedGrade || 'ថ្នាក់ទី ៨';
      const gradePlans = this.plans.filter(p => p.grade === currentGrade);
      const chapterMap = {};
      gradePlans.forEach(p => {
        if (!chapterMap[p.chapter_code]) {
          chapterMap[p.chapter_code] = {
            code: p.chapter_code,
            title: p.chapter,
            count: 0,
            plans: []
          };
        }
        chapterMap[p.chapter_code].count++;
        chapterMap[p.chapter_code].plans.push(p);
      });
      return Object.values(chapterMap);
    }

    openPrintHub(tab = 'single', initialChapter = null) {
      this.printHubActiveTab = tab;
      const chapters = this.getGradeChapters();
      if (initialChapter) {
        this.printHubSelectedSingleChapter = initialChapter;
      } else if (this.activeChapter && this.activeChapter !== 'all') {
        this.printHubSelectedSingleChapter = this.activeChapter;
      } else if (chapters.length > 0) {
        this.printHubSelectedSingleChapter = chapters[0].code;
      }

      if (this.printHubSelectedChapters.size === 0) {
        chapters.forEach(ch => this.printHubSelectedChapters.add(ch.code));
      }

      this.renderPrintHubModal();
      const modal = document.getElementById('printLessonPlansModal');
      if (modal) modal.classList.remove('hidden');
    }

    closePrintHub() {
      const modal = document.getElementById('printLessonPlansModal');
      if (modal) modal.classList.add('hidden');
    }

    setPrintHubTab(tabName) {
      this.printHubActiveTab = tabName;
      this.renderPrintHubModal();
    }

    onPrintHubSingleChapterChange(code) {
      this.printHubSelectedSingleChapter = code;
      this.renderPrintHubModal();
    }

    togglePrintHubChapter(code) {
      if (this.printHubSelectedChapters.has(code)) {
        this.printHubSelectedChapters.delete(code);
      } else {
        this.printHubSelectedChapters.add(code);
      }
      this.renderPrintHubModal();
    }

    selectAllPrintHubChapters() {
      const chapters = this.getGradeChapters();
      chapters.forEach(ch => this.printHubSelectedChapters.add(ch.code));
      this.renderPrintHubModal();
    }

    deselectAllPrintHubChapters() {
      this.printHubSelectedChapters.clear();
      this.renderPrintHubModal();
    }

    getPlansForScope(scope, targetCode = null) {
      const currentGrade = this.selectedGrade || 'ថ្នាក់ទី ៨';
      if (scope === 'modal') {
        return this.currentModalPlan ? [this.currentModalPlan] : [];
      }
      if (scope === 'single') {
        const code = targetCode || this.printHubSelectedSingleChapter;
        return this.plans.filter(p => p.grade === currentGrade && p.chapter_code === code);
      }
      if (scope === 'multiple') {
        return this.plans.filter(p => p.grade === currentGrade && this.printHubSelectedChapters.has(p.chapter_code));
      }
      if (scope === 'grade') {
        return this.plans.filter(p => p.grade === currentGrade);
      }
      return [];
    }

    executePrint(scope, targetCode = null) {
      const plans = this.getPlansForScope(scope, targetCode);
      if (!plans || plans.length === 0) {
        alert('សូមជ្រើសរើសមេរៀនយ៉ាងហោចណាស់ ១!');
        return;
      }
      let filename = `កិច្ចតែងការ_${this.selectedGrade.replace(/\s+/g, '')}`;
      if (scope === 'single') {
        const chClean = plans[0].chapter.replace(/[^a-zA-Z0-9\u1780-\u17D2]/g, '_').replace(/_+/g, '_').substring(0, 45);
        filename += `_${chClean}_(${toKhmerNum(plans.length)}ម៉ោង)`;
      } else if (scope === 'multiple') {
        filename += `_មេរៀនជ្រើសរើស_${toKhmerNum(plans.length)}ម៉ោង`;
      } else {
        filename += `_ពេញលេញ_${toKhmerNum(plans.length)}ម៉ោង`;
      }
      if (this.savedClass) {
        const classClean = this.savedClass.replace(/[^a-zA-Z0-9\u1780-\u17D2]/g, '_');
        filename += `_${classClean}`;
      }
      filename += '.pdf';
      this.downloadMergedPdf(plans, filename, true);
    }

    executeMergedPdf(scope, targetCode = null) {
      const plans = this.getPlansForScope(scope, targetCode);
      if (!plans || plans.length === 0) {
        alert('សូមជ្រើសរើសមេរៀនយ៉ាងហោចណាស់ ១!');
        return;
      }
      let filename = `កិច្ចតែងការ_${this.selectedGrade.replace(/\s+/g, '')}`;
      if (scope === 'single') {
        const chClean = plans[0].chapter.replace(/[^a-zA-Z0-9\u1780-\u17D2]/g, '_').replace(/_+/g, '_').substring(0, 45);
        filename += `_${chClean}_(${toKhmerNum(plans.length)}ម៉ោង)`;
      } else if (scope === 'multiple') {
        filename += `_មេរៀនជ្រើសរើស_${toKhmerNum(plans.length)}ម៉ោង`;
      } else {
        filename += `_ពេញលេញ_${toKhmerNum(plans.length)}ម៉ោង`;
      }
      if (this.savedClass) {
        const classClean = this.savedClass.replace(/[^a-zA-Z0-9\u1780-\u17D2]/g, '_');
        filename += `_${classClean}`;
      }
      filename += '.pdf';
      this.downloadMergedPdf(plans, filename);
    }

    generatePrintableHtml(plans) {
      const currentGrade = this.selectedGrade || 'ថ្នាក់ទី ៨';
      const isGrade8 = currentGrade === 'ថ្នាក់ទី ៨';
      const unitLabel = isGrade8 ? 'មេរៀន' : 'ជំពូក';

      return plans.map((p, idx) => {
        const teacherTitle = (p.teacher && p.teacher.includes('សុភារី')) ? 'អ្នកគ្រូ' : 'លោកគ្រូ';
        const knowledgeItems = (p.objectives && p.objectives.knowledge && p.objectives.knowledge.length > 0)
          ? p.objectives.knowledge
          : [`កំណត់ និងយល់ច្បាស់ពីខ្លឹមសារមេរៀន ${p.lesson_title} តាមការណែនាំរបស់គ្រូ។`];
        const skillItems = (p.objectives && p.objectives.skills && p.objectives.skills.length > 0)
          ? p.objectives.skills
          : [`អនុវត្តដោះស្រាយលំហាត់ និងសកម្មភាពរៀនសូត្របានត្រឹមត្រូវ និងទាន់ពេលវេលា។`];
        const attitudeText = (p.objectives && p.objectives.attitude) || 'បណ្តុះស្មារតីស្រឡាញ់មុខវិជ្ជាគណិតវិទ្យា ភាពហ្មត់ចត់ និងការចូលរួមយ៉ាងសកម្មក្នុងថ្នាក់រៀន។';
        const teacherMat = (p.materials && p.materials.teacher) || 'សៀវភៅពុម្ព, ស្លាយបង្រៀន, បន្ទាត់, រង្វង់ត្រីកោណមាត្រ/ឧបករណ៍បង្រៀន';
        const studentMat = (p.materials && p.materials.student) || 'សៀវភៅសិក្សាគោល, សៀវភៅសរសេរ, ប៊ិច, បន្ទាត់';
        const methodText = p.methods || 'វិធីសាស្ត្របង្រៀនតាមបែបសិស្សមជ្ឈមណ្ឌល (Student-Centered Approach) និង 5E';

        return `
          <div class="lesson-plan-print-page">
            <!-- Official Running Header (Matching User Image 1) -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1.5px solid #000; padding-bottom: 6px; margin-bottom: 14px;">
              <div style="display:flex; align-items:center; gap: 10px;">
                <img src="images/yukunthor-logo.jpg" style="width: 32px; height: 32px; object-fit: contain;">
                <span style="font-family:'Khmer OS Muol Light', sans-serif; font-size: 13.5px; font-weight: bold; color: #000;">
                  វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)
                </span>
              </div>
            </div>

            <!-- Title Banner -->
            <div style="text-align:center; margin: 8px 0 12px 0; background-color: #f8fafc; border: 1.5px solid #4338ca; border-radius: 8px; padding: 7px 12px;">
              <h2 style="font-size: 16px; font-weight: 800; margin: 0; color: #1e1b4b;">
                កិច្ចតែងការបង្រៀនគណិតវិទ្យា (${p.grade})
              </h2>
              <div style="font-size: 12px; font-weight: 700; color: #4f46e5; margin-top: 2px;">
                ស្តង់ដារគុណវុឌ្ឍិ ៥ ជំហានបង្រៀន NGS (ពិន្ទុ ៥០/៥០) · ម៉ោងទី ${toKhmerNum(p.ch_lesson_num)}
              </div>
            </div>

            <!-- Document Matrix -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 11px;">
              <tr>
                <td style="border: 1px solid #64748b; padding: 5px 8px; width: 50%; background: #f8fafc;">
                  <strong>${unitLabel}៖</strong> <span style="font-weight: 700; color: #4338ca;">${p.chapter}</span>
                </td>
                <td style="border: 1px solid #64748b; padding: 5px 8px; width: 50%;">
                  <strong>កាលបរិច្ឆេទបង្រៀន៖</strong> <span style="font-weight: 700; color: #0f172a;">${p.date_khmer}</span>
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #64748b; padding: 5px 8px; background: #f8fafc;">
                  <strong>ចំណងជើងមេរៀន៖</strong> <span style="font-weight: 800; color: #0f172a;">${p.lesson_title}</span>
                </td>
                <td style="border: 1px solid #64748b; padding: 5px 8px;">
                  <strong>ថ្នាក់បង្រៀន៖</strong> <span style="font-weight: 800; color: #4338ca;">ថ្នាក់ទី ${p.class_name}</span>
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #64748b; padding: 5px 8px; background: #f8fafc;">
                  <strong>ខ្លឹមសារមេរៀន៖</strong> ${p.topic}
                </td>
                <td style="border: 1px solid #64748b; padding: 5px 8px;">
                  <strong>រយៈពេលបង្រៀន៖</strong> ${p.duration}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="border: 1px solid #64748b; padding: 5px 8px; background: #fdf4ff;">
                  <strong>គ្រូបង្រៀនទទួលបន្ទុក៖</strong> <span style="font-weight: 800; color: #6b21a8;">${teacherTitle} ${p.teacher}</span> (វិទ្យាល័យព្រះយុគន្ធរ NGS)
                </td>
              </tr>
            </table>

            <!-- I. Objectives -->
            <div style="margin-bottom: 9px;">
              <div style="font-size: 11.5px; font-weight: 800; color: #1e1b4b; background: #e0e7ff; padding: 3px 8px; border-radius: 4px; margin-bottom: 5px;">
                I. វត្ថុបំណងមេរៀន (Lesson Objectives)
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px; font-size: 10px;">
                <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #fafafa;">
                  <strong style="color: #4338ca; display: block; margin-bottom: 2px;">🧠 វិជ្ជាសម្បទា (Knowledge)៖</strong>
                  <ul style="margin: 0; padding-left: 14px;">
                    ${knowledgeItems.map(k => `<li>${k}</li>`).join('')}
                  </ul>
                </div>
                <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #fafafa;">
                  <strong style="color: #0369a1; display: block; margin-bottom: 2px;">🛠️ បំណិនសម្បទា (Skills)៖</strong>
                  <ul style="margin: 0; padding-left: 14px;">
                    ${skillItems.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
                <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #fafafa;">
                  <strong style="color: #15803d; display: block; margin-bottom: 2px;">🌟 ឥរិយាបថសម្បទា (Attitude)៖</strong>
                  <p style="margin: 0;">${attitudeText}</p>
                </div>
              </div>
            </div>

            <!-- II & III. Materials & Methods -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 9px; font-size: 10px;">
              <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #fafafa;">
                <div style="font-weight: 800; color: #1e1b4b; margin-bottom: 2px;">II. សម្ភារឧបទេស (Teaching Materials)</div>
                <div style="margin-bottom: 2px;">• <strong>គ្រូ៖</strong> ${teacherMat}</div>
                <div>• <strong>សិស្ស៖</strong> ${studentMat}</div>
              </div>
              <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #fafafa;">
                <div style="font-weight: 800; color: #1e1b4b; margin-bottom: 2px;">III. វិធីសាស្ត្របង្រៀន (Teaching Methods)</div>
                <div>${methodText}</div>
              </div>
            </div>

            <!-- IV. 5-Step Process Table -->
            <div style="margin-bottom: 10px;">
              <div style="font-size: 11.5px; font-weight: 800; color: #1e1b4b; background: #e0e7ff; padding: 3px 8px; border-radius: 4px; margin-bottom: 5px;">
                IV. ដំណើរការបង្រៀន និងរៀន ៥ ជំហាន (5-Step Teaching Process)
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="border: 1px solid #64748b; padding: 4px 6px; width: 18%; text-align: center;">ជំហាន</th>
                    <th style="border: 1px solid #64748b; padding: 4px 6px; width: 12%; text-align: center;">រយៈពេល</th>
                    <th style="border: 1px solid #64748b; padding: 4px 6px; width: 70%; text-align: left;">សកម្មភាពបង្រៀន និងរៀន</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; font-weight: 700; color: #4338ca;">ជំហានទី ១</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; text-align: center; font-weight: 600;">២-៣ នាទី</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px;"><strong>រដ្ឋបាលថ្នាក់៖</strong> ${p.steps.step1}</td>
                  </tr>
                  <tr style="background: #fbfbfe;">
                    <td style="border: 1px solid #64748b; padding: 5px 6px; font-weight: 700; color: #0284c7;">ជំហានទី ២</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; text-align: center; font-weight: 600;">៣-៥ នាទី</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px;"><strong>រំឭកមេរៀនចាស់៖</strong> ${p.steps.step2}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; font-weight: 700; color: #059669;">ជំហានទី ៣</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; text-align: center; font-weight: 600;">៣៥-៦៥ នាទី</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px;"><strong>មេរៀនថ្មី៖</strong> ${p.steps.step3}</td>
                  </tr>
                  <tr style="background: #fbfbfe;">
                    <td style="border: 1px solid #64748b; padding: 5px 6px; font-weight: 700; color: #d97706;">ជំហានទី ៤</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; text-align: center; font-weight: 600;">៥-៨ នាទី</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px;"><strong>ពង្រឹងចំណេះដឹង៖</strong> ${p.steps.step4}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; font-weight: 700; color: #b45309;">ជំហានទី ៥</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; text-align: center; font-weight: 600;">២-៣ នាទី</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px;"><strong>បណ្តាំផ្ញើ & កិច្ចការផ្ទះ៖</strong> ${p.steps.step5}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- V. Signatures -->
            <div style="margin-top: 12px; padding-top: 6px;">
              <div style="text-align: right; font-size: 10.5px; font-weight: 700; color: #334155; margin-bottom: 6px;">
                រាជធានីភ្នំពេញ, ${p.date_khmer}
              </div>
              <table style="width: 100%; border: none !important; border-collapse: collapse; font-size: 10.5px; text-align: center;">
                <tr style="border: none !important;">
                  <td style="border: none !important; width: 33%; vertical-align: top;">
                    <div style="font-weight: 800; color: #0f172a;">បានឃើញ និងពិនិត្យ</div>
                    <div style="color: #64748b; font-size: 9.5px; font-weight: 700;">ប្រធានក្រុមបច្ចេកទេស</div>
                    <div style="height: 44px;"></div>
                    <div style="color: #94a3b8; font-size: 9.5px;">[ ហត្ថលេខា ]</div>
                  </td>
                  <td style="border: none !important; width: 34%; vertical-align: top;">
                    <div style="font-weight: 800; color: #0f172a;">បានឃើញ និងឯកភាព</div>
                    <div style="color: #64748b; font-size: 9.5px; font-weight: 700;">នាយករងទទួលបន្ទុក NGS</div>
                    <div style="height: 44px;"></div>
                    <div style="color: #94a3b8; font-size: 9.5px;">[ ហត្ថលេខា ]</div>
                  </td>
                  <td style="border: none !important; width: 33%; vertical-align: top;">
                    <div style="font-weight: 800; color: #0f172a;">គ្រូបង្រៀនគណិតវិទ្យា</div>
                    <div style="color: #4338ca; font-size: 9.5px; font-weight: 700;">វិទ្យាល័យព្រះយុគន្ធរ NGS</div>
                    <div style="height: 44px;"></div>
                    <div style="font-weight: 800; color: #4338ca; font-size: 11px;">${teacherTitle} ${p.teacher}</div>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Official Running Footer (Matching User Image 2) -->
            <div style="border-top: 1.5px solid #000; padding-top: 6px; margin-top: 18px; display:flex; justify-content:space-between; align-items:center; font-size: 11px; font-family:'Khmer OS Siemreap', sans-serif; color: #000;">
              <div>បង្រៀនដោយ៖ <strong>${teacherTitle} ${p.teacher}</strong></div>
              <div>- ${toKhmerNum(idx + 1)} -</div>
              <div>លេខទូរស័ព្ទ៖ <strong>${(p.teacher && p.teacher.includes('សុភារី')) ? '096 75 74 005' : '070 794 729'}</strong></div>
            </div>
          </div>
        `;
      }).join('');
    }

    async printPlans(plans, title) {
      if (!plans || plans.length === 0) return;
      const filename = (title.endsWith('.pdf') ? title : `${title}.pdf`).replace(/\s+/g, '_');
      await this.downloadMergedPdf(plans, filename, true);
    }

    async downloadMergedPdf(plans, filename, openInNewTab = false) {
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

        // Auto-sequence dates (strictly skipping Sat & Sun) and apply selected class & teacher
        const currentTeacher = this.savedTeacher || (this.selectedTeacher ? this.selectedTeacher : (plans[0].teacher || 'នួន បូណង'));
        const currentClass = this.savedClass || plans[0].class_name || (this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_B2' : '១២A');
        const startDateStr = this.savedStartDate || plans[0].date || '2026-10-19';
        const endDateStr = this.savedEndDate || '2027-02-20';
        const cadenceMode = this.savedCadence || 'auto_fit_range';
        const selectedSigDate = this.savedSigDate || plans[0].sig_date || '2026-10-12';

        const dateList = this.calculateScheduleDates(startDateStr, endDateStr, cadenceMode, plans.length);

        for (let i = 0; i < plans.length; i++) {
          const plan = plans[i];
          plan.teacher = currentTeacher;
          plan.class_name = currentClass;

          plan.date = dateList[i] || dateList[dateList.length - 1];
          plan.date_khmer = formatKhmerDate(plan.date, true);
          plan.sig_date = selectedSigDate;
          plan.sig_date_khmer = formatKhmerDate(selectedSigDate, false);

          try {
            let res = null;
            try {
              res = await fetch(encodeURI(plan.pdf_file));
            } catch (e1) {
              try { res = await fetch(plan.pdf_file); } catch (e2) {}
            }
            if (!res || !res.ok) {
              try { res = await fetch(plan.pdf_file); } catch (e3) {}
            }
            if (!res || !res.ok) {
              console.warn(`Could not load ${plan.pdf_file}`);
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
      }
    }

    renderPrintHubModal() {
      const modal = document.getElementById('printLessonPlansModal');
      if (!modal) return;

      const currentGrade = this.selectedGrade || 'ថ្នាក់ទី ៨';
      const isGrade8 = currentGrade === 'ថ្នាក់ទី ៨';
      const unitLabel = isGrade8 ? 'មេរៀន' : 'ជំពូក';
      const chapters = this.getGradeChapters();
      const allGradePlans = this.plans.filter(p => p.grade === currentGrade);

      const singleChapter = chapters.find(c => c.code === this.printHubSelectedSingleChapter) || chapters[0];
      const singlePlans = singleChapter ? singleChapter.plans : [];

      const selectedMultiChapters = chapters.filter(c => this.printHubSelectedChapters.has(c.code));
      const multiPlansCount = selectedMultiChapters.reduce((acc, c) => acc + c.count, 0);

      const activeTab = this.printHubActiveTab;

      const container = document.getElementById('printHubModalContent');
      if (!container) return;

      container.innerHTML = `
        <!-- Tabs Navigation -->
        <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
          <button onclick="window.lessonPlansManager.setPrintHubTab('single')"
            class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'single'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-100'
            }">
            <span>📘 ម្តង ១ ${unitLabel}</span>
          </button>

          <button onclick="window.lessonPlansManager.setPrintHubTab('multiple')"
            class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'multiple'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-100'
            }">
            <span>📑 លើសពី ១ ${unitLabel}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'multiple' ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-600'}">
              ${toKhmerNum(selectedMultiChapters.length)}
            </span>
          </button>

          <button onclick="window.lessonPlansManager.setPrintHubTab('grade')"
            class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'grade'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-100'
            }">
            <span>🎓 ១ កម្រិតថ្នាក់ទាំងមូល</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'grade' ? 'bg-white/30 text-white' : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'}">
              ${toKhmerNum(allGradePlans.length)}
            </span>
          </button>
        </div>

        <!-- Tab 1: Single Lesson -->
        ${activeTab === 'single' ? `
          <div class="space-y-4 pt-1 animate-in fade-in duration-200">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ជ្រើសរើស${unitLabel}ដែលត្រូវបោះពុម្ព ឬ Save PDF ៖
              </label>
              <select onchange="window.lessonPlansManager.onPrintHubSingleChapterChange(this.value)"
                class="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-sm focus:outline-none focus:border-purple-500">
                ${chapters.map(c => `
                  <option value="${c.code}" ${singleChapter && singleChapter.code === c.code ? 'selected' : ''}>
                    ${c.title} (${toKhmerNum(c.count)} ម៉ោងបង្រៀន)
                  </option>
                `).join('')}
              </select>
            </div>

            ${singleChapter ? `
              <!-- Preview Card -->
              <div class="card-soft p-4 bg-purple-50/70 dark:bg-slate-700/60 border border-purple-200 dark:border-slate-600 space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                      ${currentGrade}
                    </span>
                    <h4 class="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                      ${singleChapter.title}
                    </h4>
                  </div>
                  <div class="text-right">
                    <span class="text-xl font-black text-purple-700 dark:text-purple-300">${toKhmerNum(singlePlans.length)}</span>
                    <span class="text-[11px] text-slate-500 block">កិច្ចតែងការ / ម៉ោង</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-purple-200/60 dark:border-slate-600">
                  <div>
                    <span class="text-slate-500 text-[11px] block">ថ្នាក់បង្រៀន៖</span>
                    <strong class="text-purple-700 dark:text-purple-300">${singlePlans[0]?.class_name || this.savedClass}</strong>
                  </div>
                  <div>
                    <span class="text-slate-500 text-[11px] block">គ្រូបង្រៀន៖</span>
                    <strong class="text-slate-800 dark:text-slate-200">${singlePlans[0]?.teacher || this.savedTeacher}</strong>
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <span class="text-slate-500 text-[11px] block">កាលបរិច្ឆេទដំបូង៖</span>
                    <strong class="text-slate-800 dark:text-slate-200">${singlePlans[0]?.date_khmer || 'តាមកាលវិភាគ'}</strong>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button onclick="window.lessonPlansManager.executePrint('single')"
                  class="py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition">
                  <i class="fa-solid fa-print text-sm"></i>
                  <span>បោះពុម្ព${unitLabel}នេះ (${toKhmerNum(singlePlans.length)} ម៉ោង)</span>
                </button>
                <button onclick="window.lessonPlansManager.executeMergedPdf('single')"
                  class="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition">
                  <i class="fa-solid fa-file-arrow-down text-sm"></i>
                  <span>ទាញយក PDF បញ្ចូលគ្នា (Merged PDF)</span>
                </button>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Tab 2: Multiple Lessons -->
        ${activeTab === 'multiple' ? `
          <div class="space-y-4 pt-1 animate-in fade-in duration-200">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">
                ជ្រើសរើស${unitLabel}ដែលចង់បញ្ចូលគ្នា ៖
              </span>
              <div class="flex items-center gap-2">
                <button onclick="window.lessonPlansManager.selectAllPrintHubChapters()"
                  class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-slate-700 text-purple-700 dark:text-purple-300 hover:bg-purple-200 font-bold text-[11px] transition">
                  ✓ ជ្រើសរើសទាំងអស់
                </button>
                <button onclick="window.lessonPlansManager.deselectAllPrintHubChapters()"
                  class="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 font-bold text-[11px] transition">
                  ✗ ដោះការជ្រើសរើស
                </button>
              </div>
            </div>

            <!-- Chapters Checkbox Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[42vh] overflow-y-auto pr-1">
              ${chapters.map(c => {
                const isChecked = this.printHubSelectedChapters.has(c.code);
                return `
                  <div onclick="window.lessonPlansManager.togglePrintHubChapter('${c.code}')"
                    class="p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-2.5 ${
                      isChecked
                        ? 'bg-purple-50/90 dark:bg-purple-900/30 border-purple-400 dark:border-purple-600 shadow-sm'
                        : 'bg-white dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }">
                    <div class="flex items-center gap-3">
                      <div class="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                        isChecked ? 'bg-purple-600 text-white' : 'border border-slate-300 dark:border-slate-500 text-transparent'
                      }">
                        ✓
                      </div>
                      <div>
                        <div class="font-extrabold text-xs text-slate-800 dark:text-white">
                          ${c.title}
                        </div>
                        <div class="text-[10px] text-slate-500 dark:text-slate-400">
                          ${toKhmerNum(c.count)} ម៉ោងបង្រៀន
                        </div>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isChecked ? 'bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200' : 'bg-slate-100 text-slate-400'}">
                      ${toKhmerNum(c.count)} ម៉ោង
                    </span>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Selection Summary & Actions -->
            <div class="p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-700/60 border border-indigo-200 dark:border-slate-600 flex items-center justify-between text-xs">
              <span>សរុបបានជ្រើសរើស៖ <strong class="text-indigo-700 dark:text-indigo-300 font-extrabold">${toKhmerNum(selectedMultiChapters.length)}</strong> ${unitLabel}</span>
              <span class="font-black text-indigo-700 dark:text-indigo-300 text-sm">${toKhmerNum(multiPlansCount)} ម៉ោងបង្រៀន</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button onclick="window.lessonPlansManager.executePrint('multiple')"
                class="py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition"
                ${multiPlansCount === 0 ? 'disabled opacity-50' : ''}>
                <i class="fa-solid fa-print text-sm"></i>
                <span>បោះពុម្ពមេរៀនដែលបានជ្រើស (${toKhmerNum(multiPlansCount)} ម៉ោង)</span>
              </button>
              <button onclick="window.lessonPlansManager.executeMergedPdf('multiple')"
                class="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition"
                ${multiPlansCount === 0 ? 'disabled opacity-50' : ''}>
                <i class="fa-solid fa-file-arrow-down text-sm"></i>
                <span>ទាញយក PDF បញ្ចូលគ្នា (${toKhmerNum(multiPlansCount)} ម៉ោង)</span>
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Tab 3: Full Grade Level -->
        ${activeTab === 'grade' ? `
          <div class="space-y-4 pt-1 animate-in fade-in duration-200">
            <!-- Full Grade Hero Card -->
            <div class="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white shadow-lg space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-black uppercase tracking-wider text-emerald-200">
                  កញ្ចប់កិច្ចតែងការពេញលេញប្រចាំឆ្នាំ
                </span>
                <span class="text-2xl font-black text-amber-300">
                  ${toKhmerNum(allGradePlans.length)} ម៉ោង
                </span>
              </div>
              <h3 class="text-lg md:text-xl font-extrabold">
                កិច្ចតែងការបង្រៀនគណិតវិទ្យា${currentGrade} ទាំងមូល
              </h3>
              <p class="text-xs text-emerald-100 leading-relaxed">
                រួមបញ្ចូលគ្រប់មេរៀនទាំង <strong>${toKhmerNum(chapters.length)} ${unitLabel}</strong> (សរុប <strong>${toKhmerNum(allGradePlans.length)} ម៉ោងបង្រៀន</strong>) តាមស្តង់ដារ ៥ ជំហាន NGS ដោយ <strong>${this.savedTeacher.includes('សុភារី') ? 'អ្នកគ្រូ ថោង សុភារី' : 'លោកគ្រូ នួន បូណង'}</strong> សម្រាប់ថ្នាក់ <strong>${this.savedClass}</strong>។
              </p>
            </div>

            <!-- Grade Info Metrics -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div class="card-soft p-3 text-center bg-slate-50 dark:bg-slate-700/50">
                <span class="text-slate-400 text-[10px] block">ចំនួន${unitLabel}សរុប</span>
                <strong class="text-emerald-700 dark:text-emerald-300 text-base">${toKhmerNum(chapters.length)} ${unitLabel}</strong>
              </div>
              <div class="card-soft p-3 text-center bg-slate-50 dark:bg-slate-700/50">
                <span class="text-slate-400 text-[10px] block">ចំនួនម៉ោងបង្រៀន</span>
                <strong class="text-purple-700 dark:text-purple-300 text-base">${toKhmerNum(allGradePlans.length)} ម៉ោង</strong>
              </div>
              <div class="card-soft p-3 text-center bg-slate-50 dark:bg-slate-700/50">
                <span class="text-slate-400 text-[10px] block">ថ្នាក់បង្រៀន</span>
                <strong class="text-slate-800 dark:text-slate-200 text-xs">${this.savedClass}</strong>
              </div>
              <div class="card-soft p-3 text-center bg-slate-50 dark:bg-slate-700/50">
                <span class="text-slate-400 text-[10px] block">គ្រូបង្រៀន</span>
                <strong class="text-slate-800 dark:text-slate-200 text-xs">${this.savedTeacher}</strong>
              </div>
            </div>

            <!-- Big Action Buttons -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button onclick="window.lessonPlansManager.executePrint('grade')"
                class="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition">
                <i class="fa-solid fa-print text-sm"></i>
                <span>បោះពុម្ព${currentGrade} ទាំងមូល (${toKhmerNum(allGradePlans.length)} ម៉ោង)</span>
              </button>
              <button onclick="window.lessonPlansManager.executeMergedPdf('grade')"
                class="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition">
                <i class="fa-solid fa-file-arrow-down text-sm"></i>
                <span>ទាញយក PDF ${currentGrade} ទាំងមូល (Merged All)</span>
              </button>
            </div>
          </div>
        ` : ''}
      `;
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
