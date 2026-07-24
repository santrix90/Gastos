import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Expense } from '../types'
import { formatCurrency } from '../utils'

type Props = {
  expenses: Expense[]
  currency: string
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, currency, onEdit, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center text-sm text-neutral-400">
        No hay gastos en este periodo.
      </p>
    )
  }

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {sorted.map((expense) => (
        <li key={expense.id} className="group flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {expense.description || expense.category}
            </p>
            <p className="text-xs text-neutral-400">
              {expense.category} ·{' '}
              {format(new Date(`${expense.date}T12:00:00`), "d MMM yyyy", { locale: es })}
            </p>
          </div>
          <span className="text-sm font-semibold tabular-nums">
            {formatCurrency(expense.amount, currency)}
          </span>
          <div className="flex gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            <button
              onClick={() => onEdit(expense)}
              className="rounded-md px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
