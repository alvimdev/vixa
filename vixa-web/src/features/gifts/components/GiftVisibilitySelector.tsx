import { useState } from 'react'
import { useGroups } from '../../groups/hooks/useGroups'
import { useSetVisibility } from '../hooks/useSetVisibility'
import { GroupChipSelector } from './GroupChipSelector'

export function GiftVisibilityEditor({
  giftId,
  currentGroupIds,
  onClose,
}: {
  giftId: string
  currentGroupIds: string[]
  onClose: () => void
}) {
  const [selected, setSelected] = useState<string[]>(currentGroupIds)
  const { data: groupsData } = useGroups()
  const groups = (groupsData?.pages.flat() ?? []).map((item) => item.group)
  const setVisibility = useSetVisibility()

  const toggle = (groupId: string) => {
    setSelected((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    )
  }

  return (
    <div className="rounded-xl border border-border bg-paper-raised p-5">
      <p className="mb-3 text-sm font-medium text-ink">Visível nos grupos</p>
      <GroupChipSelector groups={groups} selected={selected} onToggle={toggle} />
      <div className="mt-3 flex gap-2">
        <button
          onClick={() =>
            setVisibility.mutate({ id: giftId, data: { groupIds: selected } }, { onSuccess: onClose })
          }
          disabled={setVisibility.isPending}
          className="rounded-lg bg-forest px-3 py-1.5 text-sm text-paper disabled:opacity-50"
        >
          Salvar
        </button>
        <button onClick={onClose} className="rounded-lg border border-border px-3 py-1.5 text-sm text-ink-muted">
          Cancelar
        </button>
      </div>
    </div>
  )
}