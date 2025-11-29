import requests
import aiohttp
import asyncio
from typing import Optional, Dict, Any

class OpenFoodFactsClient:
    def __init__(self):
        self.base_url = "https://world.openfoodfacts.org/api/v0"
    
    async def get_product_by_barcode(self, barcode: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene información de un producto por código de barras
        """
        try:
            url = f"{self.base_url}/product/{barcode}.json"
            
            # Usamos aiohttp para requests asíncronos (más eficiente)
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        # Verificar que el producto existe
                        if data.get("status") == 1:
                            return data.get("product", {})
                        else:
                            return None
                    else:
                        print(f"Error API: {response.status}")
                        return None
                        
        except Exception as e:
            print(f"Error getting product: {e}")
            return None
    
    def transform_product_data(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transforma los datos de Open Food Facts a nuestro formato
        """
        # Extraer información básica
        product_name = raw_data.get("product_name", "Producto sin nombre")
        brands = raw_data.get("brands", "")
        categories = raw_data.get("categories", "")
        
        # Intentar obtener precio (no siempre disponible en OFF)
        price = self._extract_price(raw_data)
        
        # Calcular scoring de sostenibilidad
        sustainability_score = self._calculate_sustainability_score(raw_data)
        
        return {
            "name": product_name,
            "barcode": raw_data.get("code", ""),
            "brand": brands,
            "category": categories.split(',')[0] if categories else "Sin categoría",
            "price": price,
            "sustainability_score": sustainability_score,
            "environmental_impact": self._calculate_environmental_impact(raw_data),
            "nutritional_score": self._extract_nutritional_score(raw_data),
            "image_url": raw_data.get("image_url", ""),
            "raw_data": raw_data  # Guardamos los datos originales por si los necesitamos
        }
    
    def _extract_price(self, raw_data: Dict[str, Any]) -> float:
        """Extrae el precio del producto si está disponible"""
        # Open Food Facts no siempre tiene precios, así que usamos un valor por defecto
        price = raw_data.get("product_quantity", 1000)  # Valor por defecto basado en cantidad
        
        # Si tenemos datos de países, podríamos estimar mejor el precio
        countries = raw_data.get("countries", "").lower()
        if "chile" in countries:
            return 1500.0  # Precio estimado para Chile
        elif "argentina" in countries:
            return 1200.0
        else:
            return 1000.0  # Precio por defecto
    
    def _calculate_sustainability_score(self, raw_data: Dict[str, Any]) -> float:
        """
        Calcula un score de sostenibilidad basado en varios factores
        (Por ahora es un placeholder - lo mejoraremos después)
        """
        score = 50.0  # Puntuación base
        
        # Factor 1: Etiquetas ecológicas
        labels = raw_data.get("labels", "").lower()
        if "organic" in labels or "bio" in labels:
            score += 20
        if "fairtrade" in labels:
            score += 15
            
        # Factor 2: Empaque
        packaging = raw_data.get("packaging", "").lower()
        if "recyclable" in packaging:
            score += 10
        if "plastic" in packaging:
            score -= 10
            
        # Asegurar que esté entre 0-100
        return max(0, min(100, score))
    
    def _calculate_environmental_impact(self, raw_data: Dict[str, Any]) -> float:
        """Calcula impacto ambiental estimado en kg CO2"""
        # Por ahora es una estimación simple
        base_impact = 1.0
        
        # Ajustar según categoría
        categories = raw_data.get("categories", "").lower()
        if "meat" in categories:
            return base_impact * 3.0  # La carne tiene mayor impacto
        elif "vegetable" in categories or "fruit" in categories:
            return base_impact * 0.5  # Vegetales tienen menor impacto
        else:
            return base_impact
    
    def _extract_nutritional_score(self, raw_data: Dict[str, Any]) -> Optional[float]:
        """Extrae el score nutricional si está disponible"""
        nutriscore = raw_data.get("nutriscore_grade", "").upper()
        
        # Convertir letra a número (A=100, B=80, C=60, D=40, E=20)
        nutriscore_map = {"A": 100, "B": 80, "C": 60, "D": 40, "E": 20}
        return nutriscore_map.get(nutriscore, 50)  # 50 si no hay datos

# Instancia global del cliente
food_facts_client = OpenFoodFactsClient()