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
import { useDeleteGift } from '../hooks/useDeleteGift'
import type { GiftMine } from '../schemas/gifts.schema'

export function DeleteGiftDialog({ gift, onClose }: { gift: GiftMine | null; onClose: () => void }) {
  const deleteGift = useDeleteGift()

  return (
    <AlertDialog open={!!gift} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="border-border bg-paper-raised text-ink">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">Excluir presente?</AlertDialogTitle>
          <AlertDialogDescription className="text-ink-muted">
            "{gift?.title}" será removido da sua lista e não aparecerá mais em nenhum grupo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border bg-paper">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (gift) deleteGift.mutate(gift.id)
              onClose()
            }}
            className="bg-raspberry text-white hover:bg-raspberry/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}