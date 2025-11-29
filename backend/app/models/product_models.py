from pydantic import BaseModel, Field
from typing import Optional, List, Dict

# Modelo para producto básico
class ProductBase(BaseModel):
    name: str = Field(..., description="Nombre del producto")
    barcode: str = Field(..., description="Código de barras")
    brand: Optional[str] = Field(None, description="Marca del producto")
    category: Optional[str] = Field(None, description="Categoría del producto")
    price: float = Field(..., ge=0, description="Precio en CLP")
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Leche Entera",
                "barcode": "7801234567890",
                "brand": "Soprole",
                "category": "Lácteos",
                "price": 1250.0
            }
        }

# Modelo extendido con información de sostenibilidad
class Product(ProductBase):
    id: int = Field(..., description="ID único del producto")
    sustainability_score: float = Field(..., ge=0, le=100, description="Puntuación de sostenibilidad (0-100)")
    environmental_impact: Optional[float] = Field(None, description="Impacto ambiental en kg CO2")
    social_impact: Optional[float] = Field(None, description="Puntuación de impacto social")
    nutritional_score: Optional[float] = Field(None, description="Puntuación nutricional")
    
    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "name": "Leche Entera",
                "barcode": "7801234567890",
                "brand": "Soprole",
                "category": "Lácteos",
                "price": 1250.0,
                "sustainability_score": 75.5,
                "environmental_impact": 1.2,
                "social_impact": 80.0,
                "nutritional_score": 65.0
            }
        }

# Modelo para respuesta de API
class ProductResponse(BaseModel):
    success: bool
    product: Optional[Product] = None
    message: Optional[str] = None

# Modelo para lista de compras
class ShoppingListRequest(BaseModel):
    budget: float = Field(..., gt=0, description="Presupuesto disponible")
    preferences: List[str] = Field(default=[], description="Preferencias del usuario")
    excluded_categories: List[str] = Field(default=[], description="Categorías a excluir")

class ShoppingListItem(BaseModel):
    product: Product
    quantity: int = Field(..., gt=0)

class OptimizedShoppingList(BaseModel):
    items: List[ShoppingListItem]
    total_cost: float
    total_sustainability: float
    budget_used: float
    budget_remaining: float