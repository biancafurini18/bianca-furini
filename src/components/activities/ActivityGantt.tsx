import { useState } from "react";
import { ChartGantt, CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activityTimeline, type GanttScale } from "@/lib/activity-gantt";
import { statuses, type ActivityState, type Entry } from "@/lib/activity-tracking";

const statusColors: Record<string, string> = { "Em andamento": "bg-b3-turquesa", "Concluída": "bg-b3-verde", "Não iniciada": "bg-b3-cinza-azulado", "Suspensa": "bg-b3-amarelo" };
const dateLabel = (value: string) => format(parseISO(value), "dd/MM/yyyy");
export function ActivityGantt({ entries, state, today, onDetails }: { entries: Entry[]; state: ActivityState; today: string; onDetails: (entry: Entry) => void }) {
  const [scale, setScale] = useState<GanttScale>("week");
  const timeline = activityTimeline(entries, scale);
  const todayPosition = timeline && today ? timeline.position(today) : -1;
  return <section aria-label="Gantt das atividades" className="mt-10 border-t border-border pt-7">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><ChartGantt className="size-5 text-b3-turquesa" /><h2 className="font-display text-xl font-semibold">Gantt das atividades</h2></div><Tabs value={scale} onValueChange={value => setScale(value === "month" ? "month" : "week")}><TabsList className="rounded-md"><TabsTrigger value="week">Semanas</TabsTrigger><TabsTrigger value="month">Meses</TabsTrigger></TabsList></Tabs></div>
    <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">{statuses.map(status => <span key={status} className="inline-flex items-center gap-2"><span className={`size-2 rounded-sm ${statusColors[status]}`} />{status}</span>)}</div>
    {!timeline ? <div className="border-y border-border py-12 text-center text-sm text-muted-foreground"><CalendarDays className="mx-auto mb-3 size-7" />Nenhuma atividade para este período</div> : <div className="activity-table overflow-x-auto rounded-lg border border-border border-t-2 border-t-b3-turquesa bg-background text-foreground" tabIndex={0} aria-label="Cronograma de atividades">
      <div className="min-w-[960px]" style={{ width: Math.max(960, 300 + timeline.buckets.length * 112) }}>
        <div className="flex h-14 border-b-2 border-border bg-muted"><div className="sticky left-0 z-20 flex w-[300px] shrink-0 items-center border-r border-border bg-muted px-4 text-xs font-semibold">ATIVIDADE / RESPONSÁVEIS</div><div className="relative flex-1">{timeline.buckets.map((bucket, i) => <div key={bucket.key} className="absolute inset-y-0 flex items-center border-l border-border px-3 text-xs font-semibold capitalize text-muted-foreground" style={{ left: `${bucket.left}%`, width: `${(timeline.buckets[i + 1]?.left ?? 100) - bucket.left}%` }}>{bucket.label}</div>)}</div></div>
        {timeline.entries.map(({ entry, left, width, duration }, index) => {
          const name = state.activities.find(a => a.id === entry.activityId)?.name ?? "—";
          const responsible = entry.responsibleIds.map(id => state.people.find(p => p.id === id)?.name).filter(Boolean).join(" · ");
          return <div key={entry.id} className={`flex h-24 border-b border-border last:border-0 ${index % 2 ? "bg-muted/30" : "bg-background"}`}>
            <div className="sticky left-0 z-10 w-[300px] shrink-0 border-r border-border bg-background px-4 py-3"><p className="truncate text-sm font-semibold" title={name}>{name}</p><p className="mt-1 truncate text-xs text-muted-foreground" title={responsible}>{responsible}</p><p className="mt-1 text-[11px] text-muted-foreground">{dateLabel(entry.startDate)} → {dateLabel(entry.endDate)}</p></div>
            <div className="relative flex-1">{timeline.buckets.map(bucket => <div key={bucket.key} className="absolute inset-y-0 border-l border-border/40" style={{ left: `${bucket.left}%` }} />)}
              {todayPosition >= 0 && todayPosition <= 100 && <div className="pointer-events-none absolute inset-y-0 z-10 border-l-2 border-dashed border-b3-coral" style={{ left: `${todayPosition}%` }} title="Hoje" />}
              <Button variant="ghost" type="button" aria-label={`Detalhes de ${name}, ${dateLabel(entry.startDate)} a ${dateLabel(entry.endDate)}`} title={`${name} · ${entry.status}\n${dateLabel(entry.startDate)} a ${dateLabel(entry.endDate)} · ${duration} ${duration === 1 ? "dia" : "dias"}`} onClick={() => onDetails(entry)} className={`absolute top-7 h-7 min-w-1 justify-start overflow-hidden rounded-sm p-0 hover:opacity-80 ${statusColors[entry.status] ?? "bg-b3-turquesa"}`} style={{ left: `${left}%`, width: `${width}%` }}><span className="mx-1 h-4 border-l-2 border-background/40" /></Button>
              <span className="pointer-events-none absolute top-16 whitespace-nowrap text-[10px] font-medium text-muted-foreground" style={{ left: `${left}%` }}>{duration} {duration === 1 ? "dia" : "dias"}</span>
            </div>
          </div>;
        })}
      </div>
    </div>}
    {timeline && <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>{format(timeline.start, "dd/MM/yyyy")} → {format(timeline.end, "dd/MM/yyyy")}</span>{todayPosition >= 0 && todayPosition <= 100 && <span className="text-b3-coral">Hoje · {dateLabel(today)}</span>}</div>}
  </section>;
}