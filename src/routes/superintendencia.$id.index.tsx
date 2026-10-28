import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, BarChart3, Bot, ClipboardList } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getSuperintendencia } from "@/config/integrations";

export const Route = createFileRoute("/superintendencia/$id/")({
  head: () => ({
    meta: [
      { title: "Área da Superintendência — B3" },
      {
        name: "description",
        content: "Agentes de IA e dashboards da superintendência selecionada.",
      },
      { property: "og:title", content: "Área da Superintendência — B3" },
      {
        property: "og:description",
        content: "Agentes de IA e dashboards da superintendência selecionada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ params }) => {
    const sup = getSuperintendencia(params.id);
    if (!sup) throw notFound();
    return { sup };
  },
  component: AreaSuperintendencia,
});

function AreaSuperintendencia() {
  const { sup } = Route.useLoaderData();

  const options = [
    {
      to: "/superintendencia/$id/agentes" as const,
      icon: Bot,
      title: "Agentes de IA",
      desc: "Habilidades de automação e análise assistida por inteligência artificial.",
    },
    {
      to: "/superintendencia/$id/dashboards" as const,
      icon: BarChart3,
      title: "Dashboards / Indicadores",
      desc: "Painéis de KPIs e visões analíticas da superintendência.",
    },
    ...(sup.id === "resiliencia" ? [{
      to: "/superintendencia/$id/atividades" as const,
      icon: ClipboardList,
      title: "Acompanhamento das Atividades",
      desc: "Lançamento de horas e acompanhamento das iniciativas da equipe.",
    }] : []),
  ];

  return (
    <AppShell>
      <section className="mx-auto max-w-5xl pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Voltar
        </Link>

        <h1 className="mt-8 font-display text-3xl font-extrabold leading-tight md:text-4xl">
          <span className="text-gold">{sup.nome}</span>
        </h1>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {options.map((opt) => (
            <Link
              key={opt.title}
              to={opt.to}
              params={{ id: sup.id }}
              className="glass-panel hover-lift group flex min-h-52 flex-col justify-between rounded-2xl p-7"
            >
              <opt.icon className="size-9 text-b3-cinza-azulado" strokeWidth={1.4} />
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">{opt.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{opt.desc}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-b3-cinza-azulado transition-colors group-hover:text-foreground">
                Abrir <ArrowUpRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
