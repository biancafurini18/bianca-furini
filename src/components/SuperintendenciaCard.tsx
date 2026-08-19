import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Superintendencia } from "@/config/integrations";

export function SuperintendenciaCard({ superintendencia }: { superintendencia: Superintendencia }) {
  return (
    <Link
      to="/superintendencia/$id"
      params={{ id: superintendencia.id }}
      className="glass-panel hover-lift group flex min-h-44 flex-col justify-between rounded-2xl p-6"
    >
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-b3-cinza-azulado/70">
        Superintendência
      </span>
      <h2 className="mt-4 font-display text-xl font-bold leading-snug text-foreground">
        {superintendencia.nomeCurto}
      </h2>
      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-b3-cinza-azulado transition-colors group-hover:text-foreground">
        Acessar área
        <ArrowUpRight className="size-4" />
      </div>
    </Link>
  );
}
