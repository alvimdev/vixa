import { useState } from 'react'
import { useRegenerateInviteCode } from '../hooks/useRegenerateInviteCode'

export function InviteCodeCard({ groupId, inviteCode, isAdmin }: {
  groupId: string
  inviteCode: string
  isAdmin: boolean
}) {
  const [copied, setCopied] = useState(false)
  const regenerate = useRegenerateInviteCode(groupId)

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-border bg-paper-raised p-5">
      <p className="mb-2 text-sm text-ink-muted">Código de convite</p>
      <div className="flex items-center gap-2">
        <span className="font-display text-2xl font-semibold tracking-wider text-forest">
          {inviteCode}
        </span>
        <button
          onClick={handleCopy}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-ink hover:bg-paper"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>

      {isAdmin && (
        <button
          onClick={() => regenerate.mutate()}
          disabled={regenerate.isPending}
          className="mt-3 text-sm text-raspberry hover:underline disabled:opacity-50"
        >
          {regenerate.isPending ? 'Gerando...' : 'Gerar novo código'}
        </button>
      )}
    </div>
  )
}