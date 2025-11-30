from pydantic import BaseModel
from typing import List

class KnapsackItem(BaseModel):
    barcode: str
    quantity: int = 1

class KnapsackRequest(BaseModel):
    budget: float
    items: List[KnapsackItem]

class KnapsackResponse(BaseModel):
    best_value: float
    total_cost: float
    items: list
    environmental_impact: dict  # {total_co2_kg, total_water_liters, total_waste_kg, average_impact_score}
