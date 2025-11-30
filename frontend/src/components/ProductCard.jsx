import React from 'react'

export default function ProductCard({ product }) {
  if (!product) return null

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    if (score >= 40) return '#ef4444'
    return '#9ca3af'
  }

  const score = product.sustainability_score ?? 0
  const scorePercent = Math.max(0, Math.min(100, score))

  // Normaliza claves nutritivas para evitar duplicados (calcium, calcium_100g, etc)
  const normalizeNutrients = (nutriments) => {
    const map = {}
    const seen = new Set()

    const stripSuffix = (k) => k.replace(/(_100g|_serving|_value|_unit|_label|_prepared_unit|_per_serving)$/, '')

    Object.entries(nutriments || {}).forEach(([k, v]) => {
      const base = stripSuffix(k)
      if (!seen.has(base)) {
        seen.add(base)
        map[base] = { key: base, rawKey: k, value: v }
      }
    })

    return Object.values(map)
  }

  const friendlyLabel = (key) => {
    const labels = {
      energy: 'Energía',
      'energy-kcal': 'Energía (kcal)',
      fat: 'Grasas',
      'saturated-fat': 'Grasas saturadas',
      carbohydrates: 'Carbohidratos',
      sugars: 'Azúcares',
      fiber: 'Fibra',
      proteins: 'Proteínas',
      salt: 'Sal',
      sodium: 'Sodio',
      calcium: 'Calcio',
      iron: 'Hierro'
    }
    return labels[key] || key.replace(/_/g, ' ')
  }

  const formatValue = (v) => {
    if (v === null || v === undefined) return 'N/A'
    if (typeof v === 'number') return v
    // Some OFF values are strings like "75.2" or "75.2 g"
    return v
  }

  const nutrients = normalizeNutrients(product.nutriments || {})

  return (
    <div className="product-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div>
          <h3>{product.name || '❓ Sin nombre'}</h3>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>
            {product.brand && <span>Marca: <strong>{product.brand}</strong></span>}
          </div>
        </div>
        <div style={{
          background: getScoreColor(scorePercent),
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontWeight: '700',
          fontSize: '20px',
          minWidth: '80px',
          textAlign: 'center'
        }}>
          {scorePercent.toFixed(1)}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Precio</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>
            {product.price ? `$${product.price.toLocaleString('es-CL')}` : 'N/A'}
          </div>
        </div>

        <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Código</div>
          <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'monospace' }}>
            {product.barcode}
          </div>
        </div>

        {product.impact && (
          <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '6px', fontWeight: '700' }}>Impacto estimado</div>
            <div style={{ fontSize: '13px', color: '#92400e' }}>{product.impact.category}</div>
            <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: '700', color: '#b45309' }}>{product.impact.co2_kg} kg CO₂</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>{product.impact.water_liters.toLocaleString('es-CL')} L agua</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{product.impact.waste_kg} kg residuos</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{product.impact.energy_kwh} kWh</div>
          </div>
        )}
      </div>

      {/* Score indicators */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#6b7280' }}>
          Nivel de sostenibilidad
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          background: '#e5e7eb',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${scorePercent}%`,
            height: '100%',
            background: getScoreColor(scorePercent),
            transition: 'width 0.5s ease'
          }} />
        </div>
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '4px',
          textAlign: 'right'
        }}>
          {scorePercent >= 80 ? '✅ Excelente' : scorePercent >= 60 ? '✓ Bueno' : scorePercent >= 40 ? '⚠️ Regular' : '❌ Bajo'}
        </div>
      </div>

      {nutrients && nutrients.length > 0 && (
        <details style={{ marginTop: '16px' }}>
          <summary style={{
            cursor: 'pointer',
            fontWeight: '600',
            padding: '8px',
            background: '#f3f4f6',
            borderRadius: '6px',
            userSelect: 'none'
          }}>
            📊 Ver nutrientes (valores disponibles)
          </summary>
          <div style={{
            marginTop: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '8px'
          }}>
            {nutrients.slice(0, 12).map((n) => (
              <div key={n.rawKey} style={{
                padding: '8px',
                background: '#f9fafb',
                borderRadius: '6px',
                fontSize: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ color: '#6b7280', fontSize: '11px' }}>{friendlyLabel(n.key)}</div>
                <div style={{ fontWeight: '600' }}>{formatValue(n.value)}</div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
