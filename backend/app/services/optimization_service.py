from typing import List, Dict, Any
from app.models.product_models import Product, ShoppingListRequest, OptimizedShoppingList, ShoppingListItem

class OptimizationService:
    def __init__(self):
        self.products_db = []  # Aquí cargaremos nuestros productos
    
    def multi_objective_knapsack(self, products: List[Product], budget: float, 
                               sustainability_weight: float = 0.6, 
                               price_weight: float = 0.4) -> OptimizedShoppingList:
        """
        Algoritmo de mochila multi-objetivo para optimizar compras
        
        Args:
            products: Lista de productos disponibles
            budget: Presupuesto máximo
            sustainability_weight: Peso de la sostenibilidad (0-1)
            price_weight: Peso del precio (0-1)
        """
        if not products:
            return OptimizedShoppingList(
                items=[],
                total_cost=0,
                total_sustainability=0,
                budget_used=0,
                budget_remaining=budget
            )
        
        # Calcular score compuesto para cada producto
        scored_products = []
        for product in products:
            # Normalizar scores (0-1)
            normalized_sustainability = product.sustainability_score / 100.0
            normalized_price = 1 - (product.price / max(p.price for p in products))  # Precio más bajo = mejor
            
            # Score compuesto
            composite_score = (sustainability_weight * normalized_sustainability + 
                            price_weight * normalized_price)
            
            scored_products.append({
                "product": product,
                "composite_score": composite_score,
                "price": product.price
            })
        
        # Ordenar productos por score compuesto (mejores primero)
        scored_products.sort(key=lambda x: x["composite_score"], reverse=True)
        
        # Algoritmo greedy: seleccionar productos hasta agotar presupuesto
        selected_items = []
        total_cost = 0
        total_sustainability = 0
        
        for item in scored_products:
            if total_cost + item["price"] <= budget:
                # Agregar producto a la lista
                selected_items.append(
                    ShoppingListItem(product=item["product"], quantity=1)
                )
                total_cost += item["price"]
                total_sustainability += item["product"].sustainability_score
        
        return OptimizedShoppingList(
            items=selected_items,
            total_cost=total_cost,
            total_sustainability=total_sustainability,
            budget_used=total_cost,
            budget_remaining=budget - total_cost
        )
    
    def optimize_shopping_list(self, request: ShoppingListRequest, 
                             available_products: List[Product]) -> OptimizedShoppingList:
        """
        Optimiza una lista de compras basado en presupuesto y preferencias
        """
        # Filtrar productos según preferencias
        filtered_products = self._filter_products(available_products, request.preferences, request.excluded_categories)
        
        # Aplicar algoritmo de optimización
        return self.multi_objective_knapsack(filtered_products, request.budget)
    
    def _filter_products(self, products: List[Product], preferences: List[str], 
                        excluded_categories: List[str]) -> List[Product]:
        """
        Filtra productos según preferencias y categorías excluidas
        """
        filtered = []
        
        for product in products:
            # Verificar categorías excluidas
            if product.category and any(excluded.lower() in product.category.lower() 
                                      for excluded in excluded_categories):
                continue
            
            # Verificar preferencias
            if preferences:
                matches_preference = any(pref.lower() in product.name.lower() or 
                                       (product.category and pref.lower() in product.category.lower())
                                       for pref in preferences)
                if not matches_preference:
                    continue
            
            filtered.append(product)
        
        return filtered

# Instancia global del servicio
optimization_service = OptimizationService()