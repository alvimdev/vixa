import { useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useUpdateName } from '../hooks/useUpdateName'

export function NameField({ currentName }: { currentName: string }) {
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
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} className="border-border bg-paper" />
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