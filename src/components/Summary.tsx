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
import { card, categoryColor } from '../theme'
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
      <div className={`grid content-start gap-4 p-5 ${card}`}>
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500">Total del periodo</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.55)]">
            {formatCurrency(sum, currency)}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {expenses.length} {expenses.length === 1 ? 'gasto' : 'gastos'}
          </p>
        </div>
        <div className="grid gap-2">
          {categories.length === 0 && (
            <p className="text-sm text-neutral-500">Sin datos por categoría.</p>
          )}
          {categories.map(({ category, amount }) => (
            <div key={category} className="grid gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">{category}</span>
                <span className="tabular-nums text-neutral-400">
                  {formatCurrency(amount, currency)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${sum ? (amount / sum) * 100 : 0}%`,
                    backgroundColor: categoryColor(category),
                    boxShadow: `0 0 10px ${categoryColor(category)}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-5 lg:col-span-2 ${card}`}>
        <p className="text-xs uppercase tracking-wide text-neutral-500">Gasto por día</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="neonBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#ff2ec4" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                stroke="#737373"
              />
              <YAxis tickLine={false} axisLine={false} fontSize={11} width={48} stroke="#737373" />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value), currency)}
                cursor={{ fill: 'rgba(0,240,255,0.08)' }}
                contentStyle={{
                  background: '#0a0a0a',
                  border: '1px solid #00f0ff',
                  borderRadius: 8,
                  color: '#fafafa',
                }}
                labelStyle={{ color: '#a3a3a3' }}
              />
              <Bar dataKey="amount" fill="url(#neonBar)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
