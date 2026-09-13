import { BLOCKS, drawBlock, drawGhost, type BlockName, type Face } from "./palette";
import { burst, drawParticles, stepParticles, type Particle } from "./particles";

/* ------------------------------------------------------------------ */
/* Rules                                                               */
/* ------------------------------------------------------------------ */

export const COLS = 10;
export const ROWS = 20;
/** Two rows above the visible well, where pieces spawn. */
const HIDDEN = 2;
const HEIGHT = ROWS + HIDDEN;

export type PieceType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";
export type Status = "ready" | "playing" | "paused" | "over";
type Matrix = number[][];
type Cell = PieceType | null;

export type TetrisEvent =
  | { type: "move" }
  | { type: "rotate" }
  | { type: "hold" }
  | { type: "lock" }
  | { type: "hardDrop" }
  | { type: "clear"; rows: number }
  | { type: "levelUp" }
  | { type: "over" };

const PIECES: readonly PieceType[] = ["I", "J", "L", "O", "S", "T", "Z"];

const PIECE_COLOR: Record<PieceType, BlockName> = {
  I: "blue",
  J: "royal",
  L: "orange",
  O: "yellow",
  S: "green",
  T: "purple",
  Z: "red",
};

const SHAPES: Record<PieceType, Matrix> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

/** Delay before a held arrow starts repeating, then the repeat rate. */
const DAS = 160;
const ARR = 45;
const SOFT_DROP_MS = 32;
/** Time a grounded piece waits before locking, and how often moving it
 *  can buy more time, so a player cannot stall forever. */
const LOCK_MS = 500;
const MAX_LOCK_RESETS = 15;
const CLEAR_MS = 280;
const LINE_POINTS = [0, 100, 300, 500, 800];

export const CELL = 32;
const PAD = 6;
export const BOARD_W = COLS * CELL + PAD * 2;
export const BOARD_H = ROWS * CELL + PAD * 2;
export const NEXT_W = 120;
export const NEXT_H = 250;
export const HOLD_W = 120;
export const HOLD_H = 86;

function rotateMatrix(m: Matrix, dir: 1 | -1): Matrix {
  const n = m.length;
  return m[0].map((_, c) =>
    dir === 1 ? m.map((row) => row[c]).reverse() : m.map((row) => row[n - 1 - c]),
  );
}

function shuffle<T>(list: T[]) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/** The guideline gravity curve, in milliseconds per row. */
function gravityMs(level: number) {
  return Math.max(30, Math.pow(0.8 - (level - 1) * 0.007, level - 1) * 1000);
}

function eachCell(m: Matrix, fn: (row: number, col: number) => void) {
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) if (m[r][c]) fn(r, c);
  }
}

/**
 * The game as plain state and rules, with no React and no DOM, so it can
 * run at frame rate while React only re-renders when the score, level,
 * lines or status actually change.
 */
export class TetrisGame {
  status: Status = "ready";
  score = 0;
  level = 1;
  lines = 0;
  board: Cell[][] = TetrisGame.emptyBoard();
  piece: { type: PieceType; m: Matrix; x: number; y: number } | null = null;
  queue: PieceType[] = [];
  hold: PieceType | null = null;
  canHold = true;
  clearing: { rows: number[]; t: number } | null = null;
  particles: Particle[] = [];
  time = 0;

  private bag: PieceType[] = [];
  private dropT = 0;
  private lockT = 0;
  private lockResets = 0;
  private keys = { left: false, right: false, down: false };
  private dasDir: -1 | 0 | 1 = 0;
  private dasT = 0;
  private arrT = 0;
  private readonly emit: (e: TetrisEvent) => void;
  private readonly changed: () => void;

  constructor(emit: (e: TetrisEvent) => void, changed: () => void) {
    this.emit = emit;
    this.changed = changed;
    this.fillQueue();
  }

  private static emptyBoard(): Cell[][] {
    return Array.from({ length: HEIGHT }, () => Array<Cell>(COLS).fill(null));
  }

  /** Seven-bag randomiser: every piece once per bag, no long droughts. */
  private fillQueue() {
    while (this.queue.length < 4) {
      if (!this.bag.length) this.bag = shuffle([...PIECES]);
      this.queue.push(this.bag.pop()!);
    }
  }

  start() {
    this.board = TetrisGame.emptyBoard();
    this.bag = [];
    this.queue = [];
    this.fillQueue();
    this.hold = null;
    this.canHold = true;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.clearing = null;
    this.particles = [];
    this.time = 0;
    this.releaseKeys();
    this.status = "playing";
    this.spawn();
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

  private releaseKeys() {
    this.keys = { left: false, right: false, down: false };
    this.dasDir = 0;
  }

  press(key: "left" | "right" | "down", down: boolean) {
    if (key === "down") {
      this.keys.down = down;
      return;
    }
    this.keys[key] = down;
    const dir = key === "left" ? -1 : 1;
    if (down) {
      if (this.status !== "playing") return;
      this.dasDir = dir;
      this.dasT = 0;
      this.arrT = 0;
      this.shift(dir);
    } else if (this.dasDir === dir) {
      // Releasing one arrow while the other is still held hands over to it.
      const other = key === "left" ? this.keys.right : this.keys.left;
      this.dasDir = other ? (dir === -1 ? 1 : -1) : 0;
      this.dasT = 0;
      this.arrT = 0;
    }
  }

  private collides(m: Matrix, x: number, y: number) {
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[r].length; c++) {
        if (!m[r][c]) continue;
        const bx = x + c;
        const by = y + r;
        if (bx < 0 || bx >= COLS || by >= HEIGHT) return true;
        if (by >= 0 && this.board[by][bx]) return true;
      }
    }
    return false;
  }

  private tryMove(dx: number, dy: number) {
    const p = this.piece;
    if (!p || this.collides(p.m, p.x + dx, p.y + dy)) return false;
    p.x += dx;
    p.y += dy;
    return true;
  }

  private grounded() {
    const p = this.piece;
    return !!p && this.collides(p.m, p.x, p.y + 1);
  }

  /** Moving a grounded piece buys it a little more time, up to a limit. */
  private buyTime() {
    if (this.grounded() && this.lockResets < MAX_LOCK_RESETS) {
      this.lockT = 0;
      this.lockResets++;
    }
  }

  private active() {
    return this.status === "playing" && !!this.piece && !this.clearing;
  }

  shift(dir: -1 | 1) {
    if (!this.active() || !this.tryMove(dir, 0)) return false;
    this.buyTime();
    this.emit({ type: "move" });
    return true;
  }

  rotate(dir: 1 | -1) {
    const p = this.piece;
    if (!this.active() || !p || p.type === "O") return;
    const m = rotateMatrix(p.m, dir);
    // A light wall-kick table: try in place, then nudge sideways and up.
    const kicks =
      p.type === "I"
        ? [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [0, -2]]
        : [[0, 0], [-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1]];
    for (const [dx, dy] of kicks) {
      if (!this.collides(m, p.x + dx, p.y + dy)) {
        p.m = m;
        p.x += dx;
        p.y += dy;
        this.buyTime();
        this.emit({ type: "rotate" });
        return;
      }
    }
  }

  hardDrop() {
    const p = this.piece;
    if (!this.active() || !p) return;
    let cells = 0;
    while (this.tryMove(0, 1)) cells++;
    this.score += cells * 2;
    const color = PIECE_COLOR[p.type];
    eachCell(p.m, (r, c) => {
      if (!p.m[r + 1]?.[c]) {
        burst(this.particles, (p.x + c + 0.5) * CELL, (p.y + r - HIDDEN + 1) * CELL, [color], 2, 0.45);
      }
    });
    this.emit({ type: "hardDrop" });
    this.lockPiece();
  }

  holdPiece() {
    const p = this.piece;
    if (!this.active() || !p || !this.canHold) return;
    const held = this.hold;
    this.hold = p.type;
    this.spawn(held ?? undefined);
    this.canHold = false;
    this.emit({ type: "hold" });
    this.changed();
  }

  ghostY() {
    const p = this.piece;
    if (!p) return 0;
    let y = p.y;
    while (!this.collides(p.m, p.x, y + 1)) y++;
    return y;
  }

  private spawn(type?: PieceType) {
    const next = type ?? this.queue.shift()!;
    if (!type) this.fillQueue();
    const m = SHAPES[next].map((row) => [...row]);
    const x = Math.floor((COLS - m[0].length) / 2);
    this.piece = { type: next, m, x, y: 1 };
    this.dropT = 0;
    this.lockT = 0;
    this.lockResets = 0;
    // No room for the new piece: the well has topped out.
    if (this.collides(m, x, 1)) this.gameOver();
  }

  private lockPiece() {
    const p = this.piece;
    if (!p) return;
    let aboveWell = true;
    eachCell(p.m, (r, c) => {
      const by = p.y + r;
      if (by >= 0) this.board[by][p.x + c] = p.type;
      if (by >= HIDDEN) aboveWell = false;
    });
    this.piece = null;
    this.emit({ type: "lock" });
    if (aboveWell) {
      this.gameOver();
      return;
    }

    const rows: number[] = [];
    for (let y = 0; y < HEIGHT; y++) if (this.board[y].every(Boolean)) rows.push(y);

    if (rows.length) {
      this.clearing = { rows, t: 0 };
      this.score += LINE_POINTS[rows.length] * this.level;
      this.lines += rows.length;
      this.emit({ type: "clear", rows: rows.length });
      const level = Math.floor(this.lines / 10) + 1;
      if (level > this.level) {
        this.level = level;
        this.emit({ type: "levelUp" });
      }
      for (const y of rows) {
        for (let x = 0; x < COLS; x++) {
          const t = this.board[y][x];
          if (t) burst(this.particles, (x + 0.5) * CELL, (y - HIDDEN + 0.5) * CELL, [PIECE_COLOR[t], "yellow"], 2, 0.9);
        }
      }
    } else {
      this.canHold = true;
      this.spawn();
    }
    this.changed();
  }

  private finishClear() {
    const rows = this.clearing?.rows ?? [];
    this.clearing = null;
    const kept = this.board.filter((_, y) => !rows.includes(y));
    while (kept.length < HEIGHT) kept.unshift(Array<Cell>(COLS).fill(null));
    this.board = kept;
    this.canHold = true;
    this.spawn();
    this.changed();
  }

  private gameOver() {
    this.status = "over";
    this.releaseKeys();
    this.emit({ type: "over" });
    this.changed();
  }

  update(dt: number) {
    this.time += dt;
    stepParticles(this.particles, dt, 900);
    if (this.status !== "playing") return;

    if (this.clearing) {
      this.clearing.t += dt;
      if (this.clearing.t >= CLEAR_MS) this.finishClear();
      return;
    }
    if (!this.piece) return;
    const scoreBefore = this.score;

    const dir = this.dasDir;
    if (dir !== 0) {
      this.dasT += dt;
      if (this.dasT >= DAS) {
        this.arrT += dt;
        while (this.arrT >= ARR) {
          this.arrT -= ARR;
          if (!this.shift(dir)) {
            this.arrT = 0;
            break;
          }
        }
      }
    }

    const gravity = gravityMs(this.level);
    const interval = this.keys.down ? Math.min(SOFT_DROP_MS, gravity) : gravity;
    this.dropT += dt;
    while (this.dropT >= interval) {
      this.dropT -= interval;
      if (!this.tryMove(0, 1)) {
        this.dropT = 0;
        break;
      }
      if (this.keys.down) this.score += 1;
    }

    if (this.grounded()) {
      this.lockT += dt;
      if (this.lockT >= LOCK_MS) this.lockPiece();
    } else {
      this.lockT = 0;
    }

    if (this.score !== scoreBefore && this.status === "playing") this.changed();
  }
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

export function renderTetris(ctx: CanvasRenderingContext2D, g: TetrisGame) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, BOARD_W, BOARD_H);
  ctx.save();
  ctx.translate(PAD, PAD);

  // Soft dots at the grid crossings, a guide without a cage.
  ctx.fillStyle = "#e7e7e3";
  for (let x = 1; x < COLS; x++) {
    for (let y = 1; y < ROWS; y++) {
      ctx.beginPath();
      ctx.arc(x * CELL, y * CELL, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const clearing = g.clearing;
  const k = clearing ? Math.min(1, clearing.t / CLEAR_MS) : 0;
  for (let y = HIDDEN; y < HEIGHT; y++) {
    const vanishing = clearing?.rows.includes(y) ?? false;
    for (let x = 0; x < COLS; x++) {
      const t = g.board[y][x];
      if (!t) continue;
      const px = x * CELL;
      const py = (y - HIDDEN) * CELL;
      if (vanishing) {
        // Cleared blocks cheer and shrink away.
        const size = CELL * (1 - k * 0.85);
        const o = (CELL - size) / 2;
        drawBlock(ctx, px + o, py + o, size, BLOCKS[PIECE_COLOR[t]], { face: "happy", alpha: 1 - k * 0.4 });
      } else {
        drawBlock(ctx, px, py, CELL, BLOCKS[PIECE_COLOR[t]]);
      }
    }
  }

  const p = g.piece;
  if (p && g.status !== "ready") {
    const color = BLOCKS[PIECE_COLOR[p.type]];
    const gy = g.ghostY();
    if (gy > p.y && g.status !== "over") {
      eachCell(p.m, (r, c) => {
        const by = gy + r - HIDDEN;
        if (by >= 0) drawGhost(ctx, (p.x + c) * CELL, by * CELL, CELL, color);
      });
    }
    const face: Face = g.status === "over" ? "sad" : g.time % 3400 < 130 ? "blink" : "happy";
    eachCell(p.m, (r, c) => {
      const by = p.y + r - HIDDEN;
      if (by >= 0) drawBlock(ctx, (p.x + c) * CELL, by * CELL, CELL, color, { face });
    });
  }

  drawParticles(ctx, g.particles);
  ctx.restore();
}

function drawPiece(
  ctx: CanvasRenderingContext2D,
  type: PieceType,
  cx: number,
  cy: number,
  size: number,
  alpha = 1,
) {
  const m = SHAPES[type];
  let r0 = Infinity;
  let r1 = -1;
  let c0 = Infinity;
  let c1 = -1;
  eachCell(m, (r, c) => {
    r0 = Math.min(r0, r);
    r1 = Math.max(r1, r);
    c0 = Math.min(c0, c);
    c1 = Math.max(c1, c);
  });
  const ox = Math.round(cx - ((c1 - c0 + 1) * size) / 2);
  const oy = Math.round(cy - ((r1 - r0 + 1) * size) / 2);
  eachCell(m, (r, c) =>
    drawBlock(ctx, ox + (c - c0) * size, oy + (r - r0) * size, size, BLOCKS[PIECE_COLOR[type]], {
      face: "happy",
      alpha,
    }),
  );
}

export function renderNext(ctx: CanvasRenderingContext2D, queue: readonly PieceType[]) {
  ctx.clearRect(0, 0, NEXT_W, NEXT_H);
  queue.slice(0, 3).forEach((type, i) => {
    drawPiece(ctx, type, NEXT_W / 2, 42 + i * 82, i === 0 ? 24 : 19, i === 0 ? 1 : 0.85);
  });
}

export function renderHold(ctx: CanvasRenderingContext2D, type: PieceType | null, canHold: boolean) {
  ctx.clearRect(0, 0, HOLD_W, HOLD_H);
  if (type) drawPiece(ctx, type, HOLD_W / 2, HOLD_H / 2, 22, canHold ? 1 : 0.35);
}
