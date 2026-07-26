import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useUpdateGroup } from '../hooks/useUpdateGroup'
import { updateGroupSchema, type UpdateGroupInput } from '../schemas/groups.schema'
import { useState } from 'react'

export function EditGroupDialog({
  groupId,
  currentName,
  currentDescription,
}: {
  groupId: string
  currentName: string
  currentDescription: string | null
}) {
  const [open, setOpen] = useState(false)
  const updateGroup = useUpdateGroup(groupId)

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateGroupInput>({
    resolver: zodResolver(updateGroupSchema),
    values: { name: currentName, description: currentDescription ?? '' },
  })

  const onSubmit = (data: UpdateGroupInput) => {
    updateGroup.mutate(data, { onSuccess: () => setOpen(false) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md p-1.5 text-ink-muted hover:bg-paper-raised hover:text-forest"
        aria-label="Editar grupo"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <DialogContent className="border-border bg-paper-raised text-ink">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Editar grupo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nome do grupo</Label>
            <Input {...register('name')} className="mt-1 border-border bg-paper" />
            {errors.name && <p className="mt-1 text-xs text-raspberry">{errors.name.message}</p>}
          </div>
          <div>
            <Label>Descrição (opcional)</Label>
            <Textarea {...register('description')} className="mt-1 border-border bg-paper" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-border">
              Cancelar
            </Button>
            <Button type="submit" disabled={updateGroup.isPending} className="bg-forest text-paper">
              {updateGroup.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}