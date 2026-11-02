/**
 * teaching-slides.js
 * Interactive Teaching Slides Presentation & PowerPoint Manager
 * Preah Yukunthor High School • New Generation School (NGS)
 * Teacher: Nuon Bonorng
 * 
 * Version 5.8:
 * - Two-Tier Hierarchical Navigation (ញែកតាមកម្រិតថ្នាក់):
 *   1. Grade Level Selector (ថ្នាក់ទី ១២, ១១, ១០, ៩, ៨, ៧, និង ស្លាយគំរូ NGS)
 *   2. Inside Grade: Chapter & Lesson Selection with full interactive cards (Grade 12) or Official MoEYS/NGS Syllabus Outlines (Grades 7 to 11)
 * - Authentic NGS Slide Template Layouts:
 *   1. authentic_split: Top dark blue banner with Yukunthor logo, problem search card, method pill badge, 2-column KaTeX derivation + vertical flowchart cards with downward operation arrows
 *   2. section_cover: Left vertical dark blue stripe, red circle section number, large title, key concept callout, stacked color bar chart diagram for S_n vs S_{n-1}
 *   3. practice: Classroom interactive "Your Turn" practice problems with a toggle button to reveal/hide step-by-step solutions
 * - Massive Projector Typography: text-2xl to text-5xl optimized for classroom screens and back-row students
 * - Pure KaTeX Auto-Render for all mathematical formulas
 * - Seamless Presentation Controls: arrows, Space, PageUp/Down, direct jump input, fullscreen (F), Esc
 */

(function () {
  'use strict';

  class TeachingSlidesManager {
    constructor() {
      this.lessons = window.NGS_TEACHING_SLIDES_DATA || [];
      this.selectedGrade = '12'; // '12', '11', '10', '9', '8', '7', 'template'
      this.activeChapter = 'all';  // 'all', '1', '2', '3', 'template'
      this.searchQuery = '';
      this.currentLesson = null;
      this.currentSlideIndex = 0;
      this.selectedMcqChoices = {}; // key: `lessonId_mcqIndex` -> choiceIndex
      this.revealedMcqs = {};        // key: `lessonId_mcqIndex` -> boolean
      this.revealedPractice = {};    // key: `lessonId_slideIndex_problemIndex` -> boolean
      this.keyboardBound = false;
    }

    init() {
      this.bindGlobalKeyboard();
      this.render();
    }

    bindGlobalKeyboard() {
      if (this.keyboardBound) return;
      this.keyboardBound = true;
      window.addEventListener('keydown', (e) => {
        const modal = document.getElementById('slidePresenterModal');
        if (!modal || modal.classList.contains('hidden')) return;

        // Don't intercept when user is typing in jump input
        if (e.target && e.target.id === 'slideJumpInput') {
          if (e.key === 'Enter') {
            this.jumpToInput(e.target.value);
            e.target.blur();
          }
          return;
        }

        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          this.nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          this.prevSlide();
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.goToSlide(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          const total = this.getTotalSlides();
          this.goToSlide(total - 1);
        } else if (e.key === 'Escape') {
          this.closePresenter();
        } else if (e.key === 'f' || e.key === 'F') {
          this.toggleFullScreen();
        }
      });
    }

    // =========================================================================
    // NAVIGATION & FILTERS
    // =========================================================================

    selectGrade(grade) {
      this.selectedGrade = String(grade);
      this.activeChapter = 'all';
      this.searchQuery = '';
      this.render();
    }

    filterByChapter(ch) {
      this.activeChapter = String(ch);
      this.render();
    }

    setSearch(query) {
      this.searchQuery = (query || '').toLowerCase().trim();
      this.render();
    }

    togglePracticeSolution(key) {
      this.revealedPractice[key] = !this.revealedPractice[key];
      this.renderPresenterStage();
    }

    getGrade12Lessons() {
      return this.lessons.filter(l => {
        // Only Grade 12 or template
        const isG12 = l.grade && (l.grade.includes('១២') || l.grade.includes('12'));
        const isTpl = l.is_template === true;
        if (!isG12 && !isTpl) return false;

        const ch = this.activeChapter;
        if (ch === 'template') {
          if (!l.is_template) return false;
        } else if (ch !== 'all') {
          if (l.is_template) return false;
          if (String(l.chapter_num) !== String(ch)) return false;
        }

        if (!this.searchQuery) return true;
        const q = this.searchQuery;
        const haystack = [
          l.lesson_title,
          l.chapter_title,
          l.subtitle,
          l.grade
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }

    getTotalSlides(lesson = null) {
      const l = lesson || this.currentLesson;
      if (!l) return 0;
      if (l.slides && Array.isArray(l.slides) && l.slides.length > 0) {
        return l.slides.length;
      }
      return 14;
    }

    // =========================================================================
    // MAIN RENDER METHOD
    // =========================================================================

    render() {
      const container = document.getElementById('teachingSlidesRoot');
      if (!container) return;

      const g = this.selectedGrade;
      const totalLessons = this.lessons.length;
      const totalSlidesCount = this.lessons.reduce((acc, l) => acc + this.getTotalSlides(l), 0);

      container.innerHTML = `
        <div class="space-y-6">
          <!-- Top Master Header Banner -->
          <div class="bg-gradient-to-r from-slate-900 via-[#0f3b57] to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-sky-800/40">
            <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl border-2 border-amber-400 flex items-center justify-center shrink-0">
                  <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-full h-full object-contain">
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 font-battambang shadow-sm">សាលារៀនជំនាន់ថ្មី (NGS)</span>
                    <span class="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-500/30 text-sky-200 border border-sky-400/30 font-battambang">PowerPoint & Web Presenter</span>
                    <span class="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-battambang">កម្រិតថ្នាក់ ៧ ដល់ ១២</span>
                  </div>
                  <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black font-suwannaphum text-white tracking-wide">
                    ស្លាយបង្រៀនគណិតវិទ្យា & PowerPoint Manager
                  </h1>
                  <p class="text-xs sm:text-sm text-sky-200/80 mt-1 font-battambang">
                    វិទ្យាល័យព្រះយុគន្ធរ • បង្រៀនដោយ លោកគ្រូ <b>នួន បូណង</b> • ប្រព័ន្ធគ្រប់គ្រងស្លាយបង្រៀនតាមកម្រិតថ្នាក់ (Hierarchical Grade Portal)
                  </p>
                </div>
              </div>

              <!-- Quick Stats Pill -->
              <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15">
                <div class="text-center">
                  <div class="text-2xl font-black text-amber-400 font-mono">${totalLessons}</div>
                  <div class="text-[10px] text-sky-200 uppercase tracking-wider font-battambang">មេរៀនក្នុងប្រព័ន្ធ</div>
                </div>
                <div class="w-px h-8 bg-white/20"></div>
                <div class="text-center">
                  <div class="text-2xl font-black text-emerald-400 font-mono">${totalSlidesCount}</div>
                  <div class="text-[10px] text-sky-200 uppercase tracking-wider font-battambang">ស្លាយពេញលេញ</div>
                </div>
                <div class="w-px h-8 bg-white/20"></div>
                <div class="text-center">
                  <div class="text-2xl font-black text-sky-400 font-mono">100%</div>
                  <div class="text-[10px] text-sky-200 uppercase tracking-wider font-battambang">LaTeX & NGS</div>
                </div>
              </div>
            </div>
          </div>

          <!-- LEVEL 1 NAVIGATION: Grade Portal Selection Pills (ញែកតាមកម្រិតថ្នាក់) -->
          <div class="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-purple-600 animate-pulse"></span>
                <span class="text-sm font-bold font-battambang text-slate-800 dark:text-slate-200">
                  ជំហានទី ១ ៖ សូមជ្រើសរើសកម្រិតថ្នាក់បង្រៀន (Select Grade Level)
                </span>
              </div>
              <span class="text-xs font-battambang text-slate-400">
                ជ្រើសរើសរួច ចូលទៅកាន់ជំពូក និងមេរៀន
              </span>
            </div>

            <!-- Grade Pills Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 font-battambang">
              ${this.renderGradeSelectorPill('12', '🎓 ថ្នាក់ទី ១២', 'វិទ្យាសាស្ត្រពិត (Active)', true)}
              ${this.renderGradeSelectorPill('11', '📐 ថ្នាក់ទី ១១', 'គ្រោងមេរៀន (Syllabus)')}
              ${this.renderGradeSelectorPill('10', '📊 ថ្នាក់ទី ១០', 'គ្រោងមេរៀន (Syllabus)')}
              ${this.renderGradeSelectorPill('9', '🎒 ថ្នាក់ទី ៩', 'អនុវិទ្យាល័យ (Syllabus)')}
              ${this.renderGradeSelectorPill('8', '📘 ថ្នាក់ទី ៨', 'អនុវិទ្យាល័យ (Syllabus)')}
              ${this.renderGradeSelectorPill('7', '📗 ថ្នាក់ទី ៧', 'អនុវិទ្យាល័យ (Syllabus)')}
              ${this.renderGradeSelectorPill('template', '⭐ ស្លាយគំរូ', 'NGS 26 Slides')}
            </div>
          </div>

          <!-- LEVEL 2 VIEW: Active Grade Content View -->
          ${this.renderGradeView(g)}
        </div>
      `;

      this.applyKaTeX(container);
    }

    renderGradeSelectorPill(gradeKey, label, subtitle, isHighlighted = false) {
      const active = this.selectedGrade === gradeKey;
      return `
        <button onclick="window.teachingSlidesManager.selectGrade('${gradeKey}')"
          class="p-3 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${active 
            ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/30 scale-[1.02] ring-2 ring-purple-400' 
            : isHighlighted 
              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800 hover:bg-purple-100' 
              : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <div class="font-bold text-sm sm:text-base font-suwannaphum flex items-center justify-between">
            <span>${label}</span>
            ${active ? '<i class="fa-solid fa-circle-check text-xs text-amber-300"></i>' : ''}
          </div>
          <div class="text-[11px] opacity-80 mt-1 font-battambang truncate">
            ${subtitle}
          </div>
        </button>
      `;
    }

    renderGradeView(grade) {
      if (grade === '12') {
        return this.renderGrade12InteractiveView();
      } else if (grade === 'template') {
        return this.renderTemplateDeckView();
      } else {
        return this.renderGradeSyllabusView(grade);
      }
    }

    // =========================================================================
    // GRADE 12 INTERACTIVE SLIDES VIEW (With Chapter Filter & Lessons)
    // =========================================================================

    renderGrade12InteractiveView() {
      const filtered = this.getGrade12Lessons();
      const totalSlides = filtered.reduce((acc, l) => acc + this.getTotalSlides(l), 0);

      return `
        <div class="space-y-6">
          <!-- Grade 12 Sub-Header & Controls Bar -->
          <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center gap-3">
              <span class="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-black text-sm font-battambang border border-purple-200 shrink-0">
                ថ្នាក់ទី ១២
              </span>
              <div>
                <h3 class="text-base sm:text-lg font-bold font-suwannaphum text-slate-900 dark:text-white">
                  ជ្រើសរើសជំពូក ឬមេរៀនសម្រាប់បង្រៀន
                </h3>
                <p class="text-xs text-slate-500 font-battambang">
                  មាន ៧ មេរៀនពេញលេញ (${totalSlides} ស្លាយ) • កម្រិតខ្ពស់ • មាន MCQ និងសន្លឹកកិច្ចការ ៦ ក្រុម
                </p>
              </div>
            </div>

            <!-- Search Input -->
            <div class="relative min-w-[260px]">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input type="text"
                value="${this.searchQuery}"
                oninput="window.teachingSlidesManager.setSearch(this.value)"
                placeholder="ស្វែងរកមេរៀន ជំពូក ឬប្រធានបទ..."
                class="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-battambang transition">
            </div>
          </div>

          <!-- Chapter Filter Tabs -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-battambang">
            ${this.renderChapterTab('all', '📚 ជំពូកទាំងអស់ (All 7 Lessons)')}
            ${this.renderChapterTab('1', 'ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច')}
            ${this.renderChapterTab('2', 'ជំពូកទី ២ ៖ លីមីត និងភាពជាប់')}
            ${this.renderChapterTab('3', 'ជំពូកទី ៣ ៖ ដេរីវេ និងអនុវត្តន៍')}
            ${this.renderChapterTab('template', '⭐ ស្លាយគំរូ NGS (26 Slides)')}
          </div>

          <!-- Lesson Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filtered.map(l => this.renderLessonCard(l)).join('')}
          </div>

          ${filtered.length === 0 ? `
            <div class="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
              <i class="fa-solid fa-folder-open text-5xl text-slate-300 dark:text-slate-600 mb-3"></i>
              <p class="text-base font-bold text-slate-700 dark:text-slate-300 font-battambang">រកមិនឃើញមេរៀនដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ</p>
              <button onclick="window.teachingSlidesManager.filterByChapter('all'); window.teachingSlidesManager.setSearch('')" class="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold font-battambang transition">
                បង្ហាញមេរៀនទាំងអស់ឡើងវិញ
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    renderChapterTab(chId, label) {
      const active = this.activeChapter === chId;
      return `
        <button onclick="window.teachingSlidesManager.filterByChapter('${chId}')"
          class="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 ${active ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}">
          ${label}
        </button>
      `;
    }

    renderLessonCard(l) {
      const slideCount = this.getTotalSlides(l);
      const isTemplate = l.is_template === true;
      const pptxPath = `slides/${encodeURIComponent(l.filename)}`;

      return `
        <div class="bg-white dark:bg-slate-800 rounded-3xl border ${isTemplate ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/10' : 'border-slate-200 dark:border-slate-700'} shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
          <!-- Card Top Bar -->
          <div class="p-6">
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-3 py-1 rounded-xl text-xs font-bold ${isTemplate ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300' : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200'} font-battambang">
                ${isTemplate ? '⭐ ស្លាយគំរូ NGS Standard' : l.chapter_title}
              </span>
              <span class="px-2.5 py-0.5 rounded-lg text-xs font-black bg-slate-900 text-amber-400 font-mono shadow-xs">
                ${slideCount} ស្លាយ
              </span>
            </div>

            <h3 class="text-xl font-bold font-suwannaphum text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition leading-snug line-clamp-2">
              ${l.lesson_title}
            </h3>

            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 font-battambang line-clamp-2 leading-relaxed">
              ${l.subtitle}
            </p>

            <!-- Features Pills -->
            <div class="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-battambang text-slate-500 dark:text-slate-400">
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60"><i class="fa-solid fa-graduation-cap text-purple-500 mr-1"></i>${l.grade}</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60"><i class="fa-regular fa-clock text-amber-500 mr-1"></i>${l.duration}</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60"><i class="fa-solid fa-calculator text-emerald-500 mr-1"></i>LaTeX Math</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60"><i class="fa-solid fa-users text-sky-500 mr-1"></i>៦ ក្រុមតុល្យភាព</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60"><i class="fa-solid fa-pen-to-square text-rose-500 mr-1"></i>អនុវត្តផ្ទាល់ & បង្ហាញចម្លើយ</span>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
            <button onclick="window.teachingSlidesManager.openPresenter('${l.id}')"
              class="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm font-battambang shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition active:scale-95">
              <i class="fa-solid fa-play"></i> ចាក់ស្លាយបង្រៀន
            </button>

            <a href="${pptxPath}" download="${l.filename}"
              class="py-2.5 px-3.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
              title="ទាញយក PowerPoint (.pptx)">
              <i class="fa-solid fa-download"></i> PPTX
            </a>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // TEMPLATE DECK VIEW
    // =========================================================================

    renderTemplateDeckView() {
      const tpl = this.lessons.find(l => l.id === 'template_sequence' || l.is_template);
      if (!tpl) {
        return `<div class="p-8 text-center">គ្មានស្លាយគំរូ</div>`;
      }

      return `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-sky-500/10 p-6 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-xl">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div class="space-y-2">
                <span class="px-3.5 py-1 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 font-battambang shadow-sm">
                  ⭐ ស្លាយគំរូស្តង់ដា NGS (Authentic 26 Slides)
                </span>
                <h2 class="text-2xl sm:text-3xl font-black font-suwannaphum text-slate-900 dark:text-white">
                  ${tpl.lesson_title}
                </h2>
                <p class="text-sm sm:text-base font-battambang text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  រៀបចំឡើងតាមឯកសារ PPTX គំរូជាក់ស្តែងរបស់សាលារៀនជំនាន់ថ្មី • បង្ហាញរូបមន្ត គំនូសបំព្រួញលំនាំ ស្វ៊ីតផលសង ស្វ៊ីតជំនួយ និងដ្យាក្រាមរបារ $S_n$
                </p>
              </div>

              <div class="flex items-center gap-3 shrink-0">
                <button onclick="window.teachingSlidesManager.openPresenter('${tpl.id}')"
                  class="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm sm:text-base font-battambang shadow-lg shadow-purple-600/30 flex items-center gap-2 transition active:scale-95">
                  <i class="fa-solid fa-play text-lg"></i> ចាក់ស្លាយគំរូ (${this.getTotalSlides(tpl)} ស្លាយ)
                </button>
                <a href="slides/${encodeURIComponent(tpl.filename)}" download="${tpl.filename}"
                  class="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base font-battambang shadow-lg flex items-center gap-2 transition active:scale-95">
                  <i class="fa-solid fa-download"></i> ទាញយក PPTX
                </a>
              </div>
            </div>
          </div>

          <!-- Lesson Card Preview -->
          <div class="max-w-xl mx-auto">
            ${this.renderLessonCard(tpl)}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // GRADE SYLLABUS OUTLINE VIEW (Grades 7 to 11)
    // =========================================================================

    renderGradeSyllabusView(grade) {
      const outlines = window.NGS_CURRICULUM_OUTLINES || {};
      const gData = outlines[grade];

      if (!gData) {
        return `
          <div class="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <p class="text-base font-bold font-battambang text-slate-600 dark:text-slate-300">
              មិនទាន់មានទិន្នន័យគ្រោងកម្មវិធីសម្រាប់កម្រិតថ្នាក់នេះឡើយ
            </p>
            <button onclick="window.teachingSlidesManager.selectGrade('12')" class="mt-4 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-battambang font-bold text-sm">
              ត្រឡប់ទៅកាន់ថ្នាក់ទី ១២
            </button>
          </div>
        `;
      }

      return `
        <div class="space-y-6">
          <!-- Grade Syllabus Header -->
          <div class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span class="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold text-xs font-battambang border border-purple-200">
                  ${gData.badge}
                </span>
                <span class="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs font-battambang border border-emerald-200">
                  📚 គ្រោងកម្មវិធីសិក្សាជាតិ (MoEYS / NGS)
                </span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black font-suwannaphum text-slate-900 dark:text-white">
                ${gData.grade_title} ៖ គ្រោងកម្មវិធីសិក្សា និងចំណងជើងមេរៀន
              </h2>
              <p class="text-sm font-battambang text-slate-500 dark:text-slate-400 mt-1">
                ${gData.subtitle}
              </p>
            </div>

            <button onclick="window.teachingSlidesManager.selectGrade('12')"
              class="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm font-battambang transition flex items-center gap-2 shadow-md">
              <i class="fa-solid fa-graduation-cap"></i> ទៅកាន់ថ្នាក់ទី ១២ (ស្លាយពេញលេញ)
            </button>
          </div>

          <!-- Information Notice -->
          <div class="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-battambang flex items-start gap-3">
            <i class="fa-solid fa-circle-info text-amber-500 text-xl mt-0.5 shrink-0"></i>
            <div class="text-xs sm:text-sm leading-relaxed">
              <b>ការណែនាំ ៖</b> ចំពោះថ្នាក់ទី ៧ ដល់ ១១ ត្រូវបានរៀបចំ <b>ចំណងជើងជំពូក មេរៀន និងគ្រោងខ្លឹមសារតាមកម្មវិធីសិក្សាជាតិរួចរាល់ជាផ្លូវការ</b> (មិនទាន់បង្កើតស្លាយពេញលេញនៅឡើយ)។ លោកគ្រូអាចពិនិត្យគ្រោងការណ៍ខាងក្រោម ដើម្បីត្រៀមរៀបចំការបង្រៀន ឬចូលទៅកាន់ថ្នាក់ទី ១២ សម្រាប់ស្លាយបង្រៀនពេញលេញ!
            </div>
          </div>

          <!-- Chapters & Lessons Accordion/Cards -->
          <div class="space-y-6">
            ${gData.chapters.map(ch => `
              <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <!-- Chapter Header -->
                <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <span class="w-8 h-8 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm font-mono shadow-xs">
                      ${ch.chapter_num}
                    </span>
                    <h3 class="text-lg sm:text-xl font-bold font-suwannaphum text-slate-900 dark:text-white">
                      ${ch.title}
                    </h3>
                  </div>
                  <span class="text-xs font-bold font-battambang px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    ${ch.lessons.length} មេរៀន
                  </span>
                </div>

                <!-- Lessons List -->
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  ${ch.lessons.map(ls => `
                    <div class="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-700 transition flex flex-col justify-between group">
                      <div>
                        <div class="flex items-center justify-between gap-2 mb-2">
                          <span class="text-xs font-bold text-purple-600 dark:text-purple-400 font-battambang">
                            មេរៀនទី ${ls.lesson_num}
                          </span>
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 font-battambang">
                            គ្រោងរួចរាល់
                          </span>
                        </div>
                        <h4 class="text-base font-bold font-suwannaphum text-slate-900 dark:text-white group-hover:text-purple-600 transition leading-snug">
                          ${ls.title}
                        </h4>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 font-battambang leading-relaxed">
                          ${ls.desc}
                        </p>
                      </div>

                      <div class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-battambang text-slate-400">
                        <span><i class="fa-solid fa-book text-slate-400 mr-1"></i>សៀវភៅគោល</span>
                        <span class="text-amber-500 font-bold">ត្រៀមបង្កើតស្លាយ</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SLIDE PRESENTER ENGINE (Enlarged Projector Typography)
    // =========================================================================

    openPresenter(lessonId) {
      const lesson = this.lessons.find(x => x.id === lessonId);
      if (!lesson) return;

      this.currentLesson = lesson;
      this.currentSlideIndex = 0;

      let modal = document.getElementById('slidePresenterModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'slidePresenterModal';
        modal.className = 'fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-center items-center p-2 sm:p-4';
        document.body.appendChild(modal);
      }

      modal.classList.remove('hidden');
      this.renderPresenterStage();
    }

    closePresenter() {
      const modal = document.getElementById('slidePresenterModal');
      if (modal) modal.classList.add('hidden');
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }

    toggleFullScreen() {
      const stage = document.getElementById('slideStageContainer');
      if (!stage) return;

      if (!document.fullscreenElement) {
        if (stage.requestFullscreen) {
          stage.requestFullscreen().catch(err => console.warn(err));
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => console.warn(err));
        }
      }
    }

    nextSlide() {
      if (!this.currentLesson) return;
      const total = this.getTotalSlides();
      if (this.currentSlideIndex < total - 1) {
        this.currentSlideIndex++;
        this.renderPresenterStage();
      }
    }

    prevSlide() {
      if (!this.currentLesson) return;
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--;
        this.renderPresenterStage();
      }
    }

    stepSlides(delta) {
      if (!this.currentLesson) return;
      const total = this.getTotalSlides();
      let target = this.currentSlideIndex + delta;
      if (target < 0) target = 0;
      if (target >= total) target = total - 1;
      this.goToSlide(target);
    }

    goToSlide(idx) {
      if (!this.currentLesson) return;
      const total = this.getTotalSlides();
      if (idx >= 0 && idx < total) {
        this.currentSlideIndex = idx;
        this.renderPresenterStage();
      }
    }

    jumpToInput(val) {
      const num = parseInt(val, 10);
      const total = this.getTotalSlides();
      if (!isNaN(num) && num >= 1 && num <= total) {
        this.goToSlide(num - 1);
      } else {
        const inp = document.getElementById('slideJumpInput');
        if (inp) inp.value = this.currentSlideIndex + 1;
      }
    }

    selectMcqChoice(mcqKey, choiceIdx) {
      this.selectedMcqChoices[mcqKey] = choiceIdx;
      this.renderPresenterStage();
    }

    revealMcqAnswer(mcqKey) {
      this.revealedMcqs[mcqKey] = true;
      this.renderPresenterStage();
    }

    ensurePresenterShell(modal) {
      if (document.getElementById('slideStageContainer')) return;

      modal.innerHTML = `
        <div id="slideStageContainer" class="w-full max-w-[1560px] h-[96vh] flex flex-col bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/80 mx-auto my-auto transition-all">
          <!-- Presenter Top Bar -->
          <div class="px-5 py-3 bg-slate-950 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 shrink-0">
            <div class="flex items-center gap-3">
              <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-10 h-10 rounded-xl border border-amber-400 object-contain bg-white">
              <div class="flex flex-col">
                <span id="slideTopTitle" class="font-bold text-white text-sm sm:text-base font-suwannaphum truncate max-w-xs sm:max-w-md lg:max-w-xl">
                  មេរៀនគណិតវិទ្យា
                </span>
                <span class="text-[11px] text-slate-400 font-battambang">វិទ្យាល័យព្រះយុគន្ធរ • សាលារៀនជំនាន់ថ្មី • លោកគ្រូ នួន បូណង</span>
              </div>
            </div>

            <!-- Center Slide Indicator & Direct Jump Input -->
            <div class="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-2xl border border-slate-800">
              <span class="text-xs text-slate-400 font-battambang">ស្លាយទី</span>
              <input id="slideJumpInput" type="number" min="1" max="50" value="1"
                class="w-14 text-center py-0.5 px-1 bg-slate-800 border border-slate-700 text-amber-400 font-bold text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                title="វាយលេខស្លាយ រួចចុច Enter ដើម្បីលោតទៅកាន់ស្លាយនោះ">
              <span id="slideTotalBadge" class="text-xs text-slate-400 font-battambang">នៃ 39</span>
            </div>

            <!-- Right Controls -->
            <div class="flex items-center gap-2">
              <a id="slidePptxDownloadBtn" href="#" download="" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 text-xs shadow" title="ទាញយក PowerPoint (.pptx)">
                <i class="fa-solid fa-download"></i> PPTX
              </a>
              <button onclick="window.teachingSlidesManager.toggleFullScreen()" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition" title="ពេញអេក្រង់ (F)">
                <i class="fa-solid fa-expand text-sm"></i>
              </button>
              <button onclick="window.teachingSlidesManager.closePresenter()" class="p-2 rounded-xl bg-rose-900/60 hover:bg-rose-700 text-rose-200 hover:text-white transition" title="បិទ (Esc)">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Slide Content Area (Generous space & Massive Projector Typography) -->
          <div id="slideContentArea" class="flex-1 bg-white dark:bg-slate-900 overflow-y-auto relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <!-- Rendered dynamically -->
          </div>

          <!-- Presenter Bottom Navigation Bar -->
          <div class="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <!-- Left Prev Buttons -->
            <div class="flex items-center gap-2">
              <button onclick="window.teachingSlidesManager.stepSlides(-5)"
                class="px-3 py-2 rounded-xl font-bold text-xs transition bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95" title="ថយក្រោយ ៥ ស្លាយ">
                -5
              </button>
              <button id="slidePrevBtn" onclick="window.teachingSlidesManager.prevSlide()"
                class="px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition bg-purple-600 text-white shadow-md active:scale-95">
                <i class="fa-solid fa-chevron-left"></i> ថយក្រោយ
              </button>
            </div>

            <!-- Slide Dots / Thumbnails (Scrollable with active centered) -->
            <div id="slideDotsContainer" class="flex items-center gap-1.5 overflow-x-auto max-w-xl sm:max-w-2xl py-1 px-2 scrollbar-thin scroll-smooth">
              <!-- Rendered dynamically -->
            </div>

            <!-- Right Next Buttons -->
            <div class="flex items-center gap-2">
              <button id="slideNextBtn" onclick="window.teachingSlidesManager.nextSlide()"
                class="px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition bg-purple-600 text-white shadow-md active:scale-95">
                បន្ទាប់ <i class="fa-solid fa-chevron-right"></i>
              </button>
              <button onclick="window.teachingSlidesManager.stepSlides(5)"
                class="px-3 py-2 rounded-xl font-bold text-xs transition bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95" title="ទៅមុខ ៥ ស្លាយ">
                +5
              </button>
            </div>
          </div>
        </div>
      `;
    }

    renderPresenterStage() {
      const modal = document.getElementById('slidePresenterModal');
      if (!modal || !this.currentLesson) return;
      this.ensurePresenterShell(modal);

      const l = this.currentLesson;
      const idx = this.currentSlideIndex;
      const total = this.getTotalSlides(l);
      const pptxPath = `slides/${encodeURIComponent(l.filename)}`;

      // Update Top Title & Download
      const topTitle = document.getElementById('slideTopTitle');
      if (topTitle) topTitle.textContent = `${l.chapter_title} • ${l.lesson_title}`;

      const dlBtn = document.getElementById('slidePptxDownloadBtn');
      if (dlBtn) {
        dlBtn.href = pptxPath;
        dlBtn.setAttribute('download', l.filename);
      }

      // Update Jump Input & Total
      const jumpInp = document.getElementById('slideJumpInput');
      if (jumpInp) {
        jumpInp.value = idx + 1;
        jumpInp.max = total;
        jumpInp.onchange = (e) => this.jumpToInput(e.target.value);
      }

      const totalBadge = document.getElementById('slideTotalBadge');
      if (totalBadge) totalBadge.textContent = `នៃ ${total}`;

      // Update Slide Content
      const content = document.getElementById('slideContentArea');
      if (content) {
        content.innerHTML = this.renderSlideContent(l, idx);
        this.applyKaTeX(content);
      }

      // Update Prev Button
      const prevBtn = document.getElementById('slidePrevBtn');
      if (prevBtn) {
        if (idx === 0) {
          prevBtn.disabled = true;
          prevBtn.className = "px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition bg-slate-800 text-slate-500 cursor-not-allowed";
        } else {
          prevBtn.disabled = false;
          prevBtn.className = "px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95";
        }
      }

      // Update Next Button
      const nextBtn = document.getElementById('slideNextBtn');
      if (nextBtn) {
        if (idx === total - 1) {
          nextBtn.disabled = true;
          nextBtn.className = "px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition bg-slate-800 text-slate-500 cursor-not-allowed";
        } else {
          nextBtn.disabled = false;
          nextBtn.className = "px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95";
        }
      }

      // Update Slide Dots
      const dots = document.getElementById('slideDotsContainer');
      if (dots) {
        dots.innerHTML = Array.from({ length: total }).map((_, i) => `
          <button id="slideDot_${i}" onclick="window.teachingSlidesManager.goToSlide(${i})"
            class="min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-bold transition shrink-0 ${i === idx ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300 scale-110 shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}">
            ${i + 1}
          </button>
        `).join('');

        const activeDot = document.getElementById(`slideDot_${idx}`);
        if (activeDot) {
          activeDot.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        }
      }
    }

    // =========================================================================
    // DYNAMIC SLIDE CONTENT RENDERING
    // =========================================================================

    renderSlideContent(lesson, slideIdx) {
      if (lesson.slides && Array.isArray(lesson.slides) && lesson.slides[slideIdx]) {
        return this.renderSlideFromObject(lesson, lesson.slides[slideIdx], slideIdx);
      }

      return `
        <div class="p-8 text-center text-slate-400">
          <p class="text-2xl font-bold font-suwannaphum text-white">ស្លាយទី ${slideIdx + 1}</p>
        </div>
      `;
    }

    renderSlideFromObject(lesson, slide, idx) {
      const type = slide.type || 'concept';
      const badge = slide.badge || lesson.chapter_title;
      const title = slide.title || lesson.lesson_title;
      const subtitle = slide.subtitle || '';

      // Standard Massive Header for every slide
      const headerHtml = `
        <div class="mb-4 sm:mb-6">
          <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <span class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-battambang">
              ${badge}
            </span>
            ${slide.timer ? `
              <span class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono flex items-center gap-1.5">
                <i class="fa-regular fa-clock"></i> ${slide.timer}
              </span>
            ` : ''}
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black font-suwannaphum text-slate-900 dark:text-white tracking-wide leading-tight">
            ${title}
          </h2>
          ${subtitle ? `
            <p class="text-base sm:text-lg lg:text-xl text-purple-600 dark:text-purple-300 font-battambang font-medium mt-1">
              ${subtitle}
            </p>
          ` : ''}
        </div>
      `;

      // Specific layouts based on slide type
      switch (type) {
        case 'cover':
          return this.layoutCover(lesson, slide);

        case 'authentic_split':
          return this.layoutAuthenticSplit(lesson, slide);

        case 'section_cover':
          return this.layoutSectionCover(lesson, slide);

        case 'practice':
          return this.layoutPractice(lesson, slide, idx);

        case 'reference':
          return `
            <div class="flex flex-col justify-between h-full">
              ${headerHtml}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
                ${(slide.cards || []).map(c => `
                  <div class="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-purple-200 dark:border-purple-800 shadow-md">
                    <h3 class="text-xl sm:text-2xl font-bold font-suwannaphum text-purple-700 dark:text-purple-300 mb-2">${c.title}</h3>
                    <p class="text-lg sm:text-xl font-battambang text-slate-700 dark:text-slate-200 leading-relaxed">${c.detail}</p>
                  </div>
                `).join('')}
              </div>
              <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-base sm:text-lg font-battambang mt-4">
                <i class="fa-solid fa-circle-info mr-2"></i> រៀបចំឡើងតាមស្តង់ដាកម្មវិធីសិក្សាជាតិ និងគរុកោសល្យទំនើបសាលារៀនជំនាន់ថ្មី (NGS)
              </div>
            </div>
          `;

        case 'intro':
          return `
            <div class="flex flex-col justify-between h-full">
              ${headerHtml}
              <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-slate-800/90 dark:to-slate-800/50 border-2 border-purple-200 dark:border-slate-700 shadow-lg space-y-4 my-auto">
                ${(slide.body || []).map(p => `
                  <p class="text-xl sm:text-2xl font-battambang text-slate-800 dark:text-slate-100 leading-relaxed">
                    ${p}
                  </p>
                `).join('')}
              </div>
              <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-base sm:text-lg font-battambang mt-4">
                <i class="fa-solid fa-bullseye mr-2"></i> <b>គោលបំណង ៖</b> ពង្រឹងសមត្ថភាពគិតស៊ីជម្រៅ និងការយល់ដឹងពីបាតុភូតគណិតវិទ្យាជាក់ស្តែង
              </div>
            </div>
          `;

        case 'roadmap':
          return `
            <div class="flex flex-col justify-between h-full">
              ${headerHtml}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-auto">
                ${(slide.items || []).map(item => `
                  <div class="p-5 sm:p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${item.active ? 'bg-amber-500/10 border-amber-400 dark:bg-amber-950/40 ring-2 ring-amber-400/50' : item.done ? 'bg-emerald-500/10 border-emerald-400 dark:bg-emerald-950/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'}">
                    <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl shrink-0 ${item.active ? 'bg-amber-400 text-slate-950 font-mono' : item.done ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">
                      ${item.done ? '<i class="fa-solid fa-check"></i>' : item.num}
                    </span>
                    <div>
                      <h4 class="text-lg sm:text-xl font-bold font-suwannaphum ${item.active ? 'text-amber-500 dark:text-amber-300' : 'text-slate-800 dark:text-slate-200'}">
                        ${item.title}
                      </h4>
                      <span class="text-xs sm:text-sm font-battambang ${item.active ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'}">
                        ${item.active ? 'កំពុងសិក្សា (Current Focus)' : item.done ? 'បានសិក្សារួច (Completed)' : 'ចំណុចបន្ទាប់ (Upcoming)'}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="p-3 text-xs sm:text-sm text-center text-slate-400 font-battambang">
                ប្រើគ្រាប់ចុចសញ្ញាព្រួញ (Left / Right) ដើម្បីប្តូរស្លាយ
              </div>
            </div>
          `;

        case 'diagram':
        case 'recall':
          return `
            <div class="flex flex-col justify-between h-full">
              ${headerHtml}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 my-auto">
                ${(slide.cards || []).map(c => `
                  <div class="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                    <h4 class="text-xl sm:text-2xl font-bold font-suwannaphum text-purple-600 dark:text-purple-300 mb-2">${c.title}</h4>
                    <div class="text-lg sm:text-xl font-battambang text-slate-700 dark:text-slate-200 leading-relaxed">${c.detail}</div>
                  </div>
                `).join('')}
              </div>
              ${slide.highlight ? `
                <div class="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-lg sm:text-xl font-battambang mt-4">
                  ${slide.highlight}
                </div>
              ` : ''}
            </div>
          `;

        case 'concept':
        case 'tip':
          return `
            <div class="flex flex-col justify-between h-full">
              ${headerHtml}
              <div class="space-y-5 my-auto">
                ${(slide.body || []).map(p => `
                  <p class="text-xl sm:text-2xl font-battambang text-slate-800 dark:text-slate-100 leading-relaxed">
                    ${p}
                  </p>
                `).join('')}

                ${slide.formula ? `
                  <div class="my-4 p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-amber-400/80 text-center shadow-xl">
                    <div class="text-2xl sm:text-3xl lg:text-4xl text-amber-400 font-bold overflow-x-auto py-2">
                      ${slide.formula}
                    </div>
                  </div>
                ` : ''}

                ${(slide.cards || []).length > 0 ? `
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    ${slide.cards.map(c => `
                      <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div class="text-lg sm:text-xl font-bold font-suwannaphum text-purple-600 dark:text-purple-400 mb-1">${c.title}</div>
                        <div class="text-base sm:text-lg font-battambang text-slate-700 dark:text-slate-300 leading-relaxed">${c.detail}</div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>

              <div class="p-3 text-xs sm:text-sm text-center text-slate-400 font-battambang">
                វិទ្យាល័យព្រះយុគន្ធរ • សាលារៀនជំនាន់ថ្មី • លោកគ្រូ នួន បូណង
              </div>
            </div>
          `;

        case 'example':
          return `
            <div class="flex flex-col justify-between h-full">
              ${headerHtml}
              <div class="space-y-5 my-auto">
                ${slide.problem ? `
                  <div class="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-300 dark:border-purple-800 text-slate-900 dark:text-slate-100 shadow-sm">
                    <h3 class="text-lg sm:text-xl font-bold font-suwannaphum text-purple-700 dark:text-purple-300 mb-2">
                      <i class="fa-solid fa-pen-fancy mr-2"></i> ប្រធានលំហាត់ ៖
                    </h3>
                    <div class="text-xl sm:text-2xl font-battambang leading-relaxed">
                      ${slide.problem}
                    </div>
                  </div>
                ` : ''}

                ${(slide.steps || []).length > 0 ? `
                  <div class="space-y-3">
                    ${slide.steps.map(st => `
                      <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                        <span class="text-lg sm:text-xl font-bold font-suwannaphum text-emerald-600 dark:text-emerald-400 shrink-0">
                          ${st.title}
                        </span>
                        <div class="text-lg sm:text-xl lg:text-2xl font-battambang text-slate-800 dark:text-slate-100 flex-1 sm:text-right">
                          ${st.detail}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>

              <div class="p-3 text-xs sm:text-sm text-center text-slate-400 font-battambang">
                គន្លឹះ ៖ កំណត់រូបមន្តឱ្យបានច្បាស់លាស់មុននឹងជំនួសលេខ
              </div>
            </div>
          `;

        case 'mcq':
          return this.layoutMcq(lesson, slide, idx);

        case 'worksheet':
          return this.layoutWorksheet(lesson, slide);

        case 'summary':
          return `
            <div class="flex flex-col justify-between h-full">
              ${headerHtml}
              <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 border-2 border-amber-400/80 shadow-xl space-y-4 my-auto">
                ${(slide.summary_points || []).map((pt, i) => `
                  <div class="flex items-start gap-3">
                    <span class="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm font-mono mt-1">
                      ${i+1}
                    </span>
                    <p class="text-xl sm:text-2xl font-battambang text-slate-800 dark:text-slate-100 leading-relaxed">
                      ${pt}
                    </p>
                  </div>
                `).join('')}
              </div>
              <div class="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 text-base sm:text-lg font-battambang mt-4">
                <i class="fa-solid fa-star text-amber-500 mr-2"></i> ចងចាំរូបមន្តគ្រឹះទាំងនេះសម្រាប់ការប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)!
              </div>
            </div>
          `;

        case 'homework':
          return `
            <div class="flex flex-col justify-between h-full">
              ${headerHtml}
              <div class="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-purple-300 dark:border-purple-800 shadow-xl space-y-4 my-auto">
                <h3 class="text-xl sm:text-2xl font-bold font-suwannaphum text-purple-600 dark:text-purple-300 mb-3">
                  <i class="fa-solid fa-book-open mr-2"></i> កិច្ចការស្រាវជ្រាវ និងអនុវត្តនៅផ្ទះ ៖
                </h3>
                ${(slide.homework || []).map((hw, i) => `
                  <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <span class="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs font-mono mt-1">
                      ${i+1}
                    </span>
                    <p class="text-lg sm:text-xl font-battambang text-slate-800 dark:text-slate-100 leading-relaxed">
                      ${hw}
                    </p>
                  </div>
                `).join('')}
              </div>
              <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-center text-lg font-battambang font-bold mt-4">
                សូមអរគុណប្អូនៗសិស្សានុសិស្សទាំងអស់សម្រាប់ការយកចិត្តទុកដាក់!
              </div>
            </div>
          `;

        default:
          return `
            <div class="flex flex-col justify-between h-full">
              ${headerHtml}
              <div class="space-y-4 my-auto text-xl font-battambang text-slate-800 dark:text-slate-100">
                ${(slide.body || []).map(p => `<p class="leading-relaxed">${p}</p>`).join('')}
              </div>
            </div>
          `;
      }
    }

    // =========================================================================
    // AUTHENTIC SPLIT LAYOUT (Images 1 & 3: Banner, Problem, Method, 2-Cols)
    // =========================================================================

    layoutAuthenticSplit(lesson, slide) {
      const bannerTitle = slide.badge || slide.title || lesson.lesson_title;
      const probBadge = slide.problem_badge || 'លំហាត់គំរូ';
      const probText = slide.problem || '';
      const methodBadge = slide.method_badge || '';
      const derivations = slide.derivations || [];
      const result = slide.result || '';
      const flowchart = slide.flowchart || [];

      return `
        <div class="flex flex-col justify-between h-full space-y-4">
          <!-- Top Authentic Dark Blue Banner (matching Image 1 & 3) -->
          <div class="bg-[#0f3b57] text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg shrink-0">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-sky-300 shrink-0">
                <i class="fa-solid fa-book-open text-lg"></i>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black font-suwannaphum tracking-wide text-white">
                ${bannerTitle}
              </h2>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-10 h-10 rounded-xl bg-white p-1 border border-amber-400">
            </div>
          </div>

          <!-- Problem Card (White box with red magnifying glass search icon and red pill badge) -->
          ${probText ? `
            <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 shrink-0">
              <div class="w-9 h-9 rounded-full bg-[#c0392b] text-white flex items-center justify-center text-sm shrink-0 shadow-sm">
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
              <div class="flex items-center gap-3 flex-wrap flex-1">
                <span class="px-3 py-1 rounded-full bg-[#c0392b] text-white text-xs sm:text-sm font-bold font-battambang shrink-0 shadow-xs">
                  ${probBadge}
                </span>
                <span class="text-lg sm:text-xl font-bold font-battambang text-slate-800 dark:text-slate-100">
                  ${probText}
                </span>
              </div>
            </div>
          ` : ''}

          <!-- Method Pill Badge -->
          ${methodBadge ? `
            <div class="shrink-0">
              <span class="inline-block px-5 py-2 rounded-full bg-[#0f3b57] text-white text-base sm:text-lg font-bold font-battambang shadow-sm">
                ${methodBadge}
              </span>
            </div>
          ` : ''}

          <!-- 2-COLUMN SPLIT: Left = Math Derivations & Green Result; Right = Flowchart Sequence -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto flex-1 items-center">
            <!-- Left Column: Math Steps & Final Result Box (7 cols) -->
            <div class="lg:col-span-7 space-y-4">
              <div class="space-y-3 font-battambang text-xl sm:text-2xl leading-relaxed text-slate-800 dark:text-slate-100">
                ${derivations.map(d => `<div class="py-1">${d}</div>`).join('')}
              </div>

              ${result ? `
                <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 text-emerald-950 dark:text-emerald-100 flex items-center gap-4 text-xl sm:text-2xl font-bold shadow-sm mt-4">
                  <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
                    <i class="fa-solid fa-check"></i>
                  </div>
                  <div>${result}</div>
                </div>
              ` : ''}
            </div>

            <!-- Right Column: Flowchart Sequence Cards (5 cols) -->
            <div class="lg:col-span-5 flex flex-col items-center justify-center space-y-2">
              ${flowchart.map((item, fIdx) => {
                if (item.arrow) {
                  return `
                    <div class="flex flex-col items-center justify-center my-0.5">
                      <div class="text-sm font-bold font-mono px-2 py-0.5 rounded ${item.color === 'red' ? 'text-rose-600' : item.color === 'green' ? 'text-emerald-600' : 'text-sky-600'}">
                        ${item.arrow}
                      </div>
                      <i class="fa-solid fa-arrow-down text-lg ${item.color === 'red' ? 'text-rose-500' : item.color === 'green' ? 'text-emerald-500' : 'text-sky-500'}"></i>
                    </div>
                  `;
                }

                // Node card
                const bgClass = item.bg === 'dark' 
                  ? 'bg-[#0f3b57] text-white border-[#0f3b57]' 
                  : item.bg === 'soft_blue' 
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700' 
                    : item.bg === 'soft_pink' 
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700' 
                      : item.bg === 'soft_green' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700' 
                        : 'bg-white dark:bg-slate-800 text-[#0f3b57] dark:text-sky-300 border-[#0f3b57] dark:border-sky-500';

                return `
                  <div class="w-full max-w-sm p-4 rounded-2xl border-2 shadow-sm text-center font-bold text-lg sm:text-xl font-battambang ${bgClass}">
                    ${item.title ? `<div class="text-xs uppercase tracking-wider mb-1 opacity-75">${item.title}</div>` : ''}
                    <div>${item.text}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="p-2 text-xs text-center text-slate-400 font-battambang">
            វិទ្យាល័យព្រះយុគន្ធរ • សាលារៀនជំនាន់ថ្មី • គរុកោសល្យទំនើបគណិតវិទ្យា
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SECTION COVER LAYOUT (Image 2: Left Stripe, Red Circle, S_n vs S_{n-1} Bars)
    // =========================================================================

    layoutSectionCover(lesson, slide) {
      const sectionNum = slide.section_num || '១';
      const sectionBadge = slide.section_badge || 'ផ្នែកទី ១';
      const title = slide.title || '';
      const keyConcept = slide.key_concept || '';

      return `
        <div class="flex flex-col lg:flex-row h-full rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-900">
          <!-- Left Dark Blue Stripe with Yukunthor NGS Emblem -->
          <div class="w-full lg:w-48 bg-[#0f3b57] text-white p-6 flex flex-col items-center justify-between shrink-0 shadow-lg">
            <div class="flex flex-col items-center text-center space-y-3">
              <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-20 h-20 rounded-2xl bg-white p-1.5 border-2 border-amber-400 shadow-md">
              <div class="text-xs font-battambang font-bold text-slate-200 leading-tight">
                វិទ្យាល័យព្រះយុគន្ធរ<br>
                <span class="text-amber-400">សាលារៀនជំនាន់ថ្មី</span>
              </div>
            </div>

            <div class="text-center font-battambang text-[11px] text-sky-200/70 hidden lg:block">
              គណិតវិទ្យាថ្នាក់ទី ១២<br>NGS Standard
            </div>

            <div class="text-center text-slate-400 hidden lg:block">
              <i class="fa-solid fa-infinity text-2xl opacity-40"></i>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <!-- Red Circle Badge & Section Title -->
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 rounded-full bg-[#c0392b] text-white flex items-center justify-center text-3xl font-black font-suwannaphum shadow-md shrink-0">
                  ${sectionNum}
                </div>
                <div>
                  <div class="text-rose-600 font-bold text-lg font-battambang">${sectionBadge}</div>
                  <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black font-suwannaphum text-[#0f3b57] dark:text-sky-300 tracking-wide">
                    ${title}
                  </h1>
                </div>
              </div>

              <!-- Key Concept Callout Box (Light cyan container) -->
              ${keyConcept ? `
                <div class="p-4 sm:p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-100 text-xl sm:text-2xl font-battambang font-bold shadow-sm max-w-3xl">
                  ${keyConcept}
                </div>
              ` : ''}
            </div>

            <!-- Authentic Diagram: S_n vs S_{n-1} Stacked Color Block Diagram -->
            <div class="my-auto py-6 flex flex-col items-center justify-center">
              <!-- Top Orange Arrow: S_n -->
              <div class="w-full max-w-xl text-center mb-1">
                <div class="text-sm font-bold font-mono text-amber-500 mb-0.5">S_n (ផលបូក n តួដំបូង)</div>
                <div class="h-1 bg-amber-400 rounded-full relative flex items-center justify-between">
                  <i class="fa-solid fa-caret-left text-amber-400 text-lg -ml-1"></i>
                  <i class="fa-solid fa-caret-right text-amber-400 text-lg -mr-1"></i>
                </div>
              </div>

              <!-- Middle Blue Arrow: S_{n-1} -->
              <div class="w-full max-w-xl pr-20 text-center mb-4">
                <div class="text-xs font-bold font-mono text-sky-600 mb-0.5">S_{n-1} (ផលបូក n-1 តួ)</div>
                <div class="h-1 bg-sky-500 rounded-full relative flex items-center justify-between">
                  <i class="fa-solid fa-caret-left text-sky-500 text-base -ml-1"></i>
                  <i class="fa-solid fa-caret-right text-sky-500 text-base -mr-1"></i>
                </div>
              </div>

              <!-- Stacked Blocks Grid (a1 to a5 blue-gray, an red) -->
              <div class="flex items-end gap-3 sm:gap-4 h-48 sm:h-56 pb-2">
                <!-- a1 -->
                <div class="flex flex-col items-center gap-1.5">
                  <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                  <span class="text-xs sm:text-sm font-bold font-mono text-slate-600 dark:text-slate-300">a_1</span>
                </div>

                <!-- a2 -->
                <div class="flex flex-col items-center gap-1.5">
                  <div class="flex flex-col gap-1">
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                  </div>
                  <span class="text-xs sm:text-sm font-bold font-mono text-slate-600 dark:text-slate-300">a_2</span>
                </div>

                <!-- a3 -->
                <div class="flex flex-col items-center gap-1.5">
                  <div class="flex flex-col gap-1">
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                  </div>
                  <span class="text-xs sm:text-sm font-bold font-mono text-slate-600 dark:text-slate-300">a_3</span>
                </div>

                <!-- a4 -->
                <div class="flex flex-col items-center gap-1.5">
                  <div class="flex flex-col gap-1">
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                  </div>
                  <span class="text-xs sm:text-sm font-bold font-mono text-slate-600 dark:text-slate-300">a_4</span>
                </div>

                <!-- a5 -->
                <div class="flex flex-col items-center gap-1.5">
                  <div class="flex flex-col gap-1">
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#4a7c98] rounded-md shadow-xs"></div>
                  </div>
                  <span class="text-xs sm:text-sm font-bold font-mono text-slate-600 dark:text-slate-300">a_5</span>
                </div>

                <!-- Separator / Difference Bar a_n (Vivid Red!) -->
                <div class="flex flex-col items-center gap-1.5 ml-2">
                  <div class="flex flex-col gap-1">
                    <div class="w-10 sm:w-12 h-7 bg-[#c0392b] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#c0392b] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#c0392b] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#c0392b] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#c0392b] rounded-md shadow-xs"></div>
                    <div class="w-10 sm:w-12 h-7 bg-[#c0392b] rounded-md shadow-xs"></div>
                  </div>
                  <span class="text-xs sm:text-sm font-black font-mono text-rose-600 dark:text-rose-400">a_n</span>
                </div>
              </div>

              <div class="text-sm font-battambang font-bold text-slate-500 mt-2">
                រូបមន្ត ៖ $a_n = S_n - S_{n-1} \quad (n \ge 2)$ ព្រោះ $S_n$ និង $S_{n-1}$ ខុសគ្នាតែតួ $a_n$ ប៉ុណ្ណោះ!
              </div>
            </div>

            <div class="text-xs text-slate-400 font-battambang text-right">
              វិទ្យាល័យព្រះយុគន្ធរ • សាលារៀនជំនាន់ថ្មី (NGS)
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // INTERACTIVE PRACTICE LAYOUT (Your Turn + Reveal/Hide Solution Toggle)
    // =========================================================================

    layoutPractice(lesson, slide, slideIdx) {
      const pKey = `${lesson.id}_${slideIdx}`;
      const isRevealed = !!this.revealedPractice[pKey];

      return `
        <div class="flex flex-col justify-between h-full space-y-4">
          <!-- Header -->
          <div>
            <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <span class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500/20 text-amber-500 border border-amber-400/40 font-battambang">
                ${slide.badge || 'អនុវត្តន៍ផ្ទាល់ក្នុងថ្នាក់ / Your Turn'}
              </span>
              <span class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-purple-500/20 text-purple-400 border border-purple-500/40 font-battambang">
                <i class="fa-solid fa-chalkboard-user mr-1"></i> សិស្សដោះស្រាយលើក្តារខៀន ឬសៀវភៅ
              </span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-black font-suwannaphum text-slate-900 dark:text-white">
              ${slide.title}
            </h2>
            ${slide.subtitle ? `
              <p class="text-base sm:text-lg text-purple-600 dark:text-purple-300 font-battambang font-medium mt-1">
                ${slide.subtitle}
              </p>
            ` : ''}
          </div>

          <!-- Problem Box (Massive Font for Projector) -->
          <div class="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-amber-400 shadow-md my-auto space-y-4">
            <div class="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-bold text-xl font-suwannaphum">
              <i class="fa-solid fa-pen-fancy"></i>
              <span>ប្រធានលំហាត់អនុវត្តន៍ ៖</span>
            </div>
            <div class="text-xl sm:text-2xl lg:text-3xl font-battambang text-slate-900 dark:text-slate-100 leading-relaxed">
              ${slide.problem}
            </div>

            <!-- Solution Reveal Button -->
            <div class="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 flex-wrap">
              <button onclick="window.teachingSlidesManager.togglePracticeSolution('${pKey}')"
                class="px-6 py-3 rounded-2xl ${isRevealed ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-purple-600 hover:bg-purple-500 text-white'} font-bold text-sm sm:text-base font-battambang transition shadow-md flex items-center gap-2 active:scale-95">
                <i class="fa-solid ${isRevealed ? 'fa-eye-slash' : 'fa-eye'}"></i>
                ${isRevealed ? 'លាក់ដំណោះស្រាយ' : 'បង្ហាញដំណោះស្រាយលម្អិត'}
              </button>
              <span class="text-xs sm:text-sm text-slate-400 font-battambang">
                ចុចប៊ូតុងខាងឆ្វេង ដើម្បីផ្ទៀងផ្ទាត់ចម្លើយ និងជំហានដោះស្រាយ
              </span>
            </div>

            <!-- Revealed Solution Area -->
            ${isRevealed ? `
              <div class="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 text-emerald-950 dark:text-emerald-100 space-y-3 animate-fadeIn">
                <div class="text-lg font-bold font-suwannaphum text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>ដំណោះស្រាយជាជំហានៗ ៖</span>
                </div>
                <div class="space-y-2 text-lg sm:text-xl font-battambang leading-relaxed">
                  ${(slide.solution || []).map(st => `<div>${st}</div>`).join('')}
                </div>
                ${slide.answer ? `
                  <div class="mt-4 pt-3 border-t border-emerald-300 dark:border-emerald-700 font-bold text-xl sm:text-2xl text-emerald-800 dark:text-emerald-200">
                    <b>ចម្លើយចុងក្រោយ ៖</b> ${slide.answer}
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>

          <div class="p-2 text-xs text-center text-slate-400 font-battambang">
            វិទ្យាល័យព្រះយុគន្ធរ • សាលារៀនជំនាន់ថ្មី • លោកគ្រូ នួន បូណង
          </div>
        </div>
      `;
    }

    // =========================================================================
    // MCQ & WORKSHEET LAYOUTS (Massive Projector Readability)
    // =========================================================================

    layoutCover(lesson, slide) {
      const meta = slide.meta || {};
      return `
        <div class="flex flex-col items-center justify-center text-center h-full px-4 sm:px-8 my-auto">
          <div class="flex items-center gap-3 mb-4">
            <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-amber-400 p-1 bg-white shadow-xl">
            <div class="text-left">
              <span class="px-3.5 py-1 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 text-slate-950 font-battambang shadow-sm">
                ${slide.badge || 'វិទ្យាល័យព្រះយុគន្ធរ • សាលារៀនជំនាន់ថ្មី (NGS)'}
              </span>
              <p class="text-xs sm:text-sm text-slate-400 font-battambang mt-1">
                ក្រសួងអប់រំ យុវជន និងកីឡា • គម្រោងសាលារៀនជំនាន់ថ្មី
              </p>
            </div>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black font-suwannaphum text-slate-900 dark:text-white leading-tight max-w-4xl tracking-wide my-4">
            ${slide.title}
          </h1>

          <p class="text-lg sm:text-2xl text-purple-600 dark:text-purple-300 font-battambang font-bold max-w-2xl mb-8">
            ${slide.subtitle}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl max-w-3xl w-full text-center font-battambang">
            <div>
              <div class="text-xs text-slate-400">គ្រូបង្រៀន</div>
              <div class="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">${meta.teacher || 'លោកគ្រូ នួន បូណង'}</div>
            </div>
            <div>
              <div class="text-xs text-slate-400">កម្រិតថ្នាក់</div>
              <div class="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">${meta.grade || 'ថ្នាក់ទី ១២'}</div>
            </div>
            <div>
              <div class="text-xs text-slate-400">រយៈពេល</div>
              <div class="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">${meta.duration || '៩០ នាទី'}</div>
            </div>
            <div>
              <div class="text-xs text-slate-400">ស្ថាប័ន</div>
              <div class="text-base sm:text-lg font-bold text-amber-500">${meta.school || 'NGS Yukunthor'}</div>
            </div>
          </div>

          <div class="mt-8 text-xs sm:text-sm text-slate-400 font-battambang">
            ចុចគ្រាប់ចុច <kbd class="px-2 py-1 bg-slate-800 text-amber-400 rounded-lg border border-slate-700">Space</kbd> ឬ <kbd class="px-2 py-1 bg-slate-800 text-amber-400 rounded-lg border border-slate-700">→</kbd> ដើម្បីចាប់ផ្តើម
          </div>
        </div>
      `;
    }

    layoutMcq(lesson, slide, slideIdx) {
      const mcq = slide.mcq;
      if (!mcq) return '<div class="p-8 text-center text-slate-400">គ្មានសំណួរ</div>';

      const mcqKey = `${lesson.id}_${slideIdx}`;
      const selected = this.selectedMcqChoices[mcqKey];
      const isRevealed = !!this.revealedMcqs[mcqKey];

      return `
        <div class="flex flex-col justify-start gap-4 sm:gap-6 h-full max-w-5xl mx-auto w-full py-2">
          <!-- Top Header -->
          <div>
            <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <span class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-battambang">
                ${slide.badge || 'ពង្រឹងការយល់ដឹង (MCQ Assessment)'}
              </span>
              <span class="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono">
                MCQ ${slideIdx + 1}
              </span>
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black font-suwannaphum text-slate-900 dark:text-white">
              ${slide.title}
            </h2>
          </div>

          <!-- Question Box (Enlarged) -->
          <div class="p-5 sm:p-7 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 text-slate-900 dark:text-slate-100 text-xl sm:text-2xl lg:text-3xl font-battambang leading-relaxed shadow-sm">
            <i class="fa-solid fa-circle-question text-purple-600 dark:text-purple-400 mr-2"></i>
            ${mcq.question}
          </div>

          <!-- Choices Grid (Enlarged 2x2 cards) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
            ${mcq.choices.map((choice, cIdx) => {
              const isSelected = selected === cIdx;
              const isCorrect = isRevealed && cIdx === mcq.correct_index;
              const isWrong = isRevealed && isSelected && cIdx !== mcq.correct_index;

              let cardStyle = 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-purple-400';
              if (isCorrect) {
                cardStyle = 'bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-400';
              } else if (isWrong) {
                cardStyle = 'bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-500 text-rose-900 dark:text-rose-100';
              } else if (isSelected) {
                cardStyle = 'bg-purple-50 dark:bg-purple-950/70 border-2 border-purple-600 text-purple-900 dark:text-purple-100';
              }

              const choiceLabels = ['(ក)', '(ខ)', '(គ)', '(ឃ)'];

              return `
                <button onclick="window.teachingSlidesManager.selectMcqChoice('${mcqKey}', ${cIdx})"
                  class="p-5 sm:p-6 rounded-2xl text-left transition-all flex items-center gap-4 ${cardStyle} shadow-sm group">
                  <span class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-purple-100'}">
                    ${choiceLabels[cIdx] || (cIdx + 1)}
                  </span>
                  <span class="text-xl sm:text-2xl font-bold font-battambang flex-1">
                    ${choice}
                  </span>
                  ${isCorrect ? '<i class="fa-solid fa-circle-check text-2xl text-emerald-500 shrink-0"></i>' : ''}
                  ${isWrong ? '<i class="fa-solid fa-circle-xmark text-2xl text-rose-500 shrink-0"></i>' : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Bottom Action & Explanation -->
          <div class="flex items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span class="text-xs sm:text-sm text-slate-400 font-battambang">
              ចុចលើជម្រើសដើម្បីផ្ទៀងផ្ទាត់ ឬចុចប៊ូតុងបង្ហាញចម្លើយ
            </span>
            <button onclick="window.teachingSlidesManager.revealMcqAnswer('${mcqKey}')"
              class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm font-battambang transition shadow-md flex items-center gap-2 active:scale-95">
              <i class="fa-solid fa-eye"></i> បង្ហាញចម្លើយ & ការពន្យល់
            </button>
          </div>

          ${isRevealed && mcq.explanation ? `
            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-lg sm:text-xl font-battambang shrink-0">
              <b>ការពន្យល់ ៖</b> ${mcq.explanation}
            </div>
          ` : ''}
        </div>
      `;
    }

    layoutWorksheet(lesson, slide) {
      const groups = slide.worksheet || [];
      const groupColors = [
        'bg-blue-600 text-white',
        'bg-emerald-600 text-white',
        'bg-purple-600 text-white',
        'bg-amber-500 text-slate-950 font-bold',
        'bg-rose-600 text-white',
        'bg-indigo-600 text-white'
      ];

      return `
        <div class="flex flex-col justify-between h-full space-y-4">
          <div>
            <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <span class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-battambang">
                ${slide.badge || 'សន្លឹកកិច្ចការពិភាក្សា ៦ ក្រុមតុល្យភាព'}
              </span>
              <span class="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40 font-battambang">
                រយៈពេល ១៥ នាទី (ស្មើគ្នាគ្រប់ក្រុម)
              </span>
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black font-suwannaphum text-slate-900 dark:text-white">
              ${slide.title}
            </h2>
          </div>

          <!-- 6-Group Balanced Grid (Responsive 2x3 layout with large typography) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 my-auto">
            ${groups.map((g, i) => `
              <div class="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:border-purple-400 transition flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-2.5 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span class="w-8 h-8 rounded-xl ${groupColors[i % groupColors.length]} flex items-center justify-center text-xs font-mono font-bold shadow-xs">
                      ${g.group_num || (i + 1)}
                    </span>
                    <h4 class="text-base sm:text-lg font-bold font-suwannaphum text-slate-900 dark:text-slate-100">
                      ${g.title}
                    </h4>
                  </div>
                  <div class="space-y-2.5">
                    ${(g.problems || []).map(p => `
                      <p class="text-base sm:text-lg font-battambang text-slate-800 dark:text-slate-200 leading-relaxed">
                        ${p}
                      </p>
                    `).join('')}
                  </div>
                </div>
                <div class="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-400 font-battambang text-right">
                  សរសេរលើក្តារខៀនក្រុម
                </div>
              </div>
            `).join('')}
          </div>

          <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs sm:text-sm text-center text-purple-900 dark:text-purple-200 font-battambang">
            💡 <b>សកម្មភាពសិស្ស ៖</b> ពិភាក្សាជាក្រុម រួចចាត់តាំងតំណាងក្រុមឡើងដោះស្រាយ និងពន្យល់លើក្តារខៀន
          </div>
        </div>
      `;
    }

    applyKaTeX(element) {
      if (!window.renderMathInElement || !element) return;
      try {
        window.renderMathInElement(element, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\(', right: '\)', display: false },
            { left: '\[', right: '\]', display: true }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.warn('KaTeX rendering notice:', e);
      }
    }
  }

  // Initialize and mount globally
  window.teachingSlidesManager = new TeachingSlidesManager();
  document.addEventListener('DOMContentLoaded', () => {
    window.teachingSlidesManager.init();
  });
})();
