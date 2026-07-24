import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/features/auth/schemas/auth.schema'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { useRegister } from '@/features/auth/hooks/useRegister'
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton'
import { ApiError } from '@/shared/api/httpClient'

type Mode = 'login' | 'register'

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const navigate = useNavigate()
  const goToGroups = () => navigate('/groups')

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })
  const login = useLogin()
  const register = useRegister()

  const isPending = login.isPending || register.isPending
  const generalError =
    login.error instanceof ApiError
      ? login.error.message
      : register.error instanceof ApiError
        ? register.error.message
        : null

  const onSubmit =
    mode === 'login'
      ? loginForm.handleSubmit((data) => login.mutate(data, { onSuccess: goToGroups }))
      : registerForm.handleSubmit((data) => register.mutate(data, { onSuccess: goToGroups }))

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="font-display text-4xl font-semibold text-forest">Vixa</span>
            <span className="text-3xl">🎁</span>
          </div>
          <p className="text-sm text-ink-muted">
            Listas de presentes organizadas entre amigos.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-paper-raised p-7 shadow-sm">
          <h1 className="font-display text-2xl">{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {mode === 'login' ? 'Bem-vindo de volta.' : 'Comece a montar sua wishlist.'}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            {mode === 'register' && (
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  {...registerForm.register('name')}
                  className="mt-1 border-border bg-paper"
                />
                {registerForm.formState.errors.name && (
                  <p className="mt-1 text-xs text-raspberry">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...(mode === 'login' ? loginForm.register('email') : registerForm.register('email'))}
                className="mt-1 border-border bg-paper"
              />
              {(mode === 'login' ? loginForm.formState.errors.email : registerForm.formState.errors.email) && (
                <p className="mt-1 text-xs text-raspberry">
                  {(mode === 'login' ? loginForm.formState.errors.email : registerForm.formState.errors.email)?.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...(mode === 'login' ? loginForm.register('password') : registerForm.register('password'))}
                className="mt-1 border-border bg-paper"
              />
              {(mode === 'login' ? loginForm.formState.errors.password : registerForm.formState.errors.password) && (
                <p className="mt-1 text-xs text-raspberry">
                  {(mode === 'login' ? loginForm.formState.errors.password : registerForm.formState.errors.password)?.message}
                </p>
              )}
              {mode === 'register' && (
                <p className="mt-1 text-xs text-ink-muted">Mínimo 8 caracteres.</p>
              )}
            </div>

            {generalError && (
              <div className="rounded-lg border border-raspberry/40 bg-raspberry-soft px-3 py-2 text-sm text-raspberry">
                {generalError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-forest text-paper hover:bg-forest-soft"
            >
              {isPending ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-muted">
            <div className="h-px flex-1 bg-border" />
            ou
            <div className="h-px flex-1 bg-border" />
          </div>

          <GoogleLoginButton onSuccess={goToGroups} />

          <p className="mt-7 text-center text-sm text-ink-muted">
            {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-semibold text-raspberry hover:underline"
            >
              {mode === 'login' ? 'Criar uma conta' : 'Já tenho conta'}
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}