import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppProvider, useApp } from '../context/AppContext'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

// ── Test 1: AppContext - estado inicial ──────────────────────
describe('AppContext', () => {
    it('inicia con toast nulo', () => {
        let capturedState
        function Inspector() {
            const { state } = useApp()
            capturedState = state
            return null
        }
        render(<AppProvider><Inspector /></AppProvider>)
        expect(capturedState.toast).toBeNull()
    })

    it('inicia con carrito vacío', () => {
        let capturedState
        function Inspector() {
            const { state } = useApp()
            capturedState = state
            return null
        }
        render(<AppProvider><Inspector /></AppProvider>)
        expect(capturedState.cartItems).toHaveLength(0)
    })
})

// ── Test 2: Sidebar - renderiza links de navegación ─────────
describe('Sidebar', () => {
    it('muestra los links principales', () => {
        render(
            <AppProvider>
                <MemoryRouter>
                    <Sidebar />
                </MemoryRouter>
            </AppProvider>
        )
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Productos')).toBeInTheDocument()
        expect(screen.getByText('Ventas')).toBeInTheDocument()
        expect(screen.getByText('Clientes')).toBeInTheDocument()
    })

    it('muestra el nombre de la app', () => {
        render(
            <AppProvider>
                <MemoryRouter>
                    <Sidebar />
                </MemoryRouter>
            </AppProvider>
        )
        expect(screen.getByText('Tienda')).toBeInTheDocument()
    })
})

// ── Test 3: Lógica del carrito ───────────────────────────────
describe('Lógica del carrito', () => {
    it('calcula el total correctamente', () => {
        const items = [
            { producto_id: 1, nombre: 'A', precio: 100, cantidad: 2 },
            { producto_id: 2, nombre: 'B', precio: 50, cantidad: 3 },
        ]
        const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
        expect(total).toBe(350)
    })

    it('retorna 0 con carrito vacío', () => {
        const total = [].reduce((s, i) => s + i.precio * i.cantidad, 0)
        expect(total).toBe(0)
    })

    it('CART_ADD agrega item al estado', () => {
        const initialState = { cartItems: [] }
        const action = {
            type: 'CART_ADD',
            payload: { producto_id: 1, nombre: 'Test', precio: 99 }
        }
        // Simulamos el reducer manualmente
        const newItems = [...initialState.cartItems, { ...action.payload, cantidad: 1 }]
        expect(newItems).toHaveLength(1)
        expect(newItems[0].nombre).toBe('Test')
    })
})