/**
 * NGS Interactive Math Games Engine with LaTeX (KaTeX) Typography
 * Specially Crafted for Teacher Nuon Bonorng (Bonorng11)
 */

class MathGamesEngine {
  constructor() {
    this.audioCtx = null;
    this.score = 0;
    this.streak = 0;
    this.timer = null;
    this.timeLeft = 15;
    this.currentQuestion = null;
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.activeTeam = 'A';

    // Comprehensive High School Math Question Bank in LaTeX
    this.questions = [
      {
        q: "តម្លៃនៃកន្សោមត្រីកោណមាត្រ $ \\sin^2(\\theta) + \\cos^2(\\theta) $ ស្មើនឹង៖",
        options: ["$ 0 $", "$ 1 $", "$ 2 $", "$ -1 $"],
        answer: 1,
        topic: "ត្រីកោណមាត្រ",
        grade: "ថ្នាក់ទី 10-12"
      },
      {
        q: "តម្លៃនៃ $ \\tan(45^\\circ) $ ឬ $ \\tan\\left(\\frac{\\pi}{4}\\right) $ ស្មើនឹង៖",
        options: ["$ \\frac{1}{2} $", "$ \\frac{\\sqrt{2}}{2} $", "$ 1 $", "$ \\sqrt{3} $"],
        answer: 2,
        topic: "ត្រីកោណមាត្រ",
        grade: "ថ្នាក់ទី 10-12"
      },
      {
        q: "រូបមន្តមុំទ្វេ $ \\cos(2a) $ ស្មើនឹងកន្សោមមួយណា?",
        options: [
          "$ \\cos^2(a) - \\sin^2(a) $",
          "$ 2\\cos(a)\\sin(a) $",
          "$ 1 + \\sin^2(a) $",
          "$ 2\\sin^2(a) - 1 $"
        ],
        answer: 0,
        topic: "ត្រីកោណមាត្រ",
        grade: "ថ្នាក់ទី 11-12"
      },
      {
        q: "ដោះស្រាយសមីការដឺក្រេទីពីរ $ x^2 - 9 = 0 $ គេបាន $ x $ ស្មើនឹង៖",
        options: ["$ x = 3 $", "$ x = -3 $", "$ x = \\pm 3 $", "$ x = 9 $"],
        answer: 2,
        topic: "ពិជគណិត",
        grade: "ថ្នាក់ទី 10"
      },
      {
        q: "កន្សោមពន្លាតនៃ $ (a + b)^2 $ ស្មើនឹង៖",
        options: [
          "$ a^2 + b^2 $",
          "$ a^2 + 2ab + b^2 $",
          "$ a^2 - 2ab + b^2 $",
          "$ a^2 + ab + b^2 $"
        ],
        answer: 1,
        topic: "រូបមន្តពន្លាត",
        grade: "ថ្នាក់ទី 10"
      },
      {
        q: "ផលគុណកន្សោម $ (a - b)(a + b) $ ស្មើនឹង៖",
        options: [
          "$ a^2 - b^2 $",
          "$ a^2 + b^2 $",
          "$ (a - b)^2 $",
          "$ 2a - 2b $"
        ],
        answer: 0,
        topic: "រូបមន្តពន្លាត",
        grade: "ថ្នាក់ទី 10"
      },
      {
        q: "ផលបូកឫសនៃសមីការ $ ax^2 + bx + c = 0 $ (ទ្រឹស្តីបទវ្យែត) គឺ $ S = x_1 + x_2 $ ស្មើនឹង៖",
        options: [
          "$ \\frac{b}{a} $",
          "$ -\\frac{b}{a} $",
          "$ \\frac{c}{a} $",
          "$ -\\frac{c}{a} $"
        ],
        answer: 1,
        topic: "ទ្រឹស្តីបទវ្យែត",
        grade: "ថ្នាក់ទី 10-11"
      },
      {
        q: "គណនាដេរីវេនៃអនុគមន៍ $ f(x) = x^3 $ គេបាន $ f'(x) $ ស្មើនឹង៖",
        options: ["$ 3x $", "$ 3x^2 $", "$ x^2 $", "$ 3x^3 $"],
        answer: 1,
        topic: "ដេរីវេ",
        grade: "ថ្នាក់ទី 11-12"
      },
      {
        q: "គណនាដេរីវេនៃអនុគមន៍ $ f(x) = \\sin(x) $ គេបាន $ f'(x) $ ស្មើនឹង៖",
        options: ["$ -\\cos(x) $", "$ \\cos(x) $", "$ -\\sin(x) $", "$ \\tan(x) $"],
        answer: 1,
        topic: "ដេរីវេ",
        grade: "ថ្នាក់ទី 11-12"
      },
      {
        q: "គណនាលីមីត $ \\lim_{x \\to 0} \\frac{\\sin(x)}{x} $ ស្មើនឹង៖",
        options: ["$ 0 $", "$ 1 $", "$ +\\infty $", "មិនកំណត់"],
        answer: 1,
        topic: "លីមីត",
        grade: "ថ្នាក់ទី 11-12"
      },
      {
        q: "គណនាអាំងតេក្រាលមិនកំណត់ $ \\int 2x\\,dx $ ស្មើនឹង៖",
        options: ["$ x^2 + C $", "$ 2x^2 + C $", "$ x + C $", "$ 2 + C $"],
        answer: 0,
        topic: "អាំងតេក្រាល",
        grade: "ថ្នាក់ទី 12"
      },
      {
        q: "ដេរីវេនៃអនុគមន៍អិចស្បូណង់ស្យែល $ f(x) = e^x $ គឺ $ f'(x) $ ស្មើនឹង៖",
        options: ["$ x e^{x-1} $", "$ e^x $", "$ \\ln(x) $", "$ \\frac{1}{x} $"],
        answer: 1,
        topic: "អនុគមន៍អិចស្បូណង់ស្យែល",
        grade: "ថ្នាក់ទី 12"
      },
      {
        q: "តម្លៃនៃលោការីតគោលដប់ $ \\log_{10}(100) $ ស្មើនឹង៖",
        options: ["$ 10 $", "$ 1 $", "$ 2 $", "$ 100 $"],
        answer: 2,
        topic: "លោការីត",
        grade: "ថ្នាក់ទី 11-12"
      },
      {
        q: "ក្នុងសំណុំចំនួនកុំផ្លិច $ \\mathbb{C} $ តម្លៃនៃ $ i^2 $ ស្មើនឹង៖",
        options: ["$ 1 $", "$ -1 $", "$ 0 $", "$ \\sqrt{-1} $"],
        answer: 1,
        topic: "ចំនួនកុំផ្លិច",
        grade: "ថ្នាក់ទី 12"
      },
      {
        q: "គណនាអាំងតេក្រាល $ \\int \\frac{1}{x}\\,dx $ (ចំពោះ $ x > 0 $) ស្មើនឹង៖",
        options: [
          "$ \\ln(x) + C $",
          "$ -\\frac{1}{x^2} + C $",
          "$ e^x + C $",
          "$ x + C $"
        ],
        answer: 0,
        topic: "អាំងតេក្រាល",
        grade: "ថ្នាក់ទី 12"
      },
      {
        q: "តម្លៃលីមីត $ \\lim_{x \\to +\\infty} \\frac{1}{x} $ ស្មើនឹង៖",
        options: ["$ 0 $", "$ 1 $", "$ +\\infty $", "$ -\\infty $"],
        answer: 0,
        topic: "លីមីត",
        grade: "ថ្នាក់ទី 11-12"
      }
    ];

    // High school formula pairs for Memory Match (Guaranteed 100% Unique - No duplicate answers)
    this.formulaPairs = [
      { id: 1, left: "\\sin^2(x) + \\cos^2(x)", right: "1" },
      { id: 2, left: "(a + b)^2", right: "a^2 + 2ab + b^2" },
      { id: 3, left: "a^2 - b^2", right: "(a - b)(a + b)" },
      { id: 4, left: "\\tan(x)", right: "\\frac{\\sin(x)}{\\cos(x)}" },
      { id: 5, left: "\\frac{d}{dx}[x^n]", right: "n \\cdot x^{n-1}" },
      { id: 6, left: "\\frac{d}{dx}[\\sin(x)]", right: "\\cos(x)" },
      { id: 7, left: "i^2", right: "-1" },
      { id: 8, left: "\\log(a \\cdot b)", right: "\\log(a) + \\log(b)" },
      { id: 9, left: "\\int 2x\\,dx", right: "x^2 + C" },
      { id: 10, left: "\\cos(2x)", right: "\\cos^2(x) - \\sin^2(x)" },
      { id: 11, left: "\\lim_{x \\to +\\infty} \\frac{1}{x}", right: "0" },
      { id: 12, left: "\\frac{d}{dx}[e^x]", right: "e^x" }
    ];
  }

