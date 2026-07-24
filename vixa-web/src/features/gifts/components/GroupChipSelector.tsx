interface GroupOption {
  id: string
  name: string
}

export function GroupChipSelector({
  groups,
  selected,
  onToggle,
}: {
  groups: GroupOption[]
  selected: string[]
  onToggle: (groupId: string) => void
}) {
  if (groups.length === 0) {
    return <p className="text-sm text-ink-muted">Você ainda não faz parte de nenhum grupo.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {groups.map((group) => {
        const active = selected.includes(group.id)
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => onToggle(group.id)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              active
                ? 'border-raspberry bg-raspberry-soft text-raspberry'
                : 'border-border bg-paper text-ink-muted hover:border-raspberry hover:text-ink'
            }`}
          >
            {group.name}
          </button>
        )
      })}
    </div>
  )
}