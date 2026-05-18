import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout";
import { diseases, type DiseaseId } from "@/lib/diseases";
import { NucleotideRow } from "@/components/sequence-view";
import { DnaHelix } from "@/components/dna-visuals";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, CartesianGrid,
} from "recharts";
import { Activity, AlertCircle, Brain, Dna, FlaskConical, MapPin, Stethoscope, Users, ArrowRight, FileText, Sparkles } from "lucide-react";

export const Route = createFileRoute("/enfermedad/$id")({
  head: ({ params }) => ({ meta: [{ title: `${diseases[params.id as DiseaseId]?.name ?? "Enfermedad"} · BioLearn` }] }),
  component: DiseasePage,
});

function DiseasePage() {
  const { id } = useParams({ from: "/enfermedad/$id" });
  const d = diseases[id as DiseaseId];
  if (!d) return <PageLayout><div>No encontrado</div></PageLayout>;

  // build mutation highlight maps
  const refHL: Record<number, "mutation" | "insertion" | "deletion" | "repeat"> = {};
  const sampleHL: Record<number, "mutation" | "insertion" | "deletion" | "repeat"> = {};
  if (d.mutationType === "expansion") {
    // sample has extra CAGs at end region
    for (let i = 0; i + 3 <= d.sample.length; i += 3) {
      if (d.sample.slice(i, i + 3) === "CAG") sampleHL[i] = sampleHL[i + 1] = sampleHL[i + 2] = "repeat";
    }
    for (let i = 0; i + 3 <= d.reference.length; i += 3) {
      if (d.reference.slice(i, i + 3) === "CAG") refHL[i] = refHL[i + 1] = refHL[i + 2] = "repeat";
    }
  } else if (d.mutationType === "substitution") {
    for (let i = 0; i < Math.min(d.reference.length, d.sample.length); i++) {
      if (d.reference[i] !== d.sample[i]) { refHL[i] = "mutation"; sampleHL[i] = "mutation"; }
    }
  } else if (d.mutationType === "deletion") {
    // mark deletion region (codon ATC at position ~9 vs nothing)
    // find first diff & mark
    for (let i = 0, j = 0; i < d.reference.length; i++) {
      if (d.reference[i] !== d.sample[j]) { refHL[i] = "deletion"; if (j < d.sample.length) sampleHL[j] = "insertion"; }
      else j++;
    }
  }

  return (
    <PageLayout>
      {/* Header */}
      <section className={`relative overflow-hidden rounded-3xl ${d.gradient} p-8 mb-8 shadow-soft`}>
        <div className="absolute right-4 top-0 bottom-0 opacity-40 w-64">
          <DnaHelix className="w-full h-full animate-spin-slow" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-card/80 backdrop-blur text-[10px] font-bold uppercase tracking-wider">{d.badge}</span>
            <span className="px-2.5 py-1 rounded-full bg-card/80 backdrop-blur text-[10px] font-bold uppercase tracking-wider font-mono-bio">Gen · {d.gene}</span>
            <span className="px-2.5 py-1 rounded-full bg-card/80 backdrop-blur text-[10px] font-bold uppercase tracking-wider font-mono-bio">{d.shortMutation}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-3 max-w-2xl">{d.name}</h1>
          <p className="text-muted-foreground max-w-xl">{d.description}</p>
        </div>
      </section>

      {/* Info cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <InfoCard icon={Brain} title="Concepto médico y genético" body={d.concept} tone="bg-pastel-purple text-bio-purple" />
        <InfoCard icon={Stethoscope} title="Síntomas" tone="bg-pastel-blue text-bio-blue">
          <ul className="space-y-1.5">
            {d.symptoms.map((s) => (
              <li key={s} className="flex gap-2 text-sm"><span className="text-bio-blue mt-1">●</span>{s}</li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard icon={AlertCircle} title="Causas" body={d.causes} tone="bg-pastel-green text-bio-green" />
      </div>

      {/* Impact visualization */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-bold">Impacto global</span>
            <h2 className="text-2xl font-extrabold tracking-tight">Visualización del impacto</h2>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Datos ilustrativos</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <ChartCard title="Casos por ubicación" icon={MapPin} tone="bg-pastel-blue">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={d.byLocation}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" />
                <XAxis dataKey="region" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
                <Bar dataKey="cases" fill="oklch(0.65 0.2 255)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Casos por edad" icon={Users} tone="bg-pastel-purple">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={d.byAge} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="range" type="category" tick={{ fontSize: 10 }} width={50} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
                <Bar dataKey="cases" fill="oklch(0.6 0.22 290)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Casos por género" icon={Activity} tone="bg-pastel-green">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={d.byGender} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={4}>
                  {d.byGender.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "oklch(0.65 0.2 290)" : "oklch(0.65 0.2 255)"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs">
              {d.byGender.map((g, i) => (
                <div key={g.name} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: i === 0 ? "oklch(0.65 0.2 290)" : "oklch(0.65 0.2 255)" }} />
                  {g.name} · {g.value}%
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* heatmap row */}
        <div className="grid lg:grid-cols-3 gap-5 mt-5">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-bold mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-bio-blue" /> Mapa de incidencia regional</h3>
            <p className="text-xs text-muted-foreground mb-4">Densidad relativa de casos por región</p>
            <Heatmap data={d.byLocation} />
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-bold mb-1">Indicador clínico</h3>
            <p className="text-xs text-muted-foreground mb-4">Prevalencia estimada</p>
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "p", value: 78, fill: "oklch(0.6 0.2 290)" }]} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: "oklch(0.95 0.02 290)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-24 mb-12">
              <div className="text-3xl font-extrabold text-bio-purple">{d.prevalence.split(" ")[0]}</div>
              <div className="text-xs text-muted-foreground">{d.prevalence.split(" ").slice(1).join(" ")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sequences */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-bold">Secuencias</span>
            <h2 className="text-2xl font-extrabold tracking-tight">Comparación de ADN</h2>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <LegendDot color="bg-bio-blue" label="Repetición" />
            <LegendDot color="bg-bio-red" label="Mutación" />
            <LegendDot color="bg-bio-orange" label="Inserción/Deleción" />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Secuencia de referencia</span>
              <span className="text-[10px] text-muted-foreground font-mono-bio">{d.reference.length} nt</span>
            </div>
            <NucleotideRow sequence={d.reference} highlights={refHL} />
          </div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card border border-border rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">vs</div>
            <div className="border-t border-dashed border-border pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Secuencia muestra (paciente)</span>
                <span className="text-[10px] text-muted-foreground font-mono-bio">{d.sample.length} nt</span>
              </div>
              <NucleotideRow sequence={d.sample} highlights={sampleHL} />
            </div>
          </div>
        </div>
      </section>

      {/* Functional modules */}
      <section>
        <span className="text-xs uppercase tracking-widest text-primary font-bold">Procesos moleculares</span>
        <h2 className="text-2xl font-extrabold tracking-tight mb-5">Módulos funcionales</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <ModuleButton to="/enfermedad/$id/transcripcion" id={d.id} title="Transcripción" desc="ADN → ARN" icon={Dna} tone="bg-gradient-blue" iconBg="bg-bio-blue/15 text-bio-blue" />
          <ModuleButton to="/enfermedad/$id/traduccion" id={d.id} title="Traducción" desc="ARN → Proteína" icon={FlaskConical} tone="bg-gradient-purple" iconBg="bg-bio-purple/15 text-bio-purple" />
          <ModuleButton to="/enfermedad/$id/mutaciones" id={d.id} title="Reconocer mutaciones" desc="Análisis comparativo" icon={FileText} tone="bg-gradient-green" iconBg="bg-bio-green/15 text-bio-green" featured />
        </div>
      </section>
    </PageLayout>
  );
}

function InfoCard({ icon: Icon, title, body, children, tone }: { icon: any; title: string; body?: string; children?: React.ReactNode; tone: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft hover:shadow-glow-blue hover:-translate-y-0.5 transition-all">
      <div className={`w-11 h-11 rounded-2xl ${tone} flex items-center justify-center mb-4`}><Icon className="w-5 h-5" /></div>
      <h3 className="font-bold mb-2">{title}</h3>
      {body ? <p className="text-sm text-muted-foreground">{body}</p> : children}
    </div>
  );
}

function ChartCard({ title, icon: Icon, tone, children }: any) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-xl ${tone} flex items-center justify-center`}><Icon className="w-4 h-4 text-primary" /></div>
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Heatmap({ data }: { data: { region: string; cases: number }[] }) {
  const max = Math.max(...data.map((d) => d.cases));
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {data.map((d) => {
        const intensity = d.cases / max;
        return (
          <div key={d.region} className="text-center">
            <div className="aspect-square rounded-xl" style={{ background: `oklch(${0.95 - intensity * 0.3} ${0.05 + intensity * 0.18} 255)` }} title={`${d.region}: ${d.cases}`} />
            <div className="text-[9px] mt-1 font-semibold truncate">{d.region}</div>
            <div className="text-[9px] text-muted-foreground">{d.cases.toLocaleString()}</div>
          </div>
        );
      })}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-full ${color}`} />{label}</span>;
}

function ModuleButton({ to, id, title, desc, icon: Icon, tone, iconBg, featured }: any) {
  return (
    <Link
      to={to as any} params={{ id } as any}
      className={`group relative overflow-hidden rounded-3xl border ${featured ? "border-primary/30" : "border-border"} bg-card p-6 hover:-translate-y-1 transition-all shadow-soft hover:shadow-glow-purple`}
    >
      <div className={`absolute inset-0 ${tone} opacity-40 group-hover:opacity-70 transition-opacity`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}><Icon className="w-6 h-6" /></div>
          {featured && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary text-primary-foreground">Destacado</span>}
        </div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{desc}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">Iniciar <ArrowRight className="w-4 h-4" /></span>
      </div>
    </Link>
  );
}
