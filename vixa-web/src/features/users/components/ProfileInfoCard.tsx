import { AvatarUploader } from './AvatarUploader'
import { NameField } from './NameField'
import { BirthdateField } from './BirthdateField'

export function ProfileInfoCard({
  name,
  email,
  avatarUrl,
  birthdate,
}: {
  name: string
  email: string
  avatarUrl: string | null
  birthdate: string | null
}) {
  return (
    <section className="rounded-2xl border border-border bg-paper-raised p-7">
      <h2 className="font-display text-2xl">Dados pessoais</h2>

      <div className="mt-6">
        <AvatarUploader name={name} avatarUrl={avatarUrl} />
      </div>

      <div className="mt-8 divide-y divide-border">
        <NameField currentName={name} />
        <div className="flex items-center justify-between gap-4 py-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted">Email</div>
            <div className="mt-1 text-ink">{email}</div>
          </div>
          <span className="text-xs text-ink-muted">Somente leitura</span>
        </div>
        <BirthdateField currentBirthdate={birthdate} />
      </div>
    </section>
  )
}