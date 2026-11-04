"use client";

import { useEffect, useState } from "react";
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

function NaturalStars() {
  // Fixed pseudo-random field — stable across renders, varied sizes/opacities
  const stars = [
    [8, 12, 1.2, 0.35, 0],
    [22, 8, 0.8, 0.55, 1.2],
    [38, 18, 1.4, 0.4, 2.1],
    [55, 6, 0.7, 0.7, 0.4],
    [72, 14, 1.1, 0.45, 3.2],
    [88, 10, 0.9, 0.6, 1.8],
    [12, 32, 0.7, 0.5, 4.1],
    [28, 28, 1.6, 0.3, 0.9],
    [48, 36, 0.8, 0.65, 2.7],
    [66, 30, 1.0, 0.4, 5.0],
    [82, 40, 0.7, 0.55, 1.5],
    [94, 26, 1.3, 0.35, 3.8],
    [6, 52, 0.9, 0.45, 2.3],
    [18, 58, 1.1, 0.3, 4.6],
    [35, 48, 0.6, 0.7, 0.6],
    [52, 55, 1.5, 0.35, 3.0],
    [70, 62, 0.8, 0.5, 1.1],
    [86, 50, 1.0, 0.4, 5.4],
    [15, 72, 0.7, 0.55, 2.0],
    [42, 78, 1.2, 0.3, 4.2],
    [60, 70, 0.9, 0.6, 0.3],
    [78, 82, 0.7, 0.45, 3.5],
    [92, 68, 1.1, 0.35, 1.7],
    [25, 88, 0.8, 0.5, 2.9],
    [50, 92, 1.0, 0.4, 5.1],
  ] as const;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="sky-milky absolute inset-0" />
      {stars.map(([x, y, size, base, delay], i) => (
        <span
          key={i}
          className="sky-star absolute rounded-full bg-[#FFF6E0]"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            opacity: base,
            animationDelay: `${delay}s`,
            animationDuration: `${4.5 + (i % 5) * 1.1}s`,
            boxShadow:
              size > 1.1
                ? `0 0 ${size * 3}px rgba(255, 246, 224, 0.45)`
                : undefined,
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
      className={`sky-root pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
      data-period={period}
      aria-hidden
    >
      <div className="sky-gradient absolute inset-0" />

      {showClouds && (
        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-[2s] ${
            period === "day" ? "opacity-100" : period === "dawn" || period === "dusk" ? "opacity-55" : "opacity-0"
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
          className={`absolute inset-0 transition-opacity duration-[2s] ${
            period === "night" ? "opacity-100" : "opacity-40"
          }`}
        >
          <NaturalStars />
        </div>
      )}

      {/* Soft vignette so content stays readable */}
      <div className="sky-vignette absolute inset-0" />
    </div>
  );
}
