'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTransactions } from '@/lib/transactions'
import type { Transaction, TransactionFilters } from '@/types'

export function useTransactions(filters: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTransactions(filters)
      setTransactions(data)
    } finally {
      setLoading(false)
    }
  }, [filters.month, filters.year, filters.category, filters.search]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch()
  }, [fetch])

  return { transactions, loading, refresh: fetch }
}
