import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateNameSchema, type UpdateNameInput } from '../schemas/users.schema'
import { useUpdateName } from '../hooks/useUpdateName'

export function EditableNameField({ currentName }: { currentName: string }) {
  const [editing, setEditing] = useState(false)
  const { register, handleSubmit } = useForm<UpdateNameInput>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: currentName },
  })
  const updateName = useUpdateName()

  if (!editing) {
    return (
      <div className="flex items-center justify-between">
        <p className="font-display text-xl font-semibold text-ink">{currentName}</p>
        <button onClick={() => setEditing(true)} className="text-sm text-forest hover:underline">
          Editar
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit((data) =>
        updateName.mutate(data, { onSuccess: () => setEditing(false) })
      )}
      className="flex gap-2"
    >
      <input
        {...register('name')}
        autoFocus
        className="flex-1 rounded-lg border border-border bg-paper px-3 py-1.5 text-ink"
      />
      <button
        type="submit"
        disabled={updateName.isPending}
        className="rounded-lg bg-forest px-3 py-1.5 text-sm text-paper disabled:opacity-50"
      >
        Salvar
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="rounded-lg border border-border px-3 py-1.5 text-sm text-ink-muted"
      >
        Cancelar
      </button>
    </form>
  )
}