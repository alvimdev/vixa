export function formatPrice(price: string | null): string | null {
  if (!price) return null
  const value = Number(price)
  if (Number.isNaN(value)) return null
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}