import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { Expense, Period } from './types'

export function periodInterval(period: Period, reference: Date) {
  switch (period) {
    case 'day':
      return { start: startOfDay(reference), end: endOfDay(reference) }
    case 'week':
      return {
        start: startOfWeek(reference, { weekStartsOn: 1 }),
        end: endOfWeek(reference, { weekStartsOn: 1 }),
      }
    case 'month':
      return { start: startOfMonth(reference), end: endOfMonth(reference) }
  }
}

export function periodLabel(period: Period, reference: Date) {
  const { start, end } = periodInterval(period, reference)
  if (period === 'day') return format(start, "EEEE d 'de' MMMM yyyy", { locale: es })
  if (period === 'month') return format(start, "MMMM 'de' yyyy", { locale: es })
  return `${format(start, 'd MMM', { locale: es })} – ${format(end, 'd MMM yyyy', { locale: es })}`
}

export function filterByPeriod(expenses: Expense[], period: Period, reference: Date) {
  const interval = periodInterval(period, reference)
  return expenses.filter((expense) =>
    isWithinInterval(new Date(`${expense.date}T12:00:00`), interval),
  )
}

export function total(expenses: Expense[]) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0)
}

export function totalsByCategory(expenses: Expense[]) {
  const map = new Map<string, number>()
  for (const expense of expenses) {
    map.set(expense.category, (map.get(expense.category) ?? 0) + expense.amount)
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function dailySeries(expenses: Expense[], period: Period, reference: Date) {
  const { start, end } = periodInterval(period, reference)
  return eachDayOfInterval({ start, end }).map((day) => {
    const key = format(day, 'yyyy-MM-dd')
    return {
      day: format(day, period === 'month' ? 'd' : 'EEE d', { locale: es }),
      amount: total(expenses.filter((expense) => expense.date === key)),
    }
  })
}

export function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function todayKey() {
  return format(new Date(), 'yyyy-MM-dd')
}
