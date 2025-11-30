"""
Servicio de Cálculo de Impacto Ambiental

Calcula: CO2 (kg), agua (L), residuos (kg), energía (kWh)
Basado en nutrientes, categoría de producto, y estándares internacionales
"""


class EnvironmentalImpactService:
    """
    Calcula impacto ambiental usando estándares de ciclo de vida (LCA)
    Fuentes:
    - FAO: https://www.fao.org/3/ca6799en/ca6799en.pdf
    - ADEME: https://www.ademe.fr/
    - Our World in Data: https://ourworldindata.org/food-choice-vs-eating-local
    """

    # Emisiones de CO2 por categoría (kg CO2eq por kg de producto)
    CO2_BY_CATEGORY = {
        "beef": 27.0,
        "lamb": 24.0,
        "cheese": 12.0,
        "pork": 12.0,
        "farmed fish": 10.0,
        "eggs": 4.6,
        "chicken": 6.9,
        "nuts": 0.4,
        "oils": 2.5,
        "cereals": 1.0,
        "rice": 2.7,
        "pasta": 1.5,
        "bread": 1.2,
        "vegetables": 0.9,
        "fruits": 0.7,
        "legumes": 0.4,
        "dairy": 3.2,
        "processed": 2.5,
        "drinks": 0.8,
        "default": 1.5
    }

    # Agua por categoría (L por kg de producto)
    WATER_BY_CATEGORY = {
        "beef": 15000,
        "lamb": 10000,
        "cheese": 5000,
        "pork": 6000,
        "farmed fish": 3000,
        "eggs": 2700,
        "chicken": 4300,
        "nuts": 2500,
        "oils": 6000,
        "cereals": 1500,
        "rice": 2500,
        "pasta": 1800,
        "bread": 2400,
        "vegetables": 400,
        "fruits": 700,
        "legumes": 4000,
        "dairy": 1000,
        "processed": 800,
        "drinks": 300,
        "default": 1000
    }

    # Residuos por categoría (kg residuos por kg producto)
    WASTE_BY_CATEGORY = {
        "beef": 0.3,
        "dairy": 0.15,
        "processed": 0.25,
        "vegetables": 0.2,
        "fruits": 0.15,
        "cereals": 0.05,
        "default": 0.1
    }

    # Energía por categoría (kWh por kg)
    ENERGY_BY_CATEGORY = {
        "beef": 20.0,
        "dairy": 4.5,
        "processed": 3.0,
        "cereals": 0.5,
        "vegetables": 0.3,
        "fruits": 0.2,
        "default": 0.5
    }

    @staticmethod
    def _categorize_product(name: str, nutriments: dict) -> str:
        """Intenta categorizar el producto basado en nombre y nutrientes"""
        name_lower = name.lower()

        # Patrones de búsqueda
        patterns = {
            "beef": ["carne roja", "beef", "res", "vacuno"],
            "dairy": ["leche", "yogur", "queso", "mantequilla", "crema"],
            "chicken": ["pollo", "chicken"],
            "pork": ["cerdo", "jamón", "mortadela"],
            "fish": ["salmón", "atún", "pescado"],
            "cereals": ["cereal", "avena", "trigo"],
            "bread": ["pan", "bread"],
            "pasta": ["pasta", "fideos"],
            "rice": ["arroz", "rice"],
            "vegetables": ["verdura", "vegetable", "zanahoria", "brócoli"],
            "fruits": ["fruta", "fruta", "manzana", "naranja"],
            "legumes": ["legume", "lenteja", "porotos"],
            "oils": ["aceite", "oil"],
            "nuts": ["nuez", "almendra", "nut"],
            "drinks": ["bebida", "jugo", "soda", "té", "café"],
            "processed": ["galleta", "cookie", "snack", "pringles"]
        }

        for category, keywords in patterns.items():
            for keyword in keywords:
                if keyword in name_lower:
                    return category

        # Si tiene proteína alta → probablemente animal
        if "protein" in nutriments and nutriments.get("protein", 0) > 15:
            return "beef"

        return "default"

    @staticmethod
    def compute_impact(nutriments: dict, name: str = "", weight_kg: float = 1.0) -> dict:
        """
        Calcula impacto ambiental de un producto

        Args:
            nutriments: dict con datos nutricionales
            name: nombre del producto para categorización
            weight_kg: peso del producto en kg

        Returns:
            dict con:
            - co2_kg: kg de CO2 equivalente
            - water_liters: litros de agua
            - waste_kg: kg de residuos
            - energy_kwh: kWh de energía
            - impact_score: puntuación 0-100 (100 = máximo impacto = peor)
        """

        category = EnvironmentalImpactService._categorize_product(name, nutriments)

        co2_per_kg = EnvironmentalImpactService.CO2_BY_CATEGORY.get(category, 1.5)
        water_per_kg = EnvironmentalImpactService.WATER_BY_CATEGORY.get(category, 1000)
        waste_per_kg = EnvironmentalImpactService.WASTE_BY_CATEGORY.get(category, 0.1)
        energy_per_kg = EnvironmentalImpactService.ENERGY_BY_CATEGORY.get(category, 0.5)

        # Calcular totales para el producto
        co2_kg = co2_per_kg * weight_kg
        water_liters = water_per_kg * weight_kg
        waste_kg = waste_per_kg * weight_kg
        energy_kwh = energy_per_kg * weight_kg

        # Puntuación de impacto (0-100, donde 100 es peor)
        # Normalizar sobre máximos conocidos
        co2_score = min(100, (co2_kg / 30) * 100)  # max ~30 kg CO2 (carne roja)
        water_score = min(100, (water_liters / 15000) * 100)  # max ~15k L (carne roja)
        waste_score = min(100, (waste_kg / 0.3) * 100)  # max ~0.3 kg residuos

        impact_score = (co2_score * 0.5 + water_score * 0.3 + waste_score * 0.2)

        return {
            "co2_kg": round(co2_kg, 3),
            "water_liters": round(water_liters, 1),
            "waste_kg": round(waste_kg, 3),
            "energy_kwh": round(energy_kwh, 2),
            "impact_score": round(impact_score, 1),
            "category": category
        }

    @staticmethod
    def compute_impact_batch(items: list) -> dict:
        """
        Calcula impacto total de una lista de productos

        Args:
            items: lista de dicts con {name, nutriments, quantity, unit_price, ...}

        Returns:
            dict con totales y promedio de impacto
        """
        total_co2 = 0.0
        total_water = 0.0
        total_waste = 0.0
        total_energy = 0.0
        total_impact_score = 0.0

        for item in items:
            name = item.get("name", "")
            nutriments = item.get("nutriments", {})
            quantity = item.get("quantity", 1)

            # Estimar peso: si tiene precio ~$1000 por kg, son ~200g
            # Heurística simple: price / 5000 = kg (asumiendo ~5000 CLP/kg)
            price = item.get("unit_price", 1000)
            estimated_weight = max(0.1, price / 5000)  # mínimo 100g

            impact = EnvironmentalImpactService.compute_impact(
                nutriments, name, estimated_weight * quantity
            )

            total_co2 += impact["co2_kg"]
            total_water += impact["water_liters"]
            total_waste += impact["waste_kg"]
            total_energy += impact["energy_kwh"]
            total_impact_score += impact["impact_score"]

        avg_impact = total_impact_score / len(items) if items else 0

        return {
            "total_co2_kg": round(total_co2, 3),
            "total_water_liters": round(total_water, 1),
            "total_waste_kg": round(total_waste, 3),
            "total_energy_kwh": round(total_energy, 2),
            "average_impact_score": round(avg_impact, 1)
        }
