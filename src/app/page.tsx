import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { ArrowRight, BarChart3, Shield, Smartphone, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Nav */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span>FinançasPRO</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className={buttonVariants({ variant: 'ghost' })}>
              Entrar
            </Link>
            <Link href="/register" className={buttonVariants({})}>
              Criar conta grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium">
            <span>✨</span> Controle financeiro simples e visual
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Suas finanças,{' '}
            <span className="text-blue-600 dark:text-blue-400">organizadas</span> de verdade
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Registre receitas e despesas, visualize seu saldo em tempo real e
            tome decisões financeiras com mais confiança.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: 'lg' }), 'gap-2 text-base')}
            >
              Começar gratuitamente <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'text-base')}
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Tudo que você precisa para controlar seu dinheiro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
                title: 'Dashboard visual',
                desc: 'Veja receitas, despesas e saldo em cards e gráficos intuitivos.',
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />,
                title: 'Categorias',
                desc: 'Organize transações por categoria e entenda para onde vai seu dinheiro.',
              },
              {
                icon: <Smartphone className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
                title: 'Mobile first',
                desc: 'Interface responsiva, funciona perfeitamente no celular ou desktop.',
              },
              {
                icon: <Shield className="w-8 h-8 text-orange-600 dark:text-orange-400" />,
                title: 'Seus dados, seguros',
                desc: 'Autenticação segura e dados protegidos com Row Level Security.',
              },
            ].map((f) => (
              <div key={f.title} className="text-center space-y-3">
                <div className="flex justify-center">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold">Pronto para organizar suas finanças?</h2>
          <p className="text-blue-100">Crie sua conta grátis e comece agora.</p>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'gap-2 text-base')}
          >
            Criar conta grátis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950">
        © {new Date().getFullYear()} FinançasPRO. Feito com Next.js + Supabase.
      </footer>
    </div>
  )
}
