export type Person = { id: string; name: string; managerId: string | null; role: string };
export type Front = { id: string; name: string };
export type Theme = { id: string; frontId: string; name: string };
export type Activity = { id: string; themeId: string; name: string };
export const statuses = ["Não iniciada", "Em andamento", "Concluída", "Suspensa"] as const;
export type Entry = {
  id: string; frontId: string; themeId: string; activityId: string;
  status: string; origin: string; type: string; deadline: string; startDate: string; endDate: string;
  responsibleIds: string[]; description: string; hours: number; managerIds: string[];
  version: number; createdAt: string; updatedAt: string;
};
export type Audit = { id: string; mutationId: string; entryId: string; actorId: string; action: "create" | "update"; at: string; before: Entry | null; after: Entry };
export type ActivityState = { people: Person[]; fronts: Front[]; themes: Theme[]; activities: Activity[]; entries: Entry[]; audit: Audit[] };
export type Draft = Omit<Entry, "id" | "version" | "createdAt" | "updatedAt" | "managerIds">;
export type Mutation = { id: string; entryId: string; expectedVersion: number | null; actorId: string; draft: Draft; at: string; catalog?: { front?: Front; theme?: Theme; activity?: Activity } };

export const normalizeName = (name: string) => name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
export const formatHours = (hours: number) => hours.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 2 });
export function validActivityDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
export function validateActivityPeriod(startDate: string, endDate: string): void {
  if (!validActivityDate(startDate) || !validActivityDate(endDate)) throw new Error("Informe início e fim válidos para o período da atividade.");
  if (endDate < startDate) throw new Error("O fim da atividade não pode ser anterior ao início.");
}
export function parseHours(value: string): number {
  if (!/^\d+(?:\.\d+)?$/.test(value) || !Number.isFinite(Number(value)) || Number(value) <= 0) {
    throw new Error("Informe horas maiores que zero, usando ponto para decimais (ex.: 2.5).");
  }
  return Number(value);
}
export const employeeEntries = (entries: Entry[], employeeId: string) => entries.filter(e => e.responsibleIds.includes(employeeId));
export const managerEntries = (state: ActivityState, managerId: string) => state.entries.filter(e => e.responsibleIds.some(id => state.people.some(p => p.id === id && p.managerId === managerId)));
export const managerIdsFor = (people: Person[], ids: string[]) => [...new Set(people.filter(p => ids.includes(p.id) && p.managerId).flatMap(p => p.managerId ? [p.managerId] : []))];
export const isOverdue = (entry: Entry, today: string) => entry.deadline < today && entry.status !== "Concluída" && entry.status !== "Suspensa";
export function totals(entries: Entry[], today: string) {
  return { count: entries.length, hours: entries.reduce((sum, e) => sum + e.hours, 0), active: entries.filter(e => e.status === "Em andamento").length, overdue: entries.filter(e => isOverdue(e, today)).length };
}

// Demonstration only. Production authorization, uniqueness, queue and audit are server-side.
export function applyMutation(state: ActivityState, mutation: Mutation): ActivityState {
  if (state.audit.some(log => log.mutationId === mutation.id)) return state;
  const existing = state.entries.find(e => e.id === mutation.entryId);
  const actor = state.people.find(p => p.id === mutation.actorId);
  if (!actor || actor.role !== "employee" || (existing && !existing.responsibleIds.includes(actor.id))) throw new Error("Você não pode alterar esta atividade.");
  if (!mutation.draft.responsibleIds.includes(actor.id)) throw new Error("O responsável atual deve permanecer no lançamento.");
  if ((existing?.version ?? null) !== mutation.expectedVersion) throw new Error("Esta atividade foi alterada. Feche e abra o lançamento novamente para revisar a versão atual.");
  const { draft } = mutation;
  if (!Number.isFinite(draft.hours) || draft.hours <= 0) throw new Error("Informe um esforço em horas maior que zero.");
  if (!draft.description.trim()) throw new Error("Informe a descrição da atividade.");
  validateActivityPeriod(draft.startDate, draft.endDate);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.deadline) || Number.isNaN(Date.parse(draft.deadline))) throw new Error("Informe um prazo válido.");
  if (!(statuses as readonly string[]).includes(draft.status) || !["Planejada", "Não Planejada"].includes(draft.origin) || !["Pontual", "Recorrente"].includes(draft.type)) throw new Error("Selecione status, origem e tipo válidos.");
  if (draft.responsibleIds.some(id => !state.people.some(p => p.id === id && p.role === "employee" && p.managerId))) throw new Error("Selecione responsáveis válidos com gestor cadastrado.");
  const fronts = [...state.fronts]; const themes = [...state.themes]; const activities = [...state.activities];
  const { catalog } = mutation;
  if (catalog?.front) {
    if (!normalizeName(catalog.front.name)) throw new Error("Informe o nome da frente.");
    if (fronts.some(f => normalizeName(f.name) === normalizeName(catalog.front?.name ?? ""))) throw new Error("Esta frente já existe. Selecione-a na lista.");
    fronts.push(catalog.front);
  }
  if (catalog?.theme) {
    if (!normalizeName(catalog.theme.name)) throw new Error("Informe o nome do macrotema.");
    if (themes.some(t => t.frontId === catalog.theme?.frontId && normalizeName(t.name) === normalizeName(catalog.theme?.name ?? ""))) throw new Error("Este macrotema já existe nesta frente. Selecione-o na lista.");
    themes.push(catalog.theme);
  }
  if (catalog?.activity) {
    if (!normalizeName(catalog.activity.name)) throw new Error("Informe o nome da atividade.");
    if (activities.some(a => a.themeId === catalog.activity?.themeId && normalizeName(a.name) === normalizeName(catalog.activity?.name ?? ""))) throw new Error("Esta atividade já existe neste macrotema. Selecione-a na lista.");
    activities.push(catalog.activity);
  }
  if (!fronts.some(f => f.id === draft.frontId) || !themes.some(t => t.id === draft.themeId && t.frontId === draft.frontId) || !activities.some(a => a.id === draft.activityId && a.themeId === draft.themeId)) throw new Error("Selecione uma frente, um macrotema e uma atividade relacionados.");
  const after: Entry = { ...draft, description: draft.description.trim(), responsibleIds: [...new Set(draft.responsibleIds)], id: mutation.entryId, managerIds: managerIdsFor(state.people, draft.responsibleIds), version: (existing?.version ?? 0) + 1, createdAt: existing?.createdAt ?? mutation.at, updatedAt: mutation.at };
  const audit: Audit = { id: `log-${mutation.id}`, mutationId: mutation.id, entryId: after.id, actorId: actor.id, action: existing ? "update" : "create", at: mutation.at, before: existing ? structuredClone(existing) : null, after: structuredClone(after) };
  return { ...state, fronts, themes, activities, entries: existing ? state.entries.map(e => e.id === after.id ? after : e) : [after, ...state.entries], audit: [...state.audit, audit] };
}

// One browser session only; never a substitute for the durable Databricks queue.
export class DemoMutationQueue {
  private tail: Promise<unknown> = Promise.resolve();
  enqueue<T>(job: () => T | Promise<T>): Promise<T> {
    const next = this.tail.then(job);
    this.tail = next.catch(() => undefined);
    return next;
  }
}