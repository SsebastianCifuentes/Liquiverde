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
