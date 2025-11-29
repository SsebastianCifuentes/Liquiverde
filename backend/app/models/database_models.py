from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class ProductDB(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    barcode = Column(String(100), unique=True, index=True, nullable=False)
    brand = Column(String(100))
    category = Column(String(100))
    price = Column(Float, nullable=False)
    sustainability_score = Column(Float, default=50.0)
    environmental_impact = Column(Float, default=1.0)
    social_impact = Column(Float)
    nutritional_score = Column(Float)
    image_url = Column(Text)
    raw_data = Column(Text)  # Guardamos los datos originales de Open Food Facts
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convierte el modelo de SQLAlchemy a dict para Pydantic"""
        return {
            "id": self.id,
            "name": self.name,
            "barcode": self.barcode,
            "brand": self.brand,
            "category": self.category,
            "price": self.price,
            "sustainability_score": self.sustainability_score,
            "environmental_impact": self.environmental_impact,
            "social_impact": self.social_impact,
            "nutritional_score": self.nutritional_score,
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }