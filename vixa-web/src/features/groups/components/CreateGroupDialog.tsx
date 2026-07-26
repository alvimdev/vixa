import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useCreateGroup } from '../hooks/useCreateGroup'
import { createGroupSchema, type CreateGroupInput } from '../schemas/groups.schema'

export function CreateGroupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
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