from pydantic import BaseModel
from typing import Optional

class ProductModel(BaseModel):
    barcode: str
    name: Optional[str]
    brand: Optional[str]
    nutriments: Optional[dict] = None
    sustainability_score: Optional[float] = None
    price: Optional[float] = None
    impact: Optional[dict] = None  # {co2_kg, water_liters, waste_kg, energy_kwh, impact_score, category}