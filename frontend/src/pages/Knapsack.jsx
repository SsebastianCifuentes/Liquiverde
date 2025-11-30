import React, { useState } from 'react'
import { fetchProduct } from '../api/api'

const BASE = import.meta.env.VITE_API_BASE || 'https://laughing-space-computing-machine-pxgqrj96x6gf664q-8000.app.github.dev'

async function solveKnapsack(budget, items) {
  const res = await fetch(`${BASE}/knapsack/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ budget, items })
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt || res.statusText)
  }
  return res.json()
}

export default function Knapsack() {
  const [searchBarcode, setSearchBarcode] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [budget, setBudget] = useState(10000)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Buscar y agregar producto al carrito
  async function onAddProduct(e) {
    e.preventDefault()
    setSearchError(null)
    setSearchLoading(true)
    try {
      const product = await fetchProduct(searchBarcode.trim())
      if (!product) throw new Error('Producto no encontrado')
      
      setCartItems([
        ...cartItems,
        { 
          barcode: searchBarcode, 
          quantity: 1, 
          name: product.name,
          price: product.price || 0
        }
      ])
      setSearchBarcode('')
    } catch (err) {
      setSearchError(err.message)
    } finally {
      setSearchLoading(false)
    }
  }

  // Actualizar cantidad
  function updateQuantity(idx, qty) {
    const copy = [...cartItems]
    copy[idx].quantity = Math.max(1, parseInt(qty) || 1)
    setCartItems(copy)
  }

  // Remover producto
  function removeItem(idx) {
    setCartItems(cartItems.filter((_, i) => i !== idx))
  }

  // Resolver Knapsack
  async function onSolve(e) {
    e.preventDefault()
    if (cartItems.length === 0) {
      setError('Agrega al menos un producto')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await solveKnapsack(budget, cartItems)
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  return (
    <div className="page">
      <h2>🎯 Mochila Multi-objetivo (Knapsack)</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Maximiza la sustentabilidad dentro de un presupuesto. El algoritmo selecciona los mejores productos.
      </p>

      {/* Presupuesto */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
          💰 Presupuesto máximo (CLP):
        </label>
        <input
          type="number"
          value={budget}
          onChange={e => setBudget(Math.max(100, parseInt(e.target.value) || 100))}
          min="100"
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Buscador */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '12px' }}>Buscar y agregar productos</h3>
        <form onSubmit={onAddProduct} className="form-inline">
          <input
            placeholder="Ingresa código de barras"
            value={searchBarcode}
            onChange={e => setSearchBarcode(e.target.value)}
            disabled={searchLoading}
          />
          <button type="submit" disabled={searchLoading}>
            {searchLoading ? '⏳' : '➕'} Agregar
          </button>
        </form>
        {searchError && <div className="error">{searchError}</div>}
      </div>

      {/* Carrito */}
      <div style={{
        background: '#f3f4f6',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '2px solid #e5e7eb'
      }}>
        <h3 style={{ margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Productos ({cartItems.length})</span>
          {cartItems.length > 0 && (
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '400' }}>
              Disponible: <strong style={{ color: '#059669' }}>${budget.toLocaleString('es-CL')}</strong>
            </span>
          )}
        </h3>
        
        {cartItems.length === 0 ? (
          <p style={{ color: '#6b7280', margin: 0 }}>Sin productos. Busca algunos arriba.</p>
        ) : (
          <div>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                padding: '12px',
                background: 'white',
                marginBottom: '8px',
                borderRadius: '8px',
                justifyContent: 'space-between'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>{item.name || `Producto ${item.barcode}`}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    ${item.price.toLocaleString('es-CL')} c/u
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateQuantity(idx, e.target.value)}
                    style={{ width: '60px', padding: '6px' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    style={{
                      padding: '6px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón resolver */}
      <button
        type="submit"
        onClick={onSolve}
        disabled={loading || cartItems.length === 0}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          fontWeight: '700',
          opacity: loading || cartItems.length === 0 ? 0.5 : 1,
          cursor: loading || cartItems.length === 0 ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Resolviendo...' : '🚀 Resolver Knapsack'}
      </button>

      {error && <div className="error" style={{ marginTop: '16px' }}>{error}</div>}

      {/* Resultado */}
      {result && (
        <div className="result">
          <h3>✅ Solución Knapsack</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Costo total</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
                ${result.total_cost.toLocaleString('es-CL')}
              </div>
            </div>
            <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Sustentabilidad total</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>
                {result.best_value.toFixed(1)}
              </div>
            </div>
            <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Espacio usado</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
                {((result.total_cost / budget) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Impacto Ambiental */}
          {result.environmental_impact && (
            <div style={{
              background: '#f0fdf4',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '2px solid #86efac'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#166534' }}>🌍 Impacto Ambiental</h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ background: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Emisiones CO₂</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#b45309' }}>
                    {result.environmental_impact.total_co2_kg} kg
                  </div>
                </div>
                <div style={{ background: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Agua Usada</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>
                    {result.environmental_impact.total_water_liters.toLocaleString('es-CL')} L
                  </div>
                </div>
                <div style={{ background: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Residuos</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444' }}>
                    {result.environmental_impact.total_waste_kg} kg
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '16px' }}>
            <h4 style={{ marginBottom: '12px' }}>📦 Productos seleccionados:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {result.items && result.items.map((it, idx) => (
                <li key={idx} style={{
                  padding: '12px',
                  background: 'white',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  borderLeft: '4px solid #10b981',
                  fontSize: '14px'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {it.name || `Producto ${it.barcode}`}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
                    <span>Precio: ${it.price.toLocaleString('es-CL')}</span>
                    <span>Value: {it.value.toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
