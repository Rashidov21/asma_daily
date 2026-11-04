"use client";

import { motion } from "framer-motion";
import type { DivineName } from "@/data/names";

type Props = {
  names: DivineName[];
  currentIndex: number;
};

export function NamesRing({ names, currentIndex }: Props) {
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 138;
  const labelR = 155;
  const n = names.length;
  const angle = (currentIndex / n) * Math.PI * 2 - Math.PI / 2;
  const px = cx + Math.cos(angle) * (radius - 8);
  const py = cy + Math.sin(angle) * (radius - 8);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      {/* soft gold halo behind ring centre */}
      <div
        className="halo-gold pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      />

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="relative h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5CC65" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F5CC65" stopOpacity="0" />
          </radialGradient>
          <filter id="goldBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="textGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={cx}
          cy={cy}
          r={radius + 22}
          fill="none"
          stroke="#30234E"
          strokeWidth="1"
          opacity="0.6"
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#D7B65D"
          strokeWidth="1.2"
          opacity="0.5"
          className="ring-breathe"
          filter="url(#goldBlur)"
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius - 28}
          fill="none"
          stroke="#30234E"
          strokeWidth="1"
          opacity="0.45"
        />

        {names.map((name, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * labelR;
          const y = cy + Math.sin(a) * labelR;
          const rot = (a * 180) / Math.PI + 90;
          const isCurrent = i === currentIndex;
          return (
            <text
              key={name.id}
              x={x}
              y={y}
              fill={isCurrent ? "#F5CC65" : "#F5F2FF"}
              opacity={isCurrent ? 1 : 0.45}
              fontSize={isCurrent ? 7.5 : 5.2}
              fontWeight={isCurrent ? 700 : 400}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rot}, ${x}, ${y})`}
              filter={isCurrent ? "url(#textGlow)" : undefined}
              style={{
                fontFamily: "var(--font-manrope), system-ui, sans-serif",
                letterSpacing: isCurrent ? "0.04em" : undefined,
              }}
            >
              {name.russianName}
            </text>
          );
        })}

        <motion.line
          x1={cx}
          y1={cy}
          x2={px}
          y2={py}
          stroke="#F5CC65"
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#goldBlur)"
          initial={false}
          animate={{ x2: px, y2: py }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
        {/* pulsing halo on current-name marker */}
        <circle cx={px} cy={py} r={14} fill="url(#ringGlow)" />
        <circle
          cx={px}
          cy={py}
          r={9}
          fill="url(#ringGlow)"
          className="marker-pulse"
        />
        <circle
          cx={px}
          cy={py}
          r={3.5}
          fill="#F5CC65"
          filter="url(#goldBlur)"
        />

        {/* Rub el Hizb-inspired frame */}
        <g filter="url(#goldBlur)">
          <polygon
            points={`${cx},${cy - 42} ${cx + 16},${cy - 16} ${cx + 42},${cy} ${cx + 16},${cy + 16} ${cx},${cy + 42} ${cx - 16},${cy + 16} ${cx - 42},${cy} ${cx - 16},${cy - 16}`}
            fill="none"
            stroke="#F5CC65"
            strokeWidth="1.6"
          />
        </g>
        <polygon
          points={`${cx},${cy - 30} ${cx + 11},${cy - 11} ${cx + 30},${cy} ${cx + 11},${cy + 11} ${cx},${cy + 30} ${cx - 11},${cy + 11} ${cx - 30},${cy} ${cx - 11},${cy - 11}`}
          fill="none"
          stroke="#D7B65D"
          strokeWidth="1"
          opacity="0.75"
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-numerals glow-title text-[2.65rem] font-semibold leading-none tracking-tight text-[var(--gold)]"
        >
          {currentIndex + 1}
        </motion.span>
      </div>
    </div>
  );
}
