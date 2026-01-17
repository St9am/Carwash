import React, { useEffect, useState } from 'react'
import client from '../api/client'

export default function Users(){
  const [users, setUsers] = useState<any[]>([])
  useEffect(()=>{ load() },[])
  async function load(){
    try {
      const res = await client.get('/users')
      setUsers(res.data)
    } catch (e:any) {
      alert(e?.response?.data?.detail || e.message)
    }
  }
  return (
    <div className="container">
      <h2>Пользователи</h2>
      <table className="table">
        <thead><tr><th>ID</th><th>Email</th><th>Имя</th><th>Level</th><th>Exp</th></tr></thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id}><td>{u.id}</td><td>{u.email}</td><td>{u.name}</td><td>{u.level}</td><td>{u.exp}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
