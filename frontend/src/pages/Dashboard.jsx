import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useFetch } from '../hooks/useFetch'
import { reportesApi } from '../services/api'
import './Dashboard.css'

export default function Dashboard() {
    const { data: resumen } = useFetch(reportesApi.resumen)
    const { data: porMes } = useFetch(reportesApi.ventasPorMes)
    const { data: topProductos } = useFetch(reportesApi.productosMasVendidos)
    const { data: porEmpleado } = useFetch(reportesApi.ventasPorEmpleado)

    const chartData = useMemo(() =>
        (porMes || []).map(r => ({ mes: r.mes.slice(5), total: r.total, ventas: r.cantidad })),
        [porMes])

    return (
        <div className="dashboard">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
            </div>
            <div className="kpi-grid">
                <KpiCard label="Total Ventas" value={`Q ${resumen?.total_ventas?.toFixed(2) ?? 0}`} color="accent" />
                <KpiCard label="Nº Ventas" value={resumen?.num_ventas ?? 0} color="success" />
                <KpiCard label="Productos" value={resumen?.num_productos ?? 0} color="accent2" />
                <KpiCard label="Clientes" value={resumen?.num_clientes ?? 0} color="warning" />
                <KpiCard label="Stock Bajo" value={resumen?.productos_stock_bajo ?? 0} color="danger" />
            </div>
            <div className="charts-row">
                <div className="card chart-card">
                    <h3 className="chart-title">Ventas por Mes</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="mes" tick={{ fill: '#8b90a7', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#8b90a7', fontSize: 12 }} />
                            <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2e3247', borderRadius: 8, fontSize: 13 }} cursor={{ fill: 'rgba(108,142,245,0.08)' }} />
                            <Bar dataKey="total" fill="#6c8ef5" radius={[4, 4, 0, 0]} name="Total (Q)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="card chart-card">
                    <h3 className="chart-title">Por Empleado</h3>
                    <table>
                        <thead><tr><th>Empleado</th><th>Ventas</th><th>Total</th></tr></thead>
                        <tbody>
                            {(porEmpleado || []).map(r => (
                                <tr key={r.empleado}>
                                    <td>{r.empleado}</td>
                                    <td><span className="badge badge-blue">{r.num_ventas}</span></td>
                                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>Q {r.total?.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card" style={{ marginTop: 20 }}>
                <h3 className="chart-title">Productos más vendidos</h3>
                <table>
                    <thead><tr><th>Producto</th><th>Unidades</th><th>Ingresos</th></tr></thead>
                    <tbody>
                        {(topProductos || []).map(r => (
                            <tr key={r.nombre}>
                                <td>{r.nombre}</td>
                                <td><span className="badge badge-green">{r.unidades_vendidas}</span></td>
                                <td style={{ fontFamily: 'var(--mono)', color: 'var(--success)' }}>Q {r.ingresos?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function KpiCard({ label, value, color }) {
    return (
        <div className="card kpi-card">
            <span className="kpi-label">{label}</span>
            <span className={`kpi-value kpi-${color}`}>{value}</span>
        </div>
    )
}