import { describe, expect, it } from "vitest";
import demo from "@/data/activity-demo.json";
import { applyMutation, DemoMutationQueue, employeeEntries, managerEntries, normalizeName, totals, type ActivityState, type Mutation } from "./activity-tracking";

const state = (): ActivityState => structuredClone(demo);
function mutation(s: ActivityState, overrides: Partial<Mutation> = {}): Mutation {
  const entry = s.entries[0];
  if (!entry) throw new Error("Fixture missing");
  return { id: "cmd-1", entryId: entry.id, expectedVersion: entry.version, actorId: "p-ana", draft: { ...entry, hours: 14 }, at: "2026-10-28T23:25:00Z", ...overrides };
}
describe("Activity tracking rules", () => {
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