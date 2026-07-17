// Renders each line behind its own overflow-hidden mask (see
// src/styles/reveal-lines.css) so a section's CSS can rise it into view line
// by line, the same effect Hero's title uses. `lines` accepts strings or
// nodes (e.g. a line containing an accent <span>); each gets an explicit
// transition-delay so callers can stagger them without relying on
// `:nth-child`, which would break if a wrapper adds siblings.
export default function RevealLines({ lines, as: Tag = "span", className, baseDelay = 0, step = 0.12 }) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span className="reveal-line" key={i}>
          <span className="reveal-line__inner" style={{ transitionDelay: `${(baseDelay + i * step).toFixed(2)}s` }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
