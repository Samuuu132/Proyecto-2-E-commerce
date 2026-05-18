import { useFetch } from '../hooks/useFetch'
import { ventasApi } from '../services/api'
import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'

export default function Ventas() {
    const { data, loading, error, refetch } = useFetch(ventasApi.list)
    const { showToast } = useApp()

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta venta?')) return
        try {
            await ventasApi.remove(id)
            showToast('Venta eliminada')
            refetch()
        } catch (e) {
            showToast(e.message, 'error')
        }
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Ventas</h1>
                <Link to="/carrito" className="btn btn-primary">+ Nueva Venta</Link>
            </div>
            {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
            <div className="card">
                {loading ? <p style={{ color: 'var(--text2)' }}>Cargando...</p> : (
                    <table>
                        <thead>
                            <tr><th>#</th><th>Fecha</th><th>Cliente</th><th>Empleado</th><th>Total</th><th>Acciones</th></tr>
                        </thead>
                        <tbody>
                            {(data || []).map(v => (
                                <tr key={v.id}>
                                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--text2)' }}>#{v.id}</td>
                                    <td>{new Date(v.fecha).toLocaleDateString('es-GT')}</td>
                                    <td>{v.cliente}</td>
                                    <td>{v.empleado}</td>
                                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--success)', fontWeight: 600 }}>Q {Number(v.total).toFixed(2)}</td>
                                    <td>
                                        <button className="btn btn-danger" style={{ padding: '5px 12px' }} onClick={() => handleDelete(v.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {(!data || data.length === 0) && (
                                <tr><td colSpan={6} style={{ color: 'var(--text2)', textAlign: 'center', padding: 24 }}>Sin ventas</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}