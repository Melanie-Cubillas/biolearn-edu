import { cn } from "@/lib/utils";

const nucClass = (n: string) => {
  switch (n) {
    case "A": return "text-nuc-a";
    case "T": return "text-nuc-t";
    case "C": return "text-nuc-c";
    case "G": return "text-nuc-g";
    case "U": return "text-nuc-u";
    default: return "text-muted-foreground";
  }
};

const nucBg = (n: string) => {
  switch (n) {
    case "A": return "bg-[oklch(0.72_0.18_145/0.18)]";
    case "T": return "bg-[oklch(0.65_0.23_25/0.18)]";
    case "C": return "bg-[oklch(0.65_0.2_255/0.18)]";
    case "G": return "bg-[oklch(0.7_0.18_50/0.18)]";
    case "U": return "bg-[oklch(0.65_0.2_290/0.18)]";
    default: return "bg-muted";
  }
};

export function NucleotideStrip({ sequence, codonSize = 3, highlightIdx = [], label, className }: {
  sequence: string;
  codonSize?: number;
  highlightIdx?: number[];
  label?: string;
  className?: string;
}) {
  const codons: string[] = [];
  for (let i = 0; i < sequence.length; i += codonSize) codons.push(sequence.slice(i, i + codonSize));
  return (
    <div className={cn("space-y-2", className)}>
      {label && <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{label}</div>}
      <div className="flex flex-wrap gap-1.5 font-mono-bio text-base">
        {codons.map((c, i) => {
          const isHL = highlightIdx.includes(i);
          return (
            <div
              key={i}
              className={cn(
                "px-2 py-1.5 rounded-md border transition-all",
                isHL ? "border-bio-blue bg-bio-blue/10 shadow-glow-blue scale-110 font-bold" : "border-border bg-card hover:border-primary/40"
              )}
              title={`Codón ${i + 1}: ${c}`}
            >
              <div className="flex">
                {c.split("").map((n, j) => (
                  <span key={j} className={cn("font-bold", nucClass(n))}>{n}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function NucleotideRow({ sequence, label, highlights = {} }: {
  sequence: string;
  label?: string;
  highlights?: Record<number, "mutation" | "insertion" | "deletion" | "repeat">;
}) {
  return (
    <div className="space-y-1.5">
      {label && <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">{label}</div>}
      <div className="flex flex-wrap gap-0.5 font-mono-bio">
        {sequence.split("").map((n, i) => {
          const hl = highlights[i];
          let bg = nucBg(n);
          let extra = "";
          if (hl === "mutation") { bg = "bg-bio-red text-white"; extra = "ring-2 ring-bio-red/40 animate-pulse-glow"; }
          else if (hl === "insertion") { bg = "bg-bio-orange text-white"; extra = "ring-2 ring-bio-orange/40"; }
          else if (hl === "deletion") { bg = "bg-bio-orange/50 text-white line-through"; }
          else if (hl === "repeat") { bg = "bg-bio-blue text-white"; extra = "ring-2 ring-bio-blue/40 shadow-glow-blue"; }
          return (
            <div key={i} className={cn("w-7 h-9 flex items-center justify-center rounded text-sm font-bold transition-all", bg, extra, !hl && nucClass(n))}>
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}
