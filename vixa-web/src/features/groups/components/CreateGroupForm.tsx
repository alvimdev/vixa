import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGroupSchema, type CreateGroupInput } from '../schemas/groups.schema'
import { useCreateGroup } from '../hooks/useCreateGroup'

export function CreateGroupForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupSchema),
  })
  const createGroup = useCreateGroup()

  const onSubmit = (data: CreateGroupInput) => {
    createGroup.mutate(data, {
      onSuccess: () => {
        reset()
        onSuccess?.()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <input
          {...register('name')}
          placeholder="Nome do grupo"
          className="w-full rounded-lg border border-border bg-paper px-4 py-2 text-ink placeholder:text-ink-muted"
        />
        {errors.name && <p className="mt-1 text-sm text-raspberry">{errors.name.message}</p>}
      </div>

      <textarea
        {...register('description')}
        placeholder="Descrição (opcional)"
        rows={2}
        className="w-full rounded-lg border border-border bg-paper px-4 py-2 text-ink placeholder:text-ink-muted"
      />

      <button
        type="submit"
        disabled={createGroup.isPending}
        className="rounded-lg bg-forest px-4 py-2 font-medium text-paper transition-colors hover:bg-forest-soft disabled:opacity-50"
      >
        {createGroup.isPending ? 'Criando...' : 'Criar grupo'}
      </button>
    </form>
  )
}