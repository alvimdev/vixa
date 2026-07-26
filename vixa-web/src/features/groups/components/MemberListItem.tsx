import { useState } from 'react'
import { ShieldCheck, Cake, UserMinus } from 'lucide-react'
import { Avatar } from '@/shared/components/vixa/Avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { useKickMember } from '../hooks/useKickMember'
import { formatBirthdayLabel } from '@/shared/utils/date'
import type { GroupMemberItem } from '../schemas/groups.schema'

export function MemberListItem({
  member,
  groupId,
  canKick,
}: {
  member: GroupMemberItem
  groupId: string
  canKick: boolean
}) {
  const [confirming, setConfirming] = useState(false)
  const kickMember = useKickMember(groupId)

  return (
    <li className="flex items-center gap-3">
      <Avatar name={member.user.name} avatarUrl={member.user.avatarUrl} size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{member.user.name}</span>
          {member.role === 'ADMIN' && (
            <ShieldCheck className="h-3.5 w-3.5 text-forest" aria-label="Admin" />
          )}
        </div>
        {member.user.birthdate && (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
            <Cake className="h-3 w-3" /> {formatBirthdayLabel(member.user.birthdate)}
          </div>
        )}
      </div>

      {canKick && (
        <>
          <button
            onClick={() => setConfirming(true)}
            className="rounded-md p-1.5 text-ink-muted hover:bg-raspberry-soft hover:text-raspberry"
            aria-label={`Remover ${member.user.name}`}
          >
            <UserMinus className="h-4 w-4" />
          </button>

          <AlertDialog open={confirming} onOpenChange={setConfirming}>
            <AlertDialogContent className="border-border bg-paper-raised text-ink">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display">Remover {member.user.name}?</AlertDialogTitle>
                <AlertDialogDescription className="text-ink-muted">
                  A pessoa perde acesso ao grupo e precisa de um novo convite para entrar de novo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-border bg-paper">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => kickMember.mutate(member.user.id)}
                  className="bg-raspberry text-white hover:bg-raspberry/90"
                >
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </li>
  )
}