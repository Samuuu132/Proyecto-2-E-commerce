const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    })
    if (res.status === 204) return null
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Error en la solicitud')
    return data
}

const crud = (resource) => ({
    list: () => request(`/${resource}/`),
    get: (id) => request(`/${resource}/${id}`),
    create: (body) => request(`/${resource}/`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id, b) => request(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
    remove: (id) => request(`/${resource}/${id}`, { method: 'DELETE' }),
})

export const categoriasApi = crud('categorias')
export const proveedoresApi = crud('proveedores')
export const productosApi = crud('productos')
export const clientesApi = crud('clientes')
export const empleadosApi = crud('empleados')
export const ventasApi = crud('ventas')

export const reportesApi = {
    resumen: () => request('/reportes/resumen'),
    ventasPorMes: () => request('/reportes/ventas-por-mes'),
    productosMasVendidos: () => request('/reportes/productos-mas-vendidos'),
    stockDisponible: () => request('/reportes/stock-disponible'),
    ventasPorEmpleado: () => request('/reportes/ventas-por-empleado'),
}