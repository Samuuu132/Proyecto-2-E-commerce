import { useState } from 'react'
import CrudTable from '../components/CrudTable'
import { categoriasApi, proveedoresApi, clientesApi, empleadosApi } from '../services/api'

function CategoriaForm({ initial, onSave, onCancel }) {
    const [form, setForm] = useState({ nombre: '', descripcion: '', ...initial })
    const [errors, setErrors] = useState({})
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
    const submit = async (e) => {
        e.preventDefault()
        if (!form.nombre.trim()) { setErrors({ nombre: 'Nombre requerido' }); return }
        await onSave(form)
    }
    return (
        <form onSubmit={submit}>
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>{form.id ? 'Editar' : 'Nueva'} Categoría</h2>
            <div className="form-grid">
                <div className="form-group">
                    <label>Nombre *</label>
                    <input value={form.nombre} onChange={set('nombre')} />
                    {errors.nombre && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.nombre}</span>}
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <input value={form.descripcion || ''} onChange={set('descripcion')} />
                </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
        </form>
    )
}

export function Categorias() {
    return <CrudTable title="Categorías" apiObj={categoriasApi} columns={[{ key: 'nombre', label: 'Nombre' }, { key: 'descripcion', label: 'Descripción' }]} FormComponent={CategoriaForm} />
}

function ProveedorForm({ initial, onSave, onCancel }) {
    const [form, setForm] = useState({ nombre: '', contacto: '', telefono: '', email: '', ...initial })
    const [errors, setErrors] = useState({})
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
    const submit = async (e) => {
        e.preventDefault()
        if (!form.nombre.trim()) { setErrors({ nombre: 'Nombre requerido' }); return }
        await onSave(form)
    }
    return (
        <form onSubmit={submit}>
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>{form.id ? 'Editar' : 'Nuevo'} Proveedor</h2>
            <div className="form-grid">
                {[['nombre', 'Nombre *'], ['contacto', 'Contacto'], ['telefono', 'Teléfono'], ['email', 'Email']].map(([k, l]) => (
                    <div className="form-group" key={k}>
                        <label>{l}</label>
                        <input value={form[k] || ''} onChange={set(k)} />
                        {errors[k] && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors[k]}</span>}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
        </form>
    )
}

export function Proveedores() {
    return <CrudTable title="Proveedores" apiObj={proveedoresApi} columns={[{ key: 'nombre', label: 'Nombre' }, { key: 'contacto', label: 'Contacto' }, { key: 'telefono', label: 'Teléfono' }, { key: 'email', label: 'Email' }]} FormComponent={ProveedorForm} />
}

function ClienteForm({ initial, onSave, onCancel }) {
    const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '', ...initial })
    const [errors, setErrors] = useState({})
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
    const submit = async (e) => {
        e.preventDefault()
        const errs = {}
        if (!form.nombre.trim()) errs.nombre = 'Nombre requerido'
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email inválido'
        if (Object.keys(errs).length) { setErrors(errs); return }
        await onSave(form)
    }
    return (
        <form onSubmit={submit}>
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>{form.id ? 'Editar' : 'Nuevo'} Cliente</h2>
            <div className="form-grid">
                {[['nombre', 'Nombre *'], ['email', 'Email'], ['telefono', 'Teléfono'], ['direccion', 'Dirección']].map(([k, l]) => (
                    <div className="form-group" key={k}>
                        <label>{l}</label>
                        <input value={form[k] || ''} onChange={set(k)} />
                        {errors[k] && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors[k]}</span>}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
        </form>
    )
}

export function Clientes() {
    return <CrudTable title="Clientes" apiObj={clientesApi} columns={[{ key: 'nombre', label: 'Nombre' }, { key: 'email', label: 'Email' }, { key: 'telefono', label: 'Teléfono' }, { key: 'direccion', label: 'Dirección' }]} FormComponent={ClienteForm} />
}

function EmpleadoForm({ initial, onSave, onCancel }) {
    const [form, setForm] = useState({ nombre: '', cargo: '', email: '', ...initial })
    const [errors, setErrors] = useState({})
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
    const submit = async (e) => {
        e.preventDefault()
        if (!form.nombre.trim()) { setErrors({ nombre: 'Nombre requerido' }); return }
        await onSave(form)
    }
    return (
        <form onSubmit={submit}>
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>{form.id ? 'Editar' : 'Nuevo'} Empleado</h2>
            <div className="form-grid">
                {[['nombre', 'Nombre *'], ['cargo', 'Cargo'], ['email', 'Email']].map(([k, l]) => (
                    <div className="form-group" key={k}>
                        <label>{l}</label>
                        <input value={form[k] || ''} onChange={set(k)} />
                        {errors[k] && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors[k]}</span>}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
        </form>
    )
}

export function Empleados() {
    return <CrudTable title="Empleados" apiObj={empleadosApi} columns={[{ key: 'nombre', label: 'Nombre' }, { key: 'cargo', label: 'Cargo' }, { key: 'email', label: 'Email' }]} FormComponent={EmpleadoForm} />
}