import type React from 'react'
import styles from './styles/Instructions.module.css'

interface NewInstructionProps {
    text: React.ReactNode
    insOrder: number
    numberOfCLicks: number
}

export default function NewInstruction({text, insOrder, numberOfCLicks}:NewInstructionProps) {
    // Es true cuando el numero de instruction indicado es igual al contador de clicks
    const revealed = numberOfCLicks >= insOrder

    return (
        <div 
            className={`${styles.container} ${revealed ? styles.visible : ''}`}>
            {text}
        </div>
    )
};