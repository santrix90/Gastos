import { useMemo, useRef, useState } from 'react'
import { addDays, addMonths, addWeeks } from 'date-fns'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { Summary } from './components/Summary'
import type { Expense, Period } from './types'
import { input } from './theme'
import { useLocalStorage } from './useLocalStorage'
import { filterByPeriod, periodLabel } from './utils'

const PERIODS: { value: Period; label: string }[] = [
  { value: 'day', label: 'Diario' },
  { value: 'week', label: 'Semanal' },
  { value: 'month', label: 'Mensual' },
]

const CURRENCIES = ['EUR', 'USD', 'MXN', 'COP', 'CLP', 'ARS', 'PEN']

function shift(period: Period, reference: Date, direction: number) {
  if (period === 'day') return addDays(reference, direction)
  if (period === 'week') return addWeeks(reference, direction)
  return addMonths(reference, direction)
}

export default function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('gastos.expenses', [])
  const [currency, setCurrency] = useLocalStorage<string>('gastos.currency', 'EUR')
  const [period, setPeriod] = useState<Period>('month')
  const [reference, setReference] = useState(() => new Date())
  const [editing, setEditing] = useState<Expense | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const visible = useMemo(
    () => filterByPeriod(expenses, period, reference),
    [expenses, period, reference],
  )

  function addOrUpdate(data: Omit<Expense, 'id'>) {
    if (editing) {
      setExpenses((current) =>
        current.map((expense) =>
          expense.id === editing.id ? { ...data, id: editing.id } : expense,
        ),
      )
      setEditing(null)
      return
    }
    setExpenses((current) => [...current, { ...data, id: crypto.randomUUID() }])
  }

  function remove(id: string) {
    setExpenses((current) => current.filter((expense) => expense.id !== id))
    setEditing((current) => (current?.id === id ? null : current))
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gastos-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function importJson(file: File) {
    try {
      const parsed = JSON.parse(await file.text())
      if (!Array.isArray(parsed)) throw new Error('formato inválido')
      const imported = parsed
        .filter(
          (item): item is Expense =>
            typeof item?.amount === 'number' &&
            typeof item?.date === 'string' &&
            typeof item?.category === 'string',
        )
        .map((item) => ({
          id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
          amount: item.amount,
          category: item.category,
          description: typeof item.description === 'string' ? item.description : '',
          date: item.date,
        }))
      setExpenses(imported)
    } catch {
      window.alert('No se pudo importar el archivo: JSON inválido.')
    }
  }

  const navButton =
    'rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-sm text-neutral-300 transition hover:border-cyan-400 hover:text-cyan-300'

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-cyan-300 drop-shadow-[0_0_14px_rgba(0,240,255,0.5)]">
            Gastos
          </h1>
          <p className="text-sm text-neutral-500">
            Tus datos se guardan solo en este navegador.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className={`${input} w-auto py-1.5`}
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <button className={navButton} onClick={exportJson}>
            Exportar
          </button>
          <button className={navButton} onClick={() => fileInput.current?.click()}>
            Importar
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void importJson(file)
              event.target.value = ''
            }}
          />
        </div>
      </header>

      <ExpenseForm onSubmit={addOrUpdate} editing={editing} onCancelEdit={() => setEditing(null)} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900/60 p-1">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                period === value
                  ? 'bg-cyan-400 text-neutral-950 shadow-[0_0_16px_rgba(0,240,255,0.45)]'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            className={navButton}
            aria-label="Periodo anterior"
            onClick={() => setReference((current) => shift(period, current, -1))}
          >
            ←
          </button>
          <span className="min-w-48 text-center text-sm font-medium capitalize">
            {periodLabel(period, reference)}
          </span>
          <button
            className={navButton}
            aria-label="Periodo siguiente"
            onClick={() => setReference((current) => shift(period, current, 1))}
          >
            →
          </button>
          <button className={navButton} onClick={() => setReference(new Date())}>
            Hoy
          </button>
        </div>
      </div>

      <Summary expenses={visible} period={period} reference={reference} currency={currency} />

      <ExpenseList
        expenses={visible}
        currency={currency}
        onEdit={setEditing}
        onDelete={remove}
      />
    </div>
  )
}
