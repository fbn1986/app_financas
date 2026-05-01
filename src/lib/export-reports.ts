import type { Transaction } from '@/types'

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

export function exportToExcel(transactions: Transaction[], title: string) {
  import('xlsx').then((XLSX) => {
    const rows = transactions.map((t) => ({
      Descrição: t.description,
      Valor: t.amount,
      Tipo: t.type === 'receita' ? 'Receita' : 'Despesa',
      Data: formatDate(t.date),
      Categoria: t.category,
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [{ wch: 32 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 16 }]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório')

    const receitas = transactions.filter((t) => t.type === 'receita').reduce((s, t) => s + t.amount, 0)
    const despesas = transactions.filter((t) => t.type === 'despesa').reduce((s, t) => s + t.amount, 0)
    const summary = [
      { '': '' },
      { '': 'Total Receitas', Valor: receitas },
      { '': 'Total Despesas', Valor: despesas },
      { '': 'Saldo', Valor: receitas - despesas },
    ]
    const wsSummary = XLSX.utils.json_to_sheet(summary)
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo')

    XLSX.writeFile(wb, `${title}.xlsx`)
  })
}

export async function exportToPDF(transactions: Transaction[], title: string) {
  const { default: jsPDF } = await import('jspdf')
  const autoTable = (await import('jspdf-autotable')).default

  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text(title, 14, 18)
  doc.setFontSize(10)
  doc.setTextColor(120)
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 14, 25)
  doc.setTextColor(0)

  const receitas = transactions.filter((t) => t.type === 'receita').reduce((s, t) => s + t.amount, 0)
  const despesas = transactions.filter((t) => t.type === 'despesa').reduce((s, t) => s + t.amount, 0)
  const saldo = receitas - despesas

  doc.setFontSize(11)
  doc.text(`Receitas: ${formatCurrency(receitas)}`, 14, 34)
  doc.text(`Despesas: ${formatCurrency(despesas)}`, 80, 34)
  doc.text(`Saldo: ${formatCurrency(saldo)}`, 146, 34)

  autoTable(doc, {
    startY: 42,
    head: [['Descrição', 'Categoria', 'Data', 'Tipo', 'Valor']],
    body: transactions.map((t) => [
      t.description,
      t.category,
      formatDate(t.date),
      t.type === 'receita' ? 'Receita' : 'Despesa',
      formatCurrency(t.amount),
    ]),
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 9 },
    columnStyles: { 4: { halign: 'right' } },
  })

  doc.save(`${title}.pdf`)
}
