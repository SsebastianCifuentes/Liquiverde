import React, { useState } from 'react'
import { fetchProduct } from '../api/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [barcode, setBarcode] = useState('')
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSearch(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const p = await fetchProduct(barcode.trim())
      setProduct(p)
    } catch (err) {
      setError(err.message)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h2>🔍 Buscar información del producto</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Ingresa el código de barras de un producto para ver su información de sostenibilidad y precio
      </p>
      
      <form onSubmit={onSearch} className="form-inline">
        <input
          placeholder="Ingresa código de barras (ej: 7613034947611)"
          value={barcode}
          onChange={e => setBarcode(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? '⏳ Buscando...' : '🔎 Buscar'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {product && <ProductCard product={product} />}
    </div>
  )
}
