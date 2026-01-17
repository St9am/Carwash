import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Carwashes from './pages/Carwashes'
import Referrals from './pages/Referrals'
import Reports from './pages/Reports'
import './styles.css'
import { getToken, isAdminToken } from './api/auth'

interface ProtectedRouteProps {
  element: React.ReactElement
}

function ProtectedRoute({ element }: ProtectedRouteProps) {
  const token = getToken()
  if (!token || !isAdminToken(token)) return <Navigate to="admin/login" replace />
  return element
}

function App() {
  return (
    <BrowserRouter>
      <div className="admin-shell">
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/admin/users" element={<ProtectedRoute element={<Users />} />} />
          <Route path="/admin/carwashes" element={<ProtectedRoute element={<Carwashes />} />} />
          <Route path="/admin/referrals" element={<ProtectedRoute element={<Referrals />} />} />
          <Route path="/admin/reports" element={<ProtectedRoute element={<Reports />} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById("root")!).render(<App />)
