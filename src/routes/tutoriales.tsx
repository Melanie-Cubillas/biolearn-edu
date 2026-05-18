import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout";
import { PlayCircle, Clock, BookOpen } from "lucide-react";

export const Route = createFileRoute("/tutoriales")({
  head: () => ({ meta: [{ title: "Tutoriales · BioLearn" }] }),
  component: Tutoriales,
});

const tutorials = [
  { title: "Introducción a la bioinformática", time: "8 min", level: "Básico", tone: "bg-gradient-blue", chip: "bg-pastel-blue text-bio-blue" },
  { title: "Cómo leer una secuencia de ADN", time: "12 min", level: "Básico", tone: "bg-gradient-green", chip: "bg-pastel-green text-bio-green" },
  { title: "Transcripción y traducción paso a paso", time: "15 min", level: "Intermedio", tone: "bg-gradient-purple", chip: "bg-pastel-purple text-bio-purple" },
  { title: "Detección de mutaciones con alineamientos", time: "18 min", level: "Avanzado", tone: "bg-gradient-yellow", chip: "bg-pastel-yellow text-[oklch(0.5_0.15_80)]" },
  { title: "Búsqueda en bases de datos NCBI", time: "10 min", level: "Intermedio", tone: "bg-gradient-blue", chip: "bg-pastel-blue text-bio-blue" },
];

function Tutoriales() {
  return (
    <PageLayout>
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest font-bold text-primary">Centro de aprendizaje</span>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Tutoriales</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Guías paso a paso para dominar los conceptos fundamentales de la bioinformática.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tutorials.map((t, i) => (
          <div key={i} style={{ animationDelay: `${i * 80}ms` }} className="group rounded-3xl border border-border bg-card overflow-hidden hover:-translate-y-1 transition-all shadow-soft hover:shadow-glow-blue animate-slide-up cursor-pointer">
            <div className={`${t.tone} h-32 flex items-center justify-center relative`}>
              <div className="w-14 h-14 rounded-2xl bg-card/90 backdrop-blur flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                <PlayCircle className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.chip}`}>{t.level}</span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="w-3 h-3" />{t.time}</span>
              </div>
              <h3 className="font-bold leading-snug mb-3">{t.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                <BookOpen className="w-3.5 h-3.5" /> Ver tutorial
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
