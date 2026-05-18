import { useApp } from '../context/AppContext'
import './Toast.css'

export default function Toast() {
    const { state } = useApp()
    if (!state.toast) return null
    return (
        <div className={`toast toast-${state.toast.type}`}>
            {state.toast.msg}
        </div>
    )
}