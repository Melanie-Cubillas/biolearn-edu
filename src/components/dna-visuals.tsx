// Helix illustration & DNA decorative SVGs
export function DnaHelix({ className = "", highlightPos = -1 }: { className?: string; highlightPos?: number }) {
  const steps = 14;
  return (
    <svg viewBox="0 0 200 320" className={className}>
      <defs>
        <linearGradient id="strandA" x1="0" x2="1">
          <stop offset="0" stopColor="oklch(0.65 0.2 255)" />
          <stop offset="1" stopColor="oklch(0.6 0.22 290)" />
        </linearGradient>
        <linearGradient id="strandB" x1="0" x2="1">
          <stop offset="0" stopColor="oklch(0.7 0.18 145)" />
          <stop offset="1" stopColor="oklch(0.7 0.18 50)" />
        </linearGradient>
      </defs>
      {Array.from({ length: steps }).map((_, i) => {
        const y = 10 + i * 22;
        const t = (i / steps) * Math.PI * 4;
        const x1 = 100 + Math.sin(t) * 60;
        const x2 = 100 - Math.sin(t) * 60;
        const highlight = i === highlightPos;
        return (
          <g key={i}>
            <line
              x1={x1} y1={y} x2={x2} y2={y}
              stroke={highlight ? "oklch(0.65 0.23 25)" : "oklch(0.85 0.03 250)"}
              strokeWidth={highlight ? 3 : 1.5}
              opacity={highlight ? 1 : 0.6}
            />
            <circle cx={x1} cy={y} r={highlight ? 6 : 4} fill="url(#strandA)" />
            <circle cx={x2} cy={y} r={highlight ? 6 : 4} fill="url(#strandB)" />
          </g>
        );
      })}
    </svg>
  );
}

export function MoleculePattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none">
      <g opacity="0.5">
        {Array.from({ length: 30 }).map((_, i) => {
          const x = (i % 6) * 70 + 30;
          const y = Math.floor(i / 6) * 70 + 30;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill="oklch(0.7 0.15 255)" />
              <circle cx={x + 30} cy={y + 30} r="2" fill="oklch(0.7 0.15 290)" />
              <line x1={x} y1={y} x2={x + 30} y2={y + 30} stroke="oklch(0.85 0.05 255)" strokeWidth="0.5" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
