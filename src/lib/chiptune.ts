let noiseBuffer: AudioBuffer | null = null;

function midiToFrequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function getNoiseBuffer(ctx: AudioContext) {
  if (noiseBuffer) return noiseBuffer;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

export function playVoice(
  ctx: AudioContext,
  output: AudioNode,
  type: OscillatorType,
  start: number,
  midi: number,
  duration: number,
  peak: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(midiToFrequency(midi), start);
  gain.gain.setValueAtTime(peak, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain);
  gain.connect(output);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playKick(ctx: AudioContext, output: AudioNode, start: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, start);
  osc.frequency.exponentialRampToValueAtTime(45, start + 0.08);
  gain.gain.setValueAtTime(0.16, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + 0.11);
  osc.connect(gain);
  gain.connect(output);
  osc.start(start);
  osc.stop(start + 0.13);
}

export function playNoiseHit(
  ctx: AudioContext,
  output: AudioNode,
  start: number,
  cutoff: number,
  duration: number,
  peak: number
) {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(cutoff, start);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(peak, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(output);
  noise.start(start);
  noise.stop(start + duration + 0.02);
}
