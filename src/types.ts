export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

export type Period = 'day' | 'week' | 'month'

export const CATEGORIES = [
  'Comida',
  'Transporte',
  'Hogar',
  'Salud',
  'Ocio',
  'Compras',
  'Servicios',
  'Otros',
] as const