  // Parse $ ... $ strings and render using KaTeX
  formatMath(text) {
    if (!text) return '';
    if (typeof katex === 'undefined') return text;
    return text.replace(/\$([^\$]+)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { throwOnError: false, displayMode: false });
      } catch (e) {
        return formula;
      }
    });
  }

  // Render a pure LaTeX string directly
  renderLatex(formula, displayMode = false) {
    if (!formula) return '';
    if (typeof katex === 'undefined') return formula;
    try {
      return katex.renderToString(formula, { throwOnError: false, displayMode: displayMode });
    } catch (e) {
      return formula;
    }
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15) {
    try {
      this.initAudio();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  playCorrectSound() {
    this.playTone(523.25, 'triangle', 0.1);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.15), 100);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25), 200);
  }

  playWrongSound() {
    this.playTone(220, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.3), 150);
  }

  playVictoryFanfare() {
    const melody = [523, 659, 784, 1046, 784, 1046];
    melody.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2), idx * 120);
    });
    if (typeof confetti === 'function') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  }

  switchGameMode(mode) {
    document.querySelectorAll('.game-mode-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.game-tab-btn').forEach(btn => {
      btn.classList.remove('bg-purple-600', 'text-white', 'shadow');
      btn.classList.add('text-slate-700', 'dark:text-slate-300');
    });

    const activeBtn = document.getElementById(`tabBtn-${mode}`);
    if (activeBtn) {
      activeBtn.classList.add('bg-purple-600', 'text-white', 'shadow');
      activeBtn.classList.remove('text-slate-700', 'dark:text-slate-300');
    }

    const panel = document.getElementById(`panel-${mode}`);
    if (panel) panel.classList.remove('hidden');

    if (mode === 'blitz') this.startBlitzGame();
    else if (mode === 'match') this.initFormulaMatch();
    else if (mode === 'battle') this.initTeamBattle();
  }

  /* ================== GAME 1: MATH SPEED BLITZ ================== */
  startBlitzGame() {
    this.score = 0;
    this.streak = 0;
    this.updateBlitzUI();
    this.nextBlitzQuestion();
  }

  nextBlitzQuestion() {
    clearInterval(this.timer);
    this.timeLeft = 15;
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    this.currentQuestion = this.questions[randomIndex];

    const questionEl = document.getElementById('blitzQuestionText');
    const topicEl = document.getElementById('blitzTopic');
    const gradeEl = document.getElementById('blitzGrade');
    const optionsContainer = document.getElementById('blitzOptionsContainer');
    const timerBar = document.getElementById('blitzTimerBar');

    if (questionEl) {
      questionEl.innerHTML = this.formatMath(this.currentQuestion.q);
    }
    if (topicEl) topicEl.textContent = this.currentQuestion.topic;
    if (gradeEl) gradeEl.textContent = this.currentQuestion.grade;

    if (optionsContainer) {
      optionsContainer.innerHTML = this.currentQuestion.options.map((opt, idx) => `
        <button class="blitz-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700 font-bold text-base md:text-xl text-slate-800 dark:text-white transition transform active:scale-95 shadow-sm text-center flex items-center justify-center gap-3" data-idx="${idx}">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="katex-content flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.blitz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx);
          this.handleBlitzAnswer(selected, btn);
        });
      });
    }

    // Countdown Timer Bar
    this.timer = setInterval(() => {
      this.timeLeft--;
      const timeDisplay = document.getElementById('blitzTimerText');
      if (timeDisplay) timeDisplay.textContent = `${this.timeLeft}s`;
      if (timerBar) {
        const pct = (this.timeLeft / 15) * 100;
        timerBar.style.width = `${pct}%`;
        if (pct < 30) {
          timerBar.className = "h-full bg-red-500 rounded-full transition-all duration-1000";
        } else {
          timerBar.className = "h-full bg-purple-600 rounded-full transition-all duration-1000";
        }
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.playWrongSound();
        this.streak = 0;
        this.updateBlitzUI();
        this.showBlitzFeedback(false, `អស់ពេលហើយ! ចម្លើយត្រឹមត្រូវគឺ៖ ${this.formatMath(this.currentQuestion.options[this.currentQuestion.answer])}`);
      }
    }, 1000);
  }

  handleBlitzAnswer(selectedIdx, clickedBtn) {
    clearInterval(this.timer);
    const isCorrect = selectedIdx === this.currentQuestion.answer;

    document.querySelectorAll('.blitz-opt-btn').forEach(btn => btn.disabled = true);

    if (isCorrect) {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
      this.playCorrectSound();
      this.score += 10 + (this.streak * 2);
      this.streak++;
      if (this.streak >= 3 && typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
      this.updateBlitzUI();
      setTimeout(() => this.nextBlitzQuestion(), 1200);
    } else {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
      this.playWrongSound();
      this.streak = 0;
      this.updateBlitzUI();
      this.showBlitzFeedback(false, `មិនត្រឹមត្រូវទេ! ចម្លើយត្រឹមត្រូវគឺ៖ ${this.formatMath(this.currentQuestion.options[this.currentQuestion.answer])}`);
    }
  }

  showBlitzFeedback(correct, msg) {
    const feedbackBox = document.getElementById('blitzFeedbackBox');
    if (!feedbackBox) return;
    feedbackBox.innerHTML = `
      <div class="p-4 rounded-2xl ${correct ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} border text-center font-bold text-sm">
        <div>${msg}</div>
        <button id="btnBlitzNext" class="mt-3 block mx-auto px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition">
          សំណួរបន្ទាប់ ➔
        </button>
      </div>
    `;
    feedbackBox.classList.remove('hidden');
    document.getElementById('btnBlitzNext').addEventListener('click', () => {
      feedbackBox.classList.add('hidden');
      this.nextBlitzQuestion();
    });
  }

  updateBlitzUI() {
    const scoreEl = document.getElementById('blitzScoreText');
    const streakEl = document.getElementById('blitzStreakText');
    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = this.streak;
  }

  /* ================== GAME 2: FORMULA MEMORY MATCH (FIXED & LATEX) ================== */
  initFormulaMatch() {
    const container = document.getElementById('formulaMatchGrid');
    if (!container) return;

    // Pick 6 pairs (12 cards) with guaranteed 100% unique values (No duplicate 1s or identical answers)
    const shuffledPairs = [...this.formulaPairs].sort(() => Math.random() - 0.5);
    const selected = [];
    const usedRights = new Set();
    const usedLefts = new Set();

    for (const p of shuffledPairs) {
      if (!usedRights.has(p.right) && !usedLefts.has(p.left)) {
        selected.push(p);
        usedRights.add(p.right);
        usedLefts.add(p.left);
        if (selected.length === 6) break;
      }
    }

    let cards = [];
    selected.forEach(p => {
      cards.push({ id: p.id, latex: p.left, type: 'left' });
      cards.push({ id: p.id, latex: p.right, type: 'right' });
    });

    // Shuffle
    cards.sort(() => Math.random() - 0.5);

    container.innerHTML = cards.map((c, idx) => {
      const renderedLatex = this.renderLatex(c.latex, true);
      return `
        <div class="match-card group relative h-32 cursor-pointer rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-200 select-none overflow-hidden" data-id="${c.id}" data-idx="${idx}">
          <!-- Front Face (Unflipped) -->
          <div class="card-front absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex flex-col items-center justify-center text-white transition-all">
            <span class="text-3xl font-extrabold filter drop-shadow">❓</span>
            <span class="text-[11px] font-bold text-purple-200 mt-1 uppercase tracking-wider font-battambang">រូបមន្ត</span>
          </div>

          <!-- Back Face (Formula Rendered in LaTeX) -->
          <div class="card-back absolute inset-0 hidden bg-white dark:bg-slate-800 flex items-center justify-center p-3 text-center text-purple-950 dark:text-purple-100 font-extrabold text-base md:text-lg">
            <div class="latex-wrapper transform scale-110">${renderedLatex}</div>
          </div>
        </div>
      `;
    }).join('');

    let firstCard = null;
    let lockBoard = false;
    let matchedCount = 0;

    document.querySelectorAll('.match-card').forEach(card => {
      card.addEventListener('click', () => {
        if (lockBoard || card === firstCard || card.classList.contains('matched')) return;

        // Flip Card
        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');
        front.classList.add('hidden');
        back.classList.remove('hidden');
        card.classList.add('ring-4', 'ring-purple-400');
        this.playTone(440, 'sine', 0.08);

        if (!firstCard) {
          firstCard = card;
        } else {
          // Compare
          lockBoard = true;
          const isMatch = firstCard.dataset.id === card.dataset.id;

          if (isMatch) {
            this.playCorrectSound();
            [firstCard, card].forEach(c => {
              c.classList.remove('ring-4', 'ring-purple-400', 'border-purple-200', 'dark:border-purple-800');
              c.classList.add('matched', 'border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/60');
              c.querySelector('.card-back').classList.add('bg-emerald-50', 'dark:bg-emerald-950/60', 'text-emerald-800', 'dark:text-emerald-200');
            });

            firstCard = null;
            lockBoard = false;
            matchedCount++;

            if (matchedCount === 6) {
              this.playVictoryFanfare();
              setTimeout(() => {
                alert('🎉 អបអរសាទរ! សិស្សានុសិស្សបានផ្គូផ្គងរូបមន្តគណិតវិទ្យាបានត្រឹមត្រូវទាំងអស់!');
              }, 400);
            }
          } else {
            this.playWrongSound();
            [firstCard, card].forEach(c => {
              c.classList.add('ring-4', 'ring-red-400');
            });

            setTimeout(() => {
              [firstCard, card].forEach(c => {
                c.classList.remove('ring-4', 'ring-red-400', 'ring-purple-400');
                c.querySelector('.card-front').classList.remove('hidden');
                c.querySelector('.card-back').classList.add('hidden');
              });
              firstCard = null;
              lockBoard = false;
            }, 1000);
          }
        }
      });
    });
  }

  /* ================== GAME 3: TEAM BATTLE (RED VS BLUE) ================== */
  initTeamBattle() {
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.activeTeam = 'A';
    this.updateBattleUI();
    this.nextBattleQuestion();
  }

  updateBattleUI() {
    const aScore = document.getElementById('battleScoreTeamA');
    const bScore = document.getElementById('battleScoreTeamB');
    const turnEl = document.getElementById('battleActiveTurn');

    if (aScore) aScore.textContent = this.teamAScore;
    if (bScore) bScore.textContent = this.teamBScore;
    if (turnEl) {
      if (this.activeTeam === 'A') {
        turnEl.innerHTML = `<span class="px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-bold text-xs shadow-sm">វេនក្រុមទី ១ (ក្រុមក្រហម) 🔴</span>`;
      } else {
        turnEl.innerHTML = `<span class="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs shadow-sm">វេនក្រុមទី ២ (ក្រុមខៀវ) 🔵</span>`;
      }
    }
  }

  nextBattleQuestion() {
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    const q = this.questions[randomIndex];

    const qEl = document.getElementById('battleQuestionText');
    const optContainer = document.getElementById('battleOptionsContainer');

    if (qEl) {
      qEl.innerHTML = this.formatMath(q.q);
    }

    if (optContainer) {
      optContainer.innerHTML = q.options.map((opt, idx) => `
        <button class="battle-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 font-bold text-base md:text-xl text-slate-800 dark:text-white transition shadow-sm text-center flex items-center justify-center gap-3" data-idx="${idx}">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.battle-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx);
          if (selected === q.answer) {
            this.playCorrectSound();
            if (this.activeTeam === 'A') {
              this.teamAScore += 10;
            } else {
              this.teamBScore += 10;
            }
            if (typeof confetti === 'function') confetti({ particleCount: 60, spread: 70 });
          } else {
            this.playWrongSound();
          }

          // Switch team
          this.activeTeam = this.activeTeam === 'A' ? 'B' : 'A';
          this.updateBattleUI();
          setTimeout(() => this.nextBattleQuestion(), 1000);
        });
      });
    }
  }
}

window.mathGames = new MathGamesEngine();
