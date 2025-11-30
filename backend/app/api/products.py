from fastapi import APIRouter
from app.services.openfoodfacts_service import OpenFoodFactsService
from app.models.product import ProductModel

router = APIRouter()

@router.get("/{barcode}", response_model=ProductModel)
async def get_product(barcode: str):
    """
    Devuelve información básica del producto usando OpenFoodFacts.
    """
    product = await OpenFoodFactsService.get_product(barcode)
    return product