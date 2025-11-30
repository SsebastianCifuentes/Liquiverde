import asyncio
try:
    import uvloop
    asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
except ImportError:
    # uvloop no está disponible (Windows), usa event loop por defecto
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import products, shopping, knapsack
from app.database.database import Base, engine

app = FastAPI(
    title="LiquiVerde API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(shopping.router, prefix="/shopping-list", tags=["shopping"])
app.include_router(knapsack.router, prefix="/knapsack", tags=["optimizer"])
Base.metadata.create_all(bind=engine)

@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok", "message": "LiquiVerde API running"}
