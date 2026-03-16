import './CSS/Signup.css'
import BasicInput from '../Components/BasicInput';
import React, { useState } from 'react';
import NextButton from '../Components/NextButton';
import { useNavigate, useLocation } from 'react-router-dom';
import FlatDivider from '../Components/FlatDivider';

export default function Signup() {
    // Variables para los inputs
    const [businessName, setBusinessName] = useState("")
    const [businessPhone, setBusinessPhone] = useState("")
    const [businessEmail, setBusinessEmail] = useState("")
    const [businessEmployeesNum, setBusinessEmployeesNum] = useState("")

    const navigate = useNavigate();
    const location = useLocation();
    const step1Data = location.state?.step1Data; 

    // ── Functions ──────────────────────────────────────────────
    const validateInputs = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }

        const step2Data = {
            nombre_negocio:   businessName,
            telefono_negocio: businessPhone,
            correo_negocio:   businessEmail,
            num_empleados:    businessEmployeesNum ? Number(businessEmployeesNum) : undefined,
        }

        // Pass both steps forward to plan selection
        navigate('/signup/users-tiers', { state: { step1Data, step2Data } })
    }

    return (
        <div className="backdrop">
            <div className="card">
                <h2>
                    <center>Bienvenido {step1Data?.primer_nombre} antes de comenzar, queremos saber más sobre tu negocio...</center>
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
                        type="number" 
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