from pydantic import BaseModel
from typing import Optional

class ProductModel(BaseModel):
    barcode: str
    name: Optional[str]
    brand: Optional[str]
    nutriments: Optional[dict] = None
    sustainability_score: Optional[float] = None
    price: Optional[float] = None