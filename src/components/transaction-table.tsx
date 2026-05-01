'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import TransactionForm from './transaction-form'
import { deleteTransaction } from '@/lib/transactions'
import { CATEGORY_COLORS, type Transaction } from '@/types'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

interface Props {
  transactions: Transaction[]
  onRefresh: () => void
}

export default function TransactionTable({ transactions, onRefresh }: Props) {
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)
  const [loadingDelete, setLoadingDelete] = useState(false)

  async function handleDelete() {
    if (!deleting) return
    setLoadingDelete(true)
    try {
      await deleteTransaction(deleting.id)
      toast.success('Transação excluída')
      onRefresh()
    } catch {
      toast.error('Erro ao excluir transação')
    } finally {
      setLoadingDelete(false)
      setDeleting(null)
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma transação encontrada.
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-600">Descrição</th>
              <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Categoria</th>
              <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Data</th>
              <th className="px-4 py-3 font-medium text-gray-600">Valor</th>
              <th className="px-4 py-3 font-medium text-gray-600 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{t.description}</div>
                  <div className="text-xs text-muted-foreground sm:hidden mt-0.5">
                    {t.category} · {format(new Date(t.date + 'T12:00:00'), 'dd/MM/yy', { locale: ptBR })}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: CATEGORY_COLORS[t.category] + '20',
                      color: CATEGORY_COLORS[t.category],
                    }}
                  >
                    {t.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {format(new Date(t.date + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-semibold ${
                      t.type === 'receita' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {t.type === 'receita' ? '+' : '-'}{' '}
                    {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      aria-label="Opções"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditing(t)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleting(t)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <TransactionForm
          open={!!editing}
          onClose={() => setEditing(null)}
          onSuccess={onRefresh}
          transaction={editing}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(v: boolean) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação &ldquo;{deleting?.description}&rdquo; será
              removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}
