import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight, BarChart3, Shield, Smartphone, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span>FinançasPRO</span>
          </div>
          <div className="flex items-center gap-3">
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
      <section className="flex-1 bg-gradient-to-br from-blue-50 via-white to-green-50 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium">
            <span>✨</span> Controle financeiro simples e visual
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Suas finanças,{' '}
            <span className="text-blue-600">organizadas</span> de verdade
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Tudo que você precisa para controlar seu dinheiro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
                title: 'Dashboard visual',
                desc: 'Veja receitas, despesas e saldo em cards e gráficos intuitivos.',
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                title: 'Categorias',
                desc: 'Organize transações por categoria e entenda para onde vai seu dinheiro.',
              },
              {
                icon: <Smartphone className="w-8 h-8 text-purple-600" />,
                title: 'Mobile first',
                desc: 'Interface responsiva, funciona perfeitamente no celular ou desktop.',
              },
              {
                icon: <Shield className="w-8 h-8 text-orange-600" />,
                title: 'Seus dados, seguros',
                desc: 'Autenticação segura e dados protegidos com Row Level Security.',
              },
            ].map((f) => (
              <div key={f.title} className="text-center space-y-3">
                <div className="flex justify-center">{f.icon}</div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
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

      <footer className="border-t py-6 text-center text-sm text-gray-500 bg-white">
        © {new Date().getFullYear()} FinançasPRO. Feito com Next.js + Supabase.
      </footer>
    </div>
  )
}
