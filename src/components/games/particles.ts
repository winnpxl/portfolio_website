import { BLOCKS, type BlockName } from "./palette";

/** The four confetti marks scattered around the illustration. */
export type ConfettiShape = "ring" | "plus" | "dot" | "spark";

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: BlockName;
  shape: ConfettiShape;
  angle: number;
  spin: number;
};

const SHAPES: readonly ConfettiShape[] = ["ring", "plus", "dot", "spark"];
/** Hard ceiling so a busy moment cannot grow the list without bound. */
const CAP = 420;

export function burst(
  into: Particle[],
  x: number,
  y: number,
  colors: readonly BlockName[],
  count: number,
  power = 1,
) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const speed = (60 + Math.random() * 220) * power;
    const max = 420 + Math.random() * 520;
    into.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed - 110 * power,
      life: max,
      max,
      size: (5 + Math.random() * 5) * Math.max(0.6, Math.min(power, 1.4)),
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      angle: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 8,
    });
  }
  if (into.length > CAP) into.splice(0, into.length - CAP);
}

/** Advances and prunes in place, so no array is allocated per frame. */
export function stepParticles(list: Particle[], dt: number, gravity = 520) {
  const s = dt / 1000;
  const drag = Math.pow(0.35, s);
  let keep = 0;
  for (const p of list) {
    p.life -= dt;
    if (p.life <= 0) continue;
    p.vx *= drag;
    p.vy = p.vy * drag + gravity * s;
    p.x += p.vx * s;
    p.y += p.vy * s;
    p.angle += p.spin * s;
    list[keep++] = p;
  }
  list.length = keep;
}

export function drawConfetti(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  shape: ConfettiShape,
  size: number,
  color: string,
  alpha = 1,
  angle = 0,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(2, size * 0.38);
  ctx.beginPath();
  if (shape === "ring") {
    ctx.arc(0, 0, size * 0.75, 0, Math.PI * 2);
    ctx.stroke();
  } else if (shape === "plus") {
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.stroke();
  } else if (shape === "dot") {
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.lineWidth = Math.max(1.5, size * 0.25);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.moveTo(Math.cos(a) * size * 0.45, Math.sin(a) * size * 0.45);
      ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export function drawParticles(ctx: CanvasRenderingContext2D, list: readonly Particle[]) {
  for (const p of list) {
    drawConfetti(
      ctx,
      p.x,
      p.y,
      p.shape,
      p.size,
      BLOCKS[p.color].fill,
      Math.min(1, (p.life / p.max) * 1.8),
      p.angle,
    );
  }
}
