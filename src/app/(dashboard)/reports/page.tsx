'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTransactions } from '@/lib/transactions'
import { exportToExcel, exportToPDF } from '@/lib/export-reports'
import type { Transaction } from '@/types'
import { useCustomCategories } from '@/hooks/use-custom-categories'
import { getCategoryColor } from '@/types'
import {
  FileSpreadsheet,
  FileDown,
  Search,
  TrendingUp,
  TrendingDown,
  Wallet,
  Filter,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - i)

type FilterMode = 'month' | 'year' | 'period' | 'all'

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

function buildTitle(
  mode: FilterMode,
  month: string,
  year: string,
  dateFrom: string,
  dateTo: string,
  category: string
) {
  let base = 'Relatório'
  if (mode === 'month') base = `Relatório - ${MONTHS[Number(month) - 1]} ${year}`
  else if (mode === 'year') base = `Relatório - ${year}`
  else if (mode === 'period' && dateFrom) base = `Relatório - ${formatDate(dateFrom)} a ${dateTo ? formatDate(dateTo) : '...'}`
  if (category) base += ` - ${category}`
  return base
}

export default function ReportsPage() {
  const { all: allCategories } = useCustomCategories()

  const [mode, setMode] = useState<FilterMode>('month')
  const [month, setMonth] = useState(String(new Date().getMonth() + 1))
  const [year, setYear] = useState(String(currentYear))
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const filters: Parameters<typeof getTransactions>[0] = {}

      if (mode === 'month') {
        filters.month = Number(month)
        filters.year = Number(year)
      } else if (mode === 'year') {
        filters.year = Number(year)
      } else if (mode === 'period') {
        if (dateFrom) filters.dateFrom = dateFrom
        if (dateTo) filters.dateTo = dateTo
      }

      if (category) filters.category = category
      if (search.trim()) filters.search = search.trim()

      const data = await getTransactions(filters)
      setTransactions(data)
    } finally {
      setLoading(false)
    }
  }, [mode, month, year, dateFrom, dateTo, category, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const receitas = transactions.filter((t) => t.type === 'receita').reduce((s, t) => s + t.amount, 0)
  const despesas = transactions.filter((t) => t.type === 'despesa').reduce((s, t) => s + t.amount, 0)
  const saldo = receitas - despesas

  const categoryTotals = transactions.reduce<Record<string, { receita: number; despesa: number }>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { receita: 0, despesa: 0 }
    acc[t.category][t.type] += t.amount
    return acc
  }, {})

  const pieData = Object.entries(categoryTotals)
    .map(([name, v]) => ({ name, value: v.despesa }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  const barData = Object.entries(categoryTotals)
    .map(([name, v]) => ({ name, Receitas: v.receita, Despesas: v.despesa }))
    .sort((a, b) => (b.Receitas + b.Despesas) - (a.Receitas + a.Despesas))
    .slice(0, 8)

  const title = buildTitle(mode, month, year, dateFrom, dateTo, category)

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Filtre e exporte suas transações
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => exportToExcel(transactions, title)}
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Excel
          </button>
          <button
            onClick={() => exportToPDF(transactions, title)}
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FileDown className="w-4 h-4 text-red-500" />
            PDF
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Filter className="w-4 h-4" />
          Filtros
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Modo de período */}
          <Select value={mode} onValueChange={(v) => v && setMode(v as FilterMode)}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Por mês</SelectItem>
              <SelectItem value="year">Por ano</SelectItem>
              <SelectItem value="period">Período personalizado</SelectItem>
              <SelectItem value="all">Todos os registros</SelectItem>
            </SelectContent>
          </Select>

          {/* Mês - visível só em modo month */}
          {mode === 'month' && (
            <Select value={month} onValueChange={(v) => v && setMonth(v)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Ano - visível em month e year */}
          {(mode === 'month' || mode === 'year') && (
            <Select value={year} onValueChange={(v) => v && setYear(v)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Período personalizado */}
          {mode === 'period' && (
            <>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="De"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="Até"
              />
            </>
          )}

          {/* Categoria */}
          <Select value={category || '__all__'} onValueChange={(v) => v && setCategory(v === '__all__' ? '' : v)}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="Todas categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todas categorias</SelectItem>
              {allCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(c) }} />
                    {c}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Busca */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Receitas</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(receitas)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Despesas</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(despesas)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${saldo >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
            <Wallet className={`w-5 h-5 ${saldo >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Saldo do período</p>
            <p className={`text-lg font-bold ${saldo >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
              {formatCurrency(saldo)}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 dark:text-gray-500">
          Carregando...
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500 gap-2">
          <FileDown className="w-10 h-10 opacity-30" />
          <p>Nenhuma transação encontrada para os filtros selecionados.</p>
        </div>
      ) : (
        <>
          {/* Gráficos */}
          {pieData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Despesas por categoria
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Receitas vs Despesas por categoria
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="Receitas" fill="#22c55e" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Despesas" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tabela */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Transações ({transactions.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/60 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-medium">Descrição</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Categoria</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Data</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Tipo</th>
                    <th className="text-right px-4 py-3 font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{t.description}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: getCategoryColor(t.category) }}
                          />
                          <span className="text-gray-600 dark:text-gray-300">{t.category}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            t.type === 'receita'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {t.type === 'receita' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        t.type === 'receita'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {t.type === 'receita' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
