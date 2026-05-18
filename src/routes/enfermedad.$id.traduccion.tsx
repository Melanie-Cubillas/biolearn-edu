import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout";
import { diseases, transcribe, translate, type DiseaseId } from "@/lib/diseases";
import { NucleotideStrip } from "@/components/sequence-view";
import { ArrowDown, ArrowLeft, FlaskConical } from "lucide-react";

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
  const rna = transcribe(d.sample);
  const { codons, aas } = translate(rna);

  return (
    <PageLayout>
      <Link to="/enfermedad/$id" params={{ id }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver a {d.name}
      </Link>

      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-bio-purple font-bold">Dogma central · Paso 2</span>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Traducción · ARN → Proteína</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          El ribosoma lee el ARNm en grupos de tres nucleótidos (codones) y ensambla los aminoácidos correspondientes hasta encontrar un codón de parada.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 lg:p-8 shadow-soft space-y-8">
        <Stage n="1" title="Secuencia ADN" tone="bg-pastel-blue">
          <div className="font-mono-bio text-sm break-all p-3 rounded-xl bg-muted">{d.sample}</div>
        </Stage>
        <Arrow label="Transcripción" />
        <Stage n="2" title="ARN mensajero" tone="bg-pastel-purple">
          <div className="font-mono-bio text-sm break-all p-3 rounded-xl bg-muted">{rna}</div>
        </Stage>
        <Arrow label="Separación en codones" />
        <Stage n="3" title="Codones" tone="bg-pastel-yellow">
          <NucleotideStrip sequence={rna.slice(0, codons.length * 3)} />
        </Stage>
        <Arrow label="Lectura ribosomal" />
        <Stage n="4" title="Cadena de aminoácidos" tone="bg-pastel-green">
          <div className="flex flex-wrap gap-2 items-center">
            {aas.map((a, i) => {
              const tone = aaColors[a.aa] ?? "bg-muted text-muted-foreground";
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className={`px-3 py-2 rounded-2xl ${tone} font-bold text-sm shadow-soft hover:scale-105 transition`}>
                    <div className="text-xs opacity-70 leading-none">{codons[i]}</div>
                    <div>{a.aa}</div>
                    <div className="text-[10px] opacity-70">{a.full}</div>
                  </div>
                  {i < aas.length - 1 && <span className="text-muted-foreground">—</span>}
                </div>
              );
            })}
          </div>
        </Stage>

        <Stage n="5" title="Proteína resultante" tone="bg-pastel-blue">
          <div className="rounded-2xl border border-border p-5 bg-gradient-hero">
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">Estructura primaria</div>
            <div className="font-mono-bio text-2xl font-bold tracking-wider">
              {aas.filter((a) => a.aa !== "Stop").map((a) => a.letter).join("-")}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Esta cadena polipeptídica se pliega para formar la proteína funcional codificada por el gen {d.gene}.
              La mutación asociada a {d.name} altera esta secuencia y, por tanto, la función proteica.
            </p>
          </div>
        </Stage>

        {/* Codon table preview */}
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
