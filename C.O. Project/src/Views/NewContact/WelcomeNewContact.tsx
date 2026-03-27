import { useRef, useState, useEffect } from 'react'
import NewInstruction from '../../Components/NewInstruction'
import styles from '../CSS/WelcomeNewUser.module.css'
import type { RefObject } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WelcomeNewContact() {
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

    // Despues de leer todas instrucciones el usuario puede navegar a los planes
    const navigate = useNavigate();
    function moveToSignUp() {
        navigate('/signup/new-contact')
    }

    return (
        <div className={styles.backdrop} onClick={clicksCounter}>
            {/* Header */}
            <header className={styles.header}>
                <p className={styles.titleEyebrow}>Powered by Collectia</p>
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
                        <>
                            <p>
                                Has recibido esta invitación porque "nombre_del_negocio" quiere darte una 
                                experiencia diferente: más rápida, más clara y mucho más personalizada.
                            </p><br/>
                        </>
                    }
                    insOrder={1}
                    numberOfCLicks={numberOfCLicks}
                    ref={instReference[0]}
                />}
                {numberOfCLicks>=2 && <NewInstruction
                    text={
                        <>
                            <p>
                                Con ONA, tendrás acceso a un asistente que te ayuda a resolver dudas, 
                                encontrar lo que buscas y mantenerte al tanto de lo que te interesa… 
                                sin complicaciones y sin esperas.
                            </p><br/>
                        </>
                    }
                    insOrder={2}
                    numberOfCLicks={numberOfCLicks}
                    ref={instReference[1]}
                />}
                {numberOfCLicks>=3 && <NewInstruction
                    text={
                        <>
                            <p>
                                Es como tener una línea directa con "nombre_del_negocio", siempre disponible 
                                para ayudarte.
                            </p><br/>
                        </>
                    }
                    insOrder={3}
                    numberOfCLicks={numberOfCLicks}
                    ref={instReference[2]}
                />}
                {numberOfCLicks>=4 && <NewInstruction
                    text={
                        <p>
                            <strong>Aquí, tú eres prioridad.</strong>
                            <br />Y ONA está para que cada interacción sea más fácil, más útil y más cercana.
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
                style={5<=numberOfCLicks ? {visibility:'visible'} : {visibility:'hidden'}}
                ref={instReference[4]}>
                <button className={styles.nextButton} onClick={moveToSignUp}>Continuar...</button>
            </div>}
        </div>
    )
}