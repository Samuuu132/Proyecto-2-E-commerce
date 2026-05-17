import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import { Categorias, Proveedores, Clientes, Empleados } from './pages/Entidades'
import Ventas from './pages/Ventas'
import Carrito from './pages/Carrito'
import './components/Modal.css'
import './App.css'

export default function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <div className="app-layout">
                    <Sidebar />
                    <main className="app-main">
                        <div className="app-content">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/productos" element={<Productos />} />
                                <Route path="/categorias" element={<Categorias />} />
                                <Route path="/proveedores" element={<Proveedores />} />
                                <Route path="/clientes" element={<Clientes />} />
                                <Route path="/empleados" element={<Empleados />} />
                                <Route path="/ventas" element={<Ventas />} />
                                <Route path="/carrito" element={<Carrito />} />
                            </Routes>
                        </div>
                    </main>
                </div>
                <Toast />
            </BrowserRouter>
        </AppProvider>
    )
}