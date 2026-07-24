import type { Priority } from '../schemas/gifts.schema'

const labels: Record<Priority, string> = {
  NONE: 'Nenhuma',
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
}

const styles: Record<Priority, string> = {
  NONE: 'bg-[color:var(--color-paper-raised)] text-[color:var(--color-ink-muted)] border border-[color:var(--color-border)]',
  LOW: 'bg-[color:var(--color-paper-raised)] text-[color:var(--color-forest)] border border-[color:var(--color-forest-soft)]/40',
  MEDIUM: 'bg-[color:var(--color-raspberry-soft)] text-[color:var(--color-raspberry)] border border-[color:var(--color-raspberry)]/20',
  HIGH: 'bg-[color:var(--color-raspberry)] text-white border border-[color:var(--color-raspberry)]',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[priority]}`}>
      {labels[priority]}
    </span>
  )
}