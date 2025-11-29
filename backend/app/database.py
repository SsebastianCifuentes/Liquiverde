from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.database_models import Base
import os

# URL de la base de datos SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./liquiverde.db"

# Crear engine de SQLAlchemy
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},  # Necesario para SQLite
    echo=True  # Muestra las queries SQL en consola (útil para desarrollo)
)

# SessionLocal para interactuar con la BD
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear todas las tablas
def create_tables():
    Base.metadata.create_all(bind=engine)

# Dependencia para obtener sesión de BD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Función para inicializar la BD (opcional)
def init_db():
    create_tables()
    print("✅ Tablas de la base de datos creadas exitosamente!")