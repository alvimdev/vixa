import { useMyProfile } from '@/features/users/hooks/useMyProfile'
import { ProfileInfoCard } from '@/features/users/components/ProfileInfoCard'
import { MyGiftsSection } from '@/features/gifts/components/MyGiftsSection'

export function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile()

  if (isLoading) return <p className="text-ink-muted">Carregando...</p>
  if (!profile) return null

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-4xl">Meu perfil</h1>
        <p className="mt-2 text-ink-muted">Seus dados e sua wishlist geral.</p>
      </header>

      <ProfileInfoCard
        name={profile.name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
        birthdate={profile.birthdate}
      />
      <MyGiftsSection />
    </div>
  )
}