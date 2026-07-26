import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { PriorityBadge } from './PriorityBadge'
import { formatPrice } from '@/shared/utils/currency'
import type { GiftMine } from '../schemas/gifts.schema'

export function MyGiftListItem({
  gift,
  groupNames,
  onEdit,
  onDelete,
}: {
  gift: GiftMine
  groupNames: { id: string; name: string }[]
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <li className="rounded-2xl border border-border bg-paper-raised p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg leading-tight">{gift.title}</h3>
            <PriorityBadge priority={gift.priority} />
          </div>
          {gift.description && <p className="mt-1 text-sm text-ink-muted">{gift.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
            {formatPrice(gift.price) && <span className="font-medium text-ink">{formatPrice(gift.price)}</span>}
            {gift.url && (
              <a href={gift.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-raspberry hover:underline">
                Ver link <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {gift.groupIds.length === 0 ? (
              <span className="rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-ink-muted">
                Só na sua lista privada
              </span>
            ) : (
              gift.groupIds.map((gid) => {
                const grp = groupNames.find((x) => x.id === gid)
                if (!grp) return null
                return (
                  <span key={gid} className="rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-medium text-forest">
                    {grp.name}
                  </span>
                )
              })
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button onClick={onEdit} className="rounded-md p-2 text-ink-muted hover:bg-paper hover:text-ink" aria-label="Editar">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="rounded-md p-2 text-ink-muted hover:bg-raspberry-soft hover:text-raspberry" aria-label="Excluir">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  )
}