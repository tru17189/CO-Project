import { useRef, useState, useEffect } from 'react'
import NewInstruction from '../Components/NewInstruction'
import styles from './CSS/WelcomeNewUser.module.css'
import type { RefObject } from 'react'

export default function WelcomeNewUser() {
    const [numberOfCLicks, setNumberOfClicks] = useState(0)
    const instReference = Array.from({length:5}, () => useRef<HTMLDivElement>(null))
    
    function useAutoScroll(refs: RefObject<HTMLDivElement | null>[], trigger: number) {
        useEffect(() => {
            refs.forEach(ref => {
                ref.current?.scrollIntoView({behavior: 'smooth'})
            })
        }, [trigger, refs])
    }
    useAutoScroll(instReference, numberOfCLicks)
    function clicksCounter() {
        setNumberOfClicks(prev => prev + 1)
    }

    return (
        <div className={styles.backdrop} onClick={clicksCounter}>
            {/* Header */}
            <header className={styles.header}>
                <p className={styles.titleEyebrow}>Plataforma de agentes IA</p>
                <h1 className={styles.title}>Bienvenido a ONA</h1>
                <p className={styles.subtitle}>
                    La plataforma que lleva agentes de IA directamente a tu operación
                </p>
                <div className={styles.clickHint}>
                    <span className={styles.clickDot} />
                    Clickea para continuar
                </div>
            </header>

            {/* Instructions */}
            <div className={styles.instructions}>
                {numberOfCLicks>=1 && <NewInstruction
                    text={
                        <p>
                            ¿Te imaginas sumar trabajadores incansables, súper eficientes y siempre
                            listos para vender? Eso es lo que hacen los agentes de ONA.
                        </p>
                    }
                    insOrder={1}
                    numberOfCLicks={numberOfCLicks}
                    ref={instReference[0]}
                />}
                {numberOfCLicks>=2 && <NewInstruction
                    text={
                        <p>
                            En esta primera versión, su objetivo principal es{' '}
                            <strong>impulsar tus ventas…</strong> pero vender es mucho más que
                            tocar puertas.
                        </p>
                    }
                    insOrder={2}
                    numberOfCLicks={numberOfCLicks}
                    ref={instReference[1]}
                />}
                {numberOfCLicks>=3 && <NewInstruction
                    text={
                        <ul>
                            <li><strong>Agentes informativos:</strong> promociones y novedades.</li>
                            <li><strong>Agentes de bienvenida:</strong> guían al cliente.</li>
                            <li><strong>Agentes expertos:</strong> cierran tratos.</li>
                        </ul>
                    }
                    insOrder={3}
                    numberOfCLicks={numberOfCLicks}
                    ref={instReference[2]}
                />}
                {numberOfCLicks>=4 && <NewInstruction
                    text={
                        <p>
                            <strong>Integra ONA a tu operación.</strong>
                            <br />Deja que tus nuevos agentes trabajen por ti.
                        </p>
                    }
                    insOrder={4}
                    numberOfCLicks={numberOfCLicks}
                    ref={instReference[3]}
                />}
            </div>
            {/* Footer */}
            {numberOfCLicks>=5 && <div 
                className={styles.footer}
                style={5>=numberOfCLicks ? {visibility:'visible'} : {visibility:'hidden'}}
                ref={instReference[4]}>
                <button className={styles.nextButton}>Continuar...</button>
            </div>}
        </div>
    )
}