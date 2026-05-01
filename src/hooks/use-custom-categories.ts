'use client'

import { useEffect, useState } from 'react'
import { PREDEFINED_CATEGORIES } from '@/types'

const KEY = 'financaspro_categories'
const OLD_KEY = 'financaspro_custom_categories'

function readAll(): string[] {
  if (typeof window === 'undefined') return [...PREDEFINED_CATEGORIES]
  try {
    const stored = localStorage.getItem(KEY)
    if (stored) return JSON.parse(stored)

    // Primeira vez: migra categorias antigas se existirem e inicializa com padrões
    const oldCustom: string[] = JSON.parse(localStorage.getItem(OLD_KEY) ?? '[]')
    const initial = [
      ...PREDEFINED_CATEGORIES,
      ...oldCustom.filter((c) => !PREDEFINED_CATEGORIES.includes(c as never)),
    ]
    localStorage.setItem(KEY, JSON.stringify(initial))
    localStorage.removeItem(OLD_KEY)
    return initial
  } catch {
    return [...PREDEFINED_CATEGORIES]
  }
}

function persist(list: string[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function useCustomCategories() {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    setCategories(readAll())
  }, [])

  function save(updated: string[]) {
    persist(updated)
    setCategories(updated)
  }

  function addCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed || categories.includes(trimmed)) return
    save([...categories, trimmed])
  }

  function editCategory(oldName: string, newName: string) {
    const trimmed = newName.trim()
    if (!trimmed || trimmed === oldName || categories.includes(trimmed)) return
    save(categories.map((c) => (c === oldName ? trimmed : c)))
  }

  function removeCategory(name: string) {
    save(categories.filter((c) => c !== name))
  }

  function resetToDefaults() {
    save([...PREDEFINED_CATEGORIES])
  }

  return {
    all: categories,
    // manter retrocompatibilidade com transactions/page.tsx
    custom: categories.filter((c) => !PREDEFINED_CATEGORIES.includes(c as never)),
    addCategory,
    editCategory,
    removeCategory,
    resetToDefaults,
  }
}
