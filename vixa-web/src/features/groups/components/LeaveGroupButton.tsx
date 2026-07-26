import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
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
import { useLeaveGroup } from '../hooks/useLeaveGroup'

export function LeaveGroupButton({ groupId, groupName }: { groupId: string; groupName: string }) {
  const [confirming, setConfirming] = useState(false)
  const leaveGroup = useLeaveGroup()
  const navigate = useNavigate()

  return (
    <>
      <Button
        onClick={() => setConfirming(true)}
        variant="outline"
        className="w-full border-border bg-paper text-raspberry hover:bg-raspberry-soft"
      >
        <LogOut className="mr-2 h-4 w-4" /> Sair do grupo
      </Button>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent className="border-border bg-paper-raised text-ink">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Sair de {groupName}?</AlertDialogTitle>
            <AlertDialogDescription className="text-ink-muted">
              Você deixa de ver os presentes e membros deste grupo. Alguém precisa te convidar de novo caso mude de ideia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-paper">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => leaveGroup.mutate(groupId, { onSuccess: () => navigate('/groups') })}
              className="bg-raspberry text-white hover:bg-raspberry/90"
            >
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}