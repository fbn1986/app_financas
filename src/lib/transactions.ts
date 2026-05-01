import { createClient } from '@/lib/supabase/client'
import type { Transaction, TransactionFilters } from '@/types'

export async function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const supabase = createClient()
  let query = supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  if (filters.month && filters.year) {
    const start = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`
    const end = new Date(filters.year, filters.month, 0)
    const endStr = `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
    query = query.gte('date', start).lte('date', endStr)
  }

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.search) {
    query = query.ilike('description', `%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createTransaction(
  transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...transaction, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTransaction(
  id: string,
  transaction: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTransaction(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}

export function exportToCSV(transactions: Transaction[]) {
  const headers = ['Descrição', 'Valor', 'Data', 'Tipo', 'Categoria']
  const rows = transactions.map((t) => [
    t.description,
    t.amount.toFixed(2).replace('.', ','),
    t.date,
    t.type === 'receita' ? 'Receita' : 'Despesa',
    t.category,
  ])

  const csv = [headers, ...rows].map((r) => r.join(';')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `transacoes_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
