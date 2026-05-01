'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCustomCategories } from '@/hooks/use-custom-categories'
import { getCategoryColor, PREDEFINED_CATEGORIES } from '@/types'
import { Pencil, Trash2, Check, X, Plus, RotateCcw } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  currentCategory: string
  onCategoryRemoved: (removed: string) => void
}

export default function ManageCategoriesModal({
  open,
  onClose,
  currentCategory,
  onCategoryRemoved,
}: Props) {
  const { all, addCategory, editCategory, removeCategory, resetToDefaults } =
    useCustomCategories()

  const [editingName, setEditingName] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [newName, setNewName] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const editInputRef = useRef<HTMLInputElement>(null)
  const addInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingName !== null) setTimeout(() => editInputRef.current?.focus(), 50)
  }, [editingName])

  useEffect(() => {
    if (showAdd) setTimeout(() => addInputRef.current?.focus(), 50)
  }, [showAdd])

  function startEdit(name: string) {
    setEditingName(name)
    setEditValue(name)
  }

  function commitEdit() {
    if (editingName === null) return
    editCategory(editingName, editValue)
    setEditingName(null)
  }

  function cancelEdit() {
    setEditingName(null)
  }

  function handleEditKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed) return
    addCategory(trimmed)
    setNewName('')
    setShowAdd(false)
  }

  function handleAddKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') setShowAdd(false)
  }

  function handleRemove(name: string) {
    removeCategory(name)
    if (name === currentCategory) onCategoryRemoved(name)
  }

  function handleReset() {
    resetToDefaults()
    setConfirmReset(false)
    if (!PREDEFINED_CATEGORIES.includes(currentCategory as never)) {
      onCategoryRemoved(currentCategory)
    }
  }

  const isPredefined = (c: string) => PREDEFINED_CATEGORIES.includes(c as never)

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Gerenciar categorias</DialogTitle>
        </DialogHeader>

        <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
          {all.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: getCategoryColor(cat) }}
              />

              {editingName === cat ? (
                <div className="flex flex-1 items-center gap-1">
                  <Input
                    ref={editInputRef}
                    value={editValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditValue(e.target.value)
                    }
                    onKeyDown={handleEditKey}
                    className="h-7 text-sm flex-1 bg-white dark:bg-gray-800"
                  />
                  <button
                    type="button"
                    onClick={commitEdit}
                    disabled={!editValue.trim() || editValue.trim() === cat}
                    className="p-1 rounded text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-40"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-1 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 truncate">
                    {cat}
                    {isPredefined(cat) && (
                      <span className="ml-1.5 text-xs text-muted-foreground">padrão</span>
                    )}
                  </span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      title="Renomear"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(cat)}
                      className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Adicionar nova */}
        <div className="border-t pt-3 space-y-2">
          {showAdd ? (
            <div className="flex gap-2 items-center">
              <Input
                ref={addInputRef}
                placeholder="Nome da nova categoria"
                value={newName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                onKeyDown={handleAddKey}
                className="flex-1 h-8 text-sm bg-white dark:bg-gray-800"
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
                onClick={() => { setShowAdd(false); setNewName('') }}
                className="h-8 px-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              <Plus className="w-4 h-4" />
              Nova categoria
            </button>
          )}

          {/* Restaurar padrões */}
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Restaurar categorias padrão
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Confirmar restauração?</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-red-600 font-medium hover:underline"
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-muted-foreground hover:underline"
              >
                Não
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
