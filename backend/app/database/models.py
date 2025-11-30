from sqlalchemy import Column, String, Float, Text
from sqlalchemy.dialects.sqlite import JSON
from app.database.database import Base

class ProductDB(Base):
    __tablename__ = "products"

    barcode = Column(String, primary_key=True, index=True)
    name = Column(String)
    brand = Column(String)
    nutrients_json = Column(Text)
    sustainability_score = Column(Float)
    price = Column(Float)
    category = Column(String)
