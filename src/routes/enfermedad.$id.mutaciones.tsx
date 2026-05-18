import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageLayout } from "@/components/layout";
import { analyzeSequences, diseases, ncbiSamples, type DiseaseId } from "@/lib/diseases";
import { NucleotideRow } from "@/components/sequence-view";
import { DnaHelix } from "@/components/dna-visuals";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar, Cell,
} from "recharts";
import { ArrowLeft, Beaker, Compass, Search, Target, Telescope, Microscope, FileSearch, Activity, Sparkles } from "lucide-react";

export const Route = createFileRoute("/enfermedad/$id/mutaciones")({
  head: () => ({ meta: [{ title: "Reconocer mutaciones · BioLearn" }] }),
  component: Page,
});

function Page() {
  const { id } = useParams({ from: "/enfermedad/$id/mutaciones" });
  const d = diseases[id as DiseaseId];
  const [mode, setMode] = useState<"guided" | "explore">("guided");

  return (
    <PageLayout>
      <Link to="/enfermedad/$id" params={{ id }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver a {d.name}
      </Link>

      <div className="mb-6">
        <span className="text-xs uppercase tracking-widest text-bio-green font-bold">Módulo principal</span>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Reconocer mutaciones</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Compara secuencias, detecta mutaciones y analiza su impacto biológico con visualizaciones de nivel profesional.
        </p>
      </div>

      {/* Mode switcher */}
      <div className="inline-flex rounded-2xl bg-muted p-1 mb-8">
        <button onClick={() => setMode("guided")} className={`flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-semibold transition ${mode === "guided" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>
          <Compass className="w-4 h-4" /> Modo guiado
        </button>
        <button onClick={() => setMode("explore")} className={`flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-semibold transition ${mode === "explore" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>
          <Telescope className="w-4 h-4" /> Modo exploratorio
        </button>
      </div>

      {mode === "guided" ? <GuidedMode disease={d} /> : <ExploreMode disease={d} />}
    </PageLayout>
  );
}

function GuidedMode({ disease: d }: { disease: typeof diseases[DiseaseId] }) {
  const analysis = useMemo(() => analyzeSequences(d.reference, d.sample), [d]);
  const eValue = (Math.pow(10, -8) * (100 - analysis.similarity + 1)).toExponential(2);
  const refHL: Record<number, any> = {};
  const sampleHL: Record<number, any> = {};
  let ri = 0, si = 0;
  for (const m of analysis.mutations) {
    if (m.type === "match") { ri++; si++; }
    else if (m.type === "substitution") { refHL[ri] = "mutation"; sampleHL[si] = "mutation"; ri++; si++; }
    else if (m.type === "insertion") { sampleHL[si] = "insertion"; si++; }
    else if (m.type === "deletion") { refHL[ri] = "deletion"; ri++; }
  }
  // mark CAG repeats blue in expansion type
  if (d.mutationType === "expansion") {
    for (let i = 0; i + 3 <= d.sample.length; i += 3) {
      if (d.sample.slice(i, i + 3) === "CAG") { sampleHL[i] = "repeat"; sampleHL[i + 1] = "repeat"; sampleHL[i + 2] = "repeat"; }
    }
  }

  const radarData = [
    { axis: "Identidad", val: analysis.similarity },
    { axis: "Cobertura", val: 98 },
    { axis: "Calidad", val: 95 },
    { axis: "Confianza", val: 92 },
    { axis: "E-value", val: 88 },
  ];

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Gauge value={analysis.similarity} label="Similitud" tone="oklch(0.65 0.2 255)" />
        <StatBox value={analysis.subs.toString()} label="Sustituciones" sub="cambios de base" tone="bg-pastel-pink text-bio-red" />
        <StatBox value={analysis.ins.toString()} label="Inserciones" sub="bases añadidas" tone="bg-pastel-yellow text-bio-orange" />
        <StatBox value={analysis.dels.toString()} label="Deleciones" sub="bases eliminadas" tone="bg-pastel-yellow text-bio-orange" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-1"><Microscope className="w-4 h-4 text-primary" /><h3 className="font-bold">Alineamiento de secuencias</h3></div>
          <p className="text-xs text-muted-foreground mb-4">Comparación nucleótido a nucleótido</p>
          <div className="space-y-5">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Referencia</div>
              <NucleotideRow sequence={d.reference} highlights={refHL} />
            </div>
            <AlignBar mutations={analysis.mutations} />
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Muestra</div>
              <NucleotideRow sequence={d.sample} highlights={sampleHL} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-border text-xs">
            <Metric label="E-value" value={eValue} />
            <Metric label="Identity score" value={`${analysis.similarity.toFixed(1)}%`} />
            <Metric label="Tipo dominante" value={labelType(d.mutationType)} />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-bold mb-1">Perfil de calidad</h3>
          <p className="text-xs text-muted-foreground mb-2">Indicadores del alineamiento</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="oklch(0.92 0.01 250)" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar dataKey="val" stroke="oklch(0.6 0.22 290)" fill="oklch(0.6 0.22 290)" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution of mutations + repeat counter */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-bold mb-1 flex items-center gap-2"><Activity className="w-4 h-4 text-bio-blue" /> Distribución de mutaciones por posición</h3>
          <p className="text-xs text-muted-foreground mb-4">Mapa de calor de eventos</p>
          <MutationMap mutations={analysis.mutations} />
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-bold mb-1">Patrones repetitivos</h3>
          <p className="text-xs text-muted-foreground mb-4">Repeticiones CAG detectadas</p>
          <div className="flex items-center justify-center">
            <div className="relative w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "r", value: Math.min(100, countCAG(d.sample) * 10), fill: "oklch(0.58 0.2 255)" }]} startAngle={90} endAngle={-270}>
                  <RadialBar background={{ fill: "oklch(0.95 0.03 255)" }} dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-extrabold text-bio-blue">{countCAG(d.sample)}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">CAG repeats</div>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Referencia: <span className="font-bold text-foreground">{countCAG(d.reference)}</span> · Muestra: <span className="font-bold text-bio-blue">{countCAG(d.sample)}</span>
          </p>
        </div>
      </div>

      {/* DNA helix + interpretation */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="rounded-3xl border border-border bg-gradient-purple p-6 shadow-soft flex items-center justify-center">
          <div className="w-40 h-64">
            <DnaHelix className="w-full h-full animate-spin-slow" highlightPos={Math.floor(d.reference.length / 6)} />
          </div>
        </div>
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-bio-purple" /><h3 className="font-bold">Interpretación biológica</h3></div>
          <p className="text-sm text-muted-foreground mb-4">{d.concept}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-pastel-blue/50 p-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-bio-blue mb-1">Tipo de mutación</div>
              <div className="font-bold">{labelType(d.mutationType)}</div>
            </div>
            <div className="rounded-2xl bg-pastel-purple/50 p-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-bio-purple mb-1">Gen afectado</div>
              <div className="font-bold font-mono-bio">{d.gene}</div>
            </div>
            <div className="rounded-2xl bg-pastel-green/50 p-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-bio-green mb-1">Impacto proteico</div>
              <div className="font-bold text-sm">Función alterada</div>
            </div>
            <div className="rounded-2xl bg-pastel-yellow/50 p-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[oklch(0.5_0.15_80)] mb-1">Posición clave</div>
              <div className="font-bold text-sm font-mono-bio">{analysis.mutations.findIndex((m) => m.type !== "match") + 1}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExploreMode({ disease: d }: { disease: typeof diseases[DiseaseId] }) {
  const [selected, setSelected] = useState(ncbiSamples[0].accession);
  const sample = ncbiSamples.find((s) => s.accession === selected)!;
  const [searched, setSearched] = useState(true);
  const analysis = useMemo(() => analyzeSequences(d.reference, sample.sequence), [d, sample]);

  const freq = ["A", "T", "C", "G"].map((n) => ({
    nuc: n,
    ref: (d.reference.match(new RegExp(n, "g")) ?? []).length,
    sample: (sample.sequence.match(new RegExp(n, "g")) ?? []).length,
  }));

  return (
    <div className="space-y-6">
      {/* Selector */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Selecciona una secuencia NCBI de muestra</label>
            <select value={selected} onChange={(e) => { setSelected(e.target.value); setSearched(false); }} className="w-full mt-2 h-11 rounded-xl border border-border bg-card px-3 text-sm font-mono-bio">
              {ncbiSamples.map((s) => (
                <option key={s.accession} value={s.accession}>{s.accession} · {s.gene} · {s.organism}</option>
              ))}
            </select>
          </div>
          <button onClick={() => setSearched(true)} className="h-11 px-5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-soft">
            <Search className="w-4 h-4" /> Buscar en NCBI
          </button>
        </div>
      </div>

      {searched && (
        <>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4"><FileSearch className="w-4 h-4 text-primary" /><h3 className="font-bold">Reporte científico</h3></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <Field label="Accession" value={sample.accession} mono />
              <Field label="Organism" value={sample.organism} />
              <Field label="Authors" value={sample.authors} />
              <Field label="Length" value={`${sample.length.toLocaleString()} pb`} />
              <Field label="Gene" value={sample.gene} mono />
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-muted">
              <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Title</div>
              <div className="text-sm">{sample.title}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-bold mb-1">Comparación contra referencia ({d.gene})</h3>
              <p className="text-xs text-muted-foreground mb-4">Alineamiento contra secuencia de referencia interna</p>
              <NucleotideRow sequence={d.reference} label="Referencia" />
              <div className="my-3" />
              <NucleotideRow sequence={sample.sequence} label="Muestra NCBI" />
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-bold mb-1">Similitud</h3>
              <p className="text-xs text-muted-foreground mb-2">Identidad global</p>
              <Gauge value={analysis.similarity} label="" tone="oklch(0.6 0.22 290)" />
              <div className="mt-4 space-y-1.5 text-xs">
                <Row k="Sustituciones" v={analysis.subs} c="text-bio-red" />
                <Row k="Inserciones" v={analysis.ins} c="text-bio-orange" />
                <Row k="Deleciones" v={analysis.dels} c="text-bio-orange" />
                <Row k="Coincidencias" v={analysis.matches} c="text-bio-green" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-bold mb-1">Frecuencia de nucleótidos</h3>
              <p className="text-xs text-muted-foreground mb-3">Distribución comparada</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={freq}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" />
                  <XAxis dataKey="nuc" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
                  <Bar dataKey="ref" fill="oklch(0.65 0.2 255)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="sample" fill="oklch(0.6 0.22 290)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-bold mb-1">Posible asociación</h3>
              <p className="text-xs text-muted-foreground mb-3">Detección de patrones característicos</p>
              <div className="space-y-3">
                <Bar2 label="Patrones repetitivos" value={countCAG(sample.sequence) * 12} tone="bg-bio-blue" />
                <Bar2 label="Similitud con HTT" value={sample.gene === "HTT" ? 96 : 30} tone="bg-bio-purple" />
                <Bar2 label="Similitud con HBB" value={sample.gene === "HBB" ? 95 : 25} tone="bg-bio-green" />
                <Bar2 label="Similitud con CFTR" value={sample.gene === "CFTR" ? 97 : 18} tone="bg-bio-orange" />
              </div>
              <div className="mt-4 p-3 rounded-xl bg-gradient-hero text-sm">
                <Target className="w-4 h-4 text-primary inline mr-2" />
                Asociación más probable: <span className="font-bold text-primary">{sample.gene}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Gauge({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">{label || "Similitud"}</div>
      <div className="flex items-baseline gap-1 mb-2"><span className="text-3xl font-extrabold" style={{ color: tone }}>{value.toFixed(1)}</span><span className="text-sm text-muted-foreground">%</span></div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: tone }} />
      </div>
    </div>
  );
}
function StatBox({ value, label, sub, tone }: any) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className={`w-9 h-9 rounded-xl ${tone} flex items-center justify-center mb-3`}><Beaker className="w-4 h-4" /></div>
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="text-xs font-semibold mt-1">{label}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{label}</div>
      <div className="font-bold font-mono-bio mt-1">{value}</div>
    </div>
  );
}
function AlignBar({ mutations }: { mutations: ReturnType<typeof analyzeSequences>["mutations"] }) {
  return (
    <div className="flex flex-wrap gap-0.5">
      {mutations.map((m, i) => {
        const c = m.type === "match" ? "bg-bio-green/40" : m.type === "substitution" ? "bg-bio-red" : "bg-bio-orange";
        return <div key={i} className={`w-7 h-3 rounded ${c}`} title={`pos ${i + 1}: ${m.type}`} />;
      })}
    </div>
  );
}
function MutationMap({ mutations }: { mutations: ReturnType<typeof analyzeSequences>["mutations"] }) {
  const data = mutations.map((m, i) => ({
    pos: i + 1,
    val: m.type === "match" ? 0 : m.type === "substitution" ? 3 : 2,
    type: m.type,
  }));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" />
        <XAxis dataKey="pos" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.type === "match" ? "oklch(0.85 0.05 145)" : d.type === "substitution" ? "oklch(0.65 0.23 25)" : "oklch(0.72 0.18 50)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
import { Cell } from "recharts";

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{label}</div>
      <div className={`text-sm font-bold mt-1 ${mono ? "font-mono-bio" : ""}`}>{value}</div>
    </div>
  );
}
function Row({ k, v, c }: { k: string; v: number; c: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className={`font-bold ${c}`}>{v}</span></div>;
}
function Bar2({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span>{label}</span><span className="font-bold">{Math.min(100, value)}%</span></div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${tone} transition-all`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function countCAG(s: string) {
  let max = 0, cur = 0;
  for (let i = 0; i + 3 <= s.length; i += 3) {
    if (s.slice(i, i + 3) === "CAG") { cur++; max = Math.max(max, cur); } else cur = 0;
  }
  return max;
}
function labelType(t: string) {
  if (t === "expansion") return "Expansión de repeticiones";
  if (t === "substitution") return "Sustitución puntual";
  if (t === "deletion") return "Deleción";
  return t;
}
