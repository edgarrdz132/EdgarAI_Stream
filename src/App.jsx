import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAuthStore } from '@/store/authStore'
import LoadingScreen from '@/components/ui/LoadingScreen'

const HomePage        = lazy(() => import('@/pages/HomePage'))
const PlayerPage      = lazy(() => import('@/pages/PlayerPage'))
const SearchPage      = lazy(() => import('@/pages/SearchPage'))
const ProfilePage     = lazy(() => import('@/pages/ProfilePage'))
const LoginPage       = lazy(() => import('@/pages/LoginPage'))
const MoviesPage      = lazy(() => import('@/pages/MoviesPage'))
const SeriesPage      = lazy(() => import('@/pages/SeriesPage'))
const AnimePage       = lazy(() => import('@/pages/AnimePage'))
const GamesPage = lazy(() => import('@/pages/GamesPage'))
const CaricaturasPage = lazy(() => import('@/pages/CaricaturasPage'))
const EnVivoPage      = lazy(() => import('@/pages/EnVivoPage'))   // ← NUEVO
const AdminDashboard  = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminChannels   = lazy(() => import('@/pages/admin/AdminChannels'))
const AdminLogs       = lazy(() => import('@/pages/admin/AdminLogs'))
const NotFoundPage    = lazy(() => import('@/pages/NotFoundPage'))

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
 	 <ProtectedRoute><Layout /></ProtectedRoute>
	}>			
          <Route index element={<HomePage />} />
          <Route path="peliculas" element={<MoviesPage />} />
          <Route path="series" element={<SeriesPage />} />
          <Route path="anime" element={<AnimePage />} />
          <Route path="telenovelas" element={<GamesPage />} />
          <Route path="caricaturas" element={<CaricaturasPage />} />
          <Route path="en-vivo" element={<EnVivoPage />} />          {/* ← NUEVO */}
          <Route path="watch/:channelId" element={<PlayerPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
        </Route>
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="channels" element={<AdminChannels />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
