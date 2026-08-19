import { Construction } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Tela genérica reutilizável — mesma estrutura das telas da Resiliência,
 * porém vazia, pronta para receber conteúdo.
 */
export function EmConfiguracao({
  acao = "Utilizar agente",
}: {
  acao?: string;
}) {
  return (
    <div className="glass-panel flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl p-10 text-center">
      <Construction className="size-9 text-muted-foreground/50" strokeWidth={1.3} />
      <h2 className="font-display text-2xl font-bold text-foreground">Conteúdo em configuração</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Esta área está estruturada e aguardando a conexão com os serviços de dados e agentes.
      </p>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* TODO: inserir endpoint no Databricks (src/config/integrations.ts) */}
            <span className="mt-2 inline-flex cursor-not-allowed select-none items-center justify-center rounded-md border border-border bg-muted px-5 py-2.5 text-sm font-semibold text-muted-foreground/70">
              {acao}
            </span>
          </TooltipTrigger>
          <TooltipContent>Integração ainda não configurada</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
