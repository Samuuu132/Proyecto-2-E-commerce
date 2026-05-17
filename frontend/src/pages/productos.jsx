import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import { productosApi, categoriasApi, proveedoresApi } from '../services/api'
import { useApp } from '../context/AppContext'

const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría', render: v => <span className="badge badge-blue">{v}</span> },
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'precio', label: 'Precio', render: v => `Q ${Number(v).toFixed(2)}` },
    {
        key: 'stock', label: 'Stock', render: v => (
            <span className={`badge ${v < 10 ? 'badge-red' : v < 20 ? 'badge-yellow' : 'badge-green'}`}>{v}</span>
        )
    },
]

function ProductoForm({ initial, onSave, onCancel }) {
    const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: 0, categoria_id: '', proveedor_id: '', ...initial })
    const [errors, setErrors] = useState({})
    const [cats, setCats] = useState([])
    const [provs, setProvs] = useState([])
    const { showToast } = useApp()

    useEffect(() => {
        categoriasApi.list().then(setCats).catch(() => { })
        proveedoresApi.list().then(setProvs).catch(() => { })
    }, [])

    const validate = () => {
        const e = {}
        if (!form.nombre.trim()) e.nombre = 'Nombre requerido'
        if (!form.precio || isNaN(form.precio) || Number(form.precio) < 0) e.precio = 'Precio inválido'
        if (!form.categoria_id) e.categoria_id = 'Selecciona categoría'
        if (!form.proveedor_id) e.proveedor_id = 'Selecciona proveedor'
        return e
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        try {
            await onSave({ ...form, precio: Number(form.precio), stock: Number(form.stock) })
        } catch (err) {
            showToast(err.message, 'error')
        }
    }

    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

    return (
        <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>{form.id ? 'Editar' : 'Nuevo'} Producto</h2>
            <div className="form-grid">
                <div className="form-group">
                    <label>Nombre *</label>
                    <input value={form.nombre} onChange={set('nombre')} />
                    {errors.nombre && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.nombre}</span>}
                </div>
                <div className="form-group">
                    <label>Precio (Q) *</label>
                    <input type="number" step="0.01" value={form.precio} onChange={set('precio')} />
                    {errors.precio && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.precio}</span>}
                </div>
                <div className="form-group">
                    <label>Stock</label>
                    <input type="number" value={form.stock} onChange={set('stock')} />
                </div>
                <div className="form-group">
                    <label>Categoría *</label>
                    <select value={form.categoria_id} onChange={set('categoria_id')}>
                        <option value="">Seleccionar...</option>
                        {cats.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    {errors.categoria_id && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.categoria_id}</span>}
                </div>
                <div className="form-group">
                    <label>Proveedor *</label>
                    <select value={form.proveedor_id} onChange={set('proveedor_id')}>
                        <option value="">Seleccionar...</option>
                        {provs.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                    {errors.proveedor_id && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.proveedor_id}</span>}
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Descripción</label>
                    <textarea value={form.descripcion || ''} onChange={set('descripcion')} rows={2} />
                </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
        </form>
    )
}

export default function Productos() {
    return <CrudTable title="Productos" apiObj={productosApi} columns={columns} FormComponent={ProductoForm} />
}