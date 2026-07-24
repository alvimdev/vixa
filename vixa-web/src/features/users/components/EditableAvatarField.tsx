import { useRef, useState } from 'react'
import { useUploadAvatar } from '../hooks/useUploadAvatar'

export function EditableAvatarField({
  currentAvatarUrl,
  fallbackLabel,
}: {
  currentAvatarUrl: string | null
  fallbackLabel: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const uploadAvatar = useUploadAvatar()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file)) // feedback visual imediato, antes do upload terminar
    uploadAvatar.mutate(file, {
      onSettled: () => setPreview(null), // depois do upload, volta a usar a URL real do servidor
    })
  }

  const displayUrl = preview ?? currentAvatarUrl

  return (
    <div className="flex flex-col items-center gap-3">
      {displayUrl ? (
        <img src={displayUrl} alt="" className="h-24 w-24 rounded-full object-cover" />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-forest font-display text-3xl text-paper">
          {fallbackLabel[0]?.toUpperCase()}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploadAvatar.isPending}
        className="text-sm text-forest hover:underline disabled:opacity-50"
      >
        {uploadAvatar.isPending ? 'Enviando...' : 'Trocar foto'}
      </button>

      {uploadAvatar.isError && (
        <p className="text-xs text-raspberry">Erro ao enviar imagem. Tente outro arquivo.</p>
      )}
    </div>
  )
}