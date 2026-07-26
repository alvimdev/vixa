import { useMemo, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useGroupGifts } from '../hooks/useGroupGifts'
import { GroupGiftListItem } from './GroupGiftListItem'

export function GroupGiftList({ groupId }: { groupId: string }) {
  const { data, fetchNextPage, hasNextPage } = useGroupGifts(groupId)
  const [ownerFilter, setOwnerFilter] = useState<string>('all')

  const gifts = data?.pages.flat() ?? []

  const owners = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>()
    for (const gift of gifts) map.set(gift.owner.id, gift.owner)
    return Array.from(map.values())
  }, [gifts])

  const filteredGifts = ownerFilter === 'all' ? gifts : gifts.filter((g) => g.owner.id === ownerFilter)

  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl">Presentes visíveis neste grupo</h2>
        <span className="text-xs text-ink-muted">{filteredGifts.length} itens</span>
      </div>

      {owners.length > 1 && (
        <Tabs value={ownerFilter} onValueChange={setOwnerFilter} className="mt-4">
          <TabsList className="flex-wrap bg-paper-raised">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-forest data-[state=active]:text-paper"
            >
              Todos
            </TabsTrigger>
            {owners.map((owner) => (
              <TabsTrigger
                key={owner.id}
                value={owner.id}
                className="data-[state=active]:bg-forest data-[state=active]:text-paper"
              >
                {owner.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {filteredGifts.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-paper-raised px-6 py-14 text-center">
          <div className="text-3xl">🎁</div>
          <h3 className="mt-3 font-display text-xl">Nada por aqui ainda</h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-muted">
            Quando alguém do grupo adicionar um presente visível aqui, ele aparece nesta lista.
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-5 space-y-3">
            {filteredGifts.map((gift) => (
              <GroupGiftListItem key={gift.id} gift={gift} />
            ))}
          </ul>
          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                className="border-border bg-paper-raised"
              >
                Carregar mais presentes
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  )
}