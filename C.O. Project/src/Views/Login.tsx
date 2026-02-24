import BasicInput from '../Components/BasicInput'
import { useState } from 'react';
import './CSS/Login.css'
import NextButton from '../Components/NextButton';
import GoogleButton from '../Components/GoogleButton';
import Divider from '../Components/Divider';

export default function Login() {

    // Variables principales
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className='backdrop'>
            <div className='card'>
                <h1>Log In</h1>
                <p className='subtitle'>
                    ¿No tienes una cuenta?{" "}
                    <a href="#">
                        Abre una
                    </a>
                </p>
                {<GoogleButton />}
                {<Divider />}
                {<BasicInput 
                    label="Correo Electrónico"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />}
                {<BasicInput 
                    label='Contraseña'
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />}
                <a href="#" className='forgot-link'>
                    ¿Olvidaste tu contraseña?
                </a>
                {<NextButton
                    text="Iniciar Sesión"
                />}
            </div>
        </div>
    )
}