import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { CorDestaque, Superintendencia } from "@/config/integrations";

/**
 * Mapa de cores de destaque por superintendência.
 * Classes literais para que o Tailwind as detecte em tempo de build.
 */
const estilosCor: Record<
  CorDestaque,
  { accent: string; label: string; link: string; bar: string; glow: string }
> = {
  turquesa: {
    accent: "text-b3-turquesa",
    label: "text-b3-turquesa/80",
    link: "text-b3-turquesa",
    bar: "bg-b3-turquesa",
    glow: "group-hover:border-b3-turquesa/60",
  },
  amarelo: {
    accent: "text-b3-amarelo",
    label: "text-b3-amarelo/80",
    link: "text-b3-amarelo",
    bar: "bg-b3-amarelo",
    glow: "group-hover:border-b3-amarelo/60",
  },
  verde: {
    accent: "text-b3-verde",
    label: "text-b3-verde/80",
    link: "text-b3-verde",
    bar: "bg-b3-verde",
    glow: "group-hover:border-b3-verde/60",
  },
  coral: {
    accent: "text-b3-coral",
    label: "text-b3-coral/80",
    link: "text-b3-coral",
    bar: "bg-b3-coral",
    glow: "group-hover:border-b3-coral/60",
  },
};

export function SuperintendenciaCard({ superintendencia }: { superintendencia: Superintendencia }) {
  const cor = estilosCor[superintendencia.cor];

  return (
    <Link
      to="/superintendencia/$id"
      params={{ id: superintendencia.id }}
      className={`glass-panel hover-lift group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl p-6 ${cor.glow}`}
    >
      {/* Barra de destaque superior na cor da superintendência */}
      <span
        className={`absolute inset-x-0 top-0 h-1 ${cor.bar}`}
        aria-hidden="true"
      />
      <span
        className={`text-[0.65rem] font-semibold uppercase tracking-[0.28em] ${cor.label}`}
      >
        Superintendência
      </span>
      <h2 className="mt-4 font-display text-xl font-bold leading-snug text-foreground">
        {superintendencia.nomeCurto}
      </h2>
      <div
        className={`mt-6 flex items-center gap-2 text-sm font-semibold ${cor.link} transition-colors group-hover:text-foreground`}
      >
        Acessar área
        <ArrowUpRight className="size-4" />
      </div>
    </Link>
  );
}
