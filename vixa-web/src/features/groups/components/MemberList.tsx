import { useGroupMembers } from '../hooks/useGroupMembers'
import { MemberListItem } from './MemberListItem'

export function MemberList({ groupId, isAdmin, currentUserId }: { groupId: string; isAdmin: boolean; currentUserId: string | undefined }) {
  const { data, fetchNextPage, hasNextPage } = useGroupMembers(groupId)
  const members = data?.pages.flat() ?? []

  return (
    <section className="rounded-2xl border border-border bg-paper-raised p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg">Membros</h2>
        <span className="text-xs text-ink-muted">{members.length}</span>
      </div>
      <ul className="mt-4 space-y-3">
        {members.map((m) => (
          <MemberListItem key={m.id} member={m} groupId={groupId} canKick={isAdmin && m.user.id !== currentUserId} />
        ))}
      </ul>
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="mt-4 w-full text-center text-xs font-medium text-raspberry hover:underline"
        >
          Carregar mais membros
        </button>
      )}
    </section>
  )
}