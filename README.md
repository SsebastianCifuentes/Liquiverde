**LiquiVerde**

Proyecto full-stack: plataforma de retail inteligente para ahorrar dinero y reducir impacto ambiental al comprar.

**Resumen**
- Backend: Python + FastAPI
- Frontend: React + Vite
- DB local: SQLite (caché de productos)
- Datos de ejemplo: `backend/data/prices.json`

**Estado actual**
- Funcionalidades implementadas:
	- Búsqueda de productos por código de barras (Open Food Facts + caché local)
	- Scoring de sostenibilidad (heurístico 0-100)
	- Generador de listas optimizadas multi-criterio (precio, salud, balanceado)
	- Algoritmo de mochila (knapsack) para optimizar bajo presupuesto
	- Cálculo estimado de impacto ambiental (CO₂, agua, residuos, energía)
	- Frontend con páginas: Buscar producto, Optimizar lista, Mi mochila

**Estructura del repositorio**

- `backend/` - código FastAPI
	- `app/main.py` - app y routers
	- `app/api/` - endpoints: `products.py`, `shopping.py`, `knapsack.py`
	- `app/services/` - lógicas (openfoodfacts, price, sustainability, impact, knapsack)
	- `app/models/` - Pydantic models
	- `backend/data/prices.json` - dataset de ejemplo (precios)
- `frontend/` - app React + Vite

Requisitos (local): Python 3.11+, Node.js 18+ (o LTS), npm

Cómo ejecutar

**Local (desarrollo)**

1) Backend

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

La API quedará en `http://localhost:8000` (health: `GET /health`).

2) Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev
```

Por defecto Vite sirve en `http://localhost:5173`.

API endpoints principales

- `GET /products/{barcode}`
	- Devuelve un `ProductModel` con campos: `barcode`, `name`, `brand`, `nutriments`, `sustainability_score`, `price`, `impact`.
	- Ejemplo:
		```bash
		curl http://localhost:8000/products/7613035144699
		```

- `POST /shopping-list/optimize` (body JSON)
	- Request body (`ShoppingListRequest`):
		```json
		{
			"items": [{"barcode": "7613035144699", "quantity": 2}],
			"objective": "cheapest"  
		}
		```
	- Response (`ShoppingListResponse`): incluye `total_price`, `average_sustainability`, `objective`, `items` (cada item: `barcode`, `name`, `quantity`, `unit_price`, `total_price`, `sustainability_score`, `nutriments?`), y `environmental_impact` con totales (`total_co2_kg`, `total_water_liters`, `total_waste_kg`, `average_impact_score`).

- `POST /knapsack/solve` (body JSON)
	- Request (`KnapsackRequest`): `{ "budget": 10000, "items": [{"barcode":"...","quantity":1}] }`
	- Response (`KnapsackResponse`): `{ best_value, total_cost, items, environmental_impact }`

Diseño de modelos (resumen)

- `ProductModel`:
	- `barcode`, `name`, `brand`, `nutriments` (raw), `sustainability_score` (float 0-100), `price` (float), `impact` (dict con `co2_kg`, `water_liters`, `waste_kg`, `energy_kwh`, `impact_score`, `category`).
- `ShoppingListResponse`:
	- `total_price`, `average_sustainability`, `objective`, `items`, `environmental_impact`.

Cómo se calculan los algoritmos (resumen técnico)

1) Scoring de sostenibilidad (Service: `SustainabilityService`)
	- Heurística: combina factores nutricionales y NOVA/category heuristics para producir un score entre 0 (mejor) y 100 (peor).
	- Variables consideradas: azúcares, grasas saturadas, sodio, calorías, grado de procesamiento (NOVA), etc.

2) Mochila multi-objetivo (Service: `MultiObjectiveKnapsack`)
	- Implementación: programación dinámica 0/1 (DP) que maximiza la suma de `value` (aquí usamos el `sustainability_score`) sujeta a la restricción `price <= budget`.
	- Resultado: conjunto de items que maximiza el valor total dentro del presupuesto.

3) Cálculo de impacto ambiental (Service: `EnvironmentalImpactService`)
	- Basado en factores por categoría (ej.: kg CO₂/kg, L agua/kg) definidos en tablas internas.
	- Clasificación de categoría por palabras clave en el nombre y heurísticas sobre nutriments.
	- Estimación de peso: si no hay peso, heurística `estimated_weight_kg = max(0.1, price / 5000)` (se asume ~5000 CLP/kg en ausencia de datos). Para listas se usa price→peso * cantidad.
	- Fórmulas:
		- `co2_kg = co2_per_kg * weight_kg`
		- `water_liters = water_per_kg * weight_kg`
		- `waste_kg = waste_per_kg * weight_kg`
		- `energy_kwh = energy_per_kg * weight_kg`
	- Puntuación de impacto (0-100) normalizando co2, agua y residuos y combinándolos (pesos 0.5, 0.3, 0.2).

Dataset de ejemplo

- `backend/data/prices.json` incluye ~20-25 productos con `barcode, name, brand, size, price`.

Uso de IA

- Este proyecto recibió asistencia automática de un agente (GitHub Copilot) que generó y refactorizó partes del código y ayudó con documentación. El asistente utilizado se describe como "GPT-5 mini" en los registros del desarrollo. Siempre revisa los cambios y pruebas localmente.

Contacto / Autor 
Sebastian Cifuentes