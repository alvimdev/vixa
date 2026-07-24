import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'

export function ProtectedRoute() {
  const { data, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>
  }

  if (isError || !data?.user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}