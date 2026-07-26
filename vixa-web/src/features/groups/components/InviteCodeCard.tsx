import { useState } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useRegenerateInviteCode } from '../hooks/useRegenerateInviteCode'

export function InviteCodeCard({
  groupId,
  inviteCode,
  isAdmin,
}: {
  groupId: string
  inviteCode: string
  isAdmin: boolean
}) {
  const [copied, setCopied] = useState(false)
  const regenerate = useRegenerateInviteCode(groupId)

  const copy = async () => {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section className="rounded-2xl border border-border bg-paper-raised p-5">
      <h2 className="font-display text-lg">Código de convite</h2>
      <p className="mt-1 text-xs text-ink-muted">Compartilhe com quem você quer no grupo.</p>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-paper px-3 py-2.5">
        <code className="flex-1 font-mono text-sm tracking-wider text-ink">{inviteCode}</code>
        <button
          onClick={copy}
          className="rounded-md p-1.5 text-ink-muted hover:bg-paper-raised hover:text-forest"
          aria-label="Copiar código"
        >
          {copied ? <Check className="h-4 w-4 text-forest" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      {isAdmin && (
        <Button
          onClick={() => regenerate.mutate()}
          disabled={regenerate.isPending}
          variant="outline"
          className="mt-3 w-full border-border bg-paper"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> {regenerate.isPending ? 'Gerando...' : 'Gerar novo código'}
        </Button>
      )}
    </section>
  )
}