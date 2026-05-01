'use client'

import { useEffect, useRef, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useCustomCategories } from '@/hooks/use-custom-categories'
import { getCategoryColor } from '@/types'
import { Plus, X, Check, Settings2 } from 'lucide-react'
import ManageCategoriesModal from './manage-categories-modal'

interface Props {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function CategorySelect({ value, onChange, className }: Props) {
  const { all, addCategory } = useCustomCategories()
  const [showInput, setShowInput] = useState(false)
  const [newName, setNewName] = useState('')
  const [manageOpen, setManageOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showInput) setTimeout(() => inputRef.current?.focus(), 50)
  }, [showInput])

  function handleSelectChange(v: string | null) {
    if (!v) return
    if (v === '__new__') {
      setShowInput(true)
      setNewName('')
    } else {
      onChange(v)
    }
  }

  function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed) return
    addCategory(trimmed)
    onChange(trimmed)
    setShowInput(false)
    setNewName('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
    if (e.key === 'Escape') setShowInput(false)
  }

  return (
    <div className={className}>
      <div className="flex gap-1.5 items-start">
        <div className="flex-1 space-y-2">
          <Select value={showInput ? '__new__' : value} onValueChange={handleSelectChange}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="Selecionar categoria" />
            </SelectTrigger>
            <SelectContent>
              {all.map((c) => (
                <SelectItem key={c} value={c}>
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getCategoryColor(c) }}
                    />
                    {c}
                  </span>
                </SelectItem>
              ))}
              <div className="border-t mt-1 pt-1">
                <SelectItem value="__new__">
                  <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                    <Plus className="w-4 h-4" />
                    Nova categoria...
                  </span>
                </SelectItem>
              </div>
            </SelectContent>
          </Select>

          {showInput && (
            <div className="flex gap-2 items-center">
              <Input
                ref={inputRef}
                placeholder="Nome da nova categoria"
                value={newName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-8 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="h-8 px-2 rounded-md bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowInput(false)}
                className="h-8 px-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Botão gerenciar categorias */}
        <button
          type="button"
          onClick={() => setManageOpen(true)}
          title="Gerenciar categorias"
          className="mt-0.5 h-8 w-8 shrink-0 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      <ManageCategoriesModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        currentCategory={value}
        onCategoryRemoved={() => onChange('Outros')}
      />
    </div>
  )
}
