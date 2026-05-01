import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-gray-900 hover:opacity-80">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          FinançasPRO
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  )
}
