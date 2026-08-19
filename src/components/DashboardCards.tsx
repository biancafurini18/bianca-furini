import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Layers,
  LineChart,
  PieChart,
  PlugZap,
  Shield,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { ChartDefinition, KpiDefinition } from "@/config/integrations";
import { isConfigured } from "@/config/integrations";

const kpiIcons: Record<KpiDefinition["icon"], LucideIcon> = {
  activity: Activity,
  shield: Shield,
  alert: AlertTriangle,
  clock: Clock,
  target: Target,
  layers: Layers,
};

const chartIcons: Record<ChartDefinition["tipo"], LucideIcon> = {
  linha: LineChart,
  barra: BarChart3,
  pizza: PieChart,
};

export function KpiCard({ kpi }: { kpi: KpiDefinition }) {
  const Icon = kpiIcons[kpi.icon];
  // TODO: inserir aqui a query/endpoint do Databricks (SQL Warehouse, Genie ou API REST)
  // const { data } = useQuery({ queryKey: [kpi.id], queryFn: () => callApi(kpi.endpoint), enabled: isConfigured(kpi) });
  const configured = isConfigured(kpi);

  return (
    <article className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold text-b3-cinza-azulado">{kpi.label}</span>
        <Icon className="size-5 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="mt-6 flex items-end gap-3">
        <span className="font-display text-3xl font-bold text-muted-foreground/40">—</span>
        <span className="pb-1 text-xs text-muted-foreground/70">variação —</span>
      </div>
      {!configured && (
        <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground/70">
          <PlugZap className="size-3.5" strokeWidth={1.5} />
          Conecte a fonte de dados
        </div>
      )}
    </article>
  );
}

export function ChartPlaceholder({ chart }: { chart: ChartDefinition }) {
  const Icon = chartIcons[chart.tipo];
  // TODO: inserir aqui a query/endpoint do Databricks (SQL Warehouse, Genie ou API REST)
  // const { data } = useQuery({ queryKey: [chart.id], queryFn: () => callApi(chart.endpoint), enabled: isConfigured(chart) });

  return (
    <article className="glass-panel flex min-h-64 flex-col rounded-2xl p-5">
      <header className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-foreground">{chart.label}</h3>
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/70">
          {chart.tipo}
        </span>
      </header>
      <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 text-center">
        <Icon className="size-8 text-muted-foreground/40" strokeWidth={1.25} />
        <span className="text-xs text-muted-foreground/70">Conecte a fonte de dados</span>
      </div>
    </article>
  );
}
