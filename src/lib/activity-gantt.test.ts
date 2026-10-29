import { describe, expect, it } from "vitest";
import demo from "@/data/activity-demo.json";
import { activityTimeline } from "./activity-gantt";
import { employeeEntries, managerEntries } from "./activity-tracking";

describe("Activity Gantt", () => {
  it("counts 20 scoped items over 5 inclusive days and exposes all legend statuses", () => {
    const entry = demo.entries[0]; if (!entry) throw new Error("Missing fixture");
    const entries = Array.from({ length: 20 }, (_, i) => ({ ...entry, id: `item-${i}`, startDate: "2026-10-20", endDate: "2026-10-24", status: i < 10 ? "Em andamento" : "Concluída" }));
    const group = activityTimeline(entries, "week")?.groups[0];
    expect(group?.itemCount).toBe(20);
    expect(group?.duration).toBe(5);
    expect(group?.statusSegments).toEqual([{ status: "Em andamento", count: 10 }, { status: "Concluída", count: 10 }]);
    const filtered = activityTimeline(entries.filter(e => e.status === "Concluída"), "week")?.groups[0];
    expect(filtered?.itemCount).toBe(10);
    expect(filtered?.statusSegments).toEqual([{ status: "Concluída", count: 10 }]);
    expect(activityTimeline(entries.map(e => ({ ...e, deletedAt: "2026-10-29T00:44:00Z" })), "week")).toBeNull();
  });
  it("counts macrotheme calendar days inclusively without summing overlapping activities", () => {
    const entry = demo.entries[0]; if (!entry) throw new Error("Missing fixture");
    const timeline = activityTimeline([
      { ...entry, id: "first", startDate: "2026-10-20", endDate: "2026-10-25" },
      { ...entry, id: "second", startDate: "2026-10-23", endDate: "2026-10-28" },
    ], "week");
    expect(timeline?.groups[0]?.duration).toBe(9);
    expect(timeline?.groups[0]?.children.map(item => item.duration)).toEqual([6, 6]);
  });
  it("aggregates macrotheme span and exposes only its scoped activity children", () => {
    const timeline = activityTimeline(managerEntries(demo, "p-mariana"), "week");
    const group = timeline?.groups.find(g => g.themeId === "m-controles");
    expect(group?.children.map(item => item.entry.id)).toEqual(["l-001", "l-006"]);
    expect(group?.left).toBe(timeline?.position("2026-10-20"));
    const child = group?.children.find(item => item.entry.id === "l-001");
    expect(group?.width).toBeCloseTo(child?.width ?? -1);
    const filtered = activityTimeline(employeeEntries(demo.entries, "p-ana").filter(e => e.themeId === "m-controles"), "week");
    expect(filtered?.groups.map(g => g.themeId)).toEqual(["m-controles"]);
    expect(filtered?.groups[0]?.children.map(item => item.entry.id)).toEqual(["l-001"]);
  });
  it("uses the employee and manager scopes without adding other people's entries", () => {
    expect(activityTimeline(employeeEntries(demo.entries, "p-ana"), "week")?.entries.map(e => e.entry.id).sort()).toEqual(["l-001", "l-002", "l-003", "l-004"]);
    expect(activityTimeline(managerEntries(demo, "p-mariana"), "week")?.entries.map(e => e.entry.id).sort()).toEqual(["l-001", "l-002", "l-003", "l-004", "l-005", "l-006"]);
  });
  it("renders a one-day activity with positive width and inclusive start/end", () => {
    const entry = demo.entries[0]; if (!entry) throw new Error("Missing fixture");
    const timeline = activityTimeline([{ ...entry, startDate: "2026-10-28", endDate: "2026-10-28" }], "week");
    expect(timeline?.days).toBe(7);
    expect(timeline?.entries[0]?.duration).toBe(1);
    expect(timeline?.entries[0]?.left).toBeCloseTo(2 / 7 * 100);
    expect(timeline?.entries[0]?.width).toBeCloseTo(1 / 7 * 100);
  });
  it("preserves the actual period across month and year boundaries", () => {
    const entry = demo.entries[0]; if (!entry) throw new Error("Missing fixture");
    const timeline = activityTimeline([{ ...entry, startDate: "2026-12-30", endDate: "2027-01-02" }], "month");
    expect(timeline?.entries[0]?.duration).toBe(4);
    expect(timeline?.days).toBe(62);
    expect(timeline?.buckets.map(b => b.key)).toEqual(["2026-12-01", "2027-01-01"]);
    expect(activityTimeline([], "week")).toBeNull();
  });
});