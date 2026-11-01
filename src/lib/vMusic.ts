import { holdBackgroundMusic } from '@/lib/backgroundMusic';
import { playKick, playNoiseHit, playVoice } from '@/lib/chiptune';
import { getAudioContext } from '@/lib/retroAudio';

const BEATS_PER_MINUTE = 124;
const STEPS_PER_BEAT = 4;
const STEPS_PER_BAR = 16;
const BARS_IN_LOOP = 8;
const STEPS_IN_LOOP = STEPS_PER_BAR * BARS_IN_LOOP;
const STEP_SECONDS = 60 / BEATS_PER_MINUTE / STEPS_PER_BEAT;
const SCHEDULE_AHEAD_SECONDS = 0.14;
const SCHEDULER_INTERVAL_MS = 30;
const MASTER_GAIN = 0.7;
const FADE_OUT_SECONDS = 0.08;

const BASS_GAIN = 0.075;
const ARP_GAIN = 0.024;
const LEAD_GAIN = 0.04;
const LEAD_OCTAVE_GAIN = 0.02;

/** Layers switch on as the combo builds, so a good run sounds like the signal locking in. */
const ARP_INTENSITY = 1;
const SNARE_INTENSITY = 1;
const LEAD_INTENSITY = 2;
const LEAD_OCTAVE_INTENSITY = 3;

/** Step within the bar, MIDI note, length in steps. */
type Note = [step: number, midi: number, length: number];

const LEAD_BARS: Note[][] = [
  [[0, 74, 3], [3, 77, 1], [4, 81, 4], [10, 79, 2], [12, 77, 2], [14, 76, 2]],
  [[0, 74, 6], [8, 69, 2], [10, 72, 2], [12, 74, 4]],
  [[0, 77, 3], [3, 79, 1], [4, 82, 4], [10, 81, 2], [12, 79, 2], [14, 77, 2]],
  [[0, 74, 6], [8, 70, 2], [10, 74, 2], [12, 77, 4]],
  [[0, 79, 3], [3, 82, 1], [4, 86, 4], [10, 84, 2], [12, 82, 2], [14, 81, 2]],
  [[0, 79, 6], [8, 74, 2], [10, 77, 2], [12, 79, 4]],
  [[0, 76, 3], [3, 79, 1], [4, 81, 4], [10, 85, 2], [12, 81, 2], [14, 79, 2]],
  [[0, 81, 8], [8, 85, 2], [10, 81, 2], [12, 76, 2], [14, 73, 2]],
];

/** One chord per two bars: Dm, Bb, Gm, A. */
const BASS_ROOTS = [50, 46, 43, 45];
const CHORD_TONES = [
  [74, 77, 81, 86],
  [70, 74, 77, 82],
  [67, 70, 74, 79],
  [69, 73, 76, 81],
];

const KICK_STEPS = [0, 4, 8, 12];
const SNARE_STEPS = [4, 12];

let timer = 0;
let master: GainNode | null = null;
let nextStepTime = 0;
let step = 0;
let rate = 1;
let intensity = 0;
let muted = false;

function scheduleStep(ctx: AudioContext, output: AudioNode, time: number) {
  const bar = Math.floor(step / STEPS_PER_BAR);
  const inBar = step % STEPS_PER_BAR;
  const chord = Math.floor(bar / 2);
  const stepSeconds = STEP_SECONDS / rate;

  if (KICK_STEPS.includes(inBar)) playKick(ctx, output, time);
  if (intensity >= SNARE_INTENSITY && SNARE_STEPS.includes(inBar)) {
    playNoiseHit(ctx, output, time, 1800, 0.1, 0.06);
  }
  if (inBar % 2 === 0) {
    const offbeat = inBar % 4 === 2;
    playNoiseHit(ctx, output, time, 7000, offbeat ? 0.06 : 0.025, offbeat ? 0.03 : 0.018);
  }

  // A steady eighth-note pulse with an octave on every offbeat keeps the tension up.
  if (inBar % 2 === 0) {
    const octave = inBar % 4 === 2 ? 12 : 0;
    playVoice(ctx, output, 'sawtooth', time, BASS_ROOTS[chord] + octave - 12, stepSeconds * 1.6, BASS_GAIN);
  }

  if (intensity >= ARP_INTENSITY) {
    const tones = CHORD_TONES[chord];
    playVoice(ctx, output, 'square', time, tones[inBar % tones.length], stepSeconds * 0.8, ARP_GAIN);
  }

  if (intensity < LEAD_INTENSITY) return;
  for (const [noteStep, midi, length] of LEAD_BARS[bar]) {
    if (noteStep !== inBar) continue;
    playVoice(ctx, output, 'square', time, midi, stepSeconds * length, LEAD_GAIN);
    if (intensity >= LEAD_OCTAVE_INTENSITY) {
      playVoice(ctx, output, 'triangle', time, midi + 12, stepSeconds * length, LEAD_OCTAVE_GAIN);
    }
  }
}

function schedule(ctx: AudioContext, output: AudioNode) {
  // Timers throttle in a hidden tab and the game pauses anyway, so hold the song in place.
  if (document.hidden) {
    nextStepTime = ctx.currentTime + SCHEDULE_AHEAD_SECONDS;
    return;
  }

  while (nextStepTime < ctx.currentTime + SCHEDULE_AHEAD_SECONDS) {
    scheduleStep(ctx, output, nextStepTime);
    nextStepTime += STEP_SECONDS / rate;
    step = (step + 1) % STEPS_IN_LOOP;
  }
}

export function startVMusic() {
  if (master) return;

  holdBackgroundMusic(true);

  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(muted ? 0 : MASTER_GAIN, ctx.currentTime);
  output.connect(ctx.destination);

  master = output;
  step = 0;
  rate = 1;
  intensity = 0;
  nextStepTime = ctx.currentTime + 0.05;

  schedule(ctx, output);
  timer = window.setInterval(() => schedule(ctx, output), SCHEDULER_INTERVAL_MS);
}

export function stopVMusic() {
  if (!master) return;

  const ctx = getAudioContext();
  const output = master;
  master = null;
  window.clearInterval(timer);

  // Notes already scheduled still play, so the fade is what silences them.
  output.gain.setValueAtTime(output.gain.value, ctx.currentTime);
  output.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_OUT_SECONDS);
  window.setTimeout(() => output.disconnect(), 400);

  holdBackgroundMusic(false);
}

export function setVMusicMuted(next: boolean) {
  muted = next;
  if (master) master.gain.setValueAtTime(muted ? 0 : MASTER_GAIN, getAudioContext().currentTime);
}

/** 1 plays at the written tempo; the game raises this as channels climb. */
export function setVMusicRate(nextRate: number) {
  rate = nextRate;
}

/** How many layers are playing, from 0 up to the player's combo crosses. */
export function setVMusicIntensity(next: number) {
  intensity = next;
}
