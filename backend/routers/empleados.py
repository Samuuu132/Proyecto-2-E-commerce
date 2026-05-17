from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_connection

router = APIRouter()

class EmpleadoIn(BaseModel):
    nombre: str
    cargo: Optional[str] = None
    email: Optional[str] = None
    password: str = "secret"

@router.get("/")
def listar():
    conn = get_connection()
    rows = conn.execute("SELECT id, nombre, cargo, email FROM empleados ORDER BY nombre").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{id}")
def obtener(id: int):
    conn = get_connection()
    row = conn.execute("SELECT id, nombre, cargo, email FROM empleados WHERE id=?", (id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Empleado no encontrado")
    return dict(row)

@router.post("/", status_code=201)
def crear(data: EmpleadoIn):
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO empleados (nombre, cargo, email, password) VALUES (?,?,?,?)",
            (data.nombre, data.cargo, data.email, data.password)
        )
        conn.commit()
        row = conn.execute("SELECT id, nombre, cargo, email FROM empleados WHERE id=?", (cur.lastrowid,)).fetchone()
        return dict(row)
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()

@router.put("/{id}")
def actualizar(id: int, data: EmpleadoIn):
    conn = get_connection()
    try:
        cur = conn.execute(
            "UPDATE empleados SET nombre=?, cargo=?, email=? WHERE id=?",
            (data.nombre, data.cargo, data.email, id)
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Empleado no encontrado")
        row = conn.execute("SELECT id, nombre, cargo, email FROM empleados WHERE id=?", (id,)).fetchone()
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
        cur = conn.execute("DELETE FROM empleados WHERE id=?", (id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Empleado no encontrado")
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()