import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ActivitySelect({ label, value, onChange, options, placeholder = "Selecione", disabled = false }: {
  label: string; value: string; onChange: (value: string) => void;
  options: { id: string; name: string }[]; placeholder?: string; disabled?: boolean;
}) {
  return <Select value={value} onValueChange={onChange} disabled={disabled}>
    <SelectTrigger aria-label={label} className="h-10 min-w-0 bg-background"><SelectValue placeholder={placeholder} /></SelectTrigger>
    <SelectContent>{options.map(option => <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>)}</SelectContent>
  </Select>;
}