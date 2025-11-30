import json
from pathlib import Path
from typing import Optional


class LocalPriceService:
    DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "prices.json"
    _cache = None

    @classmethod
    def _load_data(cls):
        """
        print("DATA_PATH:", cls.DATA_PATH)
        print("EXISTS?:", cls.DATA_PATH.exists())
        """
        if cls._cache is None:
            with open(cls.DATA_PATH, "r", encoding="utf-8") as f:
                cls._cache = json.load(f)
        return cls._cache

    @classmethod
    def get_price_by_barcode(cls, barcode: str) -> Optional[float]:
        data = cls._load_data()
        for item in data:
            if item.get("barcode") == barcode:
                return float(item.get("price"))
        return None
