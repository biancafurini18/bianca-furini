import { cn } from "@/lib/utils";
const colors: Record<string, string> = {
  "Em andamento": "bg-b3-turquesa/15 text-b3-turquesa ring-1 ring-b3-turquesa/40",
  "Concluída": "bg-b3-verde/15 text-b3-verde ring-1 ring-b3-verde/40",
  "Não iniciada": "bg-b3-cinza-azulado/12 text-b3-cinza-azulado ring-1 ring-b3-cinza-azulado/35",
  "Suspensa": "bg-b3-amarelo/15 text-b3-amarelo ring-1 ring-b3-amarelo/40",
};
export function ActivityStatus({ status }: { status: string }) {
  return <span className={cn("inline-flex items-center gap-2 whitespace-nowrap rounded px-2 py-1 text-xs font-semibold", colors[status])}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}