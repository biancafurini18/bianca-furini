import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ActivityWorkspace } from "@/components/activities/ActivityWorkspace";
import { getSuperintendencia } from "@/config/integrations";

export const Route = createFileRoute("/superintendencia/$id/atividades")({
  head: () => ({ meta: [
    { title: "Acompanhamento das Atividades — Resiliência | B3" },
    { name: "description", content: "Lançamento de horas e acompanhamento executivo das iniciativas de Resiliência Corporativa e Controles Integrados da B3." },
    { property: "og:title", content: "Acompanhamento das Atividades — Resiliência | B3" },
    { property: "og:description", content: "Lançamentos de atividades, esforço em horas e visão da equipe de Resiliência da B3." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  loader: ({ params }) => { const sup = getSuperintendencia(params.id); if (!sup || sup.id !== "resiliencia") throw notFound(); return { sup }; },
  component: ActivitiesPage,
});
function ActivitiesPage() {
  const { sup } = Route.useLoaderData();
  return <AppShell><section className="mx-auto max-w-7xl pt-6">
    <Link to="/superintendencia/$id" params={{ id: sup.id }} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Voltar</Link>
    <p className="mt-8 text-xs font-semibold uppercase text-b3-turquesa">Resiliência Corporativa e Controles Integrados</p>
    <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-b3-dourado md:text-4xl">Acompanhamento das Atividades</h1>
    <ActivityWorkspace />
  </section></AppShell>;
}