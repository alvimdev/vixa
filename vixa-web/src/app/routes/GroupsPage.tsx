import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, KeyRound, ShieldCheck, ChevronRight, Gift } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { useGroups } from '@/features/groups/hooks/useGroups'
import { useCreateGroup } from '@/features/groups/hooks/useCreateGroup'
import { useJoinGroup } from '@/features/groups/hooks/useJoinGroup'
import { createGroupSchema, joinGroupSchema, type CreateGroupInput, type JoinGroupInput } from '@/features/groups/schemas/groups.schema'
import { ApiError } from '@/shared/api/httpClient'

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
        <EmptyState onCreate={() => setCreateOpen(true)} onJoin={() => setJoinOpen(true)} />
      )}

      {items.length > 0 && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
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

function EmptyState({ onCreate, onJoin }: { onCreate: () => void; onJoin: () => void }) {
  return (
    <div className="mt-12 rounded-3xl border border-dashed border-border bg-paper-raised px-8 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-2xl">
        🎁
      </div>
      <h2 className="font-display text-2xl">Você ainda não está em nenhum grupo</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
        Crie um grupo para sua família ou turma, ou entre em um usando o código de convite que alguém te enviou.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={onCreate} className="bg-forest text-paper">
          <Plus className="mr-2 h-4 w-4" /> Criar grupo
        </Button>
        <Button onClick={onJoin} variant="outline" className="border-border bg-paper">
          <KeyRound className="mr-2 h-4 w-4" /> Entrar com código
        </Button>
      </div>
    </div>
  )
}

function CreateGroupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupSchema),
  })
  const createGroup = useCreateGroup()

  const onSubmit = (data: CreateGroupInput) => {
    createGroup.mutate(data, {
      onSuccess: () => {
        reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-paper-raised text-ink">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Criar grupo</DialogTitle>
          <DialogDescription className="text-ink-muted">
            Você vai receber um código de convite para compartilhar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nome do grupo</Label>
            <Input
              {...register('name')}
              className="mt-1 border-border bg-paper"
              placeholder="Amigos da faculdade"
            />
            {errors.name && <p className="mt-1 text-xs text-raspberry">{errors.name.message}</p>}
          </div>
          <div>
            <Label>Descrição (opcional)</Label>
            <Textarea
              {...register('description')}
              className="mt-1 border-border bg-paper"
              placeholder="Turma de 2016..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Cancelar
            </Button>
            <Button type="submit" disabled={createGroup.isPending} className="bg-forest text-paper">
              {createGroup.isPending ? 'Criando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function JoinGroupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JoinGroupInput>({
    resolver: zodResolver(joinGroupSchema),
  })
  const joinGroup = useJoinGroup()

  const onSubmit = (data: JoinGroupInput) => {
    joinGroup.mutate(
      { inviteCode: data.inviteCode.toUpperCase() },
      {
        onSuccess: () => {
          reset()
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-paper-raised text-ink">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Entrar com código</DialogTitle>
          <DialogDescription className="text-ink-muted">
            Peça o código de convite para alguém do grupo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Código</Label>
            <Input
              {...register('inviteCode')}
              className="mt-1 border-border bg-paper font-mono uppercase"
              placeholder="Código de entrada"
            />
            {errors.inviteCode && <p className="mt-1 text-xs text-raspberry">{errors.inviteCode.message}</p>}
          </div>
          {joinGroup.isError && (
            <p className="text-sm text-raspberry">
              {joinGroup.error instanceof ApiError ? joinGroup.error.message : 'Código inválido'}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Cancelar
            </Button>
            <Button type="submit" disabled={joinGroup.isPending} className="bg-forest text-paper">
              {joinGroup.isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}