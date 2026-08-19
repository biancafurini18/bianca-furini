import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function B3Logo() {
  return (
    <Link
      to="/"
      aria-label="B3 — página inicial"
      className="flex items-baseline gap-0.5 font-display text-2xl font-extrabold tracking-tight"
    >
      <span className="rounded-md border border-b3-cinza-azulado/40 px-1.5 text-foreground">
        B
      </span>
      <span className="text-b3-dourado">3</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background bg-circuit">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Integridade · Risco · Resiliência
        </span>
        <B3Logo />
      </header>

      <main className="relative z-10 flex-1 px-6 pb-24 md:px-12">{children}</main>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border/70 bg-background/80 py-2 text-center backdrop-blur">
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.4em] text-muted-foreground">
          Informação Interna
        </span>
      </footer>
    </div>
  );
}
