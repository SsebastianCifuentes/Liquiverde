import httpx
from app.models.product import ProductModel

class OpenFoodFactsService:
    BASE_URL = "https://world.openfoodfacts.org/api/v0/product/"

    @staticmethod
    async def get_product(barcode: str) -> ProductModel:
        url = f"{OpenFoodFactsService.BASE_URL}{barcode}.json"

        async with httpx.AsyncClient() as client:
            response = await client.get(url)

        data = response.json()

        # Si no existe producto en la API
        if data.get("status") == 0:
            return ProductModel(
                barcode=barcode,
                name=None,
                brand=None,
                nutriments=None,
                sustainability_score=None,
                price=None
            )

        product_data = data["product"]

        # Extraemos lo que nos interesa
        return ProductModel(
            barcode=barcode,
            name=product_data.get("product_name"),
            brand=product_data.get("brands"),
            nutriments=product_data.get("nutriments"),
            sustainability_score=None,
            price=None
        )
