import { Link, useNavigate } from 'react-router-dom'
import { Monitor, Moon, Sun, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../shared/components/ui/dropdown-menu'
import { useTheme } from './providers/ThemeProvider'
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser'
import { useLogout } from '../features/auth/hooks/useLogout'
import { Avatar } from '../shared/components/vixa/Avatar'

export function Header() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const { data } = useCurrentUser()
  const logout = useLogout()
  const user = data?.user

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => navigate('/login') })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/groups" className="group flex items-center gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-forest">
            Vixa
          </span>
          <span className="text-xl transition-transform group-hover:rotate-6">🎁</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-forest">
            <Avatar name={user?.name ?? '?'} avatarUrl={user?.avatarUrl} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-60 border-border bg-paper-raised text-ink"
          >
            <DropdownMenuLabel className="flex items-center gap-3 py-3">
              <Avatar name={user?.name ?? '?'} avatarUrl={user?.avatarUrl} size={32} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{user?.name}</div>
                <div className="truncate text-xs text-ink-muted">{user?.email}</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-2">
              <User className="h-4 w-4" /> Meu perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-ink-muted">
              Tema
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as any)}>
              <DropdownMenuRadioItem value="light" className="gap-2">
                <Sun className="h-4 w-4" /> Claro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="gap-2">
                <Moon className="h-4 w-4" /> Escuro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system" className="gap-2">
                <Monitor className="h-4 w-4" /> Sistema
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 text-raspberry focus:text-raspberry"
            >
              <LogOut className="h-4 w-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}