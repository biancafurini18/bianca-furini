import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AgenteCard } from "@/components/AgenteCard";
import { EmConfiguracao } from "@/components/EmConfiguracao";
import resiliaImg from "@/assets/resilia.png";
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

const orbitIcons = [ShieldCheck, Lock, Cloud, Wifi, Settings];

function ResiliaAvatar() {
  return (
    <div className="relative mx-auto flex size-72 items-center justify-center md:size-80">
      <div
        aria-hidden
        className="absolute inset-6 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, color-mix(in oklab, var(--b3-azul) 45%, transparent), transparent 70%)",
        }}
      />
      <div className="absolute inset-4 rounded-full border border-b3-azul/40" />
      <div className="absolute inset-0 rounded-full border border-dashed border-b3-cinza-azulado/20" />
      <div className="glass-panel flex size-40 items-center justify-center overflow-hidden rounded-full md:size-44">
        <svg viewBox="0 0 100 100" className="size-28 text-b3-cinza-azulado" aria-hidden>
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="28" y="30" width="44" height="38" rx="12" />
            <circle cx="41" cy="47" r="4" stroke="var(--b3-turquesa)" />
            <circle cx="59" cy="47" r="4" stroke="var(--b3-turquesa)" />
            <path d="M42 59h16" />
            <path d="M50 30V20" />
            <circle cx="50" cy="16" r="4" stroke="var(--b3-dourado)" />
            <path d="M28 44h-7M79 44h-7" />
            <path d="M38 68v9M62 68v9" />
          </g>
        </svg>
      </div>
      {orbitIcons.map((Icon, i) => {
        const angle = (i / orbitIcons.length) * 2 * Math.PI - Math.PI / 2;
        const r = 46;
        return (
          <span
            key={i}
            className="glass-panel absolute flex size-12 items-center justify-center rounded-xl"
            style={{
              left: `calc(50% + ${Math.cos(angle) * r}% - 1.5rem)`,
              top: `calc(50% + ${Math.sin(angle) * r}% - 1.5rem)`,
              boxShadow: "0 0 24px -10px var(--b3-azul)",
            }}
          >
            <Icon className="size-5 text-b3-cinza-azulado" strokeWidth={1.4} />
          </span>
        );
      })}
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
                Agentes de IA <span className="text-muted-foreground">(Habilidades da Resilia)</span>
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
