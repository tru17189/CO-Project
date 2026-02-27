import NextButton from '../Components/NextButton'
import styles from './CSS/ForgotMyPassword.module.css'

export default function ForgotMyPassword() {
    return (
        <div className={styles.forgotPasswordWrapper}>
            <div className={styles.forgotPasswordCard}>
                <h1 className={styles.cardMessage}>
                Enviamos un link de recuperación a <br/>
                tu teléfono. Sigue las instrucciones <br/>
                para recuperar tu contraseña.</h1>
                <NextButton
                    text='Regresar a la pantalla de log in' 
                />
            </div>
        </div>
    )
}