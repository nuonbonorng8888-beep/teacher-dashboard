/**
 * Classroom Tools: Lucky Wheel, Timer, Stopwatch, Sound Effects
 */

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

