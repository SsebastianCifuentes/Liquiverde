import React, { useState } from 'react'
import { optimizeList, fetchProduct } from '../api/api'

export default function Optimize() {
  const [searchBarcode, setSearchBarcode] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [objective, setObjective] = useState('cheapest')
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
        { barcode: searchBarcode, quantity: 1, name: product.name, price: product.price || 0 }
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

  // Remover producto del carrito
  function removeItem(idx) {
    setCartItems(cartItems.filter((_, i) => i !== idx))
  }

  // Calcular totales originales
  const originalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  // Optimizar lista
  async function onOptimize(e) {
    e.preventDefault()
    if (cartItems.length === 0) {
      setError('Agrega al menos un producto a la lista')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await optimizeList(cartItems, objective)
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Calcular ahorro
  const savedAmount = originalPrice - (result?.total_price || 0)
  const savingPercent = originalPrice > 0 ? Math.round((savedAmount / originalPrice) * 100) : 0

  return (
    <div className="page">
      <h2>🛒 Generador de lista optimizada</h2>
      
      {/* Buscador */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '12px' }}>Buscar y agregar productos</h3>
        <form onSubmit={onAddProduct} className="form-inline">
          <input
            placeholder="Ingresa código de barras (ej: 7613034947611)"
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

      {/* Carrito visual */}
      <div style={{
        background: '#f3f4f6',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '2px solid #e5e7eb'
      }}>
        <h3 style={{ margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Carrito ({cartItems.length})</span>
          {cartItems.length > 0 && (
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '400' }}>
              Total: <strong style={{ color: '#059669' }}>${originalPrice.toLocaleString('es-CL')}</strong>
            </span>
          )}
        </h3>
        
        {cartItems.length === 0 ? (
          <p style={{ color: '#6b7280', margin: 0 }}>El carrito está vacío. Busca productos arriba.</p>
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
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Código: {item.barcode} | Precio: <strong>${(item.price || 0).toLocaleString('es-CL')}</strong>
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

      {/* Opciones de optimización */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
          Objetivo de optimización:
        </label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { value: 'cheapest', label: '💰 Más barato' },
            { value: 'healthiest', label: '❤️ Más saludable' },
            { value: 'balanced', label: '⚖️ Balanceado' }
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setObjective(opt.value)}
              style={{
                padding: '10px 16px',
                border: objective === opt.value ? '2px solid #10b981' : '2px solid #e5e7eb',
                background: objective === opt.value ? '#dcfce7' : 'white',
                color: objective === opt.value ? '#059669' : '#6b7280',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Botón optimizar */}
      <button
        type="submit"
        onClick={onOptimize}
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
        {loading ? '⏳ Optimizando...' : '🚀 Generar lista optimizada'}
      </button>

      {error && <div className="error" style={{ marginTop: '16px' }}>{error}</div>}

      {/* Resultados */}
      {result && (
        <div className="result">
          <h3>✅ Resultado optimizado</h3>
          
          {/* Comparación */}
          {savedAmount > 0 && (
            <div style={{
              background: '#dcfce7',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '2px solid #10b981'
            }}>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#059669' }}>
                💚 ¡Ahorras ${savedAmount.toLocaleString('es-CL')} ({savingPercent}%)!
              </div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                Antes: ${originalPrice.toLocaleString('es-CL')} → Ahora: ${result.total_price.toLocaleString('es-CL')}
              </div>
            </div>
          )}

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

          {/* Estadísticas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Total</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
                ${result.total_price.toLocaleString('es-CL')}
              </div>
            </div>
            <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Sustentabilidad</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>
                {result.average_sustainability.toFixed(1)}/100
              </div>
            </div>
            <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Productos</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
                {result.items.length}
              </div>
            </div>
          </div>

          {/* Items */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ marginBottom: '12px' }}>📦 Productos en la lista optimizada:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {result.items.map((it, idx) => (
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
                    <span>Qty: {it.quantity}</span>
                    <span>Precio: ${(it.unit_price * it.quantity).toLocaleString('es-CL')}</span>
                    <span>Score: {it.sustainability_score}/100</span>
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
