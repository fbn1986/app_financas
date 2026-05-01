export type TransactionType = 'receita' | 'despesa'

export type Category =
  | 'Alimentação'
  | 'Transporte'
  | 'Moradia'
  | 'Lazer'
  | 'Saúde'
  | 'Educação'
  | 'Salário'
  | 'Freelance'
  | 'Outros'

export const CATEGORIES: Category[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Salário',
  'Freelance',
  'Outros',
]

export const CATEGORY_COLORS: Record<Category, string> = {
  Alimentação: '#f97316',
  Transporte: '#3b82f6',
  Moradia: '#8b5cf6',
  Lazer: '#ec4899',
  Saúde: '#10b981',
  Educação: '#6366f1',
  Salário: '#22c55e',
  Freelance: '#14b8a6',
  Outros: '#94a3b8',
}

export interface Transaction {
  id: string
  user_id: string
  description: string
  amount: number
  date: string
  type: TransactionType
  category: Category
  created_at: string
}

export interface TransactionFilters {
  month?: number
  year?: number
  category?: Category | ''
  search?: string
}
