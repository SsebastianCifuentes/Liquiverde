from fastapi import APIRouter
from app.models.shopping_list import ShoppingListRequest, ShoppingListResponse
from app.services.shopping_service import ShoppingOptimizer

router = APIRouter()

@router.post("/optimize", response_model=ShoppingListResponse)
async def optimize_shopping_list(body: ShoppingListRequest):
    result = await ShoppingOptimizer.optimize(body.items, body.objective)
    return result
