import { createBrowserRouter } from 'react-router-dom'
import { AuthPage } from './routes/AuthPage'
import { GroupsPage } from './routes/GroupsPage'
import { GroupDetailPage } from './routes/GroupDetailPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { ProfilePage } from './routes/ProfilePage'
import { AppShell } from './AppShell'

export const router = createBrowserRouter([
  { path: '/login', element: <AuthPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/groups', element: <GroupsPage /> },
          { path: '/groups/:id', element: <GroupDetailPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '/', element: <AuthPage /> },
])