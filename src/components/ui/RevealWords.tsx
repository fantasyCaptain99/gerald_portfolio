import { Fragment } from "react";

/**
 * Splits text into masked words that slide up when scrolled into view
 * (animated globally by MotionProvider via data-reveal="word").
 * Screen readers get the plain sentence.
 */
export function RevealWords({
  text,
  className,
  wordClassName,
}: {
  text: string;
  className?: string;
  /** Applied to each word — use for effects like gradient text that must live on the transformed element. */
  wordClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-reveal="word" className={`inline-block will-change-transform ${wordClassName ?? ""}`}>
                {w}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
