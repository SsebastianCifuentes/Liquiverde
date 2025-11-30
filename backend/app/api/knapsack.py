from fastapi import APIRouter
from app.models.knapsack import KnapsackRequest, KnapsackResponse
from app.services.knapsack_service import MultiObjectiveKnapsack

router = APIRouter()

@router.post("/solve", response_model=KnapsackResponse)
async def solve_knapsack(body: KnapsackRequest):
    result = await MultiObjectiveKnapsack.solve(body.budget, body.items)
    return result
