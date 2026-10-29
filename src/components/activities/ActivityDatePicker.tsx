import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function ActivityDatePicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild><Button type="button" variant="outline" aria-label={label} className="h-10 w-full justify-start font-normal"><CalendarIcon className="shrink-0 text-b3-turquesa" /><span className={value ? "" : "text-muted-foreground"}>{selected ? format(selected, "dd/MM/yyyy") : "Selecionar data"}</span></Button></PopoverTrigger>
    <PopoverContent align="start" className="w-auto p-0 pointer-events-auto"><Calendar mode="single" locale={ptBR} selected={selected} {...(selected ? { defaultMonth: selected } : {})} onSelect={day => { if (day) { onChange(format(day, "yyyy-MM-dd")); setOpen(false); } }} autoFocus className="p-3 pointer-events-auto" /></PopoverContent>
  </Popover>;
}