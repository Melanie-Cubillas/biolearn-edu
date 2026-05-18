import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageLayout } from "@/components/layout";
import { Check, X, ArrowRight, Trophy, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Quiz · BioLearn" }] }),
  component: Quiz,
});

interface Question {
  q: string;
  options: string[];
  answer: number;
  exp: string;
}
const questions: Question[] = [
  { q: "¿Qué gen está asociado a la Enfermedad de Huntington?", options: ["HBB", "HTT", "CFTR", "BRCA1"], answer: 1, exp: "El gen HTT codifica la proteína huntingtina." },
  { q: "Durante la transcripción, ¿qué nucleótido reemplaza a la timina?", options: ["Adenina", "Citosina", "Uracilo", "Guanina"], answer: 2, exp: "En el ARN, la T del ADN se reemplaza por U." },
  { q: "La mutación GAG → GTG en HBB produce:", options: ["Anemia falciforme", "Fibrosis quística", "Huntington", "Talasemia"], answer: 0, exp: "Sustituye Glu por Val en la cadena beta de hemoglobina." },
  { q: "¿Cuántos nucleótidos forman un codón?", options: ["2", "3", "4", "5"], answer: 1, exp: "Tres nucleótidos forman un codón que codifica un aminoácido." },
  { q: "El codón AUG codifica:", options: ["Stop", "Leucina", "Metionina (Inicio)", "Valina"], answer: 2, exp: "AUG es el codón de inicio y codifica metionina." },
];

function Quiz() {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[i];

  const next = () => {
    if (sel === q.answer) setScore(score + 1);
    if (i + 1 < questions.length) { setI(i + 1); setSel(null); } else setDone(true);
  };
  const reset = () => { setI(0); setSel(null); setScore(0); setDone(false); };

  if (done) {
    const pct = (score / questions.length) * 100;
    return (
      <PageLayout>
        <div className="max-w-xl mx-auto rounded-3xl border border-border bg-card p-10 shadow-soft text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-yellow flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-[oklch(0.5_0.15_80)]" />
          </div>
          <h2 className="text-3xl font-extrabold">¡Quiz completado!</h2>
          <p className="text-muted-foreground mt-1">Resultado final</p>
          <div className="text-6xl font-extrabold my-6 bg-gradient-to-r from-[oklch(0.6_0.2_255)] to-[oklch(0.6_0.22_290)] bg-clip-text text-transparent">
            {score}/{questions.length}
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-[oklch(0.7_0.18_145)] to-[oklch(0.65_0.2_255)]" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-sm text-muted-foreground">{pct.toFixed(0)}% de aciertos</p>
          <button onClick={reset} className="mt-8 inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
            <RotateCcw className="w-4 h-4" /> Repetir
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Pregunta {i + 1} de {questions.length}</span>
          <span className="text-xs font-bold">Puntaje: {score}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mb-8">
          <div className="h-full bg-gradient-to-r from-[oklch(0.65_0.2_255)] to-[oklch(0.6_0.22_290)] transition-all" style={{ width: `${((i + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft animate-slide-up" key={i}>
          <h2 className="text-xl font-bold mb-6 leading-tight">{q.q}</h2>
          <div className="space-y-2">
            {q.options.map((o, idx) => {
              const isSel = sel === idx;
              const showRight = sel !== null && idx === q.answer;
              const showWrong = sel !== null && isSel && idx !== q.answer;
              return (
                <button
                  key={idx}
                  disabled={sel !== null}
                  onClick={() => setSel(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                    showRight ? "border-bio-green bg-bio-green/10" :
                    showWrong ? "border-bio-red bg-bio-red/10" :
                    isSel ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    showRight ? "bg-bio-green text-white" : showWrong ? "bg-bio-red text-white" : "bg-muted"
                  }`}>
                    {showRight ? <Check className="w-4 h-4" /> : showWrong ? <X className="w-4 h-4" /> : String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-medium flex-1">{o}</span>
                </button>
              );
            })}
          </div>
          {sel !== null && (
            <div className="mt-5 p-4 rounded-2xl bg-pastel-blue/50 text-sm">
              <span className="font-bold">Explicación: </span>{q.exp}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button onClick={next} disabled={sel === null} className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-30 hover:opacity-90 transition">
              {i + 1 === questions.length ? "Finalizar" : "Siguiente"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
