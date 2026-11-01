import { getAudioContext } from '@/lib/retroAudio';

const MASTER_GAIN = 0.5;
const FADE_IN_SECONDS = 2.5;
const FADE_OUT_SECONDS = 0.6;
const SCHEDULE_AHEAD_SECONDS = 3;
const SCHEDULER_INTERVAL_MS = 1000;

const CHORD_SECONDS = 10;
const PAD_ATTACK_SECONDS = 3.5;
const PAD_RELEASE_SECONDS = 5;
const PAD_GAIN = 0.03;
const PAD_DETUNE_CENTS = 5;
const PAD_CUTOFF_HZ = 800;

const BELL_DECAY_SECONDS = 3;
const BELL_GAIN = 0.022;
const BELL_MIN_GAP_SECONDS = 2.5;
const BELL_MAX_GAP_SECONDS = 7;
const ECHO_DELAY_SECONDS = 0.48;
const ECHO_FEEDBACK = 0.38;

/** Fmaj7, Am7, Cmaj7, Gsus2: no tension to resolve, so the loop never asks for attention. */
const CHORDS = [
  [41, 53, 60, 64, 69],
  [45, 52, 60, 64, 67],
  [48, 52, 59, 64, 67],
  [43, 50, 57, 62, 67],
];

/** C major pentatonic fits every chord above, so bells can land anywhere. */
const BELL_NOTES = [72, 74, 76, 79, 81, 84];

interface MusicGraph {
  master: GainNode;
  pad: AudioNode;
  bells: AudioNode;
}

let graph: MusicGraph | null = null;
let timer = 0;
let enabled = false;
let held = false;
let playing = false;
let chordIndex = 0;
let nextChordTime = 0;
let nextBellTime = 0;

function midiToFrequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function getGraph(ctx: AudioContext) {
  if (graph) return graph;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.connect(ctx.destination);

  const pad = ctx.createBiquadFilter();
  pad.type = 'lowpass';
  pad.frequency.setValueAtTime(PAD_CUTOFF_HZ, ctx.currentTime);
  pad.connect(master);

  const bells = ctx.createGain();
  const echo = ctx.createDelay(1);
  echo.delayTime.setValueAtTime(ECHO_DELAY_SECONDS, ctx.currentTime);
  const feedback = ctx.createGain();
  feedback.gain.setValueAtTime(ECHO_FEEDBACK, ctx.currentTime);
  bells.connect(master);
  bells.connect(echo);
  echo.connect(feedback);
  feedback.connect(echo);
  feedback.connect(master);

  graph = { master, pad, bells };
  return graph;
}

function schedulePadNote(ctx: AudioContext, output: AudioNode, start: number, midi: number) {
  const end = start + CHORD_SECONDS + PAD_RELEASE_SECONDS;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(PAD_GAIN, start + PAD_ATTACK_SECONDS);
  gain.gain.setValueAtTime(PAD_GAIN, start + CHORD_SECONDS);
  gain.gain.linearRampToValueAtTime(0, end);
  gain.connect(output);

  for (const detune of [-PAD_DETUNE_CENTS, PAD_DETUNE_CENTS]) {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(midiToFrequency(midi), start);
    osc.detune.setValueAtTime(detune, start);
    osc.connect(gain);
    osc.start(start);
    osc.stop(end);
  }
}

function scheduleBell(ctx: AudioContext, output: AudioNode, start: number) {
  const midi = BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)];
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(midiToFrequency(midi), start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(BELL_GAIN, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + BELL_DECAY_SECONDS);
  osc.connect(gain);
  gain.connect(output);
  osc.start(start);
  osc.stop(start + BELL_DECAY_SECONDS + 0.02);
}

function schedule(ctx: AudioContext, { pad, bells }: MusicGraph) {
  const horizon = ctx.currentTime + SCHEDULE_AHEAD_SECONDS;

  while (nextChordTime < horizon) {
    for (const midi of CHORDS[chordIndex]) schedulePadNote(ctx, pad, nextChordTime, midi);
    chordIndex = (chordIndex + 1) % CHORDS.length;
    nextChordTime += CHORD_SECONDS;
  }

  while (nextBellTime < horizon) {
    scheduleBell(ctx, bells, nextBellTime);
    nextBellTime +=
      BELL_MIN_GAP_SECONDS + Math.random() * (BELL_MAX_GAP_SECONDS - BELL_MIN_GAP_SECONDS);
  }
}

function fadeTo(ctx: AudioContext, { master }: MusicGraph, target: number, seconds: number) {
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(target, now + seconds);
}

function sync() {
  const shouldPlay = enabled && !held;
  if (shouldPlay === playing) return;
  playing = shouldPlay;

  const ctx = getAudioContext();
  const nodes = getGraph(ctx);

  if (!shouldPlay) {
    fadeTo(ctx, nodes, 0, FADE_OUT_SECONDS);
    window.clearInterval(timer);
    return;
  }

  nextChordTime = ctx.currentTime + 0.05;
  nextBellTime = ctx.currentTime + BELL_MIN_GAP_SECONDS;
  fadeTo(ctx, nodes, MASTER_GAIN, FADE_IN_SECONDS);
  schedule(ctx, nodes);
  timer = window.setInterval(() => schedule(ctx, nodes), SCHEDULER_INTERVAL_MS);
}

/** Call from a user gesture: browsers keep audio silent until there has been one. */
export function setBackgroundMusicEnabled(next: boolean) {
  enabled = next;
  sync();
}

/** Steps aside while something louder plays, without touching the visitor's setting. */
export function holdBackgroundMusic(next: boolean) {
  held = next;
  sync();
}
