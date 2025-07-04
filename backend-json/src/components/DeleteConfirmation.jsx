import { useEffect } from "react"

import ProgressBar from "./ProgressBar"

const TIMER = 3000

export default function DeleteConfirmation({ onConfirm, onCancel }){
    useEffect(() => {
        const timer = setTimeout(() => {
            onConfirm()
        }, TIMER)

        return () => {
            clearTimeout(timer)
        }
    }, [onConfirm])

    return (
        <div id="delete-confirmation">
            <h2>Você tem certeza?</h2>
            <p>Você realmente quer remover este lugar?</p>
            <div id="confirmation-actions">
                <button onClick={onCancel} className="button-text">
                    Não
                </button>
                <button onClick={onConfirm} className="button">
                    Sim
                </button>
            </div>
            <ProgressBar timer={TIMER} />
        </div>
    )
}