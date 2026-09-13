/**
 * The arcade look for the games, after the illustration they were briefed
 * from: flat bright blocks with a light top-left bevel, a darker
 * bottom-right one, a white corner glint and a thick dark outline.
 *
 * Canvas code needs literal hex values, so this file is the source of
 * truth. The matching Tailwind tokens (--color-arcade-*, --color-space*)
 * in globals.css mirror it by hand; change both together.
 */
export const ARCADE = {
  ink: "#262626",
  space: "#13111d",
  ground: "#3a3553",
} as const;

export type BlockColor = { fill: string; light: string; shade: string };

export const BLOCKS = {
  blue: { fill: "#4dbef7", light: "#bfe8fd", shade: "#2b9bd8" },
  royal: { fill: "#4c7df0", light: "#b3c9fa", shade: "#2e5bc4" },
  orange: { fill: "#ff8a1f", light: "#ffc98f", shade: "#e2650b" },
  yellow: { fill: "#ffd21f", light: "#fff1a8", shade: "#eda600" },
  green: { fill: "#2fcb5f", light: "#a6efbe", shade: "#19984a" },
  purple: { fill: "#a861ea", light: "#dcc0f7", shade: "#7a3cc2" },
  red: { fill: "#f0304a", light: "#fbabb5", shade: "#bd1a31" },
  pink: { fill: "#ff6fb5", light: "#ffc6e2", shade: "#d9408e" },
} as const satisfies Record<string, BlockColor>;

export type BlockName = keyof typeof BLOCKS;

export type Face = "happy" | "blink" | "sad";

/** Two dot eyes and an open smile, as on the falling piece in the brief. */
function drawFace(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  face: Face,
) {
  const ex = s * 0.19;
  const ey = cy - s * 0.07;
  const er = Math.max(1.2, s * 0.06);
  ctx.fillStyle = ARCADE.ink;
  ctx.strokeStyle = ARCADE.ink;
  ctx.lineCap = "round";

  for (const side of [-1, 1]) {
    const x = cx + side * ex;
    if (face === "blink") {
      ctx.lineWidth = Math.max(1.2, s * 0.05);
      ctx.beginPath();
      ctx.moveTo(x - er, ey);
      ctx.lineTo(x + er, ey);
      ctx.stroke();
    } else if (face === "sad") {
      ctx.lineWidth = Math.max(1.2, s * 0.045);
      ctx.beginPath();
      ctx.moveTo(x - er, ey - er);
      ctx.lineTo(x + er, ey + er);
      ctx.moveTo(x + er, ey - er);
      ctx.lineTo(x - er, ey + er);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, ey, er, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const my = cy + s * 0.06;
  const mr = s * 0.13;
  if (face === "sad") {
    ctx.lineWidth = Math.max(1.2, s * 0.05);
    ctx.beginPath();
    ctx.arc(cx, my + mr, mr * 0.8, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    return;
  }
  // Bottom half-disc for the mouth, with a tongue clipped inside it.
  ctx.beginPath();
  ctx.arc(cx, my, mr, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "#ff6b6b";
  ctx.beginPath();
  ctx.arc(cx, my + mr, mr * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * One block. The outline is stroked on the cell edge, so neighbouring
 * blocks share a single line exactly as in the illustration.
 */
export function drawBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  color: BlockColor,
  opts: { face?: Face; alpha?: number } = {},
) {
  // Even widths keep a centred stroke on whole pixels.
  const lw = Math.max(2, Math.round(s * 0.05) * 2);
  const ix = x + lw / 2;
  const iy = y + lw / 2;
  const is = s - lw;
  const shade = Math.max(2, Math.round(s * 0.14));
  const light = Math.max(1, Math.round(s * 0.1));
  const face = is - shade - light;

  ctx.save();
  ctx.globalAlpha = opts.alpha ?? 1;
  ctx.fillStyle = color.shade;
  ctx.fillRect(ix, iy, is, is);
  ctx.fillStyle = color.light;
  ctx.fillRect(ix, iy, is - shade, is - shade);
  ctx.fillStyle = color.fill;
  ctx.fillRect(ix + light, iy + light, face, face);

  const glint = is * 0.26;
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.moveTo(ix, iy);
  ctx.lineTo(ix + glint, iy);
  ctx.lineTo(ix, iy + glint);
  ctx.closePath();
  ctx.fill();

  if (opts.face) {
    drawFace(ctx, ix + light + face / 2, iy + light + face / 2, is, opts.face);
  }

  ctx.strokeStyle = ARCADE.ink;
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.strokeRect(x, y, s, s);
  ctx.restore();
}

/** Landing preview for the falling piece: a faint tint and a dashed edge. */
export function drawGhost(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  color: BlockColor,
) {
  const inset = 3;
  ctx.save();
  ctx.fillStyle = color.fill;
  ctx.globalAlpha = 0.16;
  ctx.fillRect(x + inset, y + inset, s - inset * 2, s - inset * 2);
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = ARCADE.ink;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(x + inset, y + inset, s - inset * 2, s - inset * 2);
  ctx.restore();
}

/**
 * Pixel art in the same style. The outline pass fattens every lit pixel
 * so their union forms one silhouette; the fill pass then bevels only
 * the pixels on an exposed edge, which shades the shape as a whole
 * rather than each pixel.
 */
export function drawCells(
  ctx: CanvasRenderingContext2D,
  isOn: (col: number, row: number) => boolean,
  cols: number,
  rows: number,
  x: number,
  y: number,
  p: number,
  color: BlockColor,
  lw = 2,
) {
  const ox = Math.round(x);
  const oy = Math.round(y);
  const edge = Math.max(1, Math.round(p * 0.3));

  ctx.fillStyle = ARCADE.ink;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (isOn(c, r)) ctx.fillRect(ox + c * p - lw, oy + r * p - lw, p + lw * 2, p + lw * 2);
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!isOn(c, r)) continue;
      const px = ox + c * p;
      const py = oy + r * p;
      ctx.fillStyle = color.fill;
      ctx.fillRect(px, py, p, p);
      ctx.fillStyle = color.light;
      if (!isOn(c, r - 1)) ctx.fillRect(px, py, p, edge);
      if (!isOn(c - 1, r)) ctx.fillRect(px, py, edge, p);
      ctx.fillStyle = color.shade;
      if (!isOn(c + 1, r)) ctx.fillRect(px + p - edge, py, edge, p);
      if (!isOn(c, r + 1)) ctx.fillRect(px, py + p - edge, p, edge);
    }
  }
}

/** Pixel art from a string mask, where "X" is a lit pixel. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  mask: readonly string[],
  x: number,
  y: number,
  p: number,
  color: BlockColor,
  lw = 2,
) {
  const rows = mask.length;
  const cols = mask[0].length;
  drawCells(
    ctx,
    (c, r) => r >= 0 && r < rows && c >= 0 && c < cols && mask[r][c] === "X",
    cols,
    rows,
    x,
    y,
    p,
    color,
    lw,
  );
}
