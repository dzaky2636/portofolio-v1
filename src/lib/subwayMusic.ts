import { holdBackgroundMusic } from '@/lib/backgroundMusic';
import { playKick, playNoiseHit, playVoice } from '@/lib/chiptune';
import { getAudioContext } from '@/lib/retroAudio';

const BEATS_PER_MINUTE = 132;
const STEPS_PER_BEAT = 4;
const STEPS_PER_BAR = 16;
const BARS_IN_LOOP = 8;
const STEPS_IN_LOOP = STEPS_PER_BAR * BARS_IN_LOOP;
const STEP_SECONDS = 60 / BEATS_PER_MINUTE / STEPS_PER_BEAT;
const SCHEDULE_AHEAD_SECONDS = 0.14;
const SCHEDULER_INTERVAL_MS = 30;
const MASTER_GAIN = 0.75;
const FADE_OUT_SECONDS = 0.08;

const LEAD_GAIN = 0.045;
const BASS_GAIN = 0.07;
const ARP_GAIN = 0.02;

/** Step within the bar, MIDI note, length in steps. */
type Note = [step: number, midi: number, length: number];

const LEAD_BARS: Note[][] = [
  [[0, 69, 2], [3, 72, 1], [4, 76, 2], [7, 74, 1], [8, 76, 2], [11, 79, 1], [12, 76, 2], [14, 74, 2]],
  [[0, 72, 3], [3, 69, 1], [4, 72, 2], [6, 74, 2], [8, 76, 4]],
  [[0, 77, 2], [3, 76, 1], [4, 72, 2], [7, 69, 1], [8, 72, 2], [11, 74, 1], [12, 76, 2], [14, 72, 2]],
  [[0, 69, 3], [3, 67, 1], [4, 69, 2], [6, 72, 2], [8, 69, 4]],
  [[0, 79, 2], [3, 76, 1], [4, 79, 2], [7, 81, 1], [8, 79, 2], [11, 76, 1], [12, 74, 2], [14, 72, 2]],
  [[0, 76, 3], [3, 74, 1], [4, 72, 2], [6, 67, 2], [8, 72, 4]],
  [[0, 71, 2], [3, 74, 1], [4, 79, 2], [7, 77, 1], [8, 79, 2], [11, 74, 1], [12, 71, 2], [14, 74, 2]],
  [[0, 76, 2], [2, 74, 2], [4, 71, 2], [6, 67, 2], [8, 69, 1], [9, 71, 1], [10, 74, 1], [11, 76, 1], [12, 79, 1], [13, 81, 3]],
];

/** One chord per two bars: Am, F, C, G. */
const BASS_ROOTS = [45, 41, 48, 43];
const CHORD_TONES = [
  [57, 60, 64, 69],
  [53, 57, 60, 65],
  [55, 60, 64, 67],
  [55, 59, 62, 67],
];

const BASS_STEPS = [0, 3, 6, 8, 11, 14];
const KICK_STEPS = [0, 7, 8];
const SNARE_STEPS = [4, 12];
const FILL_SNARE_STEPS = [13, 14, 15];

let timer = 0;
let master: GainNode | null = null;
let nextStepTime = 0;
let step = 0;
let loopCount = 0;
let rate = 1;
let muted = false;

function scheduleDrums(ctx: AudioContext, output: AudioNode, time: number, bar: number, inBar: number) {
  if (KICK_STEPS.includes(inBar)) playKick(ctx, output, time);

  const isFill = bar === BARS_IN_LOOP - 1 && FILL_SNARE_STEPS.includes(inBar);
  if (SNARE_STEPS.includes(inBar) || isFill) playNoiseHit(ctx, output, time, 1800, 0.1, 0.07);

  if (inBar % 2 === 0) {
    const offbeat = inBar % 4 === 2;
    playNoiseHit(ctx, output, time, 7000, offbeat ? 0.07 : 0.03, offbeat ? 0.04 : 0.025);
  }
}

function scheduleStep(ctx: AudioContext, output: AudioNode, time: number) {
  const bar = Math.floor(step / STEPS_PER_BAR);
  const inBar = step % STEPS_PER_BAR;
  const chord = Math.floor(bar / 2);
  const stepSeconds = STEP_SECONDS / rate;

  scheduleDrums(ctx, output, time, bar, inBar);

  if (BASS_STEPS.includes(inBar)) {
    const octave = inBar === 14 ? 12 : 0;
    playVoice(ctx, output, 'square', time, BASS_ROOTS[chord] + octave, stepSeconds * 1.8, BASS_GAIN);
  }

  for (const [noteStep, midi, length] of LEAD_BARS[bar]) {
    if (noteStep === inBar) {
      playVoice(ctx, output, 'square', time, midi, stepSeconds * length, LEAD_GAIN);
    }
  }

  // Every second pass adds an arpeggio so the loop doesn't wear out on long runs.
  if (loopCount % 2 === 1) {
    const tones = CHORD_TONES[chord];
    playVoice(ctx, output, 'triangle', time, tones[inBar % tones.length] + 12, stepSeconds, ARP_GAIN);
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
    step += 1;
    if (step === STEPS_IN_LOOP) {
      step = 0;
      loopCount += 1;
    }
  }
}

export function startSubwayMusic() {
  if (master) return;

  holdBackgroundMusic(true);

  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(muted ? 0 : MASTER_GAIN, ctx.currentTime);
  output.connect(ctx.destination);

  master = output;
  step = 0;
  loopCount = 0;
  rate = 1;
  nextStepTime = ctx.currentTime + 0.05;

  schedule(ctx, output);
  timer = window.setInterval(() => schedule(ctx, output), SCHEDULER_INTERVAL_MS);
}

export function stopSubwayMusic() {
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

export function setSubwayMusicMuted(next: boolean) {
  muted = next;
  if (master) master.gain.setValueAtTime(muted ? 0 : MASTER_GAIN, getAudioContext().currentTime);
}

/** 1 plays at the written tempo; the game raises this as the run speeds up. */
export function setSubwayMusicRate(nextRate: number) {
  rate = nextRate;
}
