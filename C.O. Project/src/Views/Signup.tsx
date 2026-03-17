import './CSS/Signup.css'
import GoogleButton from "../Components/GoogleButton";
import Divider from '../Components/Divider';
import BasicInput from '../Components/BasicInput';
import React, { useState } from 'react';
import BirthdayInput from '../Components/BirthdayInput';
import GenderInput from '../Components/GenderInput';
import TermsAndConditions from '../Components/TermsAndConditions';
import NextButton from '../Components/NextButton';
import { useNavigate } from 'react-router-dom';
import type { RegisterData } from '../context/AuthContext';
import PasswordInput from '../Components/PasswordInput';

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
    const [birthDay, setBirthDay] = useState("")
    const [birthMonth, setBirthMonth] = useState("")
    const [birthYear, setBirthYear] = useState("")
    const [gender, setGender] = useState("")
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // ── Functions ──────────────────────────────────────────────
    const validateInputs = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }
        if (email !== confirmEmail) {
            alert("Emails do not match");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // Pass step 1 data to step 2 via router state
        const step1Data: Partial<RegisterData> = {
            primer_nombre:  firstName,
            segundo_nombre: middleName || undefined,
            apellidos,
            correo: email,
            telefono: phoneNumber,
            password,
            genero: gender,
        }
        navigate('/signup/business', { state: { step1Data } })
    }

    return (
        <div className="backdrop">
            <div className="card">
                <h1>Sign Up</h1>
                {<GoogleButton />}
                {<Divider />}
                {/*Comienzo de las preguntas */}
                <form onSubmit={validateInputs}>
                    {<BasicInput 
                        label="Primer Nombre" 
                        value={firstName} 
                        type="text" 
                        onChange={(e) => setFirstName(e.target.value)}
                    />}
                    {<BasicInput 
                        label='Segundo Nombre'
                        value={middleName}
                        type='text'
                        onChange={(e) => setMiddleName(e.target.value)}
                    />}
                    {<BasicInput 
                        label='Apellidos'
                        value={apellidos}
                        type='text'
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
                        type='email'
                        onChange={(e) => setConfirmEmail(e.target.value)}
                    />}
                    {<BasicInput 
                        label='Número de Telefono'
                        value={phoneNumber}
                        type='tel'
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        maxLegnth={10}
                    />}
                    {<PasswordInput 
                        label='Contraseña'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />}
                    {<PasswordInput 
                        label='Confirmar Contraseña'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />}
                    {<BirthdayInput 
                        dayValue={birthDay}
                        onChangeDay={(e) => setBirthDay(e.target.value)}
                        yearValue={birthYear}
                        onChangeYear={(e) => setBirthYear(e.target.value)}
                        monthValue={birthMonth}
                        onChangeMonth={(e) => setBirthMonth(e.target.value)}
                    />}
                    {<GenderInput 
                        value={gender}
                        onChange={(value) => setGender(value)}
                        required
                    />}
                    {<TermsAndConditions />}
                    {<NextButton 
                        text="Crear Cuenta"
                        type='submit'
                    />}
                </form>
            </div>
        </div>
    )
}