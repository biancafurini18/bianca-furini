import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmConfiguracao } from "@/components/EmConfiguracao";
import { getSuperintendencia } from "@/config/integrations";

export const Route = createFileRoute("/superintendencia/$id/dashboards")({
  head: () => ({
    meta: [
      { title: "Dashboards e Indicadores — B3" },
      {
        name: "description",
        content:
          "Painéis de KPIs e indicadores da Diretoria de Integridade, Risco e Resiliência da B3.",
      },
      { property: "og:title", content: "Dashboards e Indicadores — B3" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "KPIs e visões analíticas por superintendência, conectados ao Databricks.",
      },
    ],
  }),
  loader: ({ params }) => {
    const sup = getSuperintendencia(params.id);
    if (!sup) throw notFound();
    return { sup };
  },
  component: DashboardsPage,
});

function DashboardsPage() {
  const { sup } = Route.useLoaderData();

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl pt-6">
        <Link
          to="/superintendencia/$id"
          params={{ id: sup.id }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Voltar
        </Link>

        <div className="mt-10">
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">
            <span className="text-gold">Dashboards / Indicadores</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{sup.nome}</p>
          <div className="mt-8">
            <EmConfiguracao acao="Conectar fonte de dados" />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
