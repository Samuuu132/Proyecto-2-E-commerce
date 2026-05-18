import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Sidebar.css'

const links = [
    { to: '/', label: 'Dashboard', icon: '▦' },
    { to: '/productos', label: 'Productos', icon: '⬡' },
    { to: '/categorias', label: 'Categorías', icon: '◈' },
    { to: '/proveedores', label: 'Proveedores', icon: '⬟' },
    { to: '/clientes', label: 'Clientes', icon: '◉' },
    { to: '/empleados', label: 'Empleados', icon: '◎' },
    { to: '/ventas', label: 'Ventas', icon: '◆' },
    { to: '/carrito', label: 'Nueva Venta', icon: '◇', highlight: true },
]

export default function Sidebar() {
    const { state } = useApp()
    const cartCount = state.cartItems.reduce((s, i) => s + i.cantidad, 0)

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="brand-icon">◈</span>
                <span className="brand-name">Tienda</span>
            </div>
            <nav className="sidebar-nav">
                {links.map(l => (
                    <NavLink
                        key={l.to}
                        to={l.to}
                        end={l.to === '/'}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''} ${l.highlight ? 'highlight' : ''}`
                        }
                    >
                        <span className="nav-icon">{l.icon}</span>
                        <span>{l.label}</span>
                        {l.to === '/carrito' && cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <span className="text-muted">cc3062 · UVG 2026</span>
            </div>
        </aside>
    )
}