from app.database.database import SessionLocal
from app.database.models import ProductDB
import json

class ProductRepository:

    @staticmethod
    def get(barcode: str):
        db = SessionLocal()
        product = db.query(ProductDB).filter(ProductDB.barcode == barcode).first()
        db.close()
        return product

    @staticmethod
    def save(product_data):
        db = SessionLocal()
        obj = ProductDB(
            barcode = product_data["barcode"],
            name = product_data["name"],
            brand = product_data["brand"],
            nutrients_json = json.dumps(product_data["nutriments"]),
            sustainability_score = product_data["sustainability_score"],
            price = product_data["price"],
            category = product_data.get("category")
        )
        db.add(obj)
        db.commit()
        db.close()

    @staticmethod
    def exists(barcode: str):
        return ProductRepository.get(barcode) is not None
