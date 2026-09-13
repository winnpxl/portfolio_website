import { MASKS } from "./invaders-engine";
import { ARCADE, BLOCKS, type BlockColor, type BlockName } from "./palette";

/* Static SVG covers for the games index, drawn with the same palette and
   bevel as the canvases so a card and its game read as one thing. */

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}z`;

function Block({ x, y, s, c, face }: { x: number; y: number; s: number; c: BlockColor; face?: boolean }) {
  const shade = s * 0.15;
  const light = s * 0.1;
  const fs = s - shade - light;
  const cx = x + light + fs / 2;
  const cy = y + light + fs / 2;
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} fill={c.shade} />
      <rect x={x} y={y} width={s - shade} height={s - shade} fill={c.light} />
      <rect x={x + light} y={y + light} width={fs} height={fs} fill={c.fill} />
      <path d={`M${x} ${y}h${s * 0.28}L${x} ${y + s * 0.28}z`} fill="#fff" />
      {face && (
        <g fill={ARCADE.ink}>
          <circle cx={cx - s * 0.19} cy={cy - s * 0.07} r={s * 0.06} />
          <circle cx={cx + s * 0.19} cy={cy - s * 0.07} r={s * 0.06} />
          <path d={`M${cx - s * 0.13} ${cy + s * 0.05}a${s * 0.13} ${s * 0.13} 0 0 0 ${s * 0.26} 0z`} />
        </g>
      )}
      <rect x={x} y={y} width={s} height={s} fill="none" stroke={ARCADE.ink} strokeWidth={s * 0.1} strokeLinejoin="round" />
    </g>
  );
}

function Ring({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={r * 0.6} />;
}

function Plus({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  return <path d={`M${x - s} ${y}h${s * 2}M${x} ${y - s}v${s * 2}`} stroke={color} strokeWidth={s * 0.6} strokeLinecap="round" />;
}

function Spark({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  const d = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const f = (n: number) => Math.round(n * 10) / 10;
    return `M${f(x + Math.cos(a) * s * 0.45)} ${f(y + Math.sin(a) * s * 0.45)}L${f(x + Math.cos(a) * s)} ${f(y + Math.sin(a) * s)}`;
  }).join("");
  return <path d={d} stroke={color} strokeWidth={s * 0.25} strokeLinecap="round" />;
}

/** Tetris: a smiling piece in front of a yellow drip, over a gappy stack. */
export function TetrisCover() {
  const s = 34;
  const ground = 290;
  const rowY = [ground - s * 3, ground - s * 2, ground - s];
  const col = (i: number) => 47 + i * s;
  const stack: [number, number, BlockName][] = [
    [0, 0, "blue"], [1, 0, "blue"], [7, 0, "green"], [8, 0, "red"],
    [0, 1, "blue"], [1, 1, "orange"], [2, 1, "orange"], [5, 1, "blue"], [6, 1, "green"], [7, 1, "green"], [8, 1, "red"],
    [0, 2, "blue"], [1, 2, "orange"], [2, 2, "orange"], [3, 2, "blue"], [4, 2, "blue"], [5, 2, "blue"], [6, 2, "green"], [8, 2, "red"],
  ];
  const piece = [[183, 118], [149, 152], [183, 152], [217, 152]];
  return (
    <svg viewBox="0 0 400 300" className="block h-auto w-full" role="img" aria-label="Smiling yellow blocks falling onto a colourful stack">
      <rect width="400" height="300" fill="#ffffff" />
      <g fill={BLOCKS.yellow.fill}>
        <rect x="150" y="70" width="22" height="100" rx="11" />
        <rect x="176" y="22" width="22" height="30" rx="11" />
        <rect x="176" y="62" width="22" height="108" rx="11" />
        <rect x="202" y="48" width="22" height="30" rx="11" />
        <rect x="202" y="92" width="22" height="78" rx="11" />
        <rect x="228" y="14" width="22" height="30" rx="11" />
        <rect x="228" y="56" width="22" height="114" rx="11" />
        <rect x="150" y="128" width="100" height="42" />
      </g>
      <Ring x={114} y={60} r={6} color={BLOCKS.yellow.fill} />
      <Ring x={129} y={99} r={6} color={BLOCKS.orange.fill} />
      <Ring x={276} y={82} r={6} color={BLOCKS.purple.fill} />
      <Ring x={265} y={117} r={6} color={BLOCKS.green.fill} />
      <Plus x={109} y={126} s={6} color={BLOCKS.blue.fill} />
      <Plus x={142} y={124} s={5} color={BLOCKS.orange.fill} />
      <Plus x={290} y={102} s={5} color={BLOCKS.orange.fill} />
      <Plus x={270} y={149} s={6} color={BLOCKS.blue.fill} />
      <Spark x={129} y={145} s={9} color={BLOCKS.yellow.fill} />
      <Spark x={293} y={123} s={9} color={BLOCKS.yellow.fill} />
      <circle cx={105} cy={151} r={2} fill={BLOCKS.yellow.fill} />
      <circle cx={275} cy={130} r={2} fill={BLOCKS.yellow.fill} />
      {stack.map(([c, r, color]) => (
        <Block key={`${c}-${r}`} x={col(c)} y={rowY[r]} s={s} c={BLOCKS[color]} />
      ))}
      {piece.map(([x, y]) => (
        <Block key={`p-${x}-${y}`} x={x} y={y} s={s} c={BLOCKS.yellow} face />
      ))}
      <path d="M14 290h14M40 290h248M314 290h62M388 290h4" stroke={ARCADE.ink} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** Pixel art as four merged paths, so a sprite costs one <use> to repeat. */
function spritePaths(mask: readonly string[], p: number, lw: number) {
  const on = (c: number, r: number) => r >= 0 && r < mask.length && c >= 0 && c < mask[r].length && mask[r][c] === "X";
  const edge = Math.max(1, Math.round(p * 0.3));
  let outline = "";
  let fill = "";
  let light = "";
  let shade = "";
  for (let r = 0; r < mask.length; r++) {
    for (let c = 0; c < mask[r].length; c++) {
      if (!on(c, r)) continue;
      const x = c * p;
      const y = r * p;
      outline += rect(x - lw, y - lw, p + lw * 2, p + lw * 2);
      fill += rect(x, y, p, p);
      if (!on(c, r - 1)) light += rect(x, y, p, edge);
      if (!on(c - 1, r)) light += rect(x, y, edge, p);
      if (!on(c + 1, r)) shade += rect(x + p - edge, y, edge, p);
      if (!on(c, r + 1)) shade += rect(x, y + p - edge, p, edge);
    }
  }
  return { outline, fill, light, shade };
}

function SpriteDef({ id, mask, p, c, lw = 2 }: { id: string; mask: readonly string[]; p: number; c: BlockColor; lw?: number }) {
  const d = spritePaths(mask, p, lw);
  return (
    <g id={id}>
      <path d={d.outline} fill={ARCADE.ink} />
      <path d={d.fill} fill={c.fill} />
      <path d={d.light} fill={c.light} />
      <path d={d.shade} fill={c.shade} />
    </g>
  );
}

/** Deterministic stars, so the server and client render the same sky. */
const STARS = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 46 }, () => ({
    x: Math.round(rnd() * 400),
    y: Math.round(rnd() * 270),
    r: rnd() < 0.8 ? 1 : 1.6,
    o: Math.round((0.35 + rnd() * 0.6) * 100) / 100,
  }));
})();

/** Space Invaders: a formation above a lone ship, on the night sky. */
export function InvadersCover() {
  const slots = [70, 130, 190, 250, 310];
  return (
    <svg viewBox="0 0 400 300" className="block h-auto w-full" role="img" aria-label="Pixel invaders descending on a small ship at night">
      <defs>
        <SpriteDef id="cover-squid" mask={MASKS.squid[0]} p={4} c={BLOCKS.purple} />
        <SpriteDef id="cover-crab" mask={MASKS.crab[1]} p={4} c={BLOCKS.red} />
        <SpriteDef id="cover-octopus" mask={MASKS.octopus[0]} p={4} c={BLOCKS.green} />
        <SpriteDef id="cover-ufo" mask={MASKS.ufo} p={3} c={BLOCKS.pink} />
        <SpriteDef id="cover-ship" mask={MASKS.player} p={4} c={BLOCKS.blue} lw={3} />
        <SpriteDef id="cover-bunker" mask={MASKS.bunker} p={3} c={BLOCKS.green} />
      </defs>
      <rect width="400" height="300" fill={ARCADE.space} />
      {STARS.map((star, i) => (
        <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="#fff" opacity={star.o} />
      ))}
      <g opacity="0.55">
        <Ring x={40} y={120} r={5} color={BLOCKS.yellow.fill} />
        <Plus x={365} y={110} s={5} color={BLOCKS.blue.fill} />
        <Spark x={52} y={200} s={8} color={BLOCKS.purple.fill} />
        <Ring x={352} y={196} r={5} color={BLOCKS.orange.fill} />
      </g>
      <use href="#cover-ufo" x={292} y={16} />
      {slots.map((x) => (
        <use key={`squid-${x}`} href="#cover-squid" x={x + 14} y={52} />
      ))}
      {slots.map((x) => (
        <use key={`crab-${x}`} href="#cover-crab" x={x + 8} y={92} />
      ))}
      {slots.map((x) => (
        <use key={`octopus-${x}`} href="#cover-octopus" x={x + 6} y={132} />
      ))}
      <use href="#cover-bunker" x={70} y={212} />
      <use href="#cover-bunker" x={277} y={212} />
      <path d="M150 168l-4 5l8 5l-8 5l8 5" fill="none" stroke={ARCADE.ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 168l-4 5l8 5l-8 5l8 5" fill="none" stroke={BLOCKS.orange.fill} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="196" y="186" width="8" height="22" rx="4" fill={BLOCKS.yellow.fill} stroke={ARCADE.ink} strokeWidth="3" />
      <use href="#cover-ship" x={174} y={244} />
      <path d="M8 286h20M40 286h240M292 286h80M384 286h8" stroke={ARCADE.ground} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
