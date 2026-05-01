'use client'

import { useEffect, useState } from 'react'
import { PREDEFINED_CATEGORIES } from '@/types'

const STORAGE_KEY = 'financaspro_custom_categories'

function read(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function write(categories: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
}

export function useCustomCategories() {
  const [custom, setCustom] = useState<string[]>([])

  useEffect(() => {
    setCustom(read())
  }, [])

  function addCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed || PREDEFINED_CATEGORIES.includes(trimmed as never) || custom.includes(trimmed)) return
    const updated = [...custom, trimmed]
    write(updated)
    setCustom(updated)
  }

  function removeCategory(name: string) {
    const updated = custom.filter((c) => c !== name)
    write(updated)
    setCustom(updated)
  }

  const all = [...PREDEFINED_CATEGORIES, ...custom]

  return { custom, all, addCategory, removeCategory }
}
