export function toDateInputValue(isoDate: string | null): string {
  if (!isoDate) return ''
  return isoDate.slice(0, 10) // "2000-05-14T00:00:00.000Z" -> "2000-05-14"
}

export function formatBirthdayLabel(iso: string, withYear = false): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    ...(withYear ? { year: 'numeric' as const } : {}),
    timeZone: 'UTC', // essencial: sem isso, o browser converte pro fuso local e pode mudar o dia
  }).format(date)
}