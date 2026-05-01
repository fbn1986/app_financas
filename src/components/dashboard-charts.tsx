'use client'

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  type TooltipProps,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategoryColor, type Transaction } from '@/types'

interface Props {
  transactions: Transaction[]
}

function currencyFormatter(value: number | string | undefined) {
  if (typeof value !== 'number') return ''
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tooltipFormatter: TooltipProps<any, any>['formatter'] = (value) =>
  currencyFormatter(value as number)

export default function DashboardCharts({ transactions }: Props) {
  const expenses = transactions.filter((t) => t.type === 'despesa')

  const byCategory = Object.entries(
    expenses.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount
      return acc
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const byDay = Object.entries(
    transactions.reduce<Record<string, { receita: number; despesa: number }>>((acc, t) => {
      const day = t.date.slice(8, 10)
      if (!acc[day]) acc[day] = { receita: 0, despesa: 0 }
      acc[day][t.type] += t.amount
      return acc
    }, {})
  )
    .map(([day, vals]) => ({ day, ...vals }))
    .sort((a, b) => parseInt(a.day) - parseInt(b.day))

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground col-span-2">
        Sem dados para exibir. Adicione transações para ver os gráficos.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie chart por categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Despesas por categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {byCategory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma despesa no período
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={byCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {byCategory.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={getCategoryColor(entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bar chart por dia */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Receitas vs Despesas por dia</CardTitle>
        </CardHeader>
        <CardContent>
          {byDay.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum dado no período
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byDay} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                <Bar dataKey="receita" name="Receita" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesa" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
