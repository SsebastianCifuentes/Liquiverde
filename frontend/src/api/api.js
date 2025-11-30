const BASE = import.meta.env.VITE_API_BASE || 'https://laughing-space-computing-machine-pxgqrj96x6gf664q-8000.app.github.dev'

export async function fetchProduct(barcode) {
  const res = await fetch(`${BASE}/products/${barcode}`)
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt || res.statusText)
  }
  return res.json()
}

export async function optimizeList(items, objective = 'cheapest') {
  const res = await fetch(`${BASE}/shopping-list/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, objective })
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt || res.statusText)
  }
  return res.json()
}
