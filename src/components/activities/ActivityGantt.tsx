import { useState } from "react";
import { ChartGantt, CalendarDays, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activityTimeline, type GanttScale } from "@/lib/activity-gantt";
import { statuses, type ActivityState, type Entry } from "@/lib/activity-tracking";

const statusColors: Record<string, string> = { "Em andamento": "bg-b3-turquesa hover:bg-b3-turquesa", "Concluída": "bg-b3-verde hover:bg-b3-verde", "Não iniciada": "bg-b3-cinza-azulado hover:bg-b3-cinza-azulado", "Suspensa": "bg-b3-amarelo hover:bg-b3-amarelo" };
export function ActivityGantt({ entries, state, today, onDetails }: { entries: Entry[]; state: ActivityState; today: string; onDetails: (entry: Entry) => void }) {
  const [scale, setScale] = useState<GanttScale>("week");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const timeline = activityTimeline(entries, scale);
  const todayPosition = timeline && today ? timeline.position(today) : -1;
  function toggle(themeId: string) {
    setExpanded(previous => { const next = new Set(previous); if (next.has(themeId)) next.delete(themeId); else next.add(themeId); return next; });
  }
  const grid = () => <>{timeline?.buckets.map(bucket => <div key={bucket.key} className="absolute inset-y-0 border-l border-border/40" style={{ left: `${bucket.left}%` }} />)}{todayPosition >= 0 && todayPosition <= 100 && <div className="pointer-events-none absolute inset-y-0 z-10 border-l-2 border-dashed border-b3-coral" style={{ left: `${todayPosition}%` }} title="Hoje" />}</>;
  return <section aria-label="Gantt dos macrotemas" className="mt-8 border-t border-border pt-5">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><ChartGantt className="size-4 text-b3-turquesa" /><h2 className="font-display text-lg font-semibold">Gantt dos macrotemas</h2></div><Tabs value={scale} onValueChange={value => setScale(value === "month" ? "month" : "week")}><TabsList className="h-8 rounded-md"><TabsTrigger value="week" className="px-3 text-xs">Semanas</TabsTrigger><TabsTrigger value="month" className="px-3 text-xs">Meses</TabsTrigger></TabsList></Tabs></div>
    <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">{statuses.map(status => <span key={status} className="inline-flex items-center gap-1.5"><span className={`size-2 rounded-sm ${statusColors[status]}`} />{status}</span>)}</div>
    {!timeline ? <div className="border-y border-border py-8 text-center text-sm text-muted-foreground"><CalendarDays className="mx-auto mb-2 size-6" />Nenhuma atividade para este período</div> : <div className="activity-table overflow-x-auto rounded-lg border border-border border-t-2 border-t-b3-turquesa bg-background text-foreground" tabIndex={0} aria-label="Cronograma de macrotemas">
      <div className="w-full" style={{ minWidth: Math.max(860, 260 + timeline.buckets.length * 96) }}>
        <div className="flex h-9 border-b-2 border-border bg-muted"><div className="sticky left-0 z-20 flex w-[260px] shrink-0 items-center border-r border-border bg-muted px-3 text-[10px] font-semibold uppercase">Macrotema / Atividade</div><div className="relative flex-1">{timeline.buckets.map((bucket, i) => <div key={bucket.key} className="absolute inset-y-0 flex items-center border-l border-border px-2 text-[11px] font-semibold capitalize text-muted-foreground" style={{ left: `${bucket.left}%`, width: `${(timeline.buckets[i + 1]?.left ?? 100) - bucket.left}%` }}>{bucket.label}</div>)}</div></div>
        {timeline.groups.map(group => {
          const name = state.themes.find(theme => theme.id === group.themeId)?.name ?? "—";
          const open = expanded.has(group.themeId);
          return <div key={group.themeId}>
            <div className="flex h-10 border-b border-border bg-muted/30">
              <div className="sticky left-0 z-10 flex w-[260px] shrink-0 items-center border-r border-border bg-muted px-2"><Button variant="ghost" className="h-8 w-full min-w-0 justify-start gap-2 px-1 text-xs" aria-label={`${open ? "Recolher" : "Expandir"} ${name}`} aria-expanded={open} aria-controls={`gantt-${group.themeId}`} onClick={() => toggle(group.themeId)}>{open ? <ChevronDown className="size-3.5 shrink-0" /> : <ChevronRight className="size-3.5 shrink-0" />}<span className="min-w-0 flex-1 truncate text-left" title={`${name} · ${group.itemCount} itens`}>{name}</span><span className="shrink-0 text-[10px] font-medium tabular-nums text-muted-foreground">{group.itemCount} {group.itemCount === 1 ? "item" : "itens"} | {group.duration} {group.duration === 1 ? "dia" : "dias"}</span></Button></div>
              <div className="relative flex-1">{grid()}<Button variant="ghost" aria-label={`${open ? "Recolher" : "Expandir"} cronograma de ${name}`} aria-expanded={open} title={`${name} · ${group.itemCount} itens | ${group.duration} dias · ${group.statusSegments.map(segment => `${segment.status}: ${segment.count}`).join(" · ")}`} onClick={() => toggle(group.themeId)} className={`activity-gantt-summary absolute top-3 flex h-4 min-w-1 gap-0 overflow-hidden rounded-sm p-0 ${statusColors[group.status] ?? "bg-b3-turquesa"}`} style={{ left: `${group.left}%`, width: `${group.width}%` }}><span className="mx-1 h-2.5 self-center border-l-2 border-background/40" /></Button></div>
            </div>
            <div id={`gantt-${group.themeId}`} hidden={!open}>{open && group.children.map(({ entry, left, width, duration }) => {
              const activity = state.activities.find(a => a.id === entry.activityId)?.name ?? "—";
              const responsible = entry.responsibleIds.map(id => state.people.find(p => p.id === id)?.name).filter(Boolean).join(" · ");
              return <div key={entry.id} className="flex h-12 border-b border-border bg-background">
                <div className="sticky left-0 z-10 w-[260px] shrink-0 border-r border-border bg-background pl-7 pr-2"><Button variant="ghost" className="h-full w-full min-w-0 justify-start gap-2 px-1 text-left" aria-label={`Detalhes de ${activity}`} onClick={() => onDetails(entry)}><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-medium" title={activity}>{activity}</span><span className="block truncate text-[10px] text-muted-foreground" title={responsible}>{responsible}</span></span><span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{duration} {duration === 1 ? "dia" : "dias"}</span></Button></div>
                <div className="relative flex-1">{grid()}<Button variant="ghost" type="button" aria-label={`Abrir atividade ${activity}`} title={`${activity} · ${entry.status} · ${duration} dias`} onClick={() => onDetails(entry)} className={`absolute top-4 h-4 min-w-1 justify-start overflow-hidden rounded-sm p-0 hover:opacity-80 ${statusColors[entry.status] ?? "bg-b3-turquesa"}`} style={{ left: `${left}%`, width: `${width}%` }}><span className="mx-1 h-2.5 border-l-2 border-background/40" /></Button></div>
              </div>;
            })}</div>
          </div>;
        })}
      </div>
    </div>}
  </section>;
}
