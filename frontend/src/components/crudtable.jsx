import { useState, useCallback, useMemo } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useApp } from '../context/AppContext'

export default function CrudTable({ title, apiObj, columns, FormComponent, rowKey = 'id' }) {
    const { data, loading, error, refetch } = useFetch(apiObj.list)
    const { showToast } = useApp()
    const [editing, setEditing] = useState(null)
    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
        if (!data || !search) return data || []
        const q = search.toLowerCase()
        return data.filter(row =>
            Object.values(row).some(v => String(v).toLowerCase().includes(q))
        )
    }, [data, search])

    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('¿Eliminar este registro?')) return
        try {
            await apiObj.remove(id)
            showToast('Eliminado correctamente')
            refetch()
        } catch (e) {
            showToast(e.message, 'error')
        }
    }, [apiObj, showToast, refetch])

    const handleSave = useCallback(async (formData) => {
        try {
            if (formData[rowKey]) {
                await apiObj.update(formData[rowKey], formData)
                showToast('Actualizado correctamente')
            } else {
                await apiObj.create(formData)
                showToast('Creado correctamente')
            }
            setEditing(null)
            refetch()
        } catch (e) {
            showToast(e.message, 'error')
        }
    }, [apiObj, rowKey, showToast, refetch])

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">{title}</h1>
                <button className="btn btn-primary" onClick={() => setEditing({})}>+ Nuevo</button>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
                <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
            </div>
            {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
            <div className="card">
                {loading ? <p style={{ color: 'var(--text2)', padding: '20px 0' }}>Cargando...</p> : (
                    <table>
                        <thead>
                            <tr>
                                {columns.map(c => <th key={c.key}>{c.label}</th>)}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(row => (
                                <tr key={row[rowKey]}>
                                    {columns.map(c => (
                                        <td key={c.key}>{c.render ? c.render(row[c.key], row) : row[c.key] ?? '—'}</td>
                                    ))}
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-ghost" style={{ padding: '5px 12px' }} onClick={() => setEditing(row)}>Editar</button>
                                            <button className="btn btn-danger" style={{ padding: '5px 12px' }} onClick={() => handleDelete(row[rowKey])}>Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={columns.length + 1} style={{ color: 'var(--text2)', textAlign: 'center', padding: 24 }}>Sin resultados</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            {editing !== null && (
                <div className="modal-overlay" onClick={() => setEditing(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <FormComponent initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
                    </div>
                </div>
            )}
        </div>
    )
}