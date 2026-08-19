import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AgenteCard } from "@/components/AgenteCard";
import { EmConfiguracao } from "@/components/EmConfiguracao";
import resiliaAsset from "@/assets/resilia.jpeg.asset.json";
import { agentesResilia, getSuperintendencia } from "@/config/integrations";


export const Route = createFileRoute("/superintendencia/$id/agentes")({
  head: () => ({
    meta: [
      { title: "Agentes de IA — Diretoria de Integridade, Risco e Resiliência" },
      {
        name: "description",
        content:
          "Resilia: agente de inteligência artificial e automação da Superintendência de Resiliência Corporativa e Controles Integrados.",
      },
      { property: "og:title", content: "Agentes de IA — Resilia | B3" },
      {
        property: "og:description",
        content: "Habilidades de IA e automação para controles, riscos e conformidade.",
      },
    ],
  }),
  loader: ({ params }) => {
    const sup = getSuperintendencia(params.id);
    if (!sup) throw notFound();
    return { sup };
  },
  component: AgentesPage,
});

function ResiliaAvatar() {
  return (
    <div className="relative mx-auto flex size-72 items-center justify-center md:size-96">
      <div
        aria-hidden
        className="absolute inset-2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--b3-azul) 55%, transparent), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 rounded-full border border-dashed border-b3-cinza-azulado/20" />
      <img
        src={resiliaAsset.url}
        alt="Resilia — agente de inteligência artificial da Superintendência de Resiliência Corporativa e Controles Integrados"
        className="relative size-full rounded-full object-cover"
        style={{ boxShadow: "0 0 60px -18px var(--b3-azul)" }}
      />
    </div>
  );
}


const objetivos = [
  ["Simplificar", " e automatizar processos."],
  ["Reduzir", " horas de atividades operacionais."],
  ["Diminuir", " disfunções entre áreas."],
  ["Expandir", " o uso estruturado de dados e IA."],
];

function AgentesPage() {
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

        {!sup.detalhado ? (
          <div className="mt-10">
            <h1 className="font-display text-3xl font-extrabold">
              <span className="text-gold">Agentes de IA</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{sup.nome}</p>
            <div className="mt-8">
              <EmConfiguracao />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 grid items-center gap-12 md:grid-cols-2">
              <div>
                <h1 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
                  <span className="text-gold">Conheça a Resilia</span>
                </h1>
                <p className="mt-4 max-w-lg text-base text-foreground/90">
                  Agente de inteligência artificial e automação da Superintendência de Resiliência
                  Corporativa e Controles Integrados
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-b3-cinza-azulado/80">
                  ResilIA (Resiliência + IA)
                </p>

                <ul className="mt-8 space-y-3">
                  {objetivos.map(([bold, rest]) => (
                    <li key={bold} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-b3-turquesa" />
                      <span>
                        <strong className="font-bold text-foreground">{bold}</strong>
                        {rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <ResiliaAvatar />
            </div>

            <div className="mt-20">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Conheça as habilidades da Resilia
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {agentesResilia.map((agente) => (
                  <AgenteCard key={agente.id} agente={agente} />
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
