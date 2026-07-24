import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '../schemas/auth.schema'
import { useRegister } from '../hooks/useRegister'
import { ApiError } from '@/shared/api/httpClient'

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })
  const registerUser = useRegister()

  const onSubmit = (data: RegisterInput) => {
    registerUser.mutate(data, { onSuccess })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <input
          {...register('name')}
          placeholder="Nome"
          className="w-full rounded-lg border border-border bg-paper px-4 py-2 text-ink placeholder:text-ink-muted"
        />
        {errors.name && <p className="mt-1 text-sm text-raspberry">{errors.name.message}</p>}
      </div>

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
          placeholder="Senha (mín. 8 caracteres)"
          className="w-full rounded-lg border border-border bg-paper px-4 py-2 text-ink placeholder:text-ink-muted"
        />
        {errors.password && <p className="mt-1 text-sm text-raspberry">{errors.password.message}</p>}
      </div>

      {registerUser.isError && (
        <p className="text-sm text-raspberry">
          {registerUser.error instanceof ApiError ? registerUser.error.message : 'Erro ao criar conta'}
        </p>
      )}

      <button
        type="submit"
        disabled={registerUser.isPending}
        className="rounded-lg bg-forest px-4 py-2 font-medium text-paper transition-colors hover:bg-forest-soft disabled:opacity-50"
      >
        {registerUser.isPending ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  )
}