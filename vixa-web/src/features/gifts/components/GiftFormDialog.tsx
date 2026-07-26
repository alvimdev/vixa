import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGiftSchema, type CreateGiftInput, type GiftMine } from '@/features/gifts/schemas/gifts.schema'
import { useSetVisibility } from '@/features/gifts/hooks/useSetVisibility'
import { useCreateGift } from '@/features/gifts/hooks/useCreateGift'
import { useUpdateGift } from '@/features/gifts/hooks/useUpdateGift'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'

export function GiftFormDialog({
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