import type React from 'react'
import styles from './styles/Instructions.module.css'
import type { RefObject } from 'react'

interface NewInstructionProps {
    text: React.ReactNode
    insOrder: number
    numberOfCLicks: number
    ref: RefObject<HTMLDivElement | null> | undefined
}

export default function NewInstruction({text, insOrder, numberOfCLicks, ref}:NewInstructionProps) {
    // Es true cuando el numero de instruction indicado es igual al contador de clicks
    const revealed = numberOfCLicks >= insOrder

    return (
        <div 
            className={`${styles.container} ${revealed ? styles.visible : ''}`}
            ref={ref}>
            {text}
        </div>
    )
};