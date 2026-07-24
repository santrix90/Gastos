import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Expense, Period } from '../types'
import { dailySeries, formatCurrency, total, totalsByCategory } from '../utils'

type Props = {
  expenses: Expense[]
  period: Period
  reference: Date
  currency: string
}

export function Summary({ expenses, period, reference, currency }: Props) {
  const sum = total(expenses)
  const categories = totalsByCategory(expenses)
  const series = dailySeries(expenses, period, reference)

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="grid content-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-400">Total del periodo</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">
            {formatCurrency(sum, currency)}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            {expenses.length} {expenses.length === 1 ? 'gasto' : 'gastos'}
          </p>
        </div>
        <div className="grid gap-2">
          {categories.length === 0 && (
            <p className="text-sm text-neutral-400">Sin datos por categoría.</p>
          )}
          {categories.map(({ category, amount }) => (
            <div key={category} className="grid gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-600">{category}</span>
                <span className="tabular-nums text-neutral-500">
                  {formatCurrency(amount, currency)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-neutral-900"
                  style={{ width: `${sum ? (amount / sum) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
        <p className="text-xs uppercase tracking-wide text-neutral-400">Gasto por día</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} width={48} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value), currency)}
                cursor={{ fill: '#fafafa' }}
              />
              <Bar dataKey="amount" fill="#171717" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
