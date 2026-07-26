import { Link } from 'react-router-dom'
import { ShieldCheck, ChevronRight, Gift } from 'lucide-react'
import type { GroupListItem } from '../schemas/groups.schema'

export function GroupCard({ item }: { item: GroupListItem }) {
  return (
    <Link
      to={`/groups/${item.group.id}`}
      className="group rounded-2xl border border-border bg-paper-raised p-5 transition hover:border-forest-soft hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight">{item.group.name}</h3>
          {item.group.description && (
            <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
              {item.group.description}
            </p>
          )}
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5" />
      </div>
      <div className="mt-5 flex items-center justify-between text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1">
          <Gift className="h-3.5 w-3.5" /> Ver detalhes
        </span>
        {item.role === 'ADMIN' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2 py-0.5 font-medium text-forest">
            <ShieldCheck className="h-3 w-3" /> Admin
          </span>
        )}
      </div>
    </Link>
  )
}