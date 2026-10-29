import { useRef, useState, useEffect } from "react";
import { Clock3, ListChecks, CircleAlert, CheckCircle2, Plus, Search, Pencil, Users, ClipboardList, BarChart3, Construction, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import demo from "@/data/activity-demo.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { ActivitySelect } from "./ActivitySelect";
import { ActivityStatus } from "./ActivityStatus";
import { ActivityForm } from "./ActivityForm";
import { ActivityGantt } from "./ActivityGantt";
import { applyMutation, macrothemeEntries, employeeEntries, managerEntries, normalizeName, totals, isOverdue, DemoMutationQueue, formatHours, type ActivityState, type Entry, type Mutation } from "@/lib/activity-tracking";

const number = (value: number) => value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
const date = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
export function ActivityWorkspace() {
  const [state, setState] = useState<ActivityState>(() => structuredClone(demo));
  const currentState = useRef(state); const queue = useRef(new DemoMutationQueue());
  const [employeeId, setEmployeeId] = useState(demo.currentEmployeeId);
  const [managerId, setManagerId] = useState(demo.currentManagerId);
  const [view, setView] = useState("entry"); const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); const [personFilter, setPersonFilter] = useState("all");
  const [frontFilter, setFrontFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [form, setForm] = useState<{ entry: Entry | null } | null>(null);
  const [history, setHistory] = useState<Entry | null>(null);
  const [today, setToday] = useState("");
  useEffect(() => { const now = new Date(); setToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`); }, []);
  const personName = (id: string) => state.people.find(p => p.id === id)?.name ?? "—";
  const employee = state.people.find(p => p.id === employeeId);
  const team = state.people.filter(p => p.managerId === managerId);
  const scoped = view === "manager" ? managerEntries(state, managerId) : employeeEntries(state.entries, employeeId);
  const rows = macrothemeEntries(scoped, themeFilter).filter(e => {
    const activity = state.activities.find(a => a.id === e.activityId)?.name ?? "";
    const theme = state.themes.find(t => t.id === e.themeId)?.name ?? "";
    return (statusFilter === "all" || e.status === statusFilter) && (frontFilter === "all" || e.frontId === frontFilter) && (view !== "manager" || personFilter === "all" || e.responsibleIds.includes(personFilter)) && normalizeName(`${activity} ${theme} ${e.description} ${e.responsibleIds.map(personName).join(" ")}`).includes(normalizeName(search));
  });
  const summary = totals(rows, today);
  async function save(mutation: Mutation) {
    await queue.current.enqueue(() => {
      const next = applyMutation(currentState.current, mutation);
      currentState.current = next; setState(next);
    }); toast.success("Lançamento salvo.");
  }
  const metrics = [
    { label: "Esforço em horas", value: `${formatHours(summary.hours)} h`, icon: Clock3, color: "text-b3-turquesa" },
    { label: "Iniciativas", value: number(summary.count), icon: ListChecks, color: "text-b3-cinza-azulado" },
    { label: "Em andamento", value: number(summary.active), icon: CheckCircle2, color: "text-b3-verde" },
    { label: "Prazo vencido", value: number(summary.overdue), icon: CircleAlert, color: "text-b3-coral" },
  ];
  const logs = state.audit.filter(log => log.entryId === history?.id).slice().reverse();
  return <>
    <Tabs value={view} onValueChange={v => { setView(v); setSearch(""); setStatusFilter("all"); setFrontFilter("all"); setThemeFilter("all"); setPersonFilter("all"); }} className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <TabsList className="h-11 max-w-full rounded-md bg-muted/50">
          <TabsTrigger value="entry" className="gap-1 px-2 py-2 text-xs sm:gap-2 sm:px-5 sm:text-sm"><ClipboardList className="size-4" />Lançamento</TabsTrigger>
          <TabsTrigger value="manager" className="gap-1 px-2 py-2 text-xs sm:gap-2 sm:px-5 sm:text-sm"><Users className="size-4" />Gestor</TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-1 px-2 py-2 text-xs sm:gap-2 sm:px-5 sm:text-sm"><BarChart3 className="size-4" />Dashboard</TabsTrigger>
        </TabsList>
        {view !== "dashboard" && <div className="w-full min-w-0 sm:w-72"><ActivitySelect label={view === "manager" ? "Gestor" : "Funcionário"} value={view === "manager" ? managerId : employeeId} options={state.people.filter(p => p.role === (view === "manager" ? "manager" : "employee"))} onChange={id => { if (view === "manager") { setManagerId(id); setPersonFilter("all"); } else setEmployeeId(id); }} /></div>}
      </div>
      {view !== "dashboard" && <>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div><h2 className="font-display text-xl font-semibold">{view === "manager" ? "Visão da equipe" : "Meus lançamentos"}</h2><p className="mt-1 text-sm text-muted-foreground">{view === "manager" ? `${personName(managerId)} · ${team.length} funcionários` : `${personName(employeeId)} · Gestor: ${personName(employee?.managerId ?? "")}`}</p></div>
          {view === "entry" && <Button onClick={() => setForm({ entry: null })} className="h-10"><Plus />Novo lançamento</Button>}
        </div>
        <div className="my-5 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-border py-4 lg:grid-cols-4">
          {metrics.map(metric => <div key={metric.label} className="min-w-0 border-l-2 border-border pl-3"><div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"><metric.icon className={`size-3.5 shrink-0 ${metric.color}`} />{metric.label}</div><div className={`mt-1 font-display text-2xl font-semibold ${metric.color}`}>{metric.value}</div></div>)}
        </div>
        <div aria-label="Filtros de atividades" className={`mb-4 grid grid-cols-2 items-end gap-3 border-b border-border pb-4 [&>div]:min-w-0 [&>div>button]:w-full ${view === "manager" ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}>
          <div className="col-span-2 xl:col-span-1"><label htmlFor="activity-search" className="mb-1.5 block text-[11px] font-medium text-muted-foreground">Busca</label><div className="relative"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input id="activity-search" aria-label="Buscar lançamentos" placeholder="Atividade ou macrotema" className="h-10 pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div></div>
          {view === "manager" && <div><span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">Funcionário</span><ActivitySelect label="Filtrar funcionário" value={personFilter} onChange={setPersonFilter} options={[{ id: "all", name: "Todos os funcionários" }, ...team]} /></div>}
          <div><span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">Frente</span><ActivitySelect label="Filtrar frente" value={frontFilter} onChange={id => { setFrontFilter(id); setThemeFilter("all"); }} options={[{ id: "all", name: "Todas as frentes" }, ...state.fronts]} /></div>
          <div><span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">Macrotema</span><ActivitySelect label="Filtrar macrotema" value={themeFilter} onChange={setThemeFilter} options={[{ id: "all", name: "Todos os macrotemas" }, ...state.themes.filter(t => frontFilter === "all" || t.frontId === frontFilter)]} /></div>
          <div><span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">Status</span><ActivitySelect label="Filtrar status" value={statusFilter} onChange={setStatusFilter} options={[{ id: "all", name: "Todos os status" }, ...["Não iniciada", "Em andamento", "Concluída", "Suspensa"].map(name => ({ id: name, name }))]} /></div>
        </div>
        <div className="activity-table overflow-x-auto rounded-lg border border-border border-t-2 border-t-b3-turquesa bg-background text-foreground">
          <table className="w-full min-w-[1180px] text-left text-[13px]">
            <thead className="border-b-2 border-border bg-muted text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{["Frente", "Macrotema", "Atividade", ...(view === "manager" ? ["Responsáveis"] : []), "Status", "Origem / Tipo", "Período · Início / Fim", "Prazo", "Horas", ...(view === "entry" ? ["Ações"] : [])].map((title, i) => <th key={i} className="px-3 py-2.5 font-semibold">{title}</th>)}</tr></thead>
            <tbody>{rows.map(entry => <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-accent">
              <td className="max-w-40 px-3 py-2.5 text-[11px] text-muted-foreground">{state.fronts.find(f => f.id === entry.frontId)?.name}</td>
              <td className="max-w-44 px-3 py-2.5 text-xs font-medium">{state.themes.find(t => t.id === entry.themeId)?.name}</td>
              <td className="max-w-64 px-3 py-2.5"><Button variant="link" className="h-auto max-w-full justify-start whitespace-normal p-0 text-left text-xs font-semibold text-foreground decoration-b3-turquesa underline-offset-4" aria-label={`Detalhes de ${state.activities.find(a => a.id === entry.activityId)?.name}`} onClick={() => setHistory(entry)}>{state.activities.find(a => a.id === entry.activityId)?.name}</Button></td>
              {view === "manager" && <td className="max-w-44 px-3 py-2.5 text-[11px]">{entry.responsibleIds.map(id => <div key={id} className="mb-0.5">{personName(id)}</div>)}</td>}
              <td className="px-3 py-2.5"><ActivityStatus status={entry.status} /></td>
              <td className="px-3 py-2.5 text-[11px]"><div>{entry.origin}</div><div className="text-muted-foreground">{entry.type}</div></td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[11px]"><div>{date(entry.startDate)}</div><div className="text-muted-foreground">até {date(entry.endDate)}</div></td>
              <td className={`whitespace-nowrap px-3 py-2.5 text-[11px] ${today && isOverdue(entry, today) ? "text-b3-coral" : "text-muted-foreground"}`}>{date(entry.deadline)}{today && isOverdue(entry, today) && <div className="font-semibold">Vencido</div>}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold tabular-nums">{formatHours(entry.hours)} h</td>
              {view === "entry" && <td className="px-2 py-2.5"><Button variant="ghost" size="icon" className="size-7" aria-label={`Editar ${state.activities.find(a => a.id === entry.activityId)?.name}`} title="Editar lançamento" onClick={() => setForm({ entry })}><Pencil className="size-3.5 text-b3-turquesa" /></Button></td>}
            </tr>)}</tbody>
          </table>
          {!rows.length && <div className="p-12 text-center"><ClipboardList className="mx-auto mb-3 size-8 text-muted-foreground" /><p className="font-semibold">Nenhum lançamento encontrado</p><Button variant="link" onClick={() => { setSearch(""); setFrontFilter("all"); setThemeFilter("all"); setStatusFilter("all"); setPersonFilter("all"); }}>Limpar filtros <ArrowUpRight /></Button></div>}
        </div>
        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>{rows.length} {rows.length === 1 ? "lançamento" : "lançamentos"}</span></div>
        <ActivityGantt entries={rows} state={state} today={today} onDetails={setHistory} />
      </>}
      <TabsContent value="dashboard"><div className="flex min-h-80 flex-col items-center justify-center border-b border-border py-16 text-center"><Construction className="mb-5 size-12 text-b3-turquesa" strokeWidth={1.3} /><h2 className="font-display text-2xl font-semibold">Dashboard em construção</h2><p className="mt-3 text-sm text-muted-foreground">Acompanhamento das Atividades</p></div></TabsContent>
    </Tabs>
    {form && <ActivityForm state={state} employeeId={employeeId} entry={form.entry} onClose={() => setForm(null)} onSave={save} />}
    <Dialog open={Boolean(history)} onOpenChange={open => { if (!open) setHistory(null); }}><DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-lg"><DialogHeader><DialogTitle>Detalhes e histórico</DialogTitle><DialogDescription>{state.activities.find(a => a.id === history?.activityId)?.name}</DialogDescription></DialogHeader>{history && <><div className="text-sm"><span className="text-xs text-muted-foreground">Descrição</span><p className="mt-1 whitespace-pre-wrap leading-relaxed">{history.description || "—"}</p></div><div className="grid gap-3 border-y border-border py-4 text-sm sm:grid-cols-2"><div><span className="text-xs text-muted-foreground">Responsáveis</span><p className="mt-1">{history.responsibleIds.map(personName).join(" · ")}</p></div><div><span className="text-xs text-muted-foreground">Gestores</span><p className="mt-1">{history.managerIds.map(personName).join(" · ")}</p></div><div><span className="text-xs text-muted-foreground">Período da atividade</span><p className="mt-1">{date(history.startDate)} → {date(history.endDate)}</p></div><div><span className="text-xs text-muted-foreground">Prazo</span><p className="mt-1">{date(history.deadline)}</p></div></div><div className="text-sm"><span className="text-xs text-muted-foreground">Observação</span><p className="mt-1 whitespace-pre-wrap">{history.observation || "—"}</p></div><h3 className="font-semibold">Registro de alterações</h3>{!logs.length ? <p className="text-sm text-muted-foreground">Nenhuma alteração registrada.</p> : <div className="space-y-4">{logs.map(log => <div key={log.id} className="border-l-2 border-b3-turquesa pl-4"><div className="text-sm font-semibold">{log.action === "create" ? "Lançamento criado" : "Lançamento atualizado"} · versão {log.after.version}</div><p className="mt-1 text-xs text-muted-foreground">{personName(log.actorId)} · {new Date(log.at).toLocaleString("pt-BR")}</p><dl className="mt-2 space-y-1 text-xs">{(Object.keys(log.after) as (keyof Entry)[]).filter(key => !["id", "version", "updatedAt", "createdAt"].includes(key) && JSON.stringify(log.before?.[key]) !== JSON.stringify(log.after[key])).map(key => <div key={key} className="break-words"><dt className="inline font-semibold">{({ frontId: "Frente", themeId: "Macrotema", activityId: "Atividade", status: "Status", origin: "Origem", type: "Tipo", startDate: "Início da atividade", endDate: "Fim da atividade", deadline: "Prazo", responsibleIds: "Responsáveis", description: "Descrição", observation: "Observação", hours: "Horas", managerIds: "Gestores" } as Record<string, string>)[key]}: </dt><dd className="inline text-muted-foreground">{JSON.stringify(log.before?.[key] ?? "—")} → {JSON.stringify(log.after[key])}</dd></div>)}</dl></div>)}</div>}</>}</DialogContent></Dialog>
  </>;
}