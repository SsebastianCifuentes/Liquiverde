from fastapi import FastAPI
from app.api import products, shopping, knapsack
from app.database.database import Base, engine

app = FastAPI(
    title="LiquiVerde API",
    version="0.1.0",
)

app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(shopping.router, prefix="/shopping-list", tags=["shopping"])
app.include_router(knapsack.router, prefix="/knapsack", tags=["optimizer"])
Base.metadata.create_all(bind=engine)

@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok", "message": "LiquiVerde API running"}
