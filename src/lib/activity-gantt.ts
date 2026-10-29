import { differenceInCalendarDays, endOfMonth, endOfWeek, eachMonthOfInterval, eachWeekOfInterval, format, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { validActivityDate, type Entry } from "./activity-tracking";

export type GanttScale = "week" | "month";
export function activityTimeline(entries: Entry[], scale: GanttScale) {
  const scheduled = entries.filter(e => validActivityDate(e.startDate) && validActivityDate(e.endDate) && e.endDate >= e.startDate).slice().sort((a, b) => a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id));
  if (!scheduled.length) return null;
  const earliest = scheduled.reduce((min, e) => e.startDate < min ? e.startDate : min, scheduled[0]?.startDate ?? "");
  const latest = scheduled.reduce((max, e) => e.endDate > max ? e.endDate : max, scheduled[0]?.endDate ?? "");
  const start = scale === "week" ? startOfWeek(parseISO(earliest), { weekStartsOn: 1 }) : startOfMonth(parseISO(earliest));
  const end = scale === "week" ? endOfWeek(parseISO(latest), { weekStartsOn: 1 }) : endOfMonth(parseISO(latest));
  const days = differenceInCalendarDays(end, start) + 1;
  const position = (date: string) => differenceInCalendarDays(parseISO(date), start) / days * 100;
  const buckets = (scale === "week" ? eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }) : eachMonthOfInterval({ start, end })).map(day => ({
    key: format(day, "yyyy-MM-dd"), label: format(day, scale === "week" ? "dd MMM" : "MMM yyyy", { locale: ptBR }),
    left: differenceInCalendarDays(day, start) / days * 100,
  }));
  const items = scheduled.map(entry => ({ entry, left: position(entry.startDate), width: (differenceInCalendarDays(parseISO(entry.endDate), parseISO(entry.startDate)) + 1) / days * 100, duration: differenceInCalendarDays(parseISO(entry.endDate), parseISO(entry.startDate)) + 1 }));
  const groups = [...new Set(scheduled.map(entry => entry.themeId))].map(themeId => {
    const children = items.filter(item => item.entry.themeId === themeId);
    const left = Math.min(...children.map(item => item.left));
    const right = Math.max(...children.map(item => item.left + item.width));
    const firstDate = children.reduce((min, item) => item.entry.startDate < min ? item.entry.startDate : min, children[0]?.entry.startDate ?? "");
    const lastDate = children.reduce((max, item) => item.entry.endDate > max ? item.entry.endDate : max, children[0]?.entry.endDate ?? "");
    const duration = differenceInCalendarDays(parseISO(lastDate), parseISO(firstDate)) + 1;
    return { themeId, left, width: right - left, duration, children };
  });
  return { start, end, days, buckets, position, entries: items, groups };
}