import { useState } from 'react'
import { useMyGifts } from '../hooks/useMyGifts'
import { GiftCard } from './GiftCard'
import { GiftForm } from './GiftForm'
import { GiftVisibilityEditor } from './GiftVisibilityEditor'
import type { Gift } from '../schemas/gifts.schema'

export function MyGiftsSection() {
  const [showCreate, setShowCreate] = useState(false)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const [managingVisibilityId, setManagingVisibilityId] = useState<string | null>(null)
  const { data, fetchNextPage, hasNextPage, isLoading } = useMyGifts()

  const gifts = data?.pages.flat() ?? []

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Meus presentes</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-forest px-3 py-1.5 text-sm text-paper hover:bg-forest-soft"
        >
          {showCreate ? 'Fechar' : 'Adicionar'}
        </button>
      </div>

      {showCreate && (
        <div className="mt-3 rounded-xl border border-border bg-paper-raised p-5">
          <GiftForm onSuccess={() => setShowCreate(false)} />
        </div>
      )}

      {isLoading && <p className="mt-3 text-ink-muted">Carregando...</p>}

      {!isLoading && gifts.length === 0 && !showCreate && (
        <p className="mt-3 rounded-xl border border-dashed border-border p-8 text-center text-ink-muted">
          Sua lista está vazia. Adicione algo que você gostaria de ganhar.
        </p>
      )}

      <div className="mt-3 flex flex-col gap-3">
        {gifts.map((gift) =>
          editingGift?.id === gift.id ? (
            <div key={gift.id} className="rounded-xl border border-border bg-paper-raised p-5">
              <GiftForm gift={gift} onSuccess={() => setEditingGift(null)} />
              <button
                onClick={() => setEditingGift(null)}
                className="mt-2 text-sm text-ink-muted hover:underline"
              >
                Cancelar
              </button>
            </div>
          ) : managingVisibilityId === gift.id ? (
            <GiftVisibilityEditor
              key={gift.id}
              giftId={gift.id}
              currentGroupIds={gift.groupIds}
              onClose={() => setManagingVisibilityId(null)}
            />
          ) : (
            <div key={gift.id} className="flex flex-col gap-1">
              <GiftCard gift={gift} onEdit={() => setEditingGift(gift)} />
              <button
                onClick={() => setManagingVisibilityId(gift.id)}
                className="self-start text-xs text-forest hover:underline"
              >
                Gerenciar visibilidade
              </button>
            </div>
          )
        )}
      </div>

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} className="mt-3 text-sm text-forest hover:underline">
          Carregar mais
        </button>
      )}
    </div>
  )
}