import {
  BookOpen,
  CheckCircle2,
  Lock,
  Scale,
  Share2,
  Siren,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  isConfigured,
  type AgenteResilia,
  type AgentColor,
} from "@/config/integrations";

const icons: Record<AgenteResilia["icon"], LucideIcon> = {
  lock: Lock,
  scale: Scale,
  share: Share2,
  book: BookOpen,
  siren: Siren,
  check: CheckCircle2,
};

const colorVar: Record<AgentColor, string> = {
  coral: "var(--b3-coral)",
  amarelo: "var(--b3-amarelo)",
  ocre: "var(--b3-ocre)",
  verde: "var(--b3-verde)",
  turquesa: "var(--b3-turquesa)",
  verdeAgua: "var(--b3-turquesa)",
};

export function AgenteCard({ agente }: { agente: AgenteResilia }) {
  const Icon = icons[agente.icon];
  const accent = colorVar[agente.color];

  const handleUse = async () => {
    // TODO: inserir endpoint do agente no Databricks (config: src/config/integrations.ts)
    if (!isConfigured(agente)) {
      toast("Integração ainda não configurada");
      return;
    }
    // Chamada real (mesma origem, caminho relativo /api/...):
    // const data = await callApi(agente.endpoint, { method: "POST", body: JSON.stringify({}) });
    // Renderizar aqui apenas dados retornados pelo backend — nunca conteúdo gerado no frontend.
    toast("Integração ainda não configurada");
  };

  return (
    <article className="glass-panel hover-lift flex flex-col rounded-2xl p-6">
      <span
        className="flex size-12 items-center justify-center rounded-xl border"
        style={{
          borderColor: `color-mix(in oklab, ${accent} 45%, transparent)`,
          backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
          boxShadow: `0 0 22px -8px ${accent}`,
        }}
      >
        <Icon className="size-6" strokeWidth={1.5} style={{ color: accent }} />
      </span>

      <h3 className="mt-5 font-display text-lg font-bold text-foreground">{agente.label}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {agente.descricao}
      </p>

      <Button
        onClick={handleUse}
        className="mt-6 w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Utilizar agente
      </Button>
    </article>
  );
}
