from app.repositories.product_repository import ProductRepository
from app.services.sustainability_service import SustainabilityService
from app.services.price_service import LocalPriceService
from app.models.product import ProductModel
import httpx
import json

class OpenFoodFactsService:

    BASE_URL = "https://world.openfoodfacts.org/api/v0/product/"

    @staticmethod
    async def get_product(barcode: str):

        # 1. Buscar en BD
        db_product = ProductRepository.get(barcode)
        if db_product:
            return ProductModel(
                barcode=db_product.barcode,
                name=db_product.name,
                brand=db_product.brand,
                nutriments=json.loads(db_product.nutrients_json),
                sustainability_score=db_product.sustainability_score,
                price=db_product.price
            )

        # 2. NO está → obtener desde API OpenFoodFacts
        url = f"{OpenFoodFactsService.BASE_URL}{barcode}.json"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)

        data = response.json()

        if data.get("status") == 0:
            return None

        product_data = data["product"]

        nutr = product_data.get("nutriments", {})

        score = SustainabilityService.compute_score(nutr)
        price = LocalPriceService.get_price_by_barcode(barcode)

        product_dict = {
            "barcode": barcode,
            "name": product_data.get("product_name"),
            "brand": product_data.get("brands"),
            "nutriments": nutr,
            "sustainability_score": score,
            "price": price
        }

        # 3. Guardar en BD
        ProductRepository.save(product_dict)

        return ProductModel(**product_dict)