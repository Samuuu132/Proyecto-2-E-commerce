from fastapi import APIRouter
from database import get_connection

router = APIRouter()

@router.get("/resumen")
def resumen():
    conn = get_connection()
    total_ventas  = conn.execute("SELECT COALESCE(SUM(total),0) as total FROM ventas").fetchone()["total"]
    num_ventas    = conn.execute("SELECT COUNT(*) as n FROM ventas").fetchone()["n"]
    num_productos = conn.execute("SELECT COUNT(*) as n FROM productos").fetchone()["n"]
    num_clientes  = conn.execute("SELECT COUNT(*) as n FROM clientes").fetchone()["n"]
    stock_bajo    = conn.execute("SELECT COUNT(*) as n FROM productos WHERE stock < 10").fetchone()["n"]
    conn.close()
    return {
        "total_ventas": total_ventas,
        "num_ventas": num_ventas,
        "num_productos": num_productos,
        "num_clientes": num_clientes,
        "productos_stock_bajo": stock_bajo,
    }

@router.get("/ventas-por-mes")
def ventas_por_mes():
    conn = get_connection()
    rows = conn.execute("""
        SELECT strftime('%Y-%m', fecha) as mes,
               COUNT(*) as cantidad,
               SUM(total) as total
        FROM ventas
        GROUP BY mes
        ORDER BY mes
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/productos-mas-vendidos")
def productos_mas_vendidos():
    conn = get_connection()
    rows = conn.execute("""
        SELECT p.nombre, SUM(d.cantidad) as unidades_vendidas, SUM(d.cantidad * d.precio_unit) as ingresos
        FROM detalle_ventas d
        JOIN productos p ON p.id = d.producto_id
        GROUP BY p.id
        ORDER BY unidades_vendidas DESC
        LIMIT 10
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/stock-disponible")
def stock_disponible():
    conn = get_connection()
    rows = conn.execute("""
        SELECT p.nombre, p.stock, c.nombre as categoria, p.precio
        FROM productos p
        JOIN categorias c ON c.id = p.categoria_id
        ORDER BY p.stock ASC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/ventas-por-empleado")
def ventas_por_empleado():
    conn = get_connection()
    rows = conn.execute("""
        SELECT e.nombre as empleado, COUNT(v.id) as num_ventas, SUM(v.total) as total
        FROM ventas v
        JOIN empleados e ON e.id = v.empleado_id
        GROUP BY e.id
        ORDER BY total DESC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]