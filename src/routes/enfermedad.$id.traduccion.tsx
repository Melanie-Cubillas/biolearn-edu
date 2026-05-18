import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { PageLayout } from "@/components/layout";
import { diseases, transcribe, translate, type DiseaseId } from "@/lib/diseases";
import { NucleotideStrip } from "@/components/sequence-view";
import { ArrowDown, ArrowLeft, FlaskConical, Play, Loader2, RotateCcw, Dna, FileText } from "lucide-react";

export const Route = createFileRoute("/enfermedad/$id/traduccion")({
  head: () => ({ meta: [{ title: "Traducción · BioLearn" }] }),
  component: Page,
});

const aaColors: Record<string, string> = {
  Met: "bg-pastel-green text-bio-green",
  Gln: "bg-pastel-purple text-bio-purple",
  Val: "bg-pastel-blue text-bio-blue",
  Glu: "bg-pastel-yellow text-[oklch(0.5_0.15_80)]",
  Stop: "bg-bio-red/10 text-bio-red",
};

function Page() {
  const { id } = useParams({ from: "/enfermedad/$id/traduccion" });
  const d = diseases[id as DiseaseId];

  const [dna, setDna] = useState(d.sample);
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState<"idle" | "transcribing" | "translating" | "done">("idle");
  const [result, setResult] = useState<{ dna: string; rna: string; codons: string[]; aas: { aa: string; letter: string; full: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = () => {
    const clean = dna.toUpperCase().replace(/\s+/g, "");
    if (!/^[ATCG]+$/.test(clean)) {
      setError("Secuencia inválida: usa solo A, T, C, G.");
      return;
    }
    if (clean.length < 3) {
      setError("La secuencia debe tener al menos 3 nucleótidos.");
      return;
    }
    setError(null);
    setResult(null);
    setRunning(true);
    setStage("transcribing");
    setTimeout(() => {
      const rna = transcribe(clean);
      setStage("translating");
      setTimeout(() => {
        const { codons, aas } = translate(rna);
        setResult({ dna: clean, rna, codons, aas });
        setStage("done");
        setRunning(false);
      }, 900);
    }, 800);
  };

  const handleLoadExample = () => {
    setDna(d.sample);
    setError(null);
    setResult(null);
    setStage("idle");
  };

  const handleReset = () => {
    setDna("");
    setResult(null);
    setError(null);
    setStage("idle");
  };

  return (
    <PageLayout>
      <Link to="/enfermedad/$id" params={{ id }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver a {d.name}
      </Link>

      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-bio-purple font-bold">Dogma central · Paso 2</span>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Traducción · ARN → Proteína</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Ingresa una secuencia de ADN y el ribosoma simulado la transcribirá y traducirá codón por codón hasta encontrar un codón de parada.
        </p>
      </div>

      {/* Input panel */}
      <div className="rounded-3xl border border-border bg-card p-6 lg:p-8 shadow-soft mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-primary" />
          <h2 className="font-bold">Entrada · Secuencia de ADN</h2>
        </div>
        <textarea
          value={dna}
          onChange={(e) => setDna(e.target.value)}
          placeholder="Ej: ATGGTGCATCTGACTCCTGTGGAGAAGTAA"
          spellCheck={false}
          className="w-full h-28 rounded-xl border border-border bg-muted p-3 font-mono-bio text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
        />
        <div className="flex flex-wrap gap-2 mt-3 items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Longitud: <span className="font-bold text-foreground">{dna.replace(/\s+/g, "").length}</span> nt · Codones estimados: <span className="font-bold text-foreground">{Math.floor(dna.replace(/\s+/g, "").length / 3)}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleLoadExample} className="h-10 px-4 rounded-xl bg-muted text-sm font-semibold hover:bg-muted/70 transition flex items-center gap-2">
              <Dna className="w-4 h-4" /> Cargar ejemplo
            </button>
            <button onClick={handleReset} className="h-10 px-4 rounded-xl bg-muted text-sm font-semibold hover:bg-muted/70 transition flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Limpiar
            </button>
            <button onClick={handleRun} disabled={running} className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition flex items-center gap-2 shadow-soft disabled:opacity-60">
              {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Simulando…</> : <><Play className="w-4 h-4" /> Simular traducción</>}
            </button>
          </div>
        </div>
        {error && <p className="mt-3 text-xs text-bio-red font-semibold">{error}</p>}
      </div>

      {running && (
        <div className="rounded-3xl border border-border bg-card p-10 shadow-soft text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
          <div className="font-bold">
            {stage === "transcribing" ? "ARN polimerasa transcribiendo ADN → ARNm…" : "Ribosoma traduciendo codones → aminoácidos…"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Procesando dogma central</p>
        </div>
      )}

      {!running && result && (
        <div className="rounded-3xl border border-border bg-card p-6 lg:p-8 shadow-soft space-y-8">
          <Stage n="1" title="Secuencia ADN" tone="bg-pastel-blue">
            <div className="font-mono-bio text-sm break-all p-3 rounded-xl bg-muted">{result.dna}</div>
          </Stage>
          <Arrow label="Transcripción" />
          <Stage n="2" title="ARN mensajero" tone="bg-pastel-purple">
            <div className="font-mono-bio text-sm break-all p-3 rounded-xl bg-muted">{result.rna}</div>
          </Stage>
          <Arrow label="Separación en codones" />
          <Stage n="3" title="Codones" tone="bg-pastel-yellow">
            <NucleotideStrip sequence={result.rna.slice(0, result.codons.length * 3)} />
          </Stage>
          <Arrow label="Lectura ribosomal" />
          <Stage n="4" title="Cadena de aminoácidos" tone="bg-pastel-green">
            <div className="flex flex-wrap gap-2 items-center">
              {result.aas.map((a, i) => {
                const tone = aaColors[a.aa] ?? "bg-muted text-muted-foreground";
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`px-3 py-2 rounded-2xl ${tone} font-bold text-sm shadow-soft hover:scale-105 transition`}>
                      <div className="text-xs opacity-70 leading-none">{result.codons[i]}</div>
                      <div>{a.aa}</div>
                      <div className="text-[10px] opacity-70">{a.full}</div>
                    </div>
                    {i < result.aas.length - 1 && <span className="text-muted-foreground">—</span>}
                  </div>
                );
              })}
            </div>
          </Stage>

          <Stage n="5" title="Proteína resultante" tone="bg-pastel-blue">
            <div className="rounded-2xl border border-border p-5 bg-gradient-hero">
              <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">Estructura primaria</div>
              <div className="font-mono-bio text-2xl font-bold tracking-wider">
                {result.aas.filter((a) => a.aa !== "Stop").map((a) => a.letter).join("-")}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Esta cadena polipeptídica de {result.aas.filter((a) => a.aa !== "Stop").length} aminoácidos se pliega para formar la proteína funcional.
                {result.aas.some((a) => a.aa === "Stop") ? " Se detectó un codón de parada que finalizó la traducción." : " No se detectó codón de parada — secuencia incompleta."}
              </p>
            </div>
          </Stage>

          <div className="grid md:grid-cols-2 gap-5 pt-4 border-t border-border">
            <div className="rounded-2xl bg-muted p-5">
              <div className="text-xs uppercase tracking-widest font-bold mb-2">Impacto de la mutación</div>
              <p className="text-sm text-muted-foreground">
                En {d.name}, la alteración del codón modifica el aminoácido producido, lo que cambia las propiedades químicas de la proteína y compromete su función biológica.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-green p-5 relative overflow-hidden">
              <FlaskConical className="absolute -right-4 -bottom-4 w-24 h-24 text-bio-green/20" />
              <div className="text-xs uppercase tracking-widest font-bold mb-2 relative">Ribosoma en acción</div>
              <p className="text-sm text-muted-foreground relative">
                La subunidad pequeña se acopla al codón de inicio (AUG); la grande añade aminoácidos uno a uno hasta el codón de parada.
              </p>
            </div>
          </div>
        </div>
      )}

      {!running && !result && (
        <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-10 text-center">
          <FlaskConical className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
          <div className="font-bold">Aún no hay resultados</div>
          <p className="text-xs text-muted-foreground mt-1">Ingresa una secuencia y pulsa "Simular traducción" para ver el dogma central en acción.</p>
        </div>
      )}
    </PageLayout>
  );
}

function Stage({ n, title, children, tone }: any) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl ${tone} flex items-center justify-center font-bold text-sm`}>{n}</div>
        <h3 className="font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
function Arrow({ label }: { label: string }) {
  return (
    <div className="flex justify-center items-center gap-2 text-muted-foreground">
      <ArrowDown className="w-4 h-4" />
      <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
    </div>
  );
}
