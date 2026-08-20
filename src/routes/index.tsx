import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SuperintendenciaCard } from "@/components/SuperintendenciaCard";
import { superintendencias } from "@/config/integrations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Integridade, Risco e Resiliência — B3" },
      {
        name: "description",
        content:
          "Portal interno da Diretoria de Integridade, Risco e Resiliência da B3: agentes de IA e indicadores por superintendência.",
      },
      { property: "og:title", content: "Integridade, Risco e Resiliência — B3" },
      {
        property: "og:description",
        content: "Agentes de IA e indicadores das superintendências de risco e resiliência.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl pt-10 text-center md:pt-20">
        <p className="inline-flex items-center gap-3 rounded-full border border-b3-dourado/40 bg-b3-azul/10 px-6 py-2 font-display text-sm font-extrabold uppercase tracking-[0.42em] text-b3-dourado md:text-base">
          Diretoria
        </p>

        <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
          <span className="text-gold">Integridade, Risco e Resiliência</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">
          Selecione uma superintendência para acessar seus agentes de inteligência artificial e
          painéis de indicadores.
        </p>

        <div className="mt-14 grid gap-5 text-left md:grid-cols-2">
          {superintendencias.map((s) => (
            <SuperintendenciaCard key={s.id} superintendencia={s} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
