import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useMyGifts } from '../hooks/useMyGifts'
import { useGroups } from '../../groups/hooks/useGroups'
import { MyGiftListItem } from './MyGiftListItem'
import { GiftFormDialog } from './GiftFormDialog'
import { DeleteGiftDialog } from './DeleteGiftDialog'
import type { GiftMine } from '../schemas/gifts.schema'

export function MyGiftsSection() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useMyGifts()
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<GiftMine | null>(null)
  const [toDelete, setToDelete] = useState<GiftMine | null>(null)
  const { data: groupsData } = useGroups()
  const groups = (groupsData?.pages.flat() ?? []).map((item) => item.group)

  const gifts = data?.pages.flat() ?? []

  const openCreate = () => {
    setEditing(null)
    setOpenForm(true)
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Meus presentes</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Sua wishlist geral. Você escolhe em quais grupos cada item aparece.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-forest text-paper hover:bg-forest-soft">
          <Plus className="mr-2 h-4 w-4" /> Adicionar presente
        </Button>
      </div>

      {!isLoading && gifts.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-paper-raised px-8 py-14 text-center">
          <div className="text-3xl">🎁</div>
          <h3 className="mt-3 font-display text-xl">Sua lista está vazia</h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-muted">
            Adicione o primeiro presente que você gostaria de ganhar.
          </p>
          <Button onClick={openCreate} className="mt-6 bg-forest text-paper">
            <Plus className="mr-2 h-4 w-4" /> Adicionar presente
          </Button>
        </div>
      )}

      {gifts.length > 0 && (
        <>
          <ul className="mt-6 space-y-3">
            {gifts.map((g) => (
              <MyGiftListItem
                key={g.id}
                gift={g}
                groupNames={groups}
                onEdit={() => {
                  setEditing(g)
                  setOpenForm(true)
                }}
                onDelete={() => setToDelete(g)}
              />
            ))}
          </ul>
          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={() => fetchNextPage()} className="border-border bg-paper-raised">
                Carregar mais
              </Button>
            </div>
          )}
        </>
      )}

      <GiftFormDialog open={openForm} onOpenChange={setOpenForm} gift={editing} groups={groups} />
      <DeleteGiftDialog gift={toDelete} onClose={() => setToDelete(null)} />
    </section>
  )
}