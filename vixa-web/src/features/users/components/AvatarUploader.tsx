import { useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { Avatar } from '@/shared/components/vixa/Avatar'
import { useUploadAvatar } from '../hooks/useUploadAvatar'

export function AvatarUploader({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const uploadAvatar = useUploadAvatar()

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    uploadAvatar.mutate(file, { onSettled: () => setPreview(null) })
  }

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative">
        <Avatar name={name} avatarUrl={preview ?? avatarUrl} size={80} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploadAvatar.isPending}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-paper text-ink shadow-sm hover:bg-paper-raised"
          aria-label="Trocar foto"
        >
          <Camera className="h-4 w-4" />
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFile} />
      </div>
      <div>
        <p className="text-sm font-medium">Foto de perfil</p>
        <p className="text-xs text-ink-muted">
          {uploadAvatar.isPending ? 'Enviando...' : 'Envie uma imagem. Se estiver vazio, usamos sua inicial.'}
        </p>
      </div>
    </div>
  )
}