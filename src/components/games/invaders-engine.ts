import { ARCADE, BLOCKS, drawCells, drawSprite, type BlockName } from "./palette";
import {
  burst,
  drawConfetti,
  drawParticles,
  stepParticles,
  type ConfettiShape,
  type Particle,
} from "./particles";

/* ------------------------------------------------------------------ */
/* Field and sprites                                                   */
/* ------------------------------------------------------------------ */

export const W = 640;
export const H = 720;

const INV_P = 3;
const COLS = 11;
const ROWS = 5;
const COL_W = 46;
const ROW_H = 38;
const INV_H = 8 * INV_P;

const PLAYER_P = 4;
const PLAYER_W = 13 * PLAYER_P;
const PLAYER_H = 8 * PLAYER_P;
const PLAYER_Y = H - 84;
const GROUND_Y = H - 36;

const UFO_Y = 44;
const UFO_W = 16 * INV_P;
const UFO_H = 7 * INV_P;

const BUNKER_CELL = 4;
const BUNKER_COLS = 18;
const BUNKER_ROWS = 12;
const BUNKER_W = BUNKER_COLS * BUNKER_CELL;
const BUNKER_H = BUNKER_ROWS * BUNKER_CELL;
const BUNKER_Y = PLAYER_Y - 96;

const PLAYER_SPEED = 300;
const SHOT_SPEED = 780;
const MARGIN = 18;
const STEP_X = 10;
const STEP_Y = 18;

/** Classic silhouettes; "X" is a lit pixel. Invaders have two frames. */
export const MASKS = {
  squid: [
    ["...XX...", "..XXXX..", ".XXXXXX.", "XX.XX.XX", "XXXXXXXX", ".X.XX.X.", "X......X", ".X....X."],
    ["...XX...", "..XXXX..", ".XXXXXX.", "XX.XX.XX", "XXXXXXXX", "..X..X..", ".X.XX.X.", "X.X..X.X"],
  ],
  crab: [
    ["..X.....X..", "...X...X...", "..XXXXXXX..", ".XX.XXX.XX.", "XXXXXXXXXXX", "X.XXXXXXX.X", "X.X.....X.X", "...XX.XX..."],
    ["..X.....X..", "X..X...X..X", "X.XXXXXXX.X", "XXX.XXX.XXX", "XXXXXXXXXXX", ".XXXXXXXXX.", "..X.....X..", ".X.......X."],
  ],
  octopus: [
    ["....XXXX....", ".XXXXXXXXXX.", "XXXXXXXXXXXX", "XXX..XX..XXX", "XXXXXXXXXXXX", "...XX..XX...", "..XX.XX.XX..", "XX........XX"],
    ["....XXXX....", ".XXXXXXXXXX.", "XXXXXXXXXXXX", "XXX..XX..XXX", "XXXXXXXXXXXX", "..XXX..XXX..", ".XX..XX..XX.", "..XX....XX.."],
  ],
  player: ["......X......", ".....XXX.....", ".....XXX.....", ".XXXXXXXXXXX.", "XXXXXXXXXXXXX", "XXXXXXXXXXXXX", "XXXXXXXXXXXXX", "XXXXXXXXXXXXX"],
  ufo: [".....XXXXXX.....", "...XXXXXXXXXX...", "..XXXXXXXXXXXX..", ".XX.XX.XX.XX.XX.", "XXXXXXXXXXXXXXXX", "..XXX..XX..XXX..", "...X........X..."],
  bunker: [
    "....XXXXXXXXXX....",
    "...XXXXXXXXXXXX...",
    "..XXXXXXXXXXXXXX..",
    ".XXXXXXXXXXXXXXXX.",
    "XXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXXXX",
    "XXXXX........XXXXX",
    "XXXX..........XXXX",
    "XXXX..........XXXX",
  ],
} as const;

type Kind = "squid" | "crab" | "octopus";
const ROW_KIND: readonly Kind[] = ["squid", "crab", "crab", "octopus", "octopus"];
const ROW_COLOR: readonly BlockName[] = ["purple", "red", "orange", "yellow", "green"];
const ROW_POINTS = [30, 20, 20, 10, 10] as const;
const KIND_W: Record<Kind, number> = { squid: 8 * INV_P, crab: 11 * INV_P, octopus: 12 * INV_P };
const UFO_POINTS = [50, 100, 150, 300] as const;
/** Ground line with the gaps from the illustration, as fractions of width. */
const GROUND = [
  [0.02, 0.06],
  [0.09, 0.7],
  [0.73, 0.92],
  [0.95, 0.975],
] as const;

export type InvadersStatus = "ready" | "playing" | "paused" | "over";

export type InvadersEvent =
  | { type: "shoot" }
  | { type: "step"; note: number }
  | { type: "kill" }
  | { type: "ufoTick"; high: boolean }
  | { type: "ufoHit" }
  | { type: "playerHit" }
  | { type: "wave" }
  | { type: "extraLife" }
  | { type: "over" };

type Box = { x: number; y: number; w: number; h: number };
type Invader = { row: number; col: number; alive: boolean };
type Shot = { x: number; y: number; vy: number; enemy: boolean; phase: number };
type Bunker = { x: number; y: number; cells: boolean[][] };
type Popup = { x: number; y: number; text: string; color: BlockName; life: number; max: number };
type Star = { x: number; y: number; r: number; phase: number };
type Decor = { x: number; y: number; size: number; shape: ConfettiShape; color: BlockName; angle: number };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function overlap(a: Box, b: Box) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function shotBox(s: Shot): Box {
  return s.enemy
    ? { x: s.x - 5, y: s.y - 10, w: 10, h: 20 }
    : { x: s.x - 3.5, y: s.y - 10, w: 7, h: 20 };
}

/* ------------------------------------------------------------------ */
/* Rules                                                               */
/* ------------------------------------------------------------------ */

/**
 * Plain state and rules with no React or DOM. Physics runs in small fixed
 * substeps so a fast shot cannot skip through an invader on a slow frame.
 */
export class InvadersGame {
  status: InvadersStatus = "ready";
  score = 0;
  lives = 3;
  wave = 1;
  invaders: Invader[] = [];
  ox = 0;
  oy = 0;
  frame = 0;
  playerX = W / 2;
  shots: Shot[] = [];
  bunkers: Bunker[] = [];
  ufo: { x: number; dir: 1 | -1; points: number } | null = null;
  particles: Particle[] = [];
  popups: Popup[] = [];
  banner: { text: string; t: number; max: number } | null = null;
  respawnT = 0;
  invulnT = 0;
  time = 0;
  readonly stars: Star[];
  readonly decor: Decor[];

  private dir: 1 | -1 = 1;
  private stepT = 0;
  private enemyT = 0;
  private ufoT = 0;
  private ufoTickT = 0;
  private ufoHigh = false;
  private note = 0;
  private nextLife = 1500;
  private keys = { left: false, right: false, fire: false };
  private readonly emit: (e: InvadersEvent) => void;
  private readonly changed: () => void;

  constructor(emit: (e: InvadersEvent) => void, changed: () => void) {
    this.emit = emit;
    this.changed = changed;
    this.stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * (GROUND_Y - 10),
      r: Math.random() < 0.85 ? rand(0.6, 1.3) : rand(1.4, 2),
      phase: Math.random() * Math.PI * 2,
    }));
    const shapes: ConfettiShape[] = ["ring", "plus", "spark", "dot"];
    const colors: BlockName[] = ["yellow", "purple", "blue", "orange", "green", "pink"];
    this.decor = Array.from({ length: 10 }, (_, i) => ({
      x: rand(30, W - 30),
      y: rand(70, BUNKER_Y - 40),
      size: rand(5, 9),
      shape: shapes[i % shapes.length],
      color: colors[i % colors.length],
      angle: rand(0, Math.PI),
    }));
    this.resetFormation();
    this.buildBunkers();
  }

  start() {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.nextLife = 1500;
    this.shots = [];
    this.particles = [];
    this.popups = [];
    this.ufo = null;
    this.playerX = W / 2;
    this.respawnT = 0;
    this.invulnT = 0;
    this.releaseKeys();
    this.resetFormation();
    this.buildBunkers();
    this.ufoT = rand(14000, 22000);
    this.banner = { text: "Wave 1", t: 1300, max: 1300 };
    this.status = "playing";
    this.changed();
  }

  togglePause() {
    if (this.status === "playing") this.pause();
    else if (this.status === "paused") {
      this.status = "playing";
      this.changed();
    }
  }

  pause() {
    if (this.status !== "playing") return;
    this.status = "paused";
    this.releaseKeys();
    this.changed();
  }

  press(key: "left" | "right" | "fire", down: boolean) {
    this.keys[key] = down;
  }

  private releaseKeys() {
    this.keys = { left: false, right: false, fire: false };
  }

  private resetFormation() {
    this.invaders = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) this.invaders.push({ row, col, alive: true });
    }
    this.ox = Math.round((W - COLS * COL_W) / 2);
    // Later waves start a little lower, so they arrive sooner.
    this.oy = 96 + Math.min(this.wave - 1, 6) * 14;
    this.dir = 1;
    this.frame = 0;
    this.stepT = 0;
    this.note = 0;
    this.enemyT = rand(900, 1500);
  }

  private buildBunkers() {
    this.bunkers = [0, 1, 2, 3].map((i) => ({
      x: Math.round((W * (i + 1)) / 5 - BUNKER_W / 2),
      y: BUNKER_Y,
      cells: MASKS.bunker.map((row) => Array.from(row, (ch) => ch === "X")),
    }));
  }

  invaderBox(inv: Invader): Box {
    const w = KIND_W[ROW_KIND[inv.row]];
    return { x: this.ox + inv.col * COL_W + (COL_W - w) / 2, y: this.oy + inv.row * ROW_H, w, h: INV_H };
  }

  private aliveCount() {
    let n = 0;
    for (const inv of this.invaders) if (inv.alive) n++;
    return n;
  }

  update(dt: number) {
    this.time += dt;
    stepParticles(this.particles, dt, 260);
    for (const p of this.popups) {
      p.life -= dt;
      p.y -= dt * 0.03;
    }
    this.popups = this.popups.filter((p) => p.life > 0);
    if (this.status !== "playing") return;

    const before = this.score * 1000 + this.lives * 10 + this.wave;
    let left = dt;
    while (left > 0 && this.status === "playing") {
      const h = Math.min(left, 8);
      this.tick(h);
      left -= h;
    }
    if (this.score * 1000 + this.lives * 10 + this.wave !== before) this.changed();
  }

  private tick(h: number) {
    const s = h / 1000;
    if (this.banner) {
      this.banner.t -= h;
      if (this.banner.t <= 0) this.banner = null;
    }
    const grace = this.banner !== null;

    if (this.respawnT > 0) {
      this.respawnT -= h;
      if (this.respawnT <= 0) {
        this.respawnT = 0;
        this.invulnT = 1600;
      }
    } else {
      if (this.invulnT > 0) this.invulnT = Math.max(0, this.invulnT - h);
      const v = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);
      this.playerX = Math.min(
        W - MARGIN - PLAYER_W / 2,
        Math.max(MARGIN + PLAYER_W / 2, this.playerX + v * PLAYER_SPEED * s),
      );
      // Holding fire keeps shooting, but only one shot flies at a time.
      if (this.keys.fire && !grace) this.fire();
    }

    for (const shot of this.shots) {
      shot.y += shot.vy * s;
      if (shot.enemy) shot.phase += s * 14;
    }
    this.shots = this.shots.filter((shot) => shot.y > 20 && shot.y < GROUND_Y);
    this.resolveShots();
    if (this.status !== "playing") return;

    if (!grace) {
      this.stepFormation(h);
      this.enemyFire(h);
    }
    this.stepUfo(h, s, grace);

    if (this.status === "playing" && !this.banner && this.aliveCount() === 0) this.nextWave();
  }

  private fire() {
    if (this.shots.some((shot) => !shot.enemy)) return;
    this.shots.push({ x: this.playerX, y: PLAYER_Y - 10, vy: -SHOT_SPEED, enemy: false, phase: 0 });
    this.emit({ type: "shoot" });
  }

  private resolveShots() {
    const spent = new Set<Shot>();
    for (const shot of this.shots) {
      if (spent.has(shot)) continue;
      const box = shotBox(shot);

      if (!shot.enemy) {
        // Two shots meeting head-on cancel out.
        const clash = this.shots.find((o) => o.enemy && !spent.has(o) && overlap(box, shotBox(o)));
        if (clash) {
          spent.add(shot);
          spent.add(clash);
          burst(this.particles, shot.x, shot.y, ["yellow", "orange"], 6, 0.5);
          continue;
        }
        if (this.ufo && overlap(box, { x: this.ufo.x - UFO_W / 2, y: UFO_Y, w: UFO_W, h: UFO_H })) {
          spent.add(shot);
          this.hitUfo();
          continue;
        }
        const target = this.invaders.find((inv) => inv.alive && overlap(box, this.invaderBox(inv)));
        if (target) {
          spent.add(shot);
          this.killInvader(target);
          continue;
        }
      } else if (this.respawnT === 0 && this.invulnT === 0) {
        const ship = { x: this.playerX - PLAYER_W / 2 + 4, y: PLAYER_Y + 8, w: PLAYER_W - 8, h: PLAYER_H - 8 };
        if (overlap(box, ship)) {
          spent.add(shot);
          this.hitPlayer();
          if (this.status !== "playing") break;
          continue;
        }
      }

      if (this.hitBunker(box, !shot.enemy)) spent.add(shot);
    }
    if (spent.size) this.shots = this.shots.filter((shot) => !spent.has(shot));
  }

  private addScore(points: number) {
    this.score += points;
    if (this.score >= this.nextLife) {
      this.nextLife += 1500;
      if (this.lives < 5) {
        this.lives++;
        this.popups.push({ x: this.playerX, y: PLAYER_Y - 16, text: "+1 life", color: "green", life: 900, max: 900 });
        this.emit({ type: "extraLife" });
      }
    }
  }

  private killInvader(inv: Invader) {
    inv.alive = false;
    const b = this.invaderBox(inv);
    this.addScore(ROW_POINTS[inv.row]);
    burst(this.particles, b.x + b.w / 2, b.y + b.h / 2, [ROW_COLOR[inv.row], "yellow"], 10, 0.8);
    this.emit({ type: "kill" });
  }

  private hitUfo() {
    const ufo = this.ufo;
    if (!ufo) return;
    this.addScore(ufo.points);
    this.popups.push({ x: ufo.x, y: UFO_Y + 10, text: String(ufo.points), color: "pink", life: 900, max: 900 });
    burst(this.particles, ufo.x, UFO_Y + UFO_H / 2, ["pink", "yellow", "purple"], 18, 1);
    this.ufo = null;
    this.emit({ type: "ufoHit" });
  }

  private hitPlayer() {
    this.lives = Math.max(0, this.lives - 1);
    burst(this.particles, this.playerX, PLAYER_Y + PLAYER_H / 2, ["blue", "yellow", "orange"], 26, 1.2);
    this.shots = this.shots.filter((shot) => !shot.enemy);
    this.emit({ type: "playerHit" });
    if (this.lives === 0) this.gameOver();
    else this.respawnT = 1200;
    this.changed();
  }

  /** Chips a bunker where the box first meets it, from the shot's side. */
  private hitBunker(b: Box, fromBelow: boolean) {
    for (const bunker of this.bunkers) {
      if (!overlap(b, { x: bunker.x, y: bunker.y, w: BUNKER_W, h: BUNKER_H })) continue;
      const c0 = Math.max(0, Math.floor((b.x - bunker.x) / BUNKER_CELL));
      const c1 = Math.min(BUNKER_COLS - 1, Math.floor((b.x + b.w - bunker.x) / BUNKER_CELL));
      const r0 = Math.max(0, Math.floor((b.y - bunker.y) / BUNKER_CELL));
      const r1 = Math.min(BUNKER_ROWS - 1, Math.floor((b.y + b.h - bunker.y) / BUNKER_CELL));
      for (let i = 0; i <= r1 - r0; i++) {
        const r = fromBelow ? r1 - i : r0 + i;
        for (let c = c0; c <= c1; c++) {
          if (bunker.cells[r][c]) {
            this.chip(bunker, c, r);
            return true;
          }
        }
      }
    }
    return false;
  }

  private chip(bunker: Bunker, c: number, r: number) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const rr = r + dy;
        const cc = c + dx;
        if (rr < 0 || rr >= BUNKER_ROWS || cc < 0 || cc >= BUNKER_COLS) continue;
        if (dx * dx + dy * dy > 5) continue;
        // A ragged bite rather than a clean circle.
        if ((dx === 0 && dy === 0) || Math.random() < 0.65) bunker.cells[rr][cc] = false;
      }
    }
    burst(this.particles, bunker.x + (c + 0.5) * BUNKER_CELL, bunker.y + (r + 0.5) * BUNKER_CELL, ["green"], 4, 0.4);
  }

  private stepFormation(h: number) {
    this.stepT += h;
    const alive = this.aliveCount();
    if (!alive) return;
    // Fewer invaders march faster; each wave tightens the tempo too.
    const interval = Math.max(26, (34 + 640 * (alive / (COLS * ROWS))) * Math.pow(0.88, this.wave - 1));
    if (this.stepT < interval) return;
    this.stepT = 0;

    let min = Infinity;
    let max = -Infinity;
    for (const inv of this.invaders) {
      if (!inv.alive) continue;
      const b = this.invaderBox(inv);
      min = Math.min(min, b.x);
      max = Math.max(max, b.x + b.w);
    }
    const atEdge = this.dir === 1 ? max + STEP_X > W - MARGIN : min - STEP_X < MARGIN;
    if (atEdge) {
      this.oy += STEP_Y;
      this.dir = this.dir === 1 ? -1 : 1;
    } else {
      this.ox += this.dir * STEP_X;
    }
    this.frame = this.frame === 0 ? 1 : 0;
    this.emit({ type: "step", note: this.note });
    this.note = (this.note + 1) % 4;

    let bottom = 0;
    for (const inv of this.invaders) {
      if (!inv.alive) continue;
      const b = this.invaderBox(inv);
      bottom = Math.max(bottom, b.y + b.h);
      // Marching invaders plough through any bunker in their way.
      for (const bunker of this.bunkers) {
        if (!overlap(b, { x: bunker.x, y: bunker.y, w: BUNKER_W, h: BUNKER_H })) continue;
        for (let r = 0; r < BUNKER_ROWS; r++) {
          for (let c = 0; c < BUNKER_COLS; c++) {
            const cell = { x: bunker.x + c * BUNKER_CELL, y: bunker.y + r * BUNKER_CELL, w: BUNKER_CELL, h: BUNKER_CELL };
            if (overlap(b, cell)) bunker.cells[r][c] = false;
          }
        }
      }
    }
    if (bottom >= PLAYER_Y) {
      burst(this.particles, this.playerX, PLAYER_Y + PLAYER_H / 2, ["blue", "yellow", "orange"], 26, 1.2);
      this.lives = 0;
      this.gameOver();
    }
  }

  private enemyFire(h: number) {
    this.enemyT -= h;
    if (this.enemyT > 0) return;
    const gap = Math.max(260, 950 - this.wave * 70);
    this.enemyT = rand(gap, gap + 600);
    const limit = Math.min(6, 2 + Math.ceil(this.wave / 2));
    if (this.shots.filter((shot) => shot.enemy).length >= limit) return;

    // Only the lowest invader in each column can shoot.
    const lowest = new Map<number, Invader>();
    for (const inv of this.invaders) {
      if (!inv.alive) continue;
      const current = lowest.get(inv.col);
      if (!current || inv.row > current.row) lowest.set(inv.col, inv);
    }
    const shooters = [...lowest.values()];
    if (!shooters.length) return;
    let pick = shooters[Math.floor(Math.random() * shooters.length)];
    // Now and then, the one nearest the player takes aim.
    if (Math.random() < 0.35) {
      const distance = (inv: Invader) => Math.abs(this.invaderBox(inv).x - this.playerX);
      pick = shooters.reduce((best, inv) => (distance(inv) < distance(best) ? inv : best));
    }
    const b = this.invaderBox(pick);
    this.shots.push({ x: b.x + b.w / 2, y: b.y + b.h + 8, vy: 240 + this.wave * 16, enemy: true, phase: Math.random() * 6 });
  }

  private stepUfo(h: number, s: number, grace: boolean) {
    const ufo = this.ufo;
    if (ufo) {
      ufo.x += ufo.dir * 130 * s;
      this.ufoTickT -= h;
      if (this.ufoTickT <= 0) {
        this.ufoTickT = 170;
        this.ufoHigh = !this.ufoHigh;
        this.emit({ type: "ufoTick", high: this.ufoHigh });
      }
      if (ufo.x < -UFO_W || ufo.x > W + UFO_W) this.ufo = null;
      return;
    }
    if (grace) return;
    this.ufoT -= h;
    if (this.ufoT <= 0 && this.aliveCount() > 6) {
      const dir = Math.random() < 0.5 ? 1 : -1;
      this.ufo = {
        x: dir === 1 ? -UFO_W : W + UFO_W,
        dir,
        points: UFO_POINTS[Math.floor(Math.random() * UFO_POINTS.length)],
      };
      this.ufoT = rand(18000, 28000);
    }
  }

  private nextWave() {
    this.wave++;
    this.shots = [];
    this.ufo = null;
    this.resetFormation();
    this.buildBunkers();
    this.banner = { text: `Wave ${this.wave}`, t: 1500, max: 1500 };
    this.emit({ type: "wave" });
    this.changed();
  }

  private gameOver() {
    this.status = "over";
    this.releaseKeys();
    this.emit({ type: "over" });
    this.changed();
  }
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

function drawCapsule(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 8;
  const h = 22;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, w / 2);
  ctx.fillStyle = BLOCKS.yellow.fill;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = ARCADE.ink;
  ctx.stroke();
  ctx.fillStyle = BLOCKS.yellow.light;
  ctx.fillRect(x - w / 2 + 2, y - h / 2 + 5, 2, h - 12);
}

function drawZigzag(ctx: CanvasRenderingContext2D, shot: Shot) {
  const flip = Math.floor(shot.phase) % 2 === 0 ? 1 : -1;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const px = shot.x + (i % 2 === 0 ? -4 : 4) * flip;
    const py = shot.y - 10 + i * 5;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = ARCADE.ink;
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.strokeStyle = BLOCKS.orange.fill;
  ctx.lineWidth = 3.5;
  ctx.stroke();
}

export function renderInvaders(ctx: CanvasRenderingContext2D, g: InvadersGame, font: string) {
  ctx.fillStyle = ARCADE.space;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#ffffff";
  for (const star of g.stars) {
    ctx.globalAlpha = 0.2 + 0.8 * Math.abs(Math.sin(g.time * 0.0011 + star.phase));
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (const d of g.decor) drawConfetti(ctx, d.x, d.y, d.shape, d.size, BLOCKS[d.color].fill, 0.28, d.angle);

  ctx.save();
  ctx.strokeStyle = ARCADE.ground;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (const [a, b] of GROUND) {
    ctx.beginPath();
    ctx.moveTo(a * W, GROUND_Y);
    ctx.lineTo(b * W, GROUND_Y);
    ctx.stroke();
  }
  ctx.restore();

  for (const bunker of g.bunkers) {
    drawCells(
      ctx,
      (c, r) => r >= 0 && r < BUNKER_ROWS && c >= 0 && c < BUNKER_COLS && bunker.cells[r][c],
      BUNKER_COLS,
      BUNKER_ROWS,
      bunker.x,
      bunker.y,
      BUNKER_CELL,
      BLOCKS.green,
      2,
    );
  }

  for (const inv of g.invaders) {
    if (!inv.alive) continue;
    const b = g.invaderBox(inv);
    drawSprite(ctx, MASKS[ROW_KIND[inv.row]][g.frame], b.x, b.y, INV_P, BLOCKS[ROW_COLOR[inv.row]], 2);
  }

  if (g.ufo) drawSprite(ctx, MASKS.ufo, g.ufo.x - UFO_W / 2, UFO_Y, INV_P, BLOCKS.pink, 2);

  const blinkOn = g.invulnT === 0 || Math.floor(g.invulnT / 110) % 2 === 0;
  if (g.status !== "over" && g.respawnT === 0 && blinkOn) {
    drawSprite(ctx, MASKS.player, g.playerX - PLAYER_W / 2, PLAYER_Y, PLAYER_P, BLOCKS.blue, 3);
  }

  for (const shot of g.shots) {
    if (shot.enemy) drawZigzag(ctx, shot);
    else drawCapsule(ctx, shot.x, shot.y);
  }

  drawParticles(ctx, g.particles);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 18px ${font}`;
  for (const p of g.popups) {
    ctx.globalAlpha = Math.min(1, (p.life / p.max) * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = ARCADE.space;
    ctx.strokeText(p.text, p.x, p.y);
    ctx.fillStyle = BLOCKS[p.color].fill;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;

  if (g.banner) {
    const k = g.banner.t / g.banner.max;
    ctx.globalAlpha = Math.max(0, Math.min(1, (1 - k) * 5, k * 4));
    ctx.font = `600 44px ${font}`;
    ctx.lineWidth = 8;
    ctx.lineJoin = "round";
    ctx.strokeStyle = ARCADE.ink;
    ctx.strokeText(g.banner.text, W / 2, 420);
    ctx.fillStyle = BLOCKS.yellow.fill;
    ctx.fillText(g.banner.text, W / 2, 420);
    ctx.globalAlpha = 1;
  }
}
