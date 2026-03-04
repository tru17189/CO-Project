import './CSS/Signup.css'
import BasicInput from '../Components/BasicInput';
import React, { useState } from 'react';
import NextButton from '../Components/NextButton';
import { useNavigate } from 'react-router-dom';
import FlatDivider from '../Components/FlatDivider';

export default function Signup() {
    // Variables para los inputs
    const [businessName, setBusinessName] = useState("")
    const [businessPhone, setBusinessPhone] = useState("")
    const [businessEmail, setBusinessEmail] = useState("")
    const [businessEmployeesNum, setBusinessEmployeesNum] = useState("")
    const navigate = useNavigate();

    // ── Functions ──────────────────────────────────────────────
    const validateInputs = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            alert("Please fill out all required fields");
            return;
        }
        navigate('/welcome-new-user')

        // consoles
        console.log("Business Name: ", businessName);
        console.log("Business Phone: ", businessPhone)
        console.log("Business Email: ", businessEmail)
        console.log("Business Employees Number: ", businessEmployeesNum)
    }

    return (
        <div className="backdrop">
            <div className="card">
                <h2>
                    <center>Bienvenido Usuario.Nombre antes de comenzar, queremos saber más sobre tu negocio...</center>
                </h2>
                <FlatDivider />
                {/*Comienzo de las preguntas */}
                <form onSubmit={validateInputs}>
                    {<BasicInput 
                        label="Nombre del Negocio" 
                        value={businessName} 
                        type="text" 
                        onChange={(e) => setBusinessName(e.target.value)}
                    />}
                    {<BasicInput 
                        label="Número de Telefono Negocio" 
                        value={businessPhone} 
                        type="tel" 
                        onChange={(e) => setBusinessPhone(e.target.value)}
                    />}
                    {<BasicInput 
                        label="Email del Negocio" 
                        value={businessEmail} 
                        type="email" 
                        onChange={(e) => setBusinessEmail(e.target.value)}
                    />}
                    {<BasicInput 
                        label="Número de Empleados" 
                        value={businessEmployeesNum} 
                        type="num" 
                        onChange={(e) => setBusinessEmployeesNum(e.target.value)}
                    />}
                    {<NextButton 
                        text="Crear Cuenta"
                        type='submit'
                    />}
                </form>
            </div>
        </div>
    )
}