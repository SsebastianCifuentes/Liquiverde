from app.services.openfoodfacts_service import OpenFoodFactsService
from app.services.price_service import LocalPriceService
from app.services.sustainability_service import SustainabilityService

class MultiObjectiveKnapsack:

    @staticmethod
    async def solve(budget, shopping_items):
        # Step 1: obtener productos + valores
        products = []

        for item in shopping_items:
            product = await OpenFoodFactsService.get_product(item.barcode)
            price = LocalPriceService.get_price_by_barcode(item.barcode) or 0
            score = SustainabilityService.compute_score(product.nutriments) or 0

            products.append({
                "barcode": item.barcode,
                "name": product.name,
                "price": price,
                "value": score,    # valor a maximizar
            })

        n = len(products)
        W = budget

        # DP table
        dp = [[0] * (int(W) + 1) for _ in range(n + 1)]
        choose = [[False] * (int(W) + 1) for _ in range(n + 1)]

        # Knapsack: maximize sustainability score under a price constraint
        for i in range(1, n + 1):
            p = products[i - 1]
            w = int(p["price"])
            v = p["value"]

            for b in range(0, int(W) + 1):
                if w <= b:
                    if dp[i - 1][b - w] + v > dp[i - 1][b]:
                        dp[i][b] = dp[i - 1][b - w] + v
                        choose[i][b] = True
                    else:
                        dp[i][b] = dp[i - 1][b]
                else:
                    dp[i][b] = dp[i - 1][b]

        # Reconstrucción
        res = []
        b = int(W)

        for i in range(n, 0, -1):
            if choose[i][b]:
                res.append(products[i - 1])
                b -= int(products[i - 1]["price"])

        total_cost = sum(p["price"] for p in res)
        best_value = sum(p["value"] for p in res)

        return {
            "best_value": round(best_value, 2),
            "total_cost": round(total_cost, 2),
            "items": res
        }
