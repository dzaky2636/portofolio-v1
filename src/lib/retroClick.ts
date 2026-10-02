import { getAudioContext } from '@/lib/retroAudio';

/** Short square-wave click for UI easter eggs (call from user gesture). */
export function playRetroClick() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(920, now);
  osc.frequency.exponentialRampToValueAtTime(240, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.07);
}
