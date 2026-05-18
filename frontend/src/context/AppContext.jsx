import { createContext, useContext, useReducer, useCallback } from 'react'

const AppContext = createContext(null)

const initialState = {
    toast: null,
    cartItems: [],
}

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_TOAST':
            return { ...state, toast: action.payload }
        case 'CLEAR_TOAST':
            return { ...state, toast: null }
        case 'CART_ADD': {
            const existing = state.cartItems.find(i => i.producto_id === action.payload.producto_id)
            if (existing) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(i =>
                        i.producto_id === action.payload.producto_id
                            ? { ...i, cantidad: i.cantidad + 1 }
                            : i
                    )
                }
            }
            return { ...state, cartItems: [...state.cartItems, { ...action.payload, cantidad: 1 }] }
        }
        case 'CART_REMOVE':
            return { ...state, cartItems: state.cartItems.filter(i => i.producto_id !== action.payload) }
        case 'CART_UPDATE_QTY':
            return {
                ...state,
                cartItems: state.cartItems.map(i =>
                    i.producto_id === action.payload.id ? { ...i, cantidad: action.payload.qty } : i
                )
            }
        case 'CART_CLEAR':
            return { ...state, cartItems: [] }
        default:
            return state
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState)

    const showToast = useCallback((msg, type = 'success') => {
        dispatch({ type: 'SET_TOAST', payload: { msg, type } })
        setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3500)
    }, [])

    return (
        <AppContext.Provider value={{ state, dispatch, showToast }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    return useContext(AppContext)
}