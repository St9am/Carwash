import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../api/auth'
import './login.css'

export default function Login() {
  const [email, setEmail] = useState('admin@washapp.local')
  const [password, setPassword] = useState('AdminPassword123')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    console.log('useNavigate result:', navigate)
  }, [navigate])
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await adminLogin(email, password)
      navigate('/admin')
    } catch (err: any) {
      alert(err?.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <form className="card login-card" onSubmit={submit}>
        <h2>AutoWash Admin</h2>
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn" disabled={loading}>{loading ? 'Вход...' : 'Войти'}</button>
      </form>
    </div>
  )
}

/*ищем ошибку в useNavigate 
cd admin-panel
npm run build
cd ..
docker-compose build --no-cache nginx
docker-compose up -d
*/