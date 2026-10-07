/**
 * A head-and-shoulders silhouette in a two-colour gradient. CSS blurs it and the
 * backdrop adds grain, so it reads as a soft, glowing figure without any photo.
 * Purely decorative: hidden from screen readers. `id` must be unique on the page.
 */
export function Figure({ id, from, to, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 260"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M100 20C125 20 141 42 141 72C141 100 129 118 117 126L119 150C151 158 178 172 188 200L196 260H4L12 200C22 172 49 158 81 150L83 126C71 118 59 100 59 72C59 42 75 20 100 20Z"
      />
    </svg>
  );
}
