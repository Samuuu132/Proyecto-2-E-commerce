import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { productosApi, clientesApi, empleadosApi, ventasApi } from '../services/api'
import './Carrito.css'

export default function Carrito() {
    const { state, dispatch, showToast } = useApp()
    const navigate = useNavigate()

    const [productos, setProductos] = useState([])
    const [clientes, setClientes] = useState([])
    const [empleados, setEmpleados] = useState([])
    const [clienteId, setClienteId] = useState('')
    const [empleadoId, setEmpleadoId] = useState('')
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        productosApi.list().then(setProductos).catch(() => { })
        clientesApi.list().then(setClientes).catch(() => { })
        empleadosApi.list().then(setEmpleados).catch(() => { })
    }, [])

    const cartItems = state.cartItems
    const total = useMemo(() => cartItems.reduce((s, i) => s + i.precio * i.cantidad, 0), [cartItems])

    const addProduct = (e) => {
        const id = Number(e.target.value)
        if (!id) return
        const prod = productos.find(p => p.id === id)
        if (!prod) return
        dispatch({ type: 'CART_ADD', payload: { producto_id: prod.id, nombre: prod.nombre, precio: prod.precio } })
        e.target.value = ''
    }

    const updateQty = (producto_id, qty) => {
        if (qty < 1) { dispatch({ type: 'CART_REMOVE', payload: producto_id }); return }
        dispatch({ type: 'CART_UPDATE_QTY', payload: { id: producto_id, qty } })
    }

    const validate = () => {
        const e = {}
        if (!clienteId) e.cliente = 'Selecciona un cliente'
        if (!empleadoId) e.empleado = 'Selecciona un empleado'
        if (cartItems.length === 0) e.cart = 'Agrega al menos un producto'
        return e
    }

    const handleSubmit = async () => {
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setSubmitting(true)
        try {
            await ventasApi.create({
                cliente_id: Number(clienteId),
                empleado_id: Number(empleadoId),
                detalles: cartItems.map(i => ({ producto_id: i.producto_id, cantidad: i.cantidad, precio_unit: i.precio }))
            })
            dispatch({ type: 'CART_CLEAR' })
            showToast('Venta registrada exitosamente')
            navigate('/ventas')
        } catch (e) {
            showToast(e.message, 'error')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="carrito-layout">
            <div>
                <div className="page-header">
                    <h1 className="page-title">Nueva Venta</h1>
                </div>
                <div className="card" style={{ marginBottom: 16 }}>
                    <h3 style={{ marginBottom: 14, fontSize: 15 }}>Agregar producto</h3>
                    <select onChange={addProduct} defaultValue="">
                        <option value="">Seleccionar producto...</option>
                        {productos.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre} — Q {Number(p.precio).toFixed(2)} (stock: {p.stock})</option>
                        ))}
                    </select>
                    {errors.cart && <div className="error-msg" style={{ marginTop: 8 }}>{errors.cart}</div>}
                </div>
                <div className="card">
                    <h3 style={{ marginBottom: 14, fontSize: 15 }}>Carrito</h3>
                    {cartItems.length === 0 ? <p style={{ color: 'var(--text2)', padding: '12px 0' }}>Sin productos</p> : (
                        <table>
                            <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
                            <tbody>
                                {cartItems.map(item => (
                                    <tr key={item.producto_id}>
                                        <td>{item.nombre}</td>
                                        <td style={{ fontFamily: 'var(--mono)' }}>Q {Number(item.precio).toFixed(2)}</td>
                                        <td>
                                            <div className="qty-control">
                                                <button className="qty-btn" onClick={() => updateQty(item.producto_id, item.cantidad - 1)}>−</button>
                                                <span>{item.cantidad}</span>
                                                <button className="qty-btn" onClick={() => updateQty(item.producto_id, item.cantidad + 1)}>+</button>
                                            </div>
                                        </td>
                                        <td style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>Q {(item.precio * item.cantidad).toFixed(2)}</td>
                                        <td>
                                            <button className="btn btn-ghost" style={{ padding: '3px 10px', fontSize: 12 }}
                                                onClick={() => dispatch({ type: 'CART_REMOVE', payload: item.producto_id })}>✕</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <div className="carrito-sidebar">
                <div className="card" style={{ marginBottom: 16 }}>
                    <h3 style={{ marginBottom: 14, fontSize: 15 }}>Datos de la venta</h3>
                    <div className="form-group" style={{ marginBottom: 12 }}>
                        <label>Cliente *</label>
                        <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                        {errors.cliente && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.cliente}</span>}
                    </div>
                    <div className="form-group">
                        <label>Empleado *</label>
                        <select value={empleadoId} onChange={e => setEmpleadoId(e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {empleados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                        </select>
                        {errors.empleado && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.empleado}</span>}
                    </div>
                </div>
                <div className="card total-card">
                    <span className="total-label">Total</span>
                    <span className="total-value">Q {total.toFixed(2)}</span>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
                        onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Guardando...' : 'Confirmar Venta'}
                    </button>
                    <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
                        onClick={() => dispatch({ type: 'CART_CLEAR' })}>
                        Limpiar carrito
                    </button>
                </div>
            </div>
        </div>
    )
}