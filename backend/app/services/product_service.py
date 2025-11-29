from sqlalchemy.orm import Session
from app.models.database_models import ProductDB
from app.utils.api_client import food_facts_client
import json

class ProductService:
    
    async def get_or_create_product(self, db: Session, barcode: str):
        """
        Busca producto en BD, si no existe lo busca en Open Food Facts y lo guarda
        """
        print(f"🔍 Buscando producto con código: {barcode}")
        
        # 1. Buscar en base de datos primero
        existing_product = db.query(ProductDB).filter(ProductDB.barcode == barcode).first()
        if existing_product:
            print(f"✅ Producto encontrado en BD: {existing_product.name}")
            return existing_product.to_dict()
        
        print(f"📡 Producto no encontrado en BD, buscando en Open Food Facts...")
        
        # 2. Buscar en Open Food Facts
        raw_data = await food_facts_client.get_product_by_barcode(barcode)
        if not raw_data:
            print(f"❌ Producto no encontrado en Open Food Facts")
            return None
        
        # 3. Transformar datos a nuestro formato
        product_data = food_facts_client.transform_product_data(raw_data)
        
        # 4. Guardar en base de datos
        try:
            db_product = ProductDB(
                name=product_data.get("name", "Producto sin nombre"),
                barcode=barcode,
                brand=product_data.get("brand"),
                category=product_data.get("category"),
                price=product_data.get("price", 1000.0),
                sustainability_score=product_data.get("sustainability_score", 50.0),
                environmental_impact=product_data.get("environmental_impact", 1.0),
                social_impact=product_data.get("social_impact"),
                nutritional_score=product_data.get("nutritional_score"),
                image_url=product_data.get("image_url", ""),
                raw_data=json.dumps(raw_data)  # Guardamos datos originales
            )
            
            db.add(db_product)
            db.commit()
            db.refresh(db_product)
            
            print(f"💾 Producto guardado en BD: {db_product.name} (ID: {db_product.id})")
            return db_product.to_dict()
            
        except Exception as e:
            db.rollback()
            print(f"❌ Error guardando producto en BD: {e}")
            return None
    
    def get_all_products(self, db: Session):
        """
        Obtiene todos los productos de la base de datos
        """
        products = db.query(ProductDB).order_by(ProductDB.created_at.desc()).all()
        print(f"📦 Obteniendo {len(products)} productos de la BD")
        return [product.to_dict() for product in products]
    
    def get_product_by_id(self, db: Session, product_id: int):
        """
        Obtiene un producto por su ID
        """
        product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
        return product.to_dict() if product else None

# Instancia global del servicio
product_service = ProductService()