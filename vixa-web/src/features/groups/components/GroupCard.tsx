import { Link } from 'react-router-dom'
import type { GroupListItem } from '../schemas/groups.schema'

export function GroupCard({ item }: { item: GroupListItem }) {
  return (
    <Link
      to={`/groups/${item.group.id}`}
      className="flex items-center gap-4 rounded-xl border border-border bg-paper-raised p-5 transition-colors hover:border-forest"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest font-display text-lg text-paper">
        {item.group.name[0]?.toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-semibold text-ink">{item.group.name}</p>
        {item.group.description && (
          <p className="truncate text-sm text-ink-muted">{item.group.description}</p>
        )}
      </div>
      {item.role === 'ADMIN' && (
        <span className="shrink-0 rounded-full bg-raspberry-soft px-2.5 py-1 text-xs font-medium text-raspberry">
          Admin
        </span>
      )}
    </Link>
  )
}