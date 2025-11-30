from fastapi import FastAPI

from app.api import products

app = FastAPI(
    title="LiquiVerde API",
    version="0.1.0",
)

app.include_router(products.router, prefix="/products", tags=["products"])


@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok", "message": "LiquiVerde API running"}
