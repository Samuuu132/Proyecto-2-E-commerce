from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_connection

router = APIRouter()

class ClienteIn(BaseModel):
    nombre: str
    email: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None

@router.get("/")
def listar():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM clientes ORDER BY nombre").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{id}")
def obtener(id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM clientes WHERE id=?", (id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Cliente no encontrado")
    return dict(row)

@router.post("/", status_code=201)
def crear(data: ClienteIn):
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO clientes (nombre, email, telefono, direccion) VALUES (?,?,?,?)",
            (data.nombre, data.email, data.telefono, data.direccion)
        )
        conn.commit()
        row = conn.execute("SELECT * FROM clientes WHERE id=?", (cur.lastrowid,)).fetchone()
        return dict(row)
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()

@router.put("/{id}")
def actualizar(id: int, data: ClienteIn):
    conn = get_connection()
    try:
        cur = conn.execute(
            "UPDATE clientes SET nombre=?, email=?, telefono=?, direccion=? WHERE id=?",
            (data.nombre, data.email, data.telefono, data.direccion, id)
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Cliente no encontrado")
        row = conn.execute("SELECT * FROM clientes WHERE id=?", (id,)).fetchone()
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
        cur = conn.execute("DELETE FROM clientes WHERE id=?", (id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Cliente no encontrado")
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()