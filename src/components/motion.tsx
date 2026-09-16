import { ViewTransition, type CSSProperties, type ElementType, type ReactNode } from "react";

/*
 * Scroll-in motion. Elements carry `data-reveal`, and RevealObserver marks
 * them `data-revealed` once they scroll into view. globals.css only hides
 * them when scripting is on and the visitor has not asked for reduced
 * motion, and shows everything anyway if the observer never starts.
 */

/**
 * Text that rises into place a word (or a letter) at a time. Screen readers
 * get the plain string; the split copy is hidden from them.
 */
export function SplitText({
  text,
  as: Tag = "span",
  by = "word",
  delay = 0,
  stagger,
  className,
}: {
  text: string;
  as?: ElementType;
  by?: "word" | "char";
  /** Milliseconds before the first piece moves. */
  delay?: number;
  /** Milliseconds between pieces. */
  stagger?: number;
  className?: string;
}) {
  const step = stagger ?? (by === "char" ? 55 : 38);
  const words = text.split(" ");
  let n = 0;

  return (
    <Tag className={className} data-reveal="split">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            {by === "char" ? (
              // Letters of one word stay together so a line never breaks mid-word.
              <span className="whitespace-nowrap">
                {[...word].map((ch, c) => (
                  <Piece key={c} i={n++} step={step} delay={delay}>
                    {ch}
                  </Piece>
                ))}
              </span>
            ) : (
              <Piece i={n++} step={step} delay={delay}>
                {word}
              </Piece>
            )}
          </span>
        ))}
      </span>
    </Tag>
  );
}

function Piece({
  i,
  step,
  delay,
  children,
}: {
  i: number;
  step: number;
  delay: number;
  children: ReactNode;
}) {
  return (
    <span className="split-mask">
      <span className="split-piece" style={{ "--d": `${delay + i * step}ms` } as CSSProperties}>
        {children}
      </span>
    </span>
  );
}

/** A block that fades up into place when it scrolls into view. */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  /** Milliseconds before it moves, for staggering siblings. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag data-reveal="fade" className={className} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/**
 * Pairs a project's home thumbnail with its case study's opening image, so
 * one grows into the other on navigation. Without a slug it does nothing.
 */
export function WorkMorph({ slug, children }: { slug?: string; children: ReactNode }) {
  if (!slug) return <>{children}</>;
  return (
    <ViewTransition name={`work-${slug}`} share="work-morph" default="none">
      {children}
    </ViewTransition>
  );
}
