import { getAudioContext, prefersReducedMotion } from '@/lib/retroAudio';

const KONAMI_STEPS = 10;

function stepFrequency(stepIndex: number): number {
  return 280 + stepIndex * 110;
}

function stepDuration(stepIndex: number): number {
  return 0.04 + stepIndex * 0.0055;
}

function stepGain(stepIndex: number): number {
  return 0.08 + stepIndex * 0.0065;
}

function playSquareTone(
  ctx: AudioContext,
  start: number,
  freq: number,
  duration: number,
  gainPeak: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(gainPeak, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** Escalating blip for each correct Konami key (stepIndex 0–9). */
export function playCheatCorrect(stepIndex: number) {
  if (prefersReducedMotion()) return;
  const step = Math.max(0, Math.min(stepIndex, KONAMI_STEPS - 1));
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const duration = stepDuration(step);
  const gainPeak = stepGain(step);
  const freq = stepFrequency(step);

  if (step === KONAMI_STEPS - 1) {
    playSquareTone(ctx, now, freq, duration * 0.7, gainPeak);
    playSquareTone(ctx, now + duration * 0.55, freq * 1.25, duration, gainPeak * 1.1);
    return;
  }

  playSquareTone(ctx, now, freq, duration, gainPeak);

  if (step >= 6) {
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(freq * 1.02, now);
    gain2.gain.setValueAtTime(gainPeak * 0.35, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + duration + 0.02);
  }
}

/** Harsh buzz when the sequence breaks. */
export function playCheatWrong() {
  if (prefersReducedMotion()) return;
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);

  const bufferSize = ctx.sampleRate * 0.04;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.06, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
}

/** Short fanfare when the full code is entered. */
export function playCheatComplete() {
  if (prefersReducedMotion()) return;
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const notes = [392, 494, 587, 784];
  const noteLen = 0.07;
  const gap = 0.055;

  notes.forEach((freq, i) => {
    const start = now + i * gap;
    playSquareTone(ctx, start, freq, noteLen, 0.11 + i * 0.01);
  });
}
