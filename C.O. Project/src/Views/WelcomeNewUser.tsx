import { useState } from 'react'
import NewInstruction from '../Components/NewInstruction'
import NextButton from '../Components/NextButton'
import styles from './CSS/WelcomeNewUser.module.css'

export default function WelcomeNewUser() {
    const [numberOfCLicks, setNumberOfClicks] = useState(0)

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
                <NewInstruction
                    text={
                        <p>
                            ¿Te imaginas sumar trabajadores incansables, súper eficientes y siempre
                            listos para vender? Eso es lo que hacen los agentes de ONA.
                        </p>
                    }
                    insOrder={1}
                    numberOfCLicks={numberOfCLicks}
                />
                <NewInstruction
                    text={
                        <p>
                            En esta primera versión, su objetivo principal es{' '}
                            <strong>impulsar tus ventas…</strong> pero vender es mucho más que
                            tocar puertas.
                        </p>
                    }
                    insOrder={2}
                    numberOfCLicks={numberOfCLicks}
                />
                <NewInstruction
                    text={
                        <ul>
                            <li><strong>Agentes informativos:</strong> promociones y novedades.</li>
                            <li><strong>Agentes de bienvenida:</strong> guían al cliente.</li>
                            <li><strong>Agentes expertos:</strong> cierran tratos.</li>
                        </ul>
                    }
                    insOrder={3}
                    numberOfCLicks={numberOfCLicks}
                />
                <NewInstruction
                    text={
                        <p>
                            <strong>Integra ONA a tu operación.</strong>
                            <br />Deja que tus nuevos agentes trabajen por ti.
                        </p>
                    }
                    insOrder={4}
                    numberOfCLicks={numberOfCLicks}
                />
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                <NextButton text="Continuar" />
            </div>

        </div>
    )
}