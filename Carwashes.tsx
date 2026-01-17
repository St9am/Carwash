import React, { useEffect, useState } from 'react'
import client from '../api/client'
import qrcode from 'qrcode-generator'

export default function Carwashes() {
  const [list, setList] = useState<any[]>([])
  const [qrPNG, setQrPNG] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const [name, setName] = useState('')
  const [ip, setIp] = useState('')
  const [port, setPort] = useState('')
  const [networkId, setNetworkId] = useState('1')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editLatitude, setEditLatitude] = useState('')
  const [editLongitude, setEditLongitude] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const res = await client.get('/carwashes')
      setList(res.data)
    } catch (e: any) {
      alert(e?.response?.data?.detail || e.message)
    }
  }

  async function addWash(e: React.FormEvent) {
    e.preventDefault()
    try {
      await client.post('/carwashes', {
        network_id: Number(networkId),
        name,
        ip,
        port: Number(port),
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null
      })
      setName('')
      setIp('')
      setPort('')
      setLatitude('')
      setLongitude('')
      load()
    } catch (e: any) {
      alert(e?.response?.data?.detail || e.message)
    }
  }

  function startEdit(c: any) {
    setEditingId(c.id)
    setEditLatitude(c.latitude || '')
    setEditLongitude(c.longitude || '')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditLatitude('')
    setEditLongitude('')
  }

  async function saveEdit(id: number) {
    try {
      await client.put(`/carwashes/${id}`, {
        latitude: editLatitude ? Number(editLatitude) : null,
        longitude: editLongitude ? Number(editLongitude) : null
      })
      cancelEdit()
      load()
    } catch (e: any) {
      alert(e?.response?.data?.detail || e.message)
    }
  }



  async function generateQR(id: number) {
    try {
      const res = await client.get(`/carwashes/generate_qr/${id}`)
      const token = res.data.qr_token

      const qr = qrcode(0, 'M')
      qr.addData(token)
      qr.make()

      const png = qr.createDataURL(4) // PNG 260–300px

      setQrPNG(png)
      setShowModal(true)
    } catch (e: any) {
      alert(e?.response?.data?.detail || e.message)
    }
  }


  function downloadPNG() {
    if (!qrPNG) return
    const a = document.createElement('a')
    a.href = qrPNG
    a.download = 'carwash_qr.png'
    a.click()
  }

  return (
    <div className="container">
      {/** --- СТИЛИ --- */}
      <style>
        {`
          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            font-family: sans-serif;
          }

          h2, h3 {
            color: #0a3f8c;
          }

          .form {
            padding: 20px;
            margin-bottom: 30px;
            border: 1px solid #dbe4f3;
            border-radius: 12px;
            background: #f7faff;
          }

          .form input {
            margin-bottom: 10px;
            padding: 8px;
            width: 100%;
            font-size: 15px;
            border: 1px solid #c8d7ef;
            border-radius: 8px;
          }

          .btn {
            padding: 8px 14px;
            border-radius: 8px;
            background: #ececec;
            border: none;
            cursor: pointer;
            font-size: 15px;
          }

          .btn.blue {
            background: #0a74ff;
            color: white;
          }

          .btn.small {
            padding: 6px 10px;
            font-size: 13px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          table th, table td {
            padding: 10px;
            border-bottom: 1px solid #d9e2f1;
            text-align: left;
          }

          .modal-bg {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .modal {
            background: white;
            padding: 20px;
            border-radius: 12px;
            width: 340px;
            text-align: center;
          }

          .qr-img {
            width: 260px;
            height: 260px;
            margin-bottom: 15px;
            border-radius: 8px;
          }
        `}
      </style>

      <h2>Мойки</h2>

      {/* Create Form */}
      <form className="form" onSubmit={addWash}>
        <h3>Добавить мойку</h3>

        <label>Network ID</label>
        <input value={networkId} onChange={(e) => setNetworkId(e.target.value)} />

        <label>Название</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>IP</label>
        <input value={ip} onChange={(e) => setIp(e.target.value)} required />

        <label>Port</label>
        <input
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          required
        />

        <label>Широта (Latitude) - опционально</label>
        <input
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="55.7558"
        />

        <label>Долгота (Longitude) - опционально</label>
        <input
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="37.6173"
        />

        <button className="btn blue">Создать</button>
      </form>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Network</th>
            <th>Имя</th>
            <th>IP:PORT</th>
            <th>Координаты</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {list.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.network_id}</td>
              <td>{c.name}</td>
              <td>{c.ip}:{c.port}</td>
              <td>
                {editingId === c.id ? (
                  <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                    <input
                      type="number"
                      step="any"
                      value={editLatitude}
                      onChange={(e) => setEditLatitude(e.target.value)}
                      placeholder="Широта"
                      style={{ width: '100px', padding: '4px', fontSize: '12px' }}
                    />
                    <input
                      type="number"
                      step="any"
                      value={editLongitude}
                      onChange={(e) => setEditLongitude(e.target.value)}
                      placeholder="Долгота"
                      style={{ width: '100px', padding: '4px', fontSize: '12px' }}
                    />
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      <button className="btn small blue" onClick={() => saveEdit(c.id)}>
                        ✓
                      </button>
                      <button className="btn small" onClick={cancelEdit}>
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {c.latitude && c.longitude ? (
                      <span style={{ fontSize: '12px' }}>
                        {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#999' }}>Не заданы</span>
                    )}
                  </div>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn small blue" onClick={() => generateQR(c.id)}>
                    QR
                  </button>
                  {editingId !== c.id && (
                    <button className="btn small" onClick={() => startEdit(c)}>
                      ✏️ Координаты
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>QR-код мойки</h3>
            {qrPNG && <img src={qrPNG} className="qr-img" />}

            <button className="btn blue" onClick={downloadPNG}>Скачать PNG</button>
            <button className="btn" onClick={() => setShowModal(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  )
}
