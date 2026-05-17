from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_connection

router = APIRouter()

class ProductoIn(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    stock: int = 0
    categoria_id: int
    proveedor_id: int

@router.get("/")
def listar():
    conn = get_connection()
    rows = conn.execute("""
        SELECT p.*, c.nombre as categoria, v.nombre as proveedor
        FROM productos p
        JOIN categorias c ON c.id = p.categoria_id
        JOIN proveedores v ON v.id = p.proveedor_id
        ORDER BY p.nombre
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{id}")
def obtener(id: int):
    conn = get_connection()
    row = conn.execute("""
        SELECT p.*, c.nombre as categoria, v.nombre as proveedor
        FROM productos p
        JOIN categorias c ON c.id = p.categoria_id
        JOIN proveedores v ON v.id = p.proveedor_id
        WHERE p.id=?
    """, (id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Producto no encontrado")
    return dict(row)

@router.post("/", status_code=201)
def crear(data: ProductoIn):
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, proveedor_id) VALUES (?,?,?,?,?,?)",
            (data.nombre, data.descripcion, data.precio, data.stock, data.categoria_id, data.proveedor_id)
        )
        conn.commit()
        return obtener_interno(conn, cur.lastrowid)
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()

@router.put("/{id}")
def actualizar(id: int, data: ProductoIn):
    conn = get_connection()
    try:
        cur = conn.execute(
            "UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria_id=?, proveedor_id=? WHERE id=?",
            (data.nombre, data.descripcion, data.precio, data.stock, data.categoria_id, data.proveedor_id, id)
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Producto no encontrado")
        return obtener_interno(conn, id)
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
        cur = conn.execute("DELETE FROM productos WHERE id=?", (id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Producto no encontrado")
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()

def obtener_interno(conn, id):
    row = conn.execute("""
        SELECT p.*, c.nombre as categoria, v.nombre as proveedor
        FROM productos p
        JOIN categorias c ON c.id = p.categoria_id
        JOIN proveedores v ON v.id = p.proveedor_id
        WHERE p.id=?
    """, (id,)).fetchone()
    return dict(row) if row else None