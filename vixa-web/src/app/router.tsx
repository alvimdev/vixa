import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from './routes/LoginPage'
import { GroupsPage } from './routes/GroupsPage'

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/groups', element: <GroupsPage /> },
])
