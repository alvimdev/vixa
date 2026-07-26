import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { useJoinGroup } from '../hooks/useJoinGroup'
import { joinGroupSchema, type JoinGroupInput } from '../schemas/groups.schema'
import { ApiError } from '@/shared/api/httpClient'

export function JoinGroupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
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
              placeholder="VIXA-XXXXXX"
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