import { getAudioContext, playSquareTone } from '@/lib/retroAudio';

function playNotes(notes: number[], noteLength: number, gap: number, gainPeak: number) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  notes.forEach((freq, index) => {
    playSquareTone(ctx, now + index * gap, freq, noteLength, gainPeak);
  });
}

function playSweep(from: number, to: number, duration: number, gainPeak: number) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(to, now + duration);
  gain.gain.setValueAtTime(gainPeak, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playNoise(duration: number, gainPeak: number) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainPeak, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  noise.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
}

export function playGameStart() {
  playNotes([330, 494], 0.05, 0.05, 0.06);
}

export function playGameOver() {
  playNotes([392, 311, 233, 165], 0.11, 0.09, 0.09);
}

export function playGameWin() {
  playNotes([392, 494, 587, 784, 988], 0.08, 0.07, 0.09);
}

/** Pitch climbs with the score, so a long run sounds like it is getting somewhere. */
export function playSnakeEat(score: number) {
  const base = 440 + Math.min(score, 30) * 14;
  playNotes([base, base * 1.5], 0.05, 0.04, 0.07);
}

export function playSnakeTurn() {
  playNotes([180], 0.02, 0, 0.025);
}

export function playSubwayLane() {
  playSweep(320, 480, 0.05, 0.04);
}

export function playSubwayJump() {
  playSweep(240, 720, 0.14, 0.06);
}

export function playSubwayRoll() {
  playSweep(360, 110, 0.14, 0.06);
}

export function playSubwayCoin() {
  playNotes([988, 1319], 0.05, 0.04, 0.05);
}

export function playSubwayMagnet() {
  playNotes([523, 659, 784, 1047], 0.05, 0.04, 0.07);
}

export function playSubwayStumble() {
  playSweep(200, 70, 0.14, 0.1);
  playNoise(0.06, 0.05);
}

export function playSubwayCrash() {
  playNoise(0.3, 0.12);
  playSweep(220, 45, 0.45, 0.1);
}

export function playNonogramFill() {
  playSweep(640, 420, 0.03, 0.05);
}

export function playNonogramMark() {
  playSweep(300, 220, 0.03, 0.04);
}

export function playNonogramClear() {
  playSweep(180, 120, 0.03, 0.03);
}

export function playNonogramLine() {
  playNotes([659, 880], 0.05, 0.04, 0.05);
}
