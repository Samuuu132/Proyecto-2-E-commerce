from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from database import get_connection

router = APIRouter()

class DetalleIn(BaseModel):
    producto_id: int
    cantidad: int
    precio_unit: float

class VentaIn(BaseModel):
    cliente_id: int
    empleado_id: int
    detalles: List[DetalleIn]

@router.get("/")
def listar():
    conn = get_connection()
    rows = conn.execute("""
        SELECT v.*, c.nombre as cliente, e.nombre as empleado
        FROM ventas v
        JOIN clientes c ON c.id = v.cliente_id
        JOIN empleados e ON e.id = v.empleado_id
        ORDER BY v.fecha DESC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{id}")
def obtener(id: int):
    conn = get_connection()
    venta = conn.execute("""
        SELECT v.*, c.nombre as cliente, e.nombre as empleado
        FROM ventas v
        JOIN clientes c ON c.id = v.cliente_id
        JOIN empleados e ON e.id = v.empleado_id
        WHERE v.id=?
    """, (id,)).fetchone()
    if not venta:
        conn.close()
        raise HTTPException(404, "Venta no encontrada")
    detalles = conn.execute("""
        SELECT d.*, p.nombre as producto
        FROM detalle_ventas d
        JOIN productos p ON p.id = d.producto_id
        WHERE d.venta_id=?
    """, (id,)).fetchall()
    conn.close()
    result = dict(venta)
    result["detalles"] = [dict(d) for d in detalles]
    return result

@router.post("/", status_code=201)
def crear(data: VentaIn):
    if not data.detalles:
        raise HTTPException(400, "La venta debe tener al menos un producto")
    conn = get_connection()
    try:
        total = sum(d.cantidad * d.precio_unit for d in data.detalles)
        cur = conn.execute(
            "INSERT INTO ventas (cliente_id, empleado_id, total) VALUES (?,?,?)",
            (data.cliente_id, data.empleado_id, total)
        )
        venta_id = cur.lastrowid
        for d in data.detalles:
            conn.execute(
                "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unit) VALUES (?,?,?,?)",
                (venta_id, d.producto_id, d.cantidad, d.precio_unit)
            )
            conn.execute(
                "UPDATE productos SET stock = stock - ? WHERE id=?",
                (d.cantidad, d.producto_id)
            )
        conn.commit()
        return obtener(venta_id)
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()

@router.delete("/{id}", status_code=204)
def eliminar(id: int):
    conn = get_connection()
    try:
        cur = conn.execute("DELETE FROM ventas WHERE id=?", (id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(404, "Venta no encontrada")
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()