import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, User, Dna } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.2_255)] to-[oklch(0.6_0.2_290)] flex items-center justify-center shadow-glow-blue">
        <Dna className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-lg tracking-tight text-foreground">BioLearn</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground -mt-0.5">Bioinformática</span>
      </div>
    </Link>
  );
}

export function TopBar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const links = [
    { to: "/dashboard", label: "Inicio" },
    { to: "/aprende", label: "Aprende" },
    { to: "/quiz", label: "Quiz" },
    { to: "/tutoriales", label: "Tutoriales" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = path === l.to || (l.to !== "/dashboard" && path.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-full bg-pastel-yellow hover:scale-105 transition-transform flex items-center justify-center">
            <Bell className="w-4 h-4 text-[oklch(0.4_0.1_80)]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-bio-red animate-pulse-glow" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-blue flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold">María González</span>
              <span className="text-xs text-muted-foreground">Estudiante</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      <Disclaimer />
    </div>
  );
}

export function Disclaimer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 pb-10 pt-4">
      <div className="rounded-2xl border border-pastel-yellow bg-pastel-yellow/40 px-4 py-3 text-xs text-center text-[oklch(0.4_0.08_80)]">
        ⚠ BioLearn es una herramienta educativa. Los resultados no constituyen un diagnóstico médico.
      </div>
    </footer>
  );
}
