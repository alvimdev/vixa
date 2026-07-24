import { useRef, useState } from 'react'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Check, ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Avatar } from '@/shared/components/vixa/Avatar'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { PriorityBadge } from '@/features/gifts/components/PriorityBadge'
import { useMyProfile } from '@/features/users/hooks/useMyProfile'
import { useUpdateName } from '@/features/users/hooks/useUpdateName'
import { useUpdateBirthdate } from '@/features/users/hooks/useUpdateBirthdate'
import { useUploadAvatar } from '@/features/users/hooks/useUploadAvatar'
import { useMyGifts } from '@/features/gifts/hooks/useMyGifts'
import { useCreateGift } from '@/features/gifts/hooks/useCreateGift'
import { useUpdateGift } from '@/features/gifts/hooks/useUpdateGift'
import { useDeleteGift } from '@/features/gifts/hooks/useDeleteGift'
import { useSetVisibility } from '@/features/gifts/hooks/useSetVisibility'
import { useGroups } from '@/features/groups/hooks/useGroups'
import { createGiftSchema, type CreateGiftInput, type GiftMine } from '@/features/gifts/schemas/gifts.schema'
import { formatPrice } from '@/shared/utils/currency'
import { toDateInputValue } from '@/shared/utils/date'

export function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile()

  if (isLoading) return <p className="text-ink-muted">Carregando...</p>
  if (!profile) return null

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-4xl">Meu perfil</h1>
        <p className="mt-2 text-ink-muted">Seus dados e sua wishlist geral.</p>
      </header>

      <ProfileInfo
        name={profile.name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
        birthdate={profile.birthdate}
      />
      <MyGiftsSection />
    </div>
  )
}

function ProfileInfo({
  name,
  email,
  avatarUrl,
  birthdate,
}: {
  name: string
  email: string
  avatarUrl: string | null
  birthdate: string | null
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const uploadAvatar = useUploadAvatar()

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    uploadAvatar.mutate(file, { onSettled: () => setPreview(null) })
  }

  return (
    <section className="rounded-2xl border border-border bg-paper-raised p-7">
      <h2 className="font-display text-2xl">Dados pessoais</h2>

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <div className="relative">
          <Avatar name={name} avatarUrl={preview ?? avatarUrl} size={80} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadAvatar.isPending}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-paper text-ink shadow-sm hover:bg-paper-raised"
            aria-label="Trocar foto"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFile} />
        </div>
        <div>
          <p className="text-sm font-medium">Foto de perfil</p>
          <p className="text-xs text-ink-muted">
            {uploadAvatar.isPending ? 'Enviando...' : 'Envie uma imagem.'}
          </p>
        </div>
      </div>

      <div className="mt-8 divide-y divide-border">
        <NameField currentName={name} />

        <div className="flex items-center justify-between gap-4 py-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted">Email</div>
            <div className="mt-1 text-ink">{email}</div>
          </div>
          <span className="text-xs text-ink-muted">Somente leitura</span>
        </div>

        <BirthdateField currentBirthdate={birthdate} />
      </div>
    </section>
  )
}

function NameField({ currentName }: { currentName: string }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(currentName)
  const updateName = useUpdateName()

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-4 py-4">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wider text-ink-muted">Nome</div>
          <div className="mt-1 text-ink">{currentName}</div>
        </div>
        <button
          onClick={() => {
            setDraft(currentName)
            setEditing(true)
          }}
          className="inline-flex items-center gap-1 text-sm text-raspberry hover:underline"
        >
          <Pencil className="h-3.5 w-3.5" /> Editar
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wider text-ink-muted">Nome</div>
        <div className="mt-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="border-border bg-paper"
          />
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          size="sm"
          onClick={() => updateName.mutate({ name: draft }, { onSuccess: () => setEditing(false) })}
          disabled={updateName.isPending}
          className="bg-forest text-paper"
        >
          <Check className="mr-1 h-4 w-4" /> Salvar
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="text-ink-muted">
          <X className="mr-1 h-4 w-4" /> Cancelar
        </Button>
      </div>
    </div>
  )
}

function BirthdateField({ currentBirthdate }: { currentBirthdate: string | null }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(toDateInputValue(currentBirthdate))
  const [error, setError] = useState<string | null>(null)
  const updateBirthdate = useUpdateBirthdate()

  const label = currentBirthdate
    ? new Date(currentBirthdate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Não informado'

  const save = () => {
    const today = new Date().toISOString().slice(0, 10)
    if (!draft || draft > today) {
      setError('A data não pode ser futura.')
      return
    }
    updateBirthdate.mutate({ birthdate: new Date(draft) }, { onSuccess: () => setEditing(false) })
  }

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-4 py-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-muted">Aniversário</div>
          <div className="mt-1 text-ink">{label}</div>
        </div>
        <button
          onClick={() => {
            setDraft(toDateInputValue(currentBirthdate))
            setError(null)
            setEditing(true)
          }}
          className="inline-flex items-center gap-1 text-sm text-raspberry hover:underline"
        >
          <Pencil className="h-3.5 w-3.5" /> {currentBirthdate ? 'Editar' : 'Adicionar'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wider text-ink-muted">Aniversário</div>
        <div className="mt-2 space-y-2">
          <Input
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="border-border bg-paper"
          />
          {error && <p className="text-xs text-raspberry">{error}</p>}
        </div>
      </div>
      <div className="flex gap-1">
        <Button size="sm" onClick={save} disabled={updateBirthdate.isPending} className="bg-forest text-paper">
          <Check className="mr-1 h-4 w-4" /> Salvar
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="text-ink-muted">
          <X className="mr-1 h-4 w-4" /> Cancelar
        </Button>
      </div>
    </div>
  )
}

function MyGiftsSection() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useMyGifts()
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<GiftMine | null>(null)
  const [toDelete, setToDelete] = useState<GiftMine | null>(null)
  const deleteGift = useDeleteGift()
  const { data: groupsData } = useGroups()
  const groups = (groupsData?.pages.flat() ?? []).map((item) => item.group)

  const gifts = data?.pages.flat() ?? []

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Meus presentes</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Sua wishlist geral. Você escolhe em quais grupos cada item aparece.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setOpenForm(true)
          }}
          className="bg-forest text-paper hover:bg-forest-soft"
        >
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
          <Button
            onClick={() => {
              setEditing(null)
              setOpenForm(true)
            }}
            className="mt-6 bg-forest text-paper"
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar presente
          </Button>
        </div>
      )}

      {gifts.length > 0 && (
        <>
          <ul className="mt-6 space-y-3">
            {gifts.map((g) => (
              <li key={g.id} className="rounded-2xl border border-border bg-paper-raised p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg leading-tight">{g.title}</h3>
                      <PriorityBadge priority={g.priority} />
                    </div>
                    {g.description && <p className="mt-1 text-sm text-ink-muted">{g.description}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
                      {formatPrice(g.price) && <span className="font-medium text-ink">{formatPrice(g.price)}</span>}
                      {g.url && (
                        <a href={g.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-raspberry hover:underline">
                          Ver link <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {g.groupIds.length === 0 ? (
                        <span className="rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-ink-muted">
                          Só na sua lista privada
                        </span>
                      ) : (
                        g.groupIds.map((gid) => {
                          const grp = groups.find((x) => x.id === gid)
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
                    <button
                      onClick={() => {
                        setEditing(g)
                        setOpenForm(true)
                      }}
                      className="rounded-md p-2 text-ink-muted hover:bg-paper hover:text-ink"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setToDelete(g)}
                      className="rounded-md p-2 text-ink-muted hover:bg-raspberry-soft hover:text-raspberry"
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
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

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="border-border bg-paper-raised text-ink">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Excluir presente?</AlertDialogTitle>
            <AlertDialogDescription className="text-ink-muted">
              "{toDelete?.title}" será removido da sua lista e não aparecerá mais em nenhum grupo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-paper">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) deleteGift.mutate(toDelete.id)
                setToDelete(null)
              }}
              className="bg-raspberry text-white hover:bg-raspberry/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

function GiftFormDialog({
  open,
  onOpenChange,
  gift,
  groups,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  gift: GiftMine | null
  groups: { id: string; name: string }[]
}) {
  const isEditing = Boolean(gift)
  const createGift = useCreateGift()
  const updateGift = useUpdateGift()
  const setVisibility = useSetVisibility()
  const isPending = createGift.isPending || updateGift.isPending || setVisibility.isPending


  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CreateGiftInput>({
    resolver: zodResolver(createGiftSchema) as Resolver<CreateGiftInput>,
    values: {
      title: gift?.title ?? '',
      description: gift?.description ?? '',
      url: gift?.url ?? '',
      price: gift?.price ? Number(gift.price) : undefined,
      priority: gift?.priority ?? 'NONE',
      groupIds: gift?.groupIds ?? [],
    },
  })

  const onSubmit = async (data: CreateGiftInput) => {
    const normalized = { ...data, url: data.url === '' ? undefined : data.url }

    if (isEditing && gift) {
      const { groupIds, ...updateData } = normalized
      await updateGift.mutateAsync({ id: gift.id, data: updateData })
      await setVisibility.mutateAsync({ id: gift.id, data: { groupIds } })
    } else {
      await createGift.mutateAsync(normalized)
    }
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-paper-raised text-ink sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{isEditing ? 'Editar presente' : 'Adicionar presente'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input {...register('title')} className="mt-1 border-border bg-paper" placeholder="Ex.: Livro Piranesi" />
            {errors.title && <p className="mt-1 text-xs text-raspberry">{errors.title.message}</p>}
          </div>
          <div>
            <Label>Descrição (opcional)</Label>
            <Textarea {...register('description')} className="mt-1 border-border bg-paper" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Link (opcional)</Label>
              <Input {...register('url')} className="mt-1 border-border bg-paper" placeholder="https://" />
              {errors.url && <p className="mt-1 text-xs text-raspberry">{errors.url.message}</p>}
            </div>
            <div>
              <Label>Preço (opcional)</Label>
              <Input type="number" step="0.01" min={0} {...register('price')} className="mt-1 border-border bg-paper" placeholder="0,00" />
              {errors.price && <p className="mt-1 text-xs text-raspberry">{errors.price.message}</p>}
            </div>
          </div>
          <div>
            <Label>Prioridade</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1 border-border bg-paper">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Nenhuma</SelectItem>
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MEDIUM">Média</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Visível em quais grupos</Label>
            <p className="mb-2 mt-1 text-xs text-ink-muted">
              Se nenhum for marcado, o presente fica só na sua lista privada.
            </p>
            <Controller
              name="groupIds"
              control={control}
              render={({ field }) => (
                <div className="space-y-2 rounded-lg border border-border bg-paper p-3">
                  {groups.length === 0 && (
                    <p className="text-sm text-ink-muted">Você ainda não faz parte de nenhum grupo.</p>
                  )}
                  {groups.map((g) => {
                    const current = field.value ?? []
                    const checked = current.includes(g.id)
                    return (
                      <label key={g.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-paper-raised">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() =>
                            field.onChange(checked ? current.filter((id: string) => id !== g.id) : [...current, g.id])
                          }
                          className="border-border data-[state=checked]:bg-forest data-[state=checked]:border-forest"
                        />
                        <span className="text-sm">{g.name}</span>
                      </label>
                    )
                  })}
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="bg-forest text-paper">
              {isPending ? 'Salvando...' : isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}