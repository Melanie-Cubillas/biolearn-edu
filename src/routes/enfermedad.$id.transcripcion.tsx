import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { PageLayout } from "@/components/layout";
import { diseases, transcribe, type DiseaseId } from "@/lib/diseases";
import { NucleotideRow } from "@/components/sequence-view";
import { ArrowDown, ArrowLeft, Dna, Zap, Play, Loader2, RotateCcw, FileText } from "lucide-react";

export const Route = createFileRoute("/enfermedad/$id/transcripcion")({
  head: () => ({ meta: [{ title: "Transcripción · BioLearn" }] }),
  component: Page,
});

function Page() {
  const { id } = useParams({ from: "/enfermedad/$id/transcripcion" });
  const d = diseases[id as DiseaseId];

  const [dna, setDna] = useState(d.sample);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ dna: string; rna: string } | null>(null);
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
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult({ dna: clean, rna: transcribe(clean) });
      setRunning(false);
    }, 1100);
  };

  const handleLoadExample = () => {
    setDna(d.sample);
    setError(null);
    setResult(null);
  };

  const handleReset = () => {
    setDna("");
    setResult(null);
    setError(null);
  };

  const sample = result?.dna ?? "";
  const rna = result?.rna ?? "";
  const tPositions: Record<number, "mutation"> = {};
  sample.split("").forEach((n, i) => { if (n === "T") tPositions[i] = "mutation"; });
  const uPositions: Record<number, "insertion"> = {};
  rna.split("").forEach((n, i) => { if (n === "U") uPositions[i] = "insertion"; });

  return (
    <PageLayout>
      <Link to="/enfermedad/$id" params={{ id }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver a {d.name}
      </Link>

      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-bio-blue font-bold">Dogma central · Paso 1</span>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Transcripción · ADN → ARN</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Ingresa una secuencia de ADN y simula la acción de la ARN polimerasa. La timina (T) será reemplazada por uracilo (U).
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
          placeholder="Ej: ATGCAGCAGCAGTAA"
          spellCheck={false}
          className="w-full h-28 rounded-xl border border-border bg-muted p-3 font-mono-bio text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
        />
        <div className="flex flex-wrap gap-2 mt-3 items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Longitud: <span className="font-bold text-foreground">{dna.replace(/\s+/g, "").length}</span> nt
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleLoadExample} className="h-10 px-4 rounded-xl bg-muted text-sm font-semibold hover:bg-muted/70 transition flex items-center gap-2">
              <Dna className="w-4 h-4" /> Cargar ejemplo ({d.name})
            </button>
            <button onClick={handleReset} className="h-10 px-4 rounded-xl bg-muted text-sm font-semibold hover:bg-muted/70 transition flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Limpiar
            </button>
            <button onClick={handleRun} disabled={running} className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition flex items-center gap-2 shadow-soft disabled:opacity-60">
              {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Simulando…</> : <><Play className="w-4 h-4" /> Simular transcripción</>}
            </button>
          </div>
        </div>
        {error && <p className="mt-3 text-xs text-bio-red font-semibold">{error}</p>}
      </div>

      {/* Running state */}
      {running && (
        <div className="rounded-3xl border border-border bg-card p-10 shadow-soft text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
          <div className="font-bold">ARN polimerasa procesando…</div>
          <p className="text-xs text-muted-foreground mt-1">Desenrollando la doble hélice y sintetizando ARN mensajero</p>
        </div>
      )}

      {/* Results */}
      {!running && result && (
        <>
          <div className="rounded-3xl border border-border bg-card p-6 lg:p-8 shadow-soft space-y-6">
            <Step n={1} title="ADN original (molde)" tone="bg-pastel-blue">
              <NucleotideRow sequence={sample} highlights={tPositions} />
              <p className="text-xs text-muted-foreground mt-3">Las T marcadas serán reemplazadas por U durante la transcripción.</p>
            </Step>

            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-1 animate-float">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[oklch(0.65_0.2_255)] to-[oklch(0.6_0.22_290)] flex items-center justify-center shadow-glow-blue">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">ARN polimerasa</span>
                <ArrowDown className="w-5 h-5 text-primary" />
              </div>
            </div>

            <Step n={2} title="ARN mensajero generado" tone="bg-pastel-purple">
              <NucleotideRow sequence={rna} highlights={uPositions} />
              <p className="text-xs text-muted-foreground mt-3">Cada U corresponde a una T del ADN original (resaltadas en naranja).</p>
            </Step>

            <div className="grid md:grid-cols-3 gap-3 pt-4 border-t border-border">
              <Card title="¿Qué pasó?" body={`Se reemplazaron ${(sample.match(/T/g) ?? []).length} timinas por uracilos.`} icon="🔄" />
              <Card title="Dónde ocurre" body="En el núcleo de la célula eucariota, dentro de la cromatina." icon="🧬" />
              <Card title="Siguiente paso" body="El ARNm sale del núcleo hacia el ribosoma para iniciar la traducción." icon="➡️" />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link to="/enfermedad/$id/traduccion" params={{ id }} className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-soft">
              Continuar a Traducción <Dna className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}

      {!running && !result && (
        <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-10 text-center">
          <Dna className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
          <div className="font-bold">Aún no hay resultados</div>
          <p className="text-xs text-muted-foreground mt-1">Ingresa una secuencia de ADN y pulsa "Simular transcripción" para ver el proceso.</p>
        </div>
      )}
    </PageLayout>
  );
}

function Step({ n, title, children, tone }: any) {
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

function Card({ title, body, icon }: { title: string; body: string; icon: string }) {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-bold text-sm">{title}</div>
      <p className="text-xs text-muted-foreground mt-1">{body}</p>
    </div>
  );
}
