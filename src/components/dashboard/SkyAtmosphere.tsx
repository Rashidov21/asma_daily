"use client";

import { useEffect, useMemo, useState } from "react";
import { getSkyPeriod, type SkyPeriod } from "@/lib/sky-period";

function SoftCloud({
  className,
  delay,
  duration,
}: {
  className: string;
  delay: number;
  duration: number;
}) {
  return (
    <div
      className={`sky-cloud ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
      aria-hidden
    />
  );
}

/** Deterministic star field — denser, brighter, natural twinkle via CSS var. */
function NaturalStars({ count = 90 }: { count?: number }) {
  const stars = useMemo(() => {
    const out: Array<{
      x: number;
      y: number;
      size: number;
      op: number;
      delay: number;
      dur: number;
      bright: boolean;
    }> = [];
    for (let i = 0; i < count; i++) {
      // Simple LCG-ish mix for stable positions
      const n = (i * 2654435761) >>> 0;
      const x = ((n % 1000) / 10) % 100;
      const y = ((((n >>> 10) % 1000) / 10) % 100);
      const size = 1.2 + (i % 5) * 0.55 + (i % 7 === 0 ? 1.2 : 0);
      const op = 0.35 + (i % 6) * 0.1;
      const delay = (i % 17) * 0.37;
      const dur = 3.2 + (i % 8) * 0.55;
      out.push({ x, y, size, op, delay, dur, bright: i % 11 === 0 });
    }
    return out;
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Soft milky-way haze */}
      <div className="sky-milky absolute inset-0" />
      {/* Extra CSS speck layer for depth */}
      <div className="sky-starfield-dense absolute inset-0" />
      {stars.map((s, i) => (
        <span
          key={i}
          className={`sky-star absolute rounded-full ${s.bright ? "sky-star-bright" : ""}`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            // CSS var so animation doesn't wipe base brightness
            ["--star-op" as string]: String(s.op),
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            boxShadow: s.bright
              ? `0 0 ${s.size * 4}px rgba(255, 246, 224, 0.85), 0 0 ${s.size * 8}px rgba(245, 204, 101, 0.35)`
              : `0 0 ${s.size * 2.5}px rgba(255, 246, 224, 0.55)`,
            background: s.bright
              ? "radial-gradient(circle, #fff 0%, #FFE9A8 55%, transparent 100%)"
              : "#FFF6E0",
          }}
        />
      ))}
    </div>
  );
}

export function SkyAtmosphere() {
  const [period, setPeriod] = useState<SkyPeriod>("night");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tick = () => setPeriod(getSkyPeriod());
    tick();
    setReady(true);
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const showClouds = period === "day" || period === "dawn" || period === "dusk";
  const showStars = period === "night" || period === "dusk" || period === "dawn";

  return (
    <div
      className={`sky-root pointer-events-none absolute inset-0 transition-opacity duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
      data-period={period}
      aria-hidden
    >
      <div className="sky-gradient absolute inset-0" />

      {showClouds && (
        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-[2s] ${
            period === "day"
              ? "opacity-100"
              : period === "dawn" || period === "dusk"
                ? "opacity-55"
                : "opacity-0"
          }`}
        >
          <div className="sky-haze absolute inset-0" />
          <SoftCloud className="cloud-a left-[-20%] top-[8%] h-28 w-[70%]" delay={0} duration={95} />
          <SoftCloud className="cloud-b left-[25%] top-[18%] h-24 w-[55%]" delay={-20} duration={110} />
          <SoftCloud className="cloud-c left-[-10%] top-[32%] h-32 w-[75%]" delay={-45} duration={120} />
          <SoftCloud className="cloud-d left-[40%] top-[42%] h-20 w-[50%]" delay={-12} duration={100} />
          <SoftCloud className="cloud-e left-[5%] top-[58%] h-24 w-[60%]" delay={-60} duration={130} />
        </div>
      )}

      {showStars && (
        <div
          className={`absolute inset-0 transition-opacity duration-[1.2s] ${
            period === "night" ? "opacity-100" : "opacity-55"
          }`}
        >
          <NaturalStars count={period === "night" ? 110 : 60} />
        </div>
      )}

      <div className="sky-vignette absolute inset-0" />
    </div>
  );
}
