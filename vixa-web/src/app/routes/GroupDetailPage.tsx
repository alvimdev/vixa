import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useGroup } from '@/features/groups/hooks/useGroup'
import { useGroupMembers } from '@/features/groups/hooks/useGroupMembers'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { InviteCodeCard } from '@/features/groups/components/InviteCodeCard'
import { MemberList } from '@/features/groups/components/MemberList'
import { GroupGiftList } from '@/features/gifts/components/GroupGiftList'
import { EditGroupDialog } from '@/features/groups/components/EditGroupDialog'
import { LeaveGroupButton } from '@/features/groups/components/LeaveGroupButton'

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: group, isLoading: loadingGroup } = useGroup(id!)
  const { data: membersData } = useGroupMembers(id!)
  const { data: currentUser } = useCurrentUser()

  const members = membersData?.pages.flat() ?? []
  const isAdmin = members.some((m) => m.user.id === currentUser?.user.id && m.role === 'ADMIN')

  if (loadingGroup) return <p className="text-ink-muted">Carregando...</p>
  if (!group) return null

  return (
    <div>
      <Link
        to="/groups"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Meus grupos
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl">{group.name}</h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2.5 py-1 text-xs font-medium text-forest">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </span>
            )}
            {isAdmin && (
              <EditGroupDialog groupId={group.id} currentName={group.name} currentDescription={group.description} />
            )}
          </div>
          {group.description && (
            <p className="mt-2 max-w-xl text-ink-muted">{group.description}</p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <aside className="space-y-6 lg:col-span-1">
          <InviteCodeCard groupId={group.id} inviteCode={group.inviteCode} isAdmin={isAdmin} />
          <MemberList groupId={group.id} isAdmin={isAdmin} currentUserId={currentUser?.user.id} />
          <LeaveGroupButton groupId={group.id} groupName={group.name} />
        </aside>

        <section className="lg:col-span-2">
          <GroupGiftList groupId={group.id} />
        </section>
      </div>
    </div>
  )
}