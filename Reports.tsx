import React, { useState } from 'react'
import client from '../api/client'

export default function Reports(){
  const [networkId, setNetworkId] = useState<number>(1)
  async function generate(){
    try {
      const res = await client.post(`/reports/generate?network_id=${networkId}`, {})
      const blob = await client.get(`/reports/download?file=${encodeURIComponent(res.data.filename)}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([blob.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `report_${networkId}.pdf`
      a.click()
    } catch (e:any){ alert(e?.response?.data?.detail || e.message) }
  }
  return (
    <div className="container">
      <h2>Генерация отчётов</h2>
      <label>Network ID</label>
      <input type="number" value={String(networkId)} onChange={(e)=>setNetworkId(Number(e.target.value))} />
      <button className="btn" onClick={generate}>Сгенерировать отчёт</button>
    </div>
  )
}
