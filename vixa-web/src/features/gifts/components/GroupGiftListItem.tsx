import { ExternalLink } from 'lucide-react'
import { Avatar } from '@/shared/components/vixa/Avatar'
import { PriorityBadge } from './PriorityBadge'
import { formatPrice } from '@/shared/utils/currency'
import type { GiftWithOwner } from '../schemas/gifts.schema'

export function GroupGiftListItem({ gift }: { gift: GiftWithOwner }) {
  return (
    <li className="rounded-2xl border border-border bg-paper-raised p-5 transition hover:border-forest-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg leading-tight">{gift.title}</h3>
            <PriorityBadge priority={gift.priority} />
          </div>
          {gift.description && <p className="mt-1 text-sm text-ink-muted">{gift.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
            {formatPrice(gift.price) && <span className="font-medium text-ink">{formatPrice(gift.price)}</span>}
            {gift.url && (
              <a
                href={gift.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-raspberry hover:underline"
              >
                Ver link <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
        <Avatar name={gift.owner.name} avatarUrl={gift.owner.avatarUrl} size={24} />
        <span className="text-xs text-ink-muted">
          Da lista de <span className="font-medium text-ink">{gift.owner.name}</span>
        </span>
      </div>
    </li>
  )
}