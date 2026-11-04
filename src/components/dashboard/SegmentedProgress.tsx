"use client";

type Props = {
  current: number;
  total: number;
  segments?: number;
};

export function SegmentedProgress({ current, total, segments = 33 }: Props) {
  const filled = Math.round((current / total) * segments);
  return (
    <div
      className="relative flex w-full gap-[3px] overflow-hidden rounded-[3px] p-[3px] ring-1 ring-[var(--muted)]/80"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Progress ${current} of ${total}`}
    >
      {Array.from({ length: segments }).map((_, i) => {
        const isFilled = i < filled;
        return (
          <span
            key={i}
            className={`h-[6px] flex-1 rounded-[2px] ${
              isFilled ? "progress-seg-fill" : "bg-[var(--muted)]/70"
            }`}
            style={isFilled ? { animationDelay: `${0.5 + i * 0.03}s` } : undefined}
          />
        );
      })}
      <span className="progress-shimmer" aria-hidden />
    </div>
  );
}
