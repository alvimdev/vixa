import { Plus, KeyRound } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export function EmptyGroupsState({ onCreate, onJoin }: { onCreate: () => void; onJoin: () => void }) {
  return (
    <div className="mt-12 rounded-3xl border border-dashed border-border bg-paper-raised px-8 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-2xl">
        🎁
      </div>
      <h2 className="font-display text-2xl">Você ainda não está em nenhum grupo</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
        Crie um grupo para sua família ou turma, ou entre em um usando o código de convite que alguém te enviou.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={onCreate} className="bg-forest text-paper">
          <Plus className="mr-2 h-4 w-4" /> Criar grupo
        </Button>
        <Button onClick={onJoin} variant="outline" className="border-border bg-paper">
          <KeyRound className="mr-2 h-4 w-4" /> Entrar com código
        </Button>
      </div>
    </div>
  )
}