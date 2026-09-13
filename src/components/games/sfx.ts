import type { InvadersEvent } from "./invaders-engine";
import type { TetrisEvent } from "./tetris-engine";

type Tone = {
  from: number;
  to?: number;
  dur: number;
  gain?: number;
  type?: OscillatorType;
  delay?: number;
};

type Noise = {
  dur: number;
  gain?: number;
  freq?: number;
  filter?: BiquadFilterType;
  delay?: number;
};

/**
 * Game sound, synthesised rather than loaded, in the same spirit as the
 * site's interface ticks. Each game owns one of these; `enabled` follows
 * the site-wide mute toggle.
 *
 * Browsers only start audio after a gesture, so the games call unlock()
 * from their key and click handlers.
 */
export class Sfx {
  enabled = true;
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  unlock() {
    if (this.enabled) this.context();
  }

  private context() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.out = this.ctx.createGain();
      this.out.gain.value = 0.6;
      this.out.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  /** The context only when sound is on and actually running. */
  private live() {
    if (!this.enabled) return null;
    const ctx = this.context();
    return ctx && ctx.state === "running" && this.out ? ctx : null;
  }

  tone({ from, to = from, dur, gain = 0.05, type = "square", delay = 0 }: Tone) {
    const ctx = this.live();
    if (!ctx || !this.out) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
    // Exponential ramps cannot reach zero, hence the small floor.
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(gain, t + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(env);
    env.connect(this.out);
    osc.start(t);
    osc.stop(t + dur + 0.03);
    osc.onended = () => {
      osc.disconnect();
      env.disconnect();
    };
  }

  noise({ dur, gain = 0.08, freq = 1200, filter = "bandpass", delay = 0 }: Noise) {
    const ctx = this.live();
    if (!ctx || !this.out) return;
    if (!this.noiseBuffer) {
      const length = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buffer;
    }
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    const shape = ctx.createBiquadFilter();
    const env = ctx.createGain();
    src.buffer = this.noiseBuffer;
    shape.type = filter;
    shape.frequency.value = freq;
    env.gain.setValueAtTime(gain, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(shape);
    shape.connect(env);
    env.connect(this.out);
    src.start(t);
    src.stop(t + dur + 0.02);
    src.onended = () => {
      src.disconnect();
      shape.disconnect();
      env.disconnect();
    };
  }

  arpeggio(
    notes: readonly number[],
    {
      step = 0.07,
      dur = 0.12,
      gain = 0.045,
      type = "triangle",
      delay = 0,
    }: { step?: number; dur?: number; gain?: number; type?: OscillatorType; delay?: number } = {},
  ) {
    notes.forEach((note, i) => this.tone({ from: note, dur, gain, type, delay: delay + i * step }));
  }

  dispose() {
    void this.ctx?.close();
    this.ctx = null;
    this.out = null;
  }
}

export function tetrisVoice(sfx: Sfx, e: TetrisEvent) {
  switch (e.type) {
    case "move":
      sfx.tone({ from: 540, dur: 0.03, gain: 0.018, type: "square" });
      break;
    case "rotate":
      sfx.tone({ from: 760, to: 1020, dur: 0.05, gain: 0.024, type: "triangle" });
      break;
    case "hold":
      sfx.tone({ from: 460, to: 700, dur: 0.07, gain: 0.03, type: "sine" });
      break;
    case "lock":
      sfx.tone({ from: 210, to: 120, dur: 0.07, gain: 0.045, type: "triangle" });
      break;
    case "hardDrop":
      sfx.noise({ dur: 0.09, gain: 0.06, freq: 520, filter: "lowpass" });
      sfx.tone({ from: 170, to: 60, dur: 0.12, gain: 0.06, type: "sine" });
      break;
    case "clear":
      // Four rows at once gets the full run.
      sfx.arpeggio(
        e.rows >= 4 ? [523, 659, 784, 1047, 1319, 1568] : [523, 659, 784, 1047].slice(0, e.rows + 1),
        { step: 0.06, dur: 0.14, gain: e.rows >= 4 ? 0.05 : 0.04 },
      );
      break;
    case "levelUp":
      sfx.arpeggio([784, 988, 1175, 1568], { step: 0.08, dur: 0.16, gain: 0.04, delay: 0.25 });
      break;
    case "over":
      sfx.arpeggio([392, 330, 262, 196], { step: 0.15, dur: 0.24, gain: 0.04, type: "square" });
      break;
  }
}

/** The four falling bass notes of the original march. */
const STEP_NOTES = [98, 87.3, 77.8, 73.4];

export function invadersVoice(sfx: Sfx, e: InvadersEvent) {
  switch (e.type) {
    case "shoot":
      sfx.tone({ from: 1500, to: 380, dur: 0.1, gain: 0.022, type: "square" });
      break;
    case "step":
      sfx.tone({ from: STEP_NOTES[e.note], dur: 0.07, gain: 0.055, type: "square" });
      break;
    case "kill":
      sfx.noise({ dur: 0.14, gain: 0.05, freq: 1400, filter: "bandpass" });
      sfx.tone({ from: 520, to: 110, dur: 0.12, gain: 0.025, type: "square" });
      break;
    case "ufoTick":
      sfx.tone({ from: e.high ? 880 : 660, dur: 0.1, gain: 0.012, type: "sine" });
      break;
    case "ufoHit":
      sfx.arpeggio([1047, 1319, 1568, 2093], { step: 0.05, dur: 0.1, gain: 0.035 });
      break;
    case "playerHit":
      sfx.noise({ dur: 0.55, gain: 0.11, freq: 700, filter: "lowpass" });
      sfx.tone({ from: 320, to: 40, dur: 0.7, gain: 0.05, type: "sawtooth" });
      break;
    case "wave":
      sfx.arpeggio([523, 659, 784, 1047], { step: 0.09, dur: 0.16, gain: 0.04 });
      break;
    case "extraLife":
      sfx.arpeggio([784, 1047, 1319], { step: 0.08, dur: 0.12, gain: 0.04 });
      break;
    case "over":
      sfx.arpeggio([330, 262, 196, 131], { step: 0.18, dur: 0.26, gain: 0.045, type: "square" });
      break;
  }
}
