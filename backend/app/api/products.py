from fastapi import APIRouter
from app.services.openfoodfacts_service import OpenFoodFactsService
from app.services.price_service import LocalPriceService
from app.services.sustainability_service import SustainabilityService
from app.models.product import ProductModel

router = APIRouter()

@router.get("/{barcode}", response_model=ProductModel)
async def get_product(barcode: str):
    """
    Devuelve información del producto usando OpenFoodFacts
    y el precio desde un dataset local.
    """
    product = await OpenFoodFactsService.get_product(barcode)

    # Agregar precio desde dataset local
    price = LocalPriceService.get_price_by_barcode(barcode)
    product.price = price

    score = SustainabilityService.compute_score(product.nutriments)
    product.sustainability_score = score

    return product
