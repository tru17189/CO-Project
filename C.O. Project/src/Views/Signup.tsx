import './CSS/Signup.css'
import GoogleButton from "../Components/GoogleButton";
import Divider from '../Components/Divider';
import BasicInput from '../Components/BasicInput';
import { useState } from 'react';

export default function Signup() {
    // Variables para los inputs
    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [email, setEmail] = useState("")
    const [confirmEmail, setConfirmEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    return (
        <div className="backdrop">
            <div className="card">
                <h1>Sign Up</h1>
                {<GoogleButton />}
                {<Divider />}
                {/*Comienzo de las preguntas */}
                {<BasicInput 
                    label="Primer Nombre" 
                    value={firstName} 
                    type="firstName" 
                    onChange={(e) => setFirstName(e.target.value)}
                />}
                {<BasicInput 
                    label='Segundo Nombre'
                    value={middleName}
                    type='middleName'
                    onChange={(e) => setMiddleName(e.target.value)}
                />}
                {<BasicInput 
                    label='Apellidos'
                    value={apellidos}
                    type='apellidos'
                    onChange={(e) => setApellidos(e.target.value)}
                />}
                {<BasicInput 
                    label='Correo Electrónico'
                    value={email}
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                />}
                {<BasicInput 
                    label='Confirmar Correo Electrónico'
                    value={confirmEmail}
                    type='confirmEmail'
                    onChange={(e) => setConfirmEmail(e.target.value)}
                />}
                {<BasicInput 
                    label='Contraseña'
                    value={password}
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                />}
                {<BasicInput 
                    label='Confirmar Contraseña'
                    value={confirmPassword}
                    type='confirmPassword'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                {<BasicInput 
                    label='Número de Telefono'
                    value={phoneNumber}
                    type='phoneNumber'
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />}
            </div>
        </div>
    )
}