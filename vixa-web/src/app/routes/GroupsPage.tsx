import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Plus, KeyRound } from 'lucide-react'
import { useGroups } from '@/features/groups/hooks/useGroups'
import { GroupCard } from '@/features/groups/components/GroupCard'
import { EmptyGroupsState } from '@/features/groups/components/EmptyGroupsState'
import { CreateGroupDialog } from '@/features/groups/components/CreateGroupDialog'
import { JoinGroupDialog } from '@/features/groups/components/JoinGroupDialog'

export function GroupsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false) 
  const { data, fetchNextPage, hasNextPage, isLoading } = useGroups()

  const items = data?.pages.flat() ?? []

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl">Meus grupos</h1>
          <p className="mt-2 text-ink-muted">Onde sua lista aparece para as pessoas certas.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setJoinOpen(true)}
            variant="outline"
            className="border-border bg-paper-raised text-ink hover:bg-paper-raised"
          >
            <KeyRound className="mr-2 h-4 w-4" /> Entrar com código
          </Button>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-forest text-paper hover:bg-forest-soft"
          >
            <Plus className="mr-2 h-4 w-4" /> Criar grupo
          </Button>
        </div>
      </div>

      {!isLoading && items.length === 0 && (
        <EmptyGroupsState onCreate={() => setCreateOpen(true)} onJoin={() => setJoinOpen(true)} />
      )}

      {items.length > 0 && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <GroupCard key={item.id} item={item} />
            ))}
          </div>
          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                className="border-border bg-paper-raised"
              >
                Carregar mais
              </Button>
            </div>
          )}
        </>
      )}

      <CreateGroupDialog open={createOpen} onOpenChange={setCreateOpen} />
      <JoinGroupDialog open={joinOpen} onOpenChange={setJoinOpen} />
    </div>
  )
}