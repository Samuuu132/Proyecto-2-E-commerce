from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_connection

router = APIRouter()

class ProveedorIn(BaseModel):
    nombre: str
    contacto: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None

@router.get("/")
def listar():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM proveedores ORDER BY nombre").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{id}")
def obtener(id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM proveedores WHERE id=?", (id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Proveedor no encontrado")
    return dict(row)

@router.post("/", status_code=201)
def crear(data: ProveedorIn):
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES (?,?,?,?)",
            (data.nombre, data.contacto, data.telefono, data.email)
        )
        conn.commit()
        row = conn.execute("SELECT * FROM proveedores WHERE id=?", (cur.lastrowid,)).fetchone()
        return dict(row)
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()

@router.put("/{id}")
def actualizar(id: int, data: ProveedorIn):
    conn = get_connection()
    try:
        cur = conn.execute(
            "UPDATE proveedores SET nombre=?, contacto=?, telefono=?, email=? WHERE id=?",
            (data.nombre, data.contacto, data.telefono, data.email, id)
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Proveedor no encontrado")
        row = conn.execute("SELECT * FROM proveedores WHERE id=?", (id,)).fetchone()
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
        cur = conn.execute("DELETE FROM proveedores WHERE id=?", (id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Proveedor no encontrado")
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()