from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_connection

router = APIRouter()

class CategoriaIn(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

@router.get("/")
def listar():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM categorias ORDER BY nombre").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{id}")
def obtener(id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM categorias WHERE id=?", (id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Categoría no encontrada")
    return dict(row)

@router.post("/", status_code=201)
def crear(data: CategoriaIn):
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO categorias (nombre, descripcion) VALUES (?,?)",
            (data.nombre, data.descripcion)
        )
        conn.commit()
        row = conn.execute("SELECT * FROM categorias WHERE id=?", (cur.lastrowid,)).fetchone()
        return dict(row)
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()

@router.put("/{id}")
def actualizar(id: int, data: CategoriaIn):
    conn = get_connection()
    try:
        cur = conn.execute(
            "UPDATE categorias SET nombre=?, descripcion=? WHERE id=?",
            (data.nombre, data.descripcion, id)
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Categoría no encontrada")
        row = conn.execute("SELECT * FROM categorias WHERE id=?", (id,)).fetchone()
        return dict(row)
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()

@router.delete("/{id}", status_code=204)
def eliminar(id: int):
    conn = get_connection()
    try:
        cur = conn.execute("DELETE FROM categorias WHERE id=?", (id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Categoría no encontrada")
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()