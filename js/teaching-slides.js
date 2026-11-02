/**
 * teaching-slides.js
 * Interactive Teaching Slides Presentation & PowerPoint Manager
 * Preah Yukunthor High School • New Generation School (NGS)
 * Teacher: Nuon Bonorng
 * 
 * Version 5.7:
 * - Dynamic Slide Engine: Supports arbitrary slide counts (e.g. 39 slides for Ch1 L2, 36 for Ch1 L1, 26 for Template)
 * - Enhanced Navigation: Scrollable active-centered dots strip, direct slide jump input, +/-5 jump buttons
 * - Massive Typography: text-2xl to text-5xl readable on classroom projector screens
 * - Pure KaTeX Auto-Render: Mathematical formulas formatted with LaTeX ($...$ and $$...$$)
 * - 6-Group Balanced Worksheets: 2x3 responsive layout for student group work
 * - Official NGS Template Deck: Full sequence template slide deck with preview & direct PPTX download
 */

(function () {
  'use strict';

  class TeachingSlidesManager {
    constructor() {
      this.lessons = window.NGS_TEACHING_SLIDES_DATA || [];
      this.activeChapter = 'all';
      this.searchQuery = '';
      this.currentLesson = null;
      this.currentSlideIndex = 0;
      this.selectedMcqChoices = {}; // key: `lessonId_mcqIndex` -> choiceIndex
      this.revealedMcqs = {};        // key: `lessonId_mcqIndex` -> boolean
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

        // Don't intercept when user is typing in the jump input
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

    filterByChapter(ch) {
      this.activeChapter = ch;
      this.render();
    }

    setSearch(query) {
      this.searchQuery = (query || '').toLowerCase().trim();
      this.render();
    }

    getFilteredLessons() {
      return this.lessons.filter(l => {
        if (this.activeChapter === 'template') {
          if (!l.is_template) return false;
        } else if (this.activeChapter !== 'all') {
          if (l.is_template) return false;
          if (String(l.chapter_num) !== String(this.activeChapter)) return false;
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

    render() {
      const container = document.getElementById('teachingSlidesRoot');
      if (!container) return;

      const filtered = this.getFilteredLessons();
      const totalLessons = this.lessons.length;
      const totalSlidesCount = this.lessons.reduce((acc, l) => acc + this.getTotalSlides(l), 0);

      container.innerHTML = `
        <div class="space-y-6">
          <!-- Top Header Banner -->
          <div class="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/40">
            <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg border border-purple-300 flex items-center justify-center shrink-0">
                  <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-full h-full object-contain">
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900 font-battambang">NGS High Standard</span>
                    <span class="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-500/40 text-purple-200 border border-purple-400/30 font-battambang">PowerPoint & Web Presenter</span>
                  </div>
                  <h1 class="text-2xl sm:text-3xl font-extrabold font-suwannaphum text-white tracking-wide">
                    ស្លាយបង្រៀនគណិតវិទ្យា & PowerPoint Manager
                  </h1>
                  <p class="text-sm text-purple-200/80 mt-1 font-battambang">
                    វិទ្យាល័យព្រះយុគន្ធរ • សាលារៀនជំនាន់ថ្មី • បង្រៀនដោយ លោកគ្រូ <b>នួន បូណង</b> • កម្មវិធីថ្នាក់ទី ១២ (កម្រិតខ្ពស់)
                  </p>
                </div>
              </div>

              <!-- Stats Pill Badges -->
              <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15">
                <div class="text-center">
                  <div class="text-2xl font-black text-amber-400 font-mono">${totalLessons}</div>
                  <div class="text-[10px] text-purple-200 uppercase tracking-wider font-battambang">មេរៀនសរុប</div>
                </div>
                <div class="w-px h-8 bg-white/20"></div>
                <div class="text-center">
                  <div class="text-2xl font-black text-emerald-400 font-mono">${totalSlidesCount}</div>
                  <div class="text-[10px] text-purple-200 uppercase tracking-wider font-battambang">ស្លាយពេញលេញ</div>
                </div>
                <div class="w-px h-8 bg-white/20"></div>
                <div class="text-center">
                  <div class="text-2xl font-black text-sky-400 font-mono">100%</div>
                  <div class="text-[10px] text-purple-200 uppercase tracking-wider font-battambang">LaTeX & NGS</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Controls Bar: Filter Tabs & Search -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <!-- Filter Tabs -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-battambang">
              ${this.renderChapterTab('all', 'ទាំងអស់ (All)')}
              ${this.renderChapterTab('1', 'ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច')}
              ${this.renderChapterTab('2', 'ជំពូកទី ២ ៖ លីមីត & ភាពជាប់')}
              ${this.renderChapterTab('3', 'ជំពូកទី ៣ ៖ ដេរីវេ & អនុវត្តន៍')}
              ${this.renderChapterTab('template', '⭐ ស្លាយគំរូ (Template NGS)')}
            </div>

            <!-- Search Input -->
            <div class="relative min-w-[240px]">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input type="text"
                value="${this.searchQuery}"
                oninput="window.teachingSlidesManager.setSearch(this.value)"
                placeholder="ស្វែងរកមេរៀន ឬចំណងជើង..."
                class="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-battambang transition">
            </div>
          </div>

          <!-- Lessons Grid Cards -->
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

      this.applyKaTeX(container);
    }

    renderChapterTab(chId, label) {
      const active = this.activeChapter === chId;
      return `
        <button onclick="window.teachingSlidesManager.filterByChapter('${chId}')"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 ${active ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}">
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
    // SLIDE PRESENTER ENGINE
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
        // Reset input to current slide
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
        <div id="slideStageContainer" class="w-full max-w-[1440px] h-[95vh] flex flex-col bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/80 mx-auto my-auto transition-all">
          <!-- Presenter Top Bar -->
          <div class="px-5 py-3 bg-slate-950 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 shrink-0">
            <div class="flex items-center gap-3">
              <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-9 h-9 rounded-xl border border-amber-400 object-contain bg-white">
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

          <!-- Slide Content Area (Canvas with generous space filling and large typography) -->
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

        // Smooth scroll active dot into view
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

      // Fallback
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

      // Common Header for every slide
      const headerHtml = `
        <div class="mb-4 sm:mb-6">
          <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <span class="px-3.5 py-1 rounded-xl text-xs sm:text-sm font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-battambang">
              ${badge}
            </span>
            ${slide.timer ? `
              <span class="px-3.5 py-1 rounded-xl text-xs sm:text-sm font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono flex items-center gap-1.5">
                <i class="fa-regular fa-clock"></i> ${slide.timer}
              </span>
            ` : ''}
          </div>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black font-suwannaphum text-slate-900 dark:text-white tracking-wide leading-tight">
            ${title}
          </h2>
          ${subtitle ? `
            <p class="text-sm sm:text-base lg:text-lg text-purple-600 dark:text-purple-300 font-battambang font-medium mt-1">
              ${subtitle}
            </p>
          ` : ''}
        </div>
      `;

      // Specific layouts based on slide type
      switch (type) {
        case 'cover':
          return this.layoutCover(lesson, slide);

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
                  <p class="text-lg sm:text-xl lg:text-2xl font-battambang text-slate-800 dark:text-slate-100 leading-relaxed">
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
                  <div class="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
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
              <div class="space-y-4 my-auto">
                ${(slide.body || []).map(p => `
                  <p class="text-lg sm:text-xl lg:text-2xl font-battambang text-slate-800 dark:text-slate-100 leading-relaxed">
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
                      <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <h4 class="text-lg sm:text-xl font-bold font-suwannaphum text-purple-600 dark:text-purple-300 mb-1">${c.title}</h4>
                        <div class="text-base sm:text-lg font-battambang text-slate-700 dark:text-slate-200">${c.detail}</div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>

              ${slide.highlight ? `
                <div class="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 text-lg sm:text-xl font-battambang mt-4">
                  ${slide.highlight}
                </div>
              ` : ''}
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
                    <p class="text-lg sm:text-xl lg:text-2xl font-battambang text-slate-800 dark:text-slate-100 leading-relaxed">
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
              <div class="space-y-4 my-auto text-lg sm:text-xl font-battambang text-slate-800 dark:text-slate-100">
                ${(slide.body || []).map(p => `<p class="leading-relaxed">${p}</p>`).join('')}
              </div>
            </div>
          `;
      }
    }

    layoutCover(lesson, slide) {
      const meta = slide.meta || {};
      return `
        <div class="flex flex-col items-center justify-center text-center h-full px-4 sm:px-8 my-auto">
          <!-- Logo & Badges -->
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

          <!-- Main Title -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black font-suwannaphum text-slate-900 dark:text-white leading-tight max-w-4xl tracking-wide my-4">
            ${slide.title}
          </h1>

          <p class="text-lg sm:text-2xl text-purple-600 dark:text-purple-300 font-battambang font-bold max-w-2xl mb-8">
            ${slide.subtitle}
          </p>

          <!-- Teacher & Details Box -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl max-w-3xl w-full text-center font-battambang">
            <div>
              <div class="text-xs text-slate-400">គ្រូបង្រៀន</div>
              <div class="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">${meta.teacher || 'នួន បូណង'}</div>
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
        <div class="flex flex-col justify-between h-full">
          <!-- Top -->
          <div>
            <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <span class="px-3.5 py-1 rounded-xl text-xs sm:text-sm font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-battambang">
                ${slide.badge || 'សំណួរពហុជ្រើសរើស (MCQ)'}
              </span>
              <span class="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 font-battambang">
                MCQ Interactive
              </span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black font-suwannaphum text-slate-900 dark:text-white">
              ${slide.title}
            </h2>
          </div>

          <!-- Question Box (Big, prominent font) -->
          <div class="p-6 sm:p-8 rounded-3xl bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-800 shadow-md my-auto">
            <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold font-suwannaphum text-slate-900 dark:text-white leading-relaxed">
              <i class="fa-solid fa-circle-question text-purple-600 mr-2"></i> ${mcq.question}
            </h3>
          </div>

          <!-- Choices 2x2 Grid (Fills generous height, large typography) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-auto">
            ${mcq.choices.map((c, cIdx) => {
              const isSelected = selected === cIdx;
              const isCorrect = cIdx === mcq.correct;
              let btnClass = "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-purple-500 hover:shadow-lg";

              if (isRevealed) {
                if (isCorrect) {
                  btnClass = "bg-emerald-500 text-white border-2 border-emerald-400 font-bold ring-4 ring-emerald-500/30";
                } else if (isSelected) {
                  btnClass = "bg-rose-500 text-white border-2 border-rose-400 line-through opacity-80";
                } else {
                  btnClass = "bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-300 dark:border-slate-700 opacity-50";
                }
              } else if (isSelected) {
                btnClass = "bg-purple-600 text-white border-2 border-purple-400 font-bold ring-4 ring-purple-500/30";
              }

              return `
                <button onclick="window.teachingSlidesManager.selectMcqChoice('${mcqKey}', ${cIdx})"
                  class="p-5 sm:p-6 rounded-2xl text-left transition-all flex items-center gap-4 ${btnClass} active:scale-98">
                  <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl shrink-0 ${isSelected || (isRevealed && isCorrect) ? 'bg-white text-slate-950 font-bold' : 'bg-purple-100 dark:bg-slate-700 text-purple-700 dark:text-purple-300'}">
                    (${c.label})
                  </span>
                  <div class="text-xl sm:text-2xl font-battambang leading-relaxed flex-1">
                    ${c.text}
                  </div>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Action & Explanation Footer -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-xs sm:text-sm text-slate-400 font-battambang">
              ${isRevealed ? `
                <span class="text-emerald-500 font-bold text-base"><i class="fa-solid fa-circle-check mr-1"></i> ចម្លើយត្រឹមត្រូវគឺ (${mcq.choices[mcq.correct].label})</span>
              ` : `ចុចលើជម្រើសដើម្បីផ្ទៀងផ្ទាត់ ឬចុចប៊ូតុងបង្ហាញចម្លើយ`}
            </div>

            <button onclick="window.teachingSlidesManager.revealMcqAnswer('${mcqKey}')"
              class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm font-battambang transition shadow-md flex items-center gap-2 active:scale-95">
              <i class="fa-solid fa-eye"></i> បង្ហាញចម្លើយ & ការពន្យល់
            </button>
          </div>

          ${isRevealed && mcq.explanation ? `
            <div class="mt-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-base sm:text-lg font-battambang">
              <b>ការពន្យល់ ៖</b> ${mcq.explanation}
            </div>
          ` : ''}
        </div>
      `;
    }

    layoutWorksheet(lesson, slide) {
      const groups = slide.worksheet || [];
      return `
        <div class="flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <span class="px-3.5 py-1 rounded-xl text-xs sm:text-sm font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-battambang">
                ${slide.badge || 'សន្លឹកកិច្ចការ ៦ ក្រុមតុល្យភាព'}
              </span>
              <span class="px-3 py-1 rounded-xl text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40 font-battambang">
                រយៈពេល ១៥ នាទី
              </span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black font-suwannaphum text-slate-900 dark:text-white">
              ${slide.title}
            </h2>
          </div>

          <!-- 6-Group Balanced Grid (Responsive 2x3 or 3x2, clean large text) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 my-auto">
            ${groups.map(g => `
              <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:border-purple-400 transition">
                <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span class="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-xs font-mono">
                    ${g.group_num}
                  </span>
                  <h4 class="text-lg font-bold font-suwannaphum text-purple-600 dark:text-purple-300">
                    ${g.title}
                  </h4>
                </div>
                <div class="space-y-2">
                  ${(g.problems || []).map(p => `
                    <p class="text-base sm:text-lg font-battambang text-slate-800 dark:text-slate-100 leading-relaxed">
                      ${p}
                    </p>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="p-3 text-xs sm:text-sm text-center text-slate-400 font-battambang">
            សិស្សពិភាក្សាជាក្រុម រួចចាត់តាំងតំណាងឡើងដោះស្រាយលើក្តារខៀន
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
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
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
