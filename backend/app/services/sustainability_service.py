from typing import Optional, Dict

class SustainabilityService:

    @staticmethod
    def compute_score(nutriments: Optional[Dict]) -> Optional[float]:
        if not nutriments:
            return None

        score = 100

        # 1. NOVA
        nova = nutriments.get("nova-group")
        if nova:
            score -= (nova - 1) * 8

        # 2. Azúcar (g / 100g)
        sugars = nutriments.get("sugars_100g", 0)
        if sugars:
            score -= sugars * 0.5

        # 3. Grasa saturada
        sat_fat = nutriments.get("saturated-fat_100g", 0)
        if sat_fat:
            score -= sat_fat * 0.3

        # 4. Sal
        salt = nutriments.get("salt_100g", 0)
        if salt:
            score -= salt * 2

        # 5. Calorías
        calories = nutriments.get("energy-kcal_100g", 0)
        if calories:
            score -= calories * 0.05

        # Normalizar a 0-100
        score = max(0, min(100, score))

        return round(score, 2)
