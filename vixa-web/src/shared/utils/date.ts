export function toDateInputValue(isoDate: string | null): string {
  if (!isoDate) return ''
  return isoDate.slice(0, 10) // "2000-05-14T00:00:00.000Z" -> "2000-05-14"
}