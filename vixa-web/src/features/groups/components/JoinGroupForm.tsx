import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { joinGroupSchema, type JoinGroupInput } from '../schemas/groups.schema'
import { useJoinGroup } from '../hooks/useJoinGroup'
import { ApiError } from '../../../shared/api/httpClient'

export function JoinGroupForm({ onSuccess }: { onSuccess?: () => void }) {
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
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <input
          {...register('inviteCode')}
          placeholder="Código de convite"
          className="w-full rounded-lg border border-border bg-paper px-4 py-2 uppercase text-ink placeholder:text-ink-muted placeholder:normal-case"
        />
        {errors.inviteCode && <p className="mt-1 text-sm text-raspberry">{errors.inviteCode.message}</p>}
      </div>

      {joinGroup.isError && (
        <p className="text-sm text-raspberry">
          {joinGroup.error instanceof ApiError ? joinGroup.error.message : 'Código inválido'}
        </p>
      )}

      <button
        type="submit"
        disabled={joinGroup.isPending}
        className="rounded-lg border border-forest px-4 py-2 font-medium text-forest transition-colors hover:bg-forest hover:text-paper disabled:opacity-50"
      >
        {joinGroup.isPending ? 'Entrando...' : 'Entrar no grupo'}
      </button>
    </form>
  )
}