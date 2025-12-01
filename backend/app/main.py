import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import products, shopping, knapsack
from app.database.database import Base, engine

load_dotenv()

allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "*")

allowed_origins = (
    ["*"] if allowed_origins_raw == "*"
    else [o.strip() for o in allowed_origins_raw.split(",")]
)

app = FastAPI(
    title="LiquiVerde API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(shopping.router, prefix="/shopping-list", tags=["shopping"])
app.include_router(knapsack.router, prefix="/knapsack", tags=["optimizer"])

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok", "message": "LiquiVerde API running"}
