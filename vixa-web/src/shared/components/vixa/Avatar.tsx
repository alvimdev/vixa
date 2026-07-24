export function Avatar({
  name,
  avatarUrl,
  size = 36,
}: {
  name: string
  avatarUrl?: string | null
  size?: number
}) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() ?? '?'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-forest)] font-semibold text-[color:var(--color-paper)]"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </div>
  )
}