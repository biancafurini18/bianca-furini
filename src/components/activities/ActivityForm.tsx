import { useState, type FormEvent, type ReactNode } from "react";
import { Save, UserRound, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ActivitySelect } from "./ActivitySelect";
import { managerIdsFor, statuses, parseHours, formatHours, type ActivityState, type Draft, type Entry, type Mutation } from "@/lib/activity-tracking";

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <div className={wide ? "min-w-0 md:col-span-2" : "min-w-0"}><div className="mb-2 text-xs font-semibold text-muted-foreground">{label}</div>{children}</div>;
}
export function ActivityForm({ state, employeeId, entry, onClose, onSave }: {
  state: ActivityState; employeeId: string; entry: Entry | null; onClose: () => void;
  onSave: (mutation: Mutation) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Draft>(entry ? { ...entry, responsibleIds: [...entry.responsibleIds] } : {
    frontId: "", themeId: "", activityId: "", status: "Não iniciada", origin: "Planejada", type: "Pontual", deadline: "", responsibleIds: [employeeId], description: "", hours: 0,
  });
  const [newFront, setNewFront] = useState<string | null>(null);
  const [hoursInput, setHoursInput] = useState(entry ? formatHours(entry.hours) : "");
  const [newTheme, setNewTheme] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState<string | null>(null);
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  const field = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft(prev => ({ ...prev, [key]: value }));
  const managerNames = managerIdsFor(state.people, draft.responsibleIds).map(id => state.people.find(p => p.id === id)?.name).join(" · ");
  function catalogControl(level: "front" | "theme" | "activity") {
    const label = level === "front" ? "Frente" : level === "theme" ? "Macrotema" : "Atividade";
    const value = level === "front" ? draft.frontId : level === "theme" ? draft.themeId : draft.activityId;
    const options = level === "front" ? state.fronts : level === "theme" ? state.themes.filter(t => t.frontId === draft.frontId) : state.activities.filter(a => a.themeId === draft.themeId);
    const currentNew = level === "front" ? newFront : level === "theme" ? newTheme : newActivity;
    const setNew = level === "front" ? setNewFront : level === "theme" ? setNewTheme : setNewActivity;
    const disabled = level === "theme" ? !draft.frontId && newFront === null : level === "activity" ? !draft.themeId && newTheme === null : false;
    const change = (id: string) => {
      if (level === "front") { setDraft(prev => ({ ...prev, frontId: id, themeId: "", activityId: "" })); setNewTheme(null); setNewActivity(null); }
      else if (level === "theme") { setDraft(prev => ({ ...prev, themeId: id, activityId: "" })); setNewActivity(null); }
      else field("activityId", id);
    };
    return <div className="flex min-w-0 gap-2">
      <div className="min-w-0 flex-1">{currentNew !== null ? <Input aria-label={`Nova ${label.toLowerCase()}`} required value={currentNew} onChange={e => setNew(e.target.value)} placeholder={`Nome de ${label.toLowerCase()}`} className="h-10" /> : <ActivitySelect label={label} value={value} onChange={change} options={options} disabled={disabled} />}</div>
      <Button type="button" size="icon" variant="outline" disabled={disabled || saving} aria-label={currentNew !== null ? `Selecionar ${label.toLowerCase()} existente` : `Cadastrar ${label.toLowerCase()}`} title={currentNew !== null ? "Selecionar existente" : `Cadastrar ${label.toLowerCase()}`} className="h-10 w-10 shrink-0" onClick={() => { setNew(currentNew === null ? "" : null); change(""); }}>{currentNew !== null ? <X /> : <Plus />}</Button>
    </div>;
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setSaving(true);
    const frontId = newFront !== null ? crypto.randomUUID() : draft.frontId;
    const themeId = newTheme !== null ? crypto.randomUUID() : draft.themeId;
    const activityId = newActivity !== null ? crypto.randomUUID() : draft.activityId;
    try {
      const hours = parseHours(hoursInput);
      await onSave({ id: crypto.randomUUID(), entryId: entry?.id ?? crypto.randomUUID(), expectedVersion: entry?.version ?? null, actorId: employeeId, at: new Date().toISOString(), draft: { ...draft, hours, frontId, themeId, activityId }, catalog: {
        ...(newFront !== null ? { front: { id: frontId, name: newFront.trim() } } : {}),
        ...(newTheme !== null ? { theme: { id: themeId, frontId, name: newTheme.trim() } } : {}),
        ...(newActivity !== null ? { activity: { id: activityId, themeId, name: newActivity.trim() } } : {}),
      } });
      onClose();
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível salvar."); }
    finally { setSaving(false); }
  }
  return <Dialog open onOpenChange={open => { if (!open && !saving) onClose(); }}>
    <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-lg">
      <DialogHeader><DialogTitle className="font-display text-xl">{entry ? "Editar lançamento" : "Novo lançamento"}</DialogTitle><DialogDescription>{entry ? `Versão ${entry.version}` : "Acompanhamento das Atividades"}</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="space-y-6">
        <fieldset disabled={saving} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Frente *">{catalogControl("front")}</Field>
            <Field label="Macrotema *">{catalogControl("theme")}</Field>
            <Field label="Atividade *" wide>{catalogControl("activity")}</Field>
          </div>
          <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2 md:grid-cols-3">
            <Field label="Status *"><ActivitySelect label="Status" value={draft.status} onChange={v => field("status", v)} options={statuses.map(name => ({ id: name, name }))} /></Field>
            <Field label="Origem *"><ActivitySelect label="Origem" value={draft.origin} onChange={v => field("origin", v)} options={["Planejada", "Não Planejada"].map(name => ({ id: name, name }))} /></Field>
            <Field label="Tipo *"><ActivitySelect label="Tipo" value={draft.type} onChange={v => field("type", v)} options={["Pontual", "Recorrente"].map(name => ({ id: name, name }))} /></Field>
            <Field label="Prazo *"><Input type="date" aria-label="Prazo" required value={draft.deadline} onChange={e => field("deadline", e.target.value)} className="h-10" /></Field>
            <Field label="Esforço em horas *"><Input type="text" inputMode="decimal" aria-label="Esforço em horas" required value={hoursInput} placeholder="0.00" onChange={e => setHoursInput(e.target.value)} className="h-10" /></Field>
          </div>
          <div className="grid gap-5 border-t border-border pt-5 md:grid-cols-2">
            <Field label="Responsáveis *"><div className="space-y-3">{state.people.filter(p => p.role === "employee").map(p => <label key={p.id} className="flex items-center gap-2 text-sm"><Checkbox aria-label={p.name} checked={draft.responsibleIds.includes(p.id)} disabled={p.id === employeeId} onCheckedChange={checked => field("responsibleIds", checked ? [...draft.responsibleIds, p.id] : draft.responsibleIds.filter(id => id !== p.id))} /><span>{p.name}{p.id === employeeId && <span className="ml-2 text-xs text-b3-turquesa">Você</span>}</span></label>)}</div></Field>
            <Field label="Gestor · automático"><div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 p-3 text-sm"><UserRound className="mt-0.5 size-4 shrink-0 text-b3-turquesa" /><span>{managerNames || "—"}</span></div></Field>
            <Field label="Descrição (resumo) *" wide><Textarea aria-label="Descrição (resumo)" value={draft.description} onChange={e => field("description", e.target.value)} required maxLength={2000} rows={3} placeholder="Resumo da iniciativa" /></Field>
          </div>
        </fieldset>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4"><div className="flex gap-2"><Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button><Button type="submit" disabled={saving}><Save />{saving ? "Salvando…" : "Salvar lançamento"}</Button></div></div>
      </form>
    </DialogContent>
  </Dialog>;
}