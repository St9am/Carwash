import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  return (
    <div className="container">
      <header className="topbar">
        <div className="brand">AutoWash Admin</div>
        <nav className="topnav">
          <Link to="/users">Пользователи</Link>
          <Link to="/carwashes">Мойки</Link>
          <Link to="/referrals">Рефералы</Link>
          <Link to="/reports">Отчёты</Link>
          <a href="#" onClick={()=>{localStorage.removeItem('admin_token'); location.href='admin/login'}}>Выйти</a> 
        </nav>
      </header>
      <main>
        <h1>Панель управления</h1>
        <p>Быстрые ссылки</p>
        <div className="grid">
          <Link className="card" to="/admin/users">Пользователи</Link>
          <Link className="card" to="/admin/carwashes">Управление</Link>
          <Link className="card" to="/admin/referrals">Реферальные события</Link>
          <Link className="card" to="/admin/reports">Генерация отчётов</Link>
        </div>
      </main>
    </div>
  )
}

