import type { GroupMemberItem } from '../schemas/groups.schema'

function formatBirthdate(birthdate: string | null): string | null {
  if (!birthdate) return null
  const date = new Date(birthdate)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
}

export function MemberRow({ member }: { member: GroupMemberItem }) {
  const birthdateLabel = formatBirthdate(member.user.birthdate)

  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest font-display text-paper">
        {member.user.name[0]?.toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{member.user.name}</p>
        {birthdateLabel && <p className="text-sm text-ink-muted">🎂 {birthdateLabel}</p>}
      </div>
      {member.role === 'ADMIN' && (
        <span className="shrink-0 rounded-full bg-raspberry-soft px-2.5 py-1 text-xs font-medium text-raspberry">
          Admin
        </span>
      )}
    </div>
  )
}