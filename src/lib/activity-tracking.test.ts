import { describe, expect, it } from "vitest";
import demo from "@/data/activity-demo.json";
import { applyDeletion, applyMutation, DemoMutationQueue, employeeEntries, macrothemeEntries, managerEntries, normalizeName, totals, parseHours, formatHours, validateActivityPeriod, type ActivityState, type Mutation } from "./activity-tracking";

const state = (): ActivityState => {
  const snapshot: ActivityState = structuredClone(demo);
  return snapshot;
};
function mutation(s: ActivityState, overrides: Partial<Mutation> = {}): Mutation {
  const entry = s.entries[0];
  if (!entry) throw new Error("Fixture missing");
  return { id: "cmd-1", entryId: entry.id, expectedVersion: entry.version, actorId: "p-ana", draft: { ...entry, hours: 14 }, at: "2026-10-28T23:25:00Z", ...overrides };
}
describe("Activity tracking rules", () => {
  it("deletes a shared entry from all scopes while retaining catalog and immutable audit", () => {
    const s = state(); const m = mutation(s);
    const next = applyDeletion(s, { ...m, expectedVersion: 1 });
    expect(employeeEntries(next.entries, "p-ana").map(e => e.id)).not.toContain(m.entryId);
    expect(managerEntries(next, "p-mariana").map(e => e.id)).not.toContain(m.entryId);
    expect(next.activities).toEqual(s.activities);
    expect(next.audit[0]?.action).toBe("delete");
    expect(next.audit[0]?.before?.version).toBe(1);
    expect(next.audit[0]?.after.version).toBe(2);
    expect(next.audit[0]?.after.deletedAt).toBe(m.at);
    const original = s.entries[0]; if (!original) throw new Error("Fixture missing");
    original.description = "Changed externally";
    expect(next.audit[0]?.before?.description).not.toBe(original.description);
  });
  it("blocks deletion by unassigned employees and read-only managers", () => {
    const s = state(); const m = mutation(s);
    for (const actorId of ["p-diego", "p-mariana"]) expect(() => applyDeletion(s, { ...m, actorId, expectedVersion: 1 })).toThrow("não pode excluir");
    expect(s.audit).toHaveLength(0);
  });
  it("checks deletion versions through the shared queue and blocks stale resurrection", async () => {
    let s = state(); const queue = new DemoMutationQueue(); const m = mutation(s);
    await queue.enqueue(() => { s = applyMutation(s, m); });
    await expect(queue.enqueue(() => { s = applyDeletion(s, { ...m, id: "delete-stale", expectedVersion: 1 }); })).rejects.toThrow("foi alterada");
    const deletion = { ...m, id: "delete-current", expectedVersion: 2 };
    await queue.enqueue(() => { s = applyDeletion(s, deletion); });
    expect(applyDeletion(s, deletion)).toBe(s);
    expect(s.audit).toHaveLength(2);
    expect(() => applyMutation(s, { ...m, id: "stale-edit", expectedVersion: 3 })).toThrow("excluída");
  });
  it("allows observation to be omitted or empty when saving", () => {
    for (const observation of [undefined, ""]) {
      const s = state(); const m = mutation(s);
      if (observation === undefined) delete m.draft.observation;
      else m.draft.observation = observation;
      expect(applyMutation(s, m).entries[0]?.observation).toBe("");
    }
  });
  it("preserves optional observation changes in immutable audit snapshots", () => {
    const s = state(); const m = mutation(s); m.draft.observation = "Aguardando validação do gestor.";
    const next = applyMutation(s, m);
    expect(next.entries[0]?.observation).toBe("Aguardando validação do gestor.");
    expect(next.audit[0]?.before?.observation).toBe("");
    m.draft.observation = "Outro texto";
    expect(next.audit[0]?.after.observation).toBe("Aguardando validação do gestor.");
  });
  it("filters macrotheme within employee and manager scopes", () => {
    const s = state();
    expect(macrothemeEntries(employeeEntries(s.entries, "p-ana"), "m-controles").map(e => e.id)).toEqual(["l-001"]);
    expect(macrothemeEntries(managerEntries(s, "p-mariana"), "m-controles").map(e => e.id)).toEqual(["l-001", "l-006"]);
    expect(macrothemeEntries(employeeEntries(s.entries, "p-ana"), "all")).toHaveLength(4);
  });
  it("saves the activity start and end in immutable audit snapshots", () => {
    const s = state(); const m = mutation(s);
    m.draft.startDate = "2026-10-22"; m.draft.endDate = "2026-11-05";
    const next = applyMutation(s, m);
    expect(next.entries[0]?.startDate).toBe("2026-10-22");
    expect(next.entries[0]?.endDate).toBe("2026-11-05");
    expect(next.audit[0]?.before?.startDate).toBe("2026-10-20");
    expect(next.audit[0]?.after.endDate).toBe("2026-11-05");
    m.draft.endDate = "2026-11-06";
    expect(next.audit[0]?.after.endDate).toBe("2026-11-05");
  });
  it("rejects an end before the start without changing state", () => {
    const s = state(); const m = mutation(s);
    m.draft.startDate = "2026-11-06"; m.draft.endDate = "2026-11-05";
    expect(() => applyMutation(s, m)).toThrow("anterior ao início");
    expect(s.audit).toHaveLength(0);
  });
  it("requires valid calendar dates for both ends of the period", () => {
    for (const [start, end] of [["", "2026-11-06"], ["2026-10-20", ""], ["2026-02-30", "2026-11-06"], ["2026-10-20", "2026-13-01"]]) {
      expect(() => validateActivityPeriod(start ?? "", end ?? "")).toThrow("válidos");
    }
    expect(() => validateActivityPeriod("2026-11-06", "2026-11-06")).not.toThrow();
  });
  it("accepts fractional hours only with a period and displays the same separator", () => {
    expect(parseHours("2.5")).toBe(2.5);
    expect(parseHours("12.75")).toBe(12.75);
    expect(parseHours("2")).toBe(2);
    expect(formatHours(12.75)).toBe("12.75");
    for (const invalid of ["2,5", "1,000.5", "1e2", "2.5.1", "", "0", "-2", "Infinity"]) {
      expect(() => parseHours(invalid)).toThrow();
    }
  });
  it("employee sees only their own assignments, including shared ones", () => {
    expect(employeeEntries(state().entries, "p-ana").map(e => e.id)).toEqual(["l-001", "l-002", "l-003", "l-004"]);
  });
  it("manager sees only their employees and shared initiatives once", () => {
    expect(managerEntries(state(), "p-mariana").map(e => e.id)).toEqual(["l-001", "l-002", "l-003", "l-004", "l-005", "l-006"]);
  });
  it("blocks editing someone else's initiative", () => {
    const s = state();
    expect(() => applyMutation(s, mutation(s, { actorId: "p-diego" }))).toThrow("Você não pode alterar");
  });
  it("derives all managers for multiple responsible employees", () => {
    const s = state(); const m = mutation(s);
    m.draft.responsibleIds = ["p-ana", "p-diego"];
    expect(applyMutation(s, m).entries[0]?.managerIds).toEqual(["p-mariana", "p-rafael"]);
  });
  it("keeps the authenticated employee assigned", () => {
    const s = state(); const m = mutation(s); m.draft.responsibleIds = ["p-bruno"];
    expect(() => applyMutation(s, m)).toThrow("deve permanecer");
  });
  it("normalizes front duplicates across case, accents and spaces", () => {
    const s = state(); const m = mutation(s); m.catalog = { front: { id: "new", name: "  CONTROLES   INTEGRADOS " } };
    expect(() => applyMutation(s, m)).toThrow("frente já existe");
    expect(normalizeName(" Resiliência ")).toBe("resiliencia");
  });
  it("prevents duplicate macrothemes in the same front", () => {
    const s = state(); const m = mutation(s); m.catalog = { theme: { id: "new", frontId: "f-controles", name: "AVALIACAO DE CONTROLES" } };
    expect(() => applyMutation(s, m)).toThrow("macrotema já existe");
  });
  it("prevents duplicate activities in the same macrotheme", () => {
    const s = state(); const m = mutation(s); m.catalog = { activity: { id: "new", themeId: "m-controles", name: "revisao da matriz de controles" } };
    expect(() => applyMutation(s, m)).toThrow("atividade já existe");
  });
  it("rejects mismatched front and macrotheme", () => {
    const s = state(); const m = mutation(s); m.draft.frontId = "f-resiliencia";
    expect(() => applyMutation(s, m)).toThrow("relacionados");
  });
  it("creates a new entry within a chosen macrotheme", () => {
    const s = state(); const m = mutation(s, { entryId: "new-entry", expectedVersion: null });
    m.catalog = { activity: { id: "new-activity", themeId: "m-controles", name: "Revisão adicional" } }; m.draft.activityId = "new-activity";
    const next = applyMutation(s, m);
    expect(next.entries[0]?.activityId).toBe("new-activity"); expect(next.audit[0]?.action).toBe("create");
  });
  it("logs before and after every successful change", () => {
    const s = state(); const next = applyMutation(s, mutation(s));
    expect(next.audit[0]?.before?.hours).toBe(12.5); expect(next.audit[0]?.after.hours).toBe(14); expect(next.audit[0]?.actorId).toBe("p-ana");
    expect(s.entries[0]?.version).toBe(1); expect(next.entries[0]?.version).toBe(2);
  });
  it("rejects concurrent stale edits without silent overwrites", async () => {
    let s = state(); const queue = new DemoMutationQueue(); const first = mutation(s); const stale = mutation(s, { id: "cmd-2" });
    await queue.enqueue(() => { s = applyMutation(s, first); });
    await expect(queue.enqueue(() => { s = applyMutation(s, stale); })).rejects.toThrow("foi alterada");
    expect(s.audit).toHaveLength(1); expect(s.entries[0]?.hours).toBe(14);
    await queue.enqueue(() => { s = applyMutation(s, mutation(s, { id: "cmd-3" })); });
    expect(s.audit).toHaveLength(2);
  });
  it("does not apply duplicate mutation IDs twice", () => {
    const s = state(); const m = mutation(s); const next = applyMutation(s, m);
    expect(applyMutation(next, m).audit).toHaveLength(1);
  });
  it("calculates initiative totals without double counting shared employees", () => {
    const s = state(); expect(totals(managerEntries(s, "p-mariana"), "2026-10-28")).toEqual({ count: 6, hours: 47, active: 3, overdue: 1 });
  });
});