import { cn } from "@/lib/utils";
const colors: Record<string, string> = {
  "Em andamento": "bg-b3-turquesa/10 text-b3-turquesa",
  "Concluída": "bg-b3-verde/10 text-b3-verde",
  "Não iniciada": "bg-b3-cinza-azulado/10 text-b3-cinza-azulado",
  "Suspensa": "bg-b3-amarelo/10 text-b3-amarelo",
};
export function ActivityStatus({ status }: { status: string }) {
  return <span className={cn("inline-flex items-center gap-2 whitespace-nowrap rounded px-2 py-1 text-xs font-semibold", colors[status])}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}