import React, { useEffect, useState } from 'react'
import client from '../api/client'

export default function Referrals(){
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{ load() },[])
  async function load(){
    try {
      const res = await client.get('/referrals') // implement backend route
      setRows(res.data)
    } catch (e:any){ console.error(e) }
  }
  return (
    <div className="container">
      <h2>Реферальные события</h2>
      <table className="table">
        <thead><tr><th>ID</th><th>Inviter</th><th>Invited</th><th>Reward</th><th>Date</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id}><td>{r.id}</td><td>{r.inviter_id}</td><td>{r.invited_id}</td><td>{r.reward}</td><td>{new Date(r.created_at).toLocaleString()}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
