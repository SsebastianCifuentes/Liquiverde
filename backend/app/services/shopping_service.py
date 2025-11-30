from typing import List, Dict
from app.services.openfoodfacts_service import OpenFoodFactsService
from app.services.price_service import LocalPriceService
from app.services.sustainability_service import SustainabilityService


class ShoppingOptimizer:

    @staticmethod
    async def optimize(shopping_items, objective: str):
        results = []

        for item in shopping_items:
            barcode = item.barcode
            quantity = item.quantity

            # Obtener datos del producto
            product = await OpenFoodFactsService.get_product(barcode)

            # Precio
            price = LocalPriceService.get_price_by_barcode(barcode) or 0

            # Sustentabilidad
            score = SustainabilityService.compute_score(product.nutriments) or 0

            results.append({
                "barcode": barcode,
                "name": product.name,
                "quantity": quantity,
                "unit_price": price,
                "total_price": price * quantity,
                "sustainability_score": score
            })

        # Calcular totales
        total_price = sum(p["total_price"] for p in results)
        avg_sust = sum(p["sustainability_score"] for p in results) / len(results)

        # OPTIMIZACIÓN por objetivo (simple MVP)
        if objective == "cheapest":
            results = sorted(results, key=lambda p: p["unit_price"])

        elif objective == "healthiest":
            results = sorted(results, key=lambda p: p["sustainability_score"], reverse=True)

        elif objective == "balanced":
            # Puntaje simple: 50% precio, 50% sustentabilidad
            def balanced_score(p):
                price_norm = p["unit_price"]  # ya está en pesos
                sust_norm = 100 - p["sustainability_score"]
                return price_norm * 0.5 + sust_norm * 0.5

            results = sorted(results, key=balanced_score)

        return {
            "total_price": round(total_price, 2),
            "average_sustainability": round(avg_sust, 2),
            "objective": objective,
            "items": results
        }
