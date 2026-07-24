import { useEffect, useState } from 'react'
import { CATEGORIES } from '../types'
import type { Expense } from '../types'
import { todayKey } from '../utils'

type Props = {
  onSubmit: (expense: Omit<Expense, 'id'>) => void
  editing: Expense | null
  onCancelEdit: () => void
}

const emptyForm = {
  amount: '',
  category: CATEGORIES[0] as string,
  description: '',
  date: todayKey(),
}

export function ExpenseForm({ onSubmit, editing, onCancelEdit }: Props) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editing) {
      setForm({
        amount: String(editing.amount),
        category: editing.category,
        description: editing.description,
        date: editing.date,
      })
    } else {
      setForm({ ...emptyForm, date: todayKey() })
    }
  }, [editing])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const amount = Number(form.amount.replace(',', '.'))
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Introduce un importe mayor que 0')
      return
    }
    setError('')
    onSubmit({
      amount,
      category: form.category,
      description: form.description.trim(),
      date: form.date,
    })
    setForm({ ...emptyForm, date: form.date })
  }

  const inputClass =
    'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-900'

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:grid-cols-[1fr_1fr_1.5fr_1fr_auto] sm:items-end"
    >
      <label className="grid gap-1 text-xs font-medium text-neutral-500">
        Importe
        <input
          className={inputClass}
          inputMode="decimal"
          placeholder="0.00"
          value={form.amount}
          onChange={(event) => setForm({ ...form, amount: event.target.value })}
        />
      </label>
      <label className="grid gap-1 text-xs font-medium text-neutral-500">
        Categoría
        <select
          className={inputClass}
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-neutral-500">
        Descripción
        <input
          className={inputClass}
          placeholder="Opcional"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
      </label>
      <label className="grid gap-1 text-xs font-medium text-neutral-500">
        Fecha
        <input
          className={inputClass}
          type="date"
          value={form.date}
          onChange={(event) => setForm({ ...form, date: event.target.value })}
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          {editing ? 'Guardar' : 'Añadir'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
          >
            Cancelar
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 sm:col-span-5">{error}</p>}
    </form>
  )
}
