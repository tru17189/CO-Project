import BasicInput from '../Components/BasicInput'
import { useState } from 'react';
import './CSS/Login.css'
import NextButton from '../Components/NextButton';
import GoogleButton from '../Components/GoogleButton';
import Divider from '../Components/Divider';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    // Variables principales
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // ── Functions ──────────────────────────────────────────────
    const validateInputs = () => {
        event?.preventDefault(); 
        console.log("Email:", email);
        console.log("password:", password);
        // Validacion correcta
        navigate('/dashboard');
    }

    return (
        <div className='login-wrapper'>
            <div className='login-card'>
                <h1>Log In</h1>
                <p className='subtitle'>
                    ¿No tienes una cuenta?{" "}
                    <a href="/signup">
                        Abre una
                    </a>
                </p>
                {<GoogleButton />}
                {<Divider />}
                <form onSubmit={validateInputs}>
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
                    <a href="/forgot-password" className='forgot-link'>
                        ¿Olvidaste tu contraseña?
                    </a>
                    {<NextButton
                        text="Iniciar Sesión"
                        onClick={validateInputs}
                    />}
                </form>
            </div>
        </div>
    )
}