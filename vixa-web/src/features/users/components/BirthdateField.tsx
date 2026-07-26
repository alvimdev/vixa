import { useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useUpdateBirthdate } from '../hooks/useUpdateBirthdate'
import { formatBirthdayLabel, toDateInputValue } from '@/shared/utils/date'

export function BirthdateField({ currentBirthdate }: { currentBirthdate: string | null }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(toDateInputValue(currentBirthdate))
  const [error, setError] = useState<string | null>(null)
  const updateBirthdate = useUpdateBirthdate()

  const label = currentBirthdate ? formatBirthdayLabel(currentBirthdate, true) : 'Não informado'

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