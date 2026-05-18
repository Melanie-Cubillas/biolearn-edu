import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout";
import { diseaseList } from "@/lib/diseases";
import { Activity, ArrowRight, Dna, Users } from "lucide-react";

export const Route = createFileRoute("/aprende")({
  head: () => ({ meta: [{ title: "Aprende · BioLearn" }] }),
  component: Aprende,
});

function Aprende() {
  return (
    <PageLayout>
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest font-semibold text-primary">Módulo 1</span>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-1">¿Sobre qué enfermedad te gustaría aprender?</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Elige una enfermedad genética para explorar su gen asociado, secuencia de referencia, mutaciones y procesos moleculares.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {diseaseList.map((d, i) => (
          <Link
            key={d.id} to="/enfermedad/$id" params={{ id: d.id }}
            style={{ animationDelay: `${i * 100}ms` }}
            className="group relative rounded-3xl border border-border bg-card overflow-hidden hover:-translate-y-1 transition-all shadow-soft hover:shadow-glow-blue animate-slide-up flex flex-col"
          >
            <div className={`${d.gradient} h-32 relative overflow-hidden`}>
              <div className="absolute -right-6 -bottom-6 opacity-30">
                <Dna className="w-40 h-40" strokeWidth={1} />
              </div>
              <div className="p-5 flex items-start justify-between relative">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-full bg-card/80 backdrop-blur text-[10px] font-bold uppercase tracking-wider">{d.badge}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-card/90 backdrop-blur border border-border shadow-soft">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block leading-none">Gen</span>
                  <span className="font-mono-bio font-bold text-primary">{d.gene}</span>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-bold text-lg leading-tight mb-1">{d.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{d.shortMutation}</p>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-5">{d.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="rounded-xl bg-pastel-blue/50 p-3">
                  <div className="flex items-center gap-1.5 mb-1 text-bio-blue"><Users className="w-3 h-3" /><span className="text-[10px] uppercase font-bold">Casos</span></div>
                  <div className="font-bold text-sm">{d.cases.toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-pastel-green/50 p-3">
                  <div className="flex items-center gap-1.5 mb-1 text-bio-green"><Activity className="w-3 h-3" /><span className="text-[10px] uppercase font-bold">Prevalencia</span></div>
                  <div className="font-bold text-xs">{d.prevalence}</div>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">Secuencia · {d.reference.length} nt</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                  Explorar <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
