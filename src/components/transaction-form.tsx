'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { createTransaction, updateTransaction } from '@/lib/transactions'
import { CATEGORIES, type Transaction, type Category, type TransactionType } from '@/types'
import { Loader2 } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  transaction?: Transaction
}

const defaultForm = {
  description: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  type: 'despesa' as TransactionType,
  category: 'Outros' as Category,
}

export default function TransactionForm({ open, onClose, onSuccess, transaction }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(
    transaction
      ? {
          description: transaction.description,
          amount: String(transaction.amount),
          date: transaction.date,
          type: transaction.type,
          category: transaction.category,
        }
      : defaultForm
  )

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const amount = parseFloat(form.amount.replace(',', '.'))
    if (isNaN(amount) || amount <= 0) {
      toast.error('Informe um valor válido')
      return
    }
    setLoading(true)
    try {
      const payload = {
        description: form.description.trim(),
        amount,
        date: form.date,
        type: form.type,
        category: form.category,
      }
      if (transaction) {
        await updateTransaction(transaction.id, payload)
        toast.success('Transação atualizada')
      } else {
        await createTransaction(payload)
        toast.success('Transação criada')
      }
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setForm(
      transaction
        ? {
            description: transaction.description,
            amount: String(transaction.amount),
            date: transaction.date,
            type: transaction.type,
            category: transaction.category,
          }
        : defaultForm
    )
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar transação' : 'Nova transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado"
              required
              value={form.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                set('description', e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                placeholder="0,00"
                required
                value={form.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  set('amount', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                required
                value={form.date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  set('date', e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={form.type}
                onValueChange={(v: string | null) => v && set('type', v as TransactionType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={form.category}
                onValueChange={(v: string | null) => v && set('category', v as Category)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {transaction ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
