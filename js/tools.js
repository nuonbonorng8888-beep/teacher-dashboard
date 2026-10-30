/**
 * Classroom Tools: Lucky Wheel, Timer, Stopwatch, Sound Effects, Standard Dialogs
 */

function showStandardDialog({ title, text, html, icon = 'info', confirmText = 'យល់ព្រម', showCancel = false, cancelText = 'បោះបង់', onConfirm = null }) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: title,
      text: text,
      html: html,
      icon: icon,
      confirmButtonText: confirmText,
      showCancelButton: showCancel,
      cancelButtonText: cancelText,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#94a3b8',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-3xl border border-purple-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xl font-kantumruy',
        title: 'text-lg md:text-xl font-bold text-slate-900 dark:text-white',
        htmlContainer: 'text-sm text-slate-600 dark:text-slate-300',
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold text-xs shadow-md',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold text-xs'
      }
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      }
    });
  } else {
    // Custom modal fallback without native browser alert
    const fallbackBox = document.createElement('div');
    fallbackBox.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm';
    fallbackBox.innerHTML = `
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
        <h4 class="font-bold text-base text-slate-900 dark:text-white">${title || ''}</h4>
        <div class="text-xs text-slate-600 dark:text-slate-300">${html || text || ''}</div>
        <div class="flex items-center justify-center gap-2 pt-2">
          ${showCancel ? `<button id="fbCancel" class="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs">${cancelText}</button>` : ''}
          <button id="fbOk" class="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow">${confirmText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(fallbackBox);
    fallbackBox.querySelector('#fbOk').onclick = () => {
      fallbackBox.remove();
      if (onConfirm) onConfirm();
    };
    if (showCancel) {
      fallbackBox.querySelector('#fbCancel').onclick = () => fallbackBox.remove();
    }
  }
}
window.showStandardDialog = showStandardDialog;

function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none max-w-sm';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `pointer-events-auto transform transition-all duration-300 translate-y-2 opacity-0 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 mb-2 ${
    type === 'error' ? 'bg-red-600 text-white' :
    type === 'warning' ? 'bg-amber-500 text-white' :
    'bg-purple-700 text-white'
  }`;
  toast.innerHTML = message;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
window.showToast = showToast;

class ClassroomTools {
  constructor() {
    this.audioCtx = null;
    this.wheelSpinning = false;
    this.currentRotation = 0;
    this.timerInterval = null;
    this.timerSeconds = 300; // 5 mins default
    this.timerTotal = 300;
    this.timerRunning = false;
    this.stopwatchInterval = null;
    this.stopwatchMs = 0;
    this.stopwatchRunning = false;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  beep(freq = 600, duration = 0.08, type = 'sine') {
    try {
      this.initAudio();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted yet
    }
  }

  playVictoryTone() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    notes.forEach((freq, idx) => {
      setTimeout(() => this.beep(freq, 0.25, 'triangle'), idx * 120);
    });
  }

  /* ================== LUCKY WHEEL ================== */
  drawWheel(canvasId, names) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = centerX - 10;
    const count = names.length;
    if (count === 0) return;

    ctx.clearRect(0, 0, width, height);

    const colors = [
      '#7C3AED', '#EC4899', '#3B82F6', '#10B981', 
      '#F59E0B', '#8B5CF6', '#06B6D4', '#EF4444',
      '#6366F1', '#14B8A6', '#F97316', '#84CC16'
    ];

    const sliceAngle = (2 * Math.PI) / count;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.currentRotation);

    for (let i = 0; i < count; i++) {
      const angle = i * sliceAngle;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + sliceAngle);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px "Kantumruy Pro", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 3;
      const displayName = names[i].length > 14 ? names[i].substring(0, 12) + '...' : names[i];
      ctx.fillText(displayName, radius - 18, 5);
      ctx.restore();
    }

    // Center hub
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#7C3AED';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#7C3AED';
    ctx.fill();

    ctx.restore();
  }

  spinWheel(canvasId, names, onWinner) {
    if (this.wheelSpinning || names.length === 0) return;
    this.wheelSpinning = true;

    // Pick random target
    const count = names.length;
    const sliceAngle = (2 * Math.PI) / count;
    const winningIndex = Math.floor(Math.random() * count);
    
    // Pointer is at the top (angle -Math.PI / 2 or 3*PI/2)
    // We want slice winningIndex to align with pointer at end
    const fullRotations = (5 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
    const targetSliceAngle = winningIndex * sliceAngle + sliceAngle / 2;
    // Align with 270 deg (top pointer)
    const targetRotation = fullRotations + (1.5 * Math.PI - targetSliceAngle);

    const startRotation = this.currentRotation % (2 * Math.PI);
    const totalRotation = targetRotation + (2 * Math.PI - (startRotation % (2 * Math.PI)));
    const duration = 4500; // ms
    const startTime = performance.now();

    let lastTickAngle = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      this.currentRotation = startRotation + totalRotation * ease;
      this.drawWheel(canvasId, names);

      // Play tick sound when passing each slice
      if (Math.abs(this.currentRotation - lastTickAngle) > sliceAngle) {
        this.beep(800, 0.03, 'sine');
        lastTickAngle = this.currentRotation;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.wheelSpinning = false;
        const winner = names[winningIndex];
        this.playVictoryTone();
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        if (onWinner) onWinner(winner, winningIndex);
      }
    };

    requestAnimationFrame(animate);
  }

  /* ================== CLASSROOM TIMER ================== */
  formatTimerDisplay(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  startTimer(onTick, onComplete) {
    if (this.timerRunning) return;
    this.timerRunning = true;
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        if (onTick) onTick(this.formatTimerDisplay(this.timerSeconds), this.timerSeconds, this.timerTotal);
      } else {
        this.pauseTimer();
        this.beep(900, 0.5, 'square');
        setTimeout(() => this.beep(900, 0.5, 'square'), 600);
        setTimeout(() => this.beep(900, 0.8, 'square'), 1200);
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
  }

  resetTimer(newTotal = 300, onTick = null) {
    this.pauseTimer();
    this.timerTotal = newTotal;
    this.timerSeconds = newTotal;
    if (onTick) onTick(this.formatTimerDisplay(this.timerSeconds), this.timerSeconds, this.timerTotal);
  }

  /* ================== STOPWATCH ================== */
  formatStopwatch(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  }

  startStopwatch(onTick) {
    if (this.stopwatchRunning) return;
    this.stopwatchRunning = true;
    const startOffset = performance.now() - this.stopwatchMs;
    this.stopwatchInterval = setInterval(() => {
      this.stopwatchMs = performance.now() - startOffset;
      if (onTick) onTick(this.formatStopwatch(this.stopwatchMs));
    }, 30);
  }

  pauseStopwatch() {
    this.stopwatchRunning = false;
    clearInterval(this.stopwatchInterval);
  }

  resetStopwatch(onTick) {
    this.pauseStopwatch();
    this.stopwatchMs = 0;
    if (onTick) onTick('00:00.00');
  }
}

window.classroomTools = new ClassroomTools();

