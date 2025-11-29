from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn

# Importar nuestros módulos
from app.models.product_models import Product, ProductResponse, ShoppingListRequest, OptimizedShoppingList
from app.services.optimization_service import optimization_service
from app.services.product_service import product_service
from app.database import get_db, create_tables

# Crear aplicación FastAPI
app = FastAPI(
    title="LiquiVerde Retail API",
    description="API para plataforma de retail inteligente y sostenible",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas al iniciar la aplicación
@app.on_event("startup")
async def startup_event():
    create_tables()
    print("🚀 LiquiVerde API iniciada con base de datos SQLite")

# Rutas de la API
@app.get("/")
async def root():
    return {
        "message": "¡Bienvenido a LiquiVerde Retail API!",
        "status": "active", 
        "version": "1.0.0",
        "database": "SQLite"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# Obtener todos los productos (desde BD)
@app.get("/products", response_model=list[Product])
async def get_products(db: Session = Depends(get_db)):
    products = product_service.get_all_products(db)
    return products

# Buscar producto por código de barras
@app.get("/products/{barcode}", response_model=ProductResponse)
async def get_product_by_barcode(barcode: str, db: Session = Depends(get_db)):
    product_data = await product_service.get_or_create_product(db, barcode)
    
    if product_data:
        return ProductResponse(success=True, product=product_data)
    else:
        return ProductResponse(
            success=False, 
            message=f"Producto con código {barcode} no encontrado"
        )

# Optimizar lista de compras
@app.post("/optimize-shopping-list", response_model=OptimizedShoppingList)
async def optimize_shopping_list(
    request: ShoppingListRequest, 
    db: Session = Depends(get_db)
):
    # Obtener productos desde la BD
    available_products = [Product(**product) for product in product_service.get_all_products(db)]
    
    if not available_products:
        raise HTTPException(
            status_code=400, 
            detail="No hay productos disponibles. Escanea algunos productos primero."
        )
    
    # Optimizar la lista
    optimized_list = optimization_service.optimize_shopping_list(request, available_products)
    
    return optimized_list

# Ruta de prueba para optimización
@app.get("/test-optimization")
async def test_optimization(db: Session = Depends(get_db)):
    """
    Ruta de prueba GET para el algoritmo de optimización
    """
    try:
        # Crear request de prueba
        test_request = ShoppingListRequest(
            budget=5000,
            preferences=[],
            excluded_categories=[]
        )
        
        # Obtener productos desde BD
        available_products = [Product(**product) for product in product_service.get_all_products(db)]
        
        if not available_products:
            return {
                "success": False,
                "message": "❌ Primero escanea algunos productos. Visita: /products/7613034626844",
                "available_products": 0
            }
        
        # Ejecutar optimización
        optimized_list = optimization_service.optimize_shopping_list(
            test_request, available_products
        )
        
        return {
            "success": True,
            "message": "✅ Optimización completada",
            "test_parameters": {
                "budget": 5000,
                "preferences": [],
                "excluded_categories": []
            },
            "available_products": len(available_products),
            "optimized_list": optimized_list.dict()
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"❌ Error en optimización: {str(e)}",
            "available_products": 0
        }

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )