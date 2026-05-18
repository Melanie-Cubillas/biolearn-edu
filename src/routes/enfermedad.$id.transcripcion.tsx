import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout";
import { diseases, transcribe, type DiseaseId } from "@/lib/diseases";
import { NucleotideRow } from "@/components/sequence-view";
import { ArrowDown, ArrowLeft, Dna, Zap } from "lucide-react";

export const Route = createFileRoute("/enfermedad/$id/transcripcion")({
  head: () => ({ meta: [{ title: "Transcripción · BioLearn" }] }),
  component: Page,
});

function Page() {
  const { id } = useParams({ from: "/enfermedad/$id/transcripcion" });
  const d = diseases[id as DiseaseId];
  const rna = transcribe(d.sample);
  const tPositions: Record<number, "mutation"> = {};
  d.sample.split("").forEach((n, i) => { if (n === "T") tPositions[i] = "mutation"; });
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
          La ARN polimerasa sintetiza una cadena de ARN mensajero usando el ADN como molde. La timina (T) se reemplaza por uracilo (U).
        </p>
      </div>

      {/* Flow */}
      <div className="rounded-3xl border border-border bg-card p-6 lg:p-8 shadow-soft space-y-6">
        <Step n={1} title="ADN original (molde)" tone="bg-pastel-blue">
          <NucleotideRow sequence={d.sample} highlights={tPositions} />
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
          <Card title="¿Qué pasó?" body={`Se reemplazaron ${(d.sample.match(/T/g) ?? []).length} timinas por uracilos.`} icon="🔄" />
          <Card title="Dónde ocurre" body="En el núcleo de la célula eucariota, dentro de la cromatina." icon="🧬" />
          <Card title="Siguiente paso" body="El ARNm sale del núcleo hacia el ribosoma para iniciar la traducción." icon="➡️" />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link to="/enfermedad/$id/traduccion" params={{ id }} className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-soft">
          Continuar a Traducción <Dna className="w-4 h-4" />
        </Link>
      </div>
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
