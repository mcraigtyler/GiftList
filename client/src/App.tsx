import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProgressSpinner } from 'primereact/progressspinner'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

const LoginPage      = lazy(() => import('./pages/LoginPage'))
const RegisterPage   = lazy(() => import('./pages/RegisterPage'))
const DashboardPage  = lazy(() => import('./pages/DashboardPage'))
const MyListsPage    = lazy(() => import('./pages/MyListsPage'))
const ListDetailPage = lazy(() => import('./pages/ListDetailPage'))
const ListEditPage   = lazy(() => import('./pages/ListEditPage'))
const FriendsPage    = lazy(() => import('./pages/FriendsPage'))
const InvitesPage    = lazy(() => import('./pages/InvitesPage'))
const MyClaimsPage   = lazy(() => import('./pages/MyClaimsPage'))
const ProfilePage    = lazy(() => import('./pages/ProfilePage'))

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="flex justify-content-center align-items-center" style={{ height: '100vh' }}><ProgressSpinner /></div>}>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/lists" element={<ProtectedRoute><MyListsPage /></ProtectedRoute>} />
          <Route path="/lists/:id" element={<ProtectedRoute><ListDetailPage /></ProtectedRoute>} />
          <Route path="/lists/:id/edit" element={<ProtectedRoute><ListEditPage /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
          <Route path="/invites" element={<ProtectedRoute><InvitesPage /></ProtectedRoute>} />
          <Route path="/claims" element={<ProtectedRoute><MyClaimsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App
