'use client'

import { useEffect, useRef, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useCustomCategories } from '@/hooks/use-custom-categories'
import { PREDEFINED_CATEGORIES, getCategoryColor } from '@/types'
import { Plus, X, Check } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function CategorySelect({ value, onChange, className }: Props) {
  const { custom, all, addCategory, removeCategory } = useCustomCategories()
  const [showInput, setShowInput] = useState(false)
  const [newName, setNewName] = useState('')
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
    if (e.key === 'Escape') { setShowInput(false) }
  }

  const isPredefined = (c: string) => PREDEFINED_CATEGORIES.includes(c as never)

  return (
    <div className={className}>
      <Select value={showInput ? '__new__' : value} onValueChange={handleSelectChange}>
        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
          <SelectValue placeholder="Selecionar categoria" />
        </SelectTrigger>
        <SelectContent>
          {/* Categorias padrão */}
          {PREDEFINED_CATEGORIES.map((c) => (
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

          {/* Categorias personalizadas */}
          {custom.length > 0 && (
            <>
              <div className="px-2 py-1 mt-1 text-xs font-medium text-muted-foreground border-t">
                Personalizadas
              </div>
              {custom.map((c) => (
                <div key={c} className="flex items-center group">
                  <SelectItem value={c} className="flex-1">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: getCategoryColor(c) }}
                      />
                      {c}
                    </span>
                  </SelectItem>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeCategory(c)
                      if (value === c) onChange('Outros')
                    }}
                    className="mr-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-all"
                    title="Remover categoria"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Opção para adicionar nova */}
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

      {/* Input para nova categoria */}
      {showInput && (
        <div className="mt-2 flex gap-2 items-center">
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
            className="h-8 px-2 rounded-md bg-blue-600 text-white text-sm disabled:opacity-40 hover:bg-blue-700 transition-colors"
            title="Confirmar"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowInput(false)}
            className="h-8 px-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Cancelar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
