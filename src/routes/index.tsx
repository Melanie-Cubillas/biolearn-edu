import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/layout";
import { DnaHelix, MoleculePattern } from "@/components/dna-visuals";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BioLearn — Transformando secuencias en conocimiento" },
      { name: "description", content: "Plataforma educativa de bioinformática para estudiantes universitarios." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("maria.gonzalez@uni.edu");
  const [pwd, setPwd] = useState("biolearn2026");

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* LEFT */}
      <div className="flex items-center justify-center px-6 py-12 lg:py-0 relative">
        <div className="w-full max-w-md">
          <Logo className="mb-12" />
          <div className="space-y-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pastel-green text-[oklch(0.4_0.1_150)]">
              <Sparkles className="w-3 h-3" /> Plataforma educativa
            </span>
            <h2 className="text-3xl font-bold tracking-tight">Iniciar sesión</h2>
            <p className="text-muted-foreground text-sm">Ingresa con tu correo institucional para continuar tu aprendizaje.</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
            className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4"
          >
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Correo institucional</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-pastel-blue/40 border border-transparent focus:bg-card focus:border-primary outline-none transition-all text-sm"
                  placeholder="usuario@universidad.edu"
                />
              </div>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contraseña</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password" value={pwd} onChange={(e) => setPwd(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-pastel-blue/40 border border-transparent focus:bg-card focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </label>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded" defaultChecked /> Recordarme
              </label>
              <a className="font-semibold text-primary hover:underline cursor-pointer">¿Olvidaste tu contraseña?</a>
            </div>
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 hover:gap-3 transition-all shadow-soft"
            >
              Ingresar <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-center text-xs text-muted-foreground">
              ¿Sin cuenta? <span className="text-primary font-semibold cursor-pointer hover:underline">Solicita acceso institucional</span>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative hidden lg:flex items-center justify-center bg-gradient-hero overflow-hidden">
        <MoleculePattern className="absolute inset-0 w-full h-full" />
        <div className="absolute top-20 right-16 animate-float">
          <div className="w-24 h-24 rounded-3xl bg-pastel-purple/80 backdrop-blur flex items-center justify-center shadow-soft">
            <span className="font-mono-bio text-2xl font-bold text-bio-purple">CAG</span>
          </div>
        </div>
        <div className="absolute bottom-32 left-12 animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="w-20 h-20 rounded-2xl bg-pastel-green/80 backdrop-blur flex items-center justify-center shadow-soft">
            <span className="font-mono-bio text-xl font-bold text-bio-green">DNA</span>
          </div>
        </div>
        <div className="absolute top-32 left-20 animate-float" style={{ animationDelay: "0.8s" }}>
          <div className="px-4 py-2 rounded-full bg-pastel-yellow/80 backdrop-blur shadow-soft text-xs font-bold">
            HBB · HTT · CFTR
          </div>
        </div>

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="mx-auto w-56 h-80 mb-6">
            <DnaHelix className="w-full h-full animate-spin-slow" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-[oklch(0.4_0.18_255)] to-[oklch(0.4_0.2_290)] bg-clip-text text-transparent">
            Bienvenido a BioLearn
          </h1>
          <p className="text-lg text-muted-foreground">
            Transformando secuencias en conocimiento
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[{ n: "120+", l: "Lecciones" }, { n: "3", l: "Enfermedades" }, { n: "NCBI", l: "Integrado" }].map((s) => (
              <div key={s.l} className="rounded-2xl bg-card/70 backdrop-blur p-3 shadow-soft">
                <div className="font-bold text-lg text-primary">{s.n}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
          <Link to="/dashboard" className="text-xs text-muted-foreground mt-6 inline-block hover:text-primary">
            Demo · entrar sin credenciales →
          </Link>
        </div>
      </div>
    </div>
  );
}
