import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Cake, Check, Copy, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Avatar } from '@/shared/components/vixa/Avatar'
import { PriorityBadge } from '@/features/gifts/components/PriorityBadge'
import { useGroup } from '@/features/groups/hooks/useGroup'
import { useGroupMembers } from '@/features/groups/hooks/useGroupMembers'
import { useGroupGifts } from '@/features/gifts/hooks/useGroupGifts'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useRegenerateInviteCode } from '@/features/groups/hooks/useRegenerateInviteCode'
import { formatPrice } from '@/shared/utils/currency'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
function formatBirthday(iso: string) {
  const d = new Date(iso)
  return `${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]}`
}

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [copied, setCopied] = useState(false)

  // hooks sempre no topo, antes de qualquer return condicional
  const { data: group, isLoading: loadingGroup } = useGroup(id!)
  const { data: membersData, fetchNextPage: fetchNextMembers, hasNextPage: hasNextMembers } = useGroupMembers(id!)
  const { data: giftsData, fetchNextPage: fetchNextGifts, hasNextPage: hasNextGifts } = useGroupGifts(id!)
  const { data: currentUser } = useCurrentUser()
  const regenerate = useRegenerateInviteCode(id!)

  const members = membersData?.pages.flat() ?? []
  const gifts = giftsData?.pages.flat() ?? []
  const isAdmin = members.some((m) => m.user.id === currentUser?.user.id && m.role === 'ADMIN')

  if (loadingGroup) return <p className="text-ink-muted">Carregando...</p>
  if (!group) return null

  const copy = async () => {
    await navigator.clipboard.writeText(group.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

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
          </div>
          {group.description && (
            <p className="mt-2 max-w-xl text-ink-muted">{group.description}</p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <aside className="space-y-6 lg:col-span-1">
          <section className="rounded-2xl border border-border bg-paper-raised p-5">
            <h2 className="font-display text-lg">Código de convite</h2>
            <p className="mt-1 text-xs text-ink-muted">Compartilhe com quem você quer no grupo.</p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-paper px-3 py-2.5">
              <code className="flex-1 font-mono text-sm tracking-wider text-ink">
                {group.inviteCode}
              </code>
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

          <section className="rounded-2xl border border-border bg-paper-raised p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-lg">Membros</h2>
              <span className="text-xs text-ink-muted">{members.length}</span>
            </div>
            <ul className="mt-4 space-y-3">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <Avatar name={m.user.name} avatarUrl={m.user.avatarUrl} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{m.user.name}</span>
                      {m.role === 'ADMIN' && (
                        <ShieldCheck className="h-3.5 w-3.5 text-forest" aria-label="Admin" />
                      )}
                    </div>
                    {m.user.birthdate && (
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                        <Cake className="h-3 w-3" /> {formatBirthday(m.user.birthdate)}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {hasNextMembers && (
              <button
                onClick={() => fetchNextMembers()}
                className="mt-4 w-full text-center text-xs font-medium text-raspberry hover:underline"
              >
                Carregar mais membros
              </button>
            )}
          </section>
        </aside>

        <section className="lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Presentes visíveis neste grupo</h2>
            <span className="text-xs text-ink-muted">{gifts.length} itens</span>
          </div>

          {gifts.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-paper-raised px-6 py-14 text-center">
              <div className="text-3xl">🎁</div>
              <h3 className="mt-3 font-display text-xl">Nada por aqui ainda</h3>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-muted">
                Quando alguém do grupo adicionar um presente visível aqui, ele aparece nesta lista.
              </p>
            </div>
          ) : (
            <>
              <ul className="mt-5 space-y-3">
                {gifts.map((gift) => (
                  <li
                    key={gift.id}
                    className="rounded-2xl border border-border bg-paper-raised p-5 transition hover:border-forest-soft"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg leading-tight">{gift.title}</h3>
                          <PriorityBadge priority={gift.priority} />
                        </div>
                        {gift.description && (
                          <p className="mt-1 text-sm text-ink-muted">{gift.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
                          {formatPrice(gift.price) && (
                            <span className="font-medium text-ink">{formatPrice(gift.price)}</span>
                          )}
                          {gift.url && (
                            <a
                              href={gift.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-raspberry hover:underline"
                            >
                              Ver link <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                      <Avatar name={gift.owner.name} avatarUrl={gift.owner.avatarUrl} size={24} />
                      <span className="text-xs text-ink-muted">
                        Da lista de <span className="font-medium text-ink">{gift.owner.name}</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              {hasNextGifts && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextGifts()}
                    className="border-border bg-paper-raised"
                  >
                    Carregar mais presentes
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}