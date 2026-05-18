import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout";
import { BookOpen, Brain, PlayCircle, ArrowUpRight, TrendingUp, Award } from "lucide-react";
import { MoleculePattern } from "@/components/dna-visuals";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · BioLearn" }] }),
  component: Dashboard,
});

const modules = [
  {
    to: "/aprende",
    title: "Aprende sobre Bioinformática",
    desc: "Explora enfermedades genéticas reales, secuencias de ADN y procesos moleculares.",
    icon: BookOpen,
    grad: "bg-gradient-blue",
    chip: "12 lecciones",
    iconBg: "bg-bio-blue/15 text-bio-blue",
  },
  {
    to: "/quiz",
    title: "Pon a prueba tus conocimientos",
    desc: "Quizzes interactivos con preguntas de selección múltiple e interpretación de secuencias.",
    icon: Brain,
    grad: "bg-gradient-purple",
    chip: "8 evaluaciones",
    iconBg: "bg-bio-purple/15 text-bio-purple",
  },
  {
    to: "/tutoriales",
    title: "Tutoriales",
    desc: "Guías paso a paso de transcripción, traducción y detección de mutaciones.",
    icon: PlayCircle,
    grad: "bg-gradient-green",
    chip: "5 tutoriales",
    iconBg: "bg-bio-green/15 text-bio-green",
  },
];

function Dashboard() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 lg:p-10 mb-8 shadow-soft">
        <MoleculePattern className="absolute inset-0 w-full h-full opacity-40" />
        <div className="relative grid lg:grid-cols-3 gap-6 items-end">
          <div className="lg:col-span-2">
            <span className="inline-block px-3 py-1 rounded-full bg-card/70 backdrop-blur text-xs font-semibold mb-3">
              Hola, María 👋
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
              Continúa explorando el código de la vida.
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Selecciona un módulo para profundizar en genética, mutaciones y procesos bioinformáticos reales.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Progreso" value="64%" icon={TrendingUp} tone="bg-pastel-blue text-bio-blue" />
            <StatCard label="Racha" value="7d" icon={Award} tone="bg-pastel-yellow text-[oklch(0.5_0.15_80)]" />
            <StatCard label="Insignias" value="12" icon={Brain} tone="bg-pastel-purple text-bio-purple" />
          </div>
        </div>
      </section>

      {/* Module cards */}
      <h2 className="text-sm uppercase tracking-widest font-semibold text-muted-foreground mb-4">Módulos principales</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {modules.map((m, i) => (
          <Link
            key={m.to} to={m.to}
            style={{ animationDelay: `${i * 80}ms` }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 hover:-translate-y-1 transition-all shadow-soft hover:shadow-glow-blue animate-slide-up"
          >
            <div className={`absolute inset-0 ${m.grad} opacity-50 group-hover:opacity-80 transition-opacity`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${m.iconBg} flex items-center justify-center`}>
                  <m.icon className="w-6 h-6" strokeWidth={2.2} />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all" />
              </div>
              <h3 className="text-xl font-bold mb-2 leading-tight">{m.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{m.desc}</p>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-card text-xs font-semibold border border-border">{m.chip}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Activity */}
      <section className="mt-10 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-bold mb-4">Actividad reciente</h3>
          <ul className="space-y-3">
            {[
              { t: "Completaste la lección Huntington · Repeticiones CAG", c: "bg-pastel-purple", g: "HTT" },
              { t: "Quiz: Detección de mutaciones · 8/10", c: "bg-pastel-green", g: "QUIZ" },
              { t: "Iniciaste Anemia Falciforme · GAG→GTG", c: "bg-pastel-blue", g: "HBB" },
            ].map((a, i) => (
              <li key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition">
                <div className={`w-10 h-10 rounded-xl ${a.c} flex items-center justify-center text-[10px] font-bold font-mono-bio`}>{a.g}</div>
                <span className="text-sm flex-1">{a.t}</span>
                <span className="text-xs text-muted-foreground">hace {i + 1}h</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-bold mb-1">Próximo objetivo</h3>
          <p className="text-xs text-muted-foreground mb-4">Completa el módulo de Mutaciones para desbloquear la insignia avanzada.</p>
          <div className="h-3 rounded-full bg-muted overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-[oklch(0.65_0.2_255)] to-[oklch(0.65_0.2_290)]" style={{ width: "72%" }} />
          </div>
          <div className="text-xs text-right text-muted-foreground">72%</div>
          <Link to="/aprende" className="mt-4 block text-center rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition">
            Continuar
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof TrendingUp; tone: string }) {
  return (
    <div className="rounded-2xl bg-card/80 backdrop-blur p-3 shadow-soft">
      <div className={`w-8 h-8 rounded-lg ${tone} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="font-bold text-xl">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
