import { describe, expect, it } from "vitest";
import demo from "@/data/activity-demo.json";
import { activityTimeline } from "./activity-gantt";
import { employeeEntries, managerEntries } from "./activity-tracking";

describe("Activity Gantt", () => {
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