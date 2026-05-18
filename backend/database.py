import sqlite3
import os
from pathlib import Path

DB_PATH = os.getenv("DB_PATH", "/data/tienda.db")
SCHEMA_PATH = Path(__file__).parent.parent / "database" / "schema.sql"
if not SCHEMA_PATH.exists():
    SCHEMA_PATH = Path(__file__).parent / ".." / "database" / "schema.sql"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_connection()
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()