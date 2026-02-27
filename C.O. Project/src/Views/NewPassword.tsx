import { useState } from 'react'
import BasicInput from '../Components/BasicInput'
import styles from './CSS/ForgotMyPassword.module.css'
import NextButton from '../Components/NextButton'

export default function NewPassword() {
    const [codigoVerificacion, setCodigoVerificacion] = useState<number>()
    const [nuevaContraseña, setNuevaContrasena] = useState<string>("")
    const [confirmarNuevaContraseña, setConfirmarNuevaContrasena] = useState<string>("")
    return (
        <div className={styles.forgotPasswordWrapper}>
            <div className={styles.forgotPasswordCard}>
                <BasicInput 
                    label='Ingresa el código de verificación que te enviamos.'
                    value={codigoVerificacion}
                    type="codigo"
                    onChange={(e) => setCodigoVerificacion(e.target.value)}
                />
                <BasicInput 
                    label='Nueva Contraseña'
                    value={nuevaContraseña}
                    type="password"
                    onChange={(e) => setNuevaContrasena(e.target.value)}
                />
                <BasicInput
                    label='Confirmar Nueva Contraseña'
                    value={confirmarNuevaContraseña}
                    type='password'
                    onChange={(e) => setConfirmarNuevaContrasena(e.target.value)}
                />
                <NextButton 
                    text='Regresar a la pantalla de log in'
                />
            </div>
        </div>
    )
}