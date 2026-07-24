import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateBirthdateSchema, type UpdateBirthdateInput } from '../schemas/users.schema'
import { useUpdateBirthdate } from '../hooks/useUpdateBirthdate'
import { toDateInputValue } from '@/shared/utils/date'

export function EditableBirthdateField({ currentBirthdate }: { currentBirthdate: string | null }) {
  const [editing, setEditing] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateBirthdateInput>({
    resolver: zodResolver(updateBirthdateSchema),
  })
  const updateBirthdate = useUpdateBirthdate()

  const label = currentBirthdate
    ? new Date(currentBirthdate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
    : 'Não informado'

  if (!editing) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-muted">Aniversário</p>
          <p className="text-ink">🎂 {label}</p>
        </div>
        <button onClick={() => setEditing(true)} className="text-sm text-forest hover:underline">
          {currentBirthdate ? 'Editar' : 'Adicionar'}
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit((data) =>
        updateBirthdate.mutate(data, { onSuccess: () => setEditing(false) })
      )}
      className="flex flex-col gap-2"
    >
      <input
        type="date"
        defaultValue={toDateInputValue(currentBirthdate)}
        {...register('birthdate')}
        max={toDateInputValue(new Date().toISOString())}
        className="w-full rounded-lg border border-border bg-paper px-3 py-1.5 text-ink"
      />
      {errors.birthdate && <p className="text-xs text-raspberry">{errors.birthdate.message}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={updateBirthdate.isPending}
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
      </div>
    </form>
  )
}