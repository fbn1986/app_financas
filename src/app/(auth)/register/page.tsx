'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('As senhas não coincidem')
      return
    }
    if (form.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })
      if (error) throw error
      setRegisteredEmail(form.email)
      setDone(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <Card className="w-full max-w-sm shadow-lg text-center">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-xl">Verifique seu e-mail!</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Enviamos um link de confirmação para
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2">
            <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm break-all">
              {registeredEmail}
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground text-left">
            <p className="flex items-start gap-2">
              <span className="text-blue-500 font-bold shrink-0">1.</span>
              Abra sua caixa de entrada e procure um e-mail do FinançasPRO.
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 font-bold shrink-0">2.</span>
              Clique no botão <strong className="text-foreground">Confirmar e-mail</strong> dentro da mensagem.
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 font-bold shrink-0">3.</span>
              Após confirmar, volte aqui e faça login para acessar o app.
            </p>
          </div>

          <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
            Não encontrou o e-mail? Verifique a pasta de <strong>spam</strong> ou lixo eletrônico.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 h-8 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Ir para o login <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDone(false)}
            className="text-xs text-muted-foreground hover:underline"
          >
            Usar outro e-mail
          </button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Criar conta</CardTitle>
        <CardDescription>Comece a controlar suas finanças hoje</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
              value={form.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmar senha</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Repita a senha"
              required
              value={form.confirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, confirm: e.target.value })
              }
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Criar conta
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Já tem conta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
