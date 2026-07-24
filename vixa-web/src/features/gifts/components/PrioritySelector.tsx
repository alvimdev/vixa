import type { Priority } from '../schemas/gifts.schema'

const options: { value: Priority; label: string; dotClass: string }[] = [
  { value: 'NONE', label: 'Nenhuma', dotClass: 'bg-ink-muted' },
  { value: 'LOW', label: 'Baixa', dotClass: 'bg-ink-muted' },
  { value: 'MEDIUM', label: 'Média', dotClass: 'bg-raspberry' },
  { value: 'HIGH', label: 'Alta', dotClass: 'bg-raspberry' },
]

export function PrioritySelector({ value, onChange }: { value: Priority; onChange: (p: Priority) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              active
                ? 'border-forest bg-forest text-paper'
                : 'border-border bg-paper text-ink-muted hover:border-forest hover:text-ink'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-paper' : opt.dotClass}`} />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}