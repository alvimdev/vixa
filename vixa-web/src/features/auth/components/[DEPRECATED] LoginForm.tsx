import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '../schemas/auth.schema'
import { useLogin } from '../hooks/useLogin'
import { ApiError } from '@/shared/api/httpClient'

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })
  const login = useLogin()

  const onSubmit = (data: LoginInput) => {
    login.mutate(data, { onSuccess })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-border bg-paper px-4 py-2 text-ink placeholder:text-ink-muted"
        />
        {errors.email && <p className="mt-1 text-sm text-raspberry">{errors.email.message}</p>}
      </div>

      <div>
        <input
          {...register('password')}
          type="password"
          placeholder="Senha"
          className="w-full rounded-lg border border-border bg-paper px-4 py-2 text-ink placeholder:text-ink-muted"
        />
        {errors.password && <p className="mt-1 text-sm text-raspberry">{errors.password.message}</p>}
      </div>

      {login.isError && (
        <p className="text-sm text-raspberry">
          {login.error instanceof ApiError ? login.error.message : 'Erro ao entrar'}
        </p>
      )}

      <button
        type="submit"
        disabled={login.isPending}
        className="rounded-lg bg-forest px-4 py-2 font-medium text-paper transition-colors hover:bg-forest-soft disabled:opacity-50"
      >
        {login.isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}