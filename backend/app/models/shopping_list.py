from pydantic import BaseModel
from typing import List


class ShoppingItem(BaseModel):
    barcode: str
    quantity: int = 1


class ShoppingListRequest(BaseModel):
    items: List[ShoppingItem]
    objective: str = "cheapest"  # cheapest, healthiest, balanced


class ShoppingListResponse(BaseModel):
    total_price: float
    average_sustainability: float
    objective: str
    items: list
    environmental_impact: dict  # {total_co2_kg, total_water_liters, total_waste_kg, average_impact_score}
