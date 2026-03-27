import '../CSS/Signup.css'
import GoogleButton from "../../Components/GoogleButton";
import Divider from '../../Components/Divider';
import BasicInput from '../../Components/BasicInput';
import React, { useState, useEffect } from 'react';
import BirthdayInput from '../../Components/BirthdayInput';
import GenderInput from '../../Components/GenderInput';
import TermsAndConditions from '../../Components/TermsAndConditions';
import NextButton from '../../Components/NextButton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from '../../Components/PasswordInput';
import ErrorMessage from '../../Components/ErrorMessage';
import BasicDropDown from '../../Components/BasicDropDown';
import api from '../../api/axios';
 

export default function SignupNewContact() {
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
    const [platform, setPlatform] = useState("WhatsApp")
    const [error, setError] = useState("");

    const [negocioNombre, setNegocioNombre] = useState('')
    const [loadingNegocio, setLoadingNegocio] = useState(true)
    const [notFound,      setNotFound]      = useState(false)

    const [searchParams] = useSearchParams()
    const negocioId = searchParams.get('negocio')  // reads ?negocio=4 from URL
    const navigate = useNavigate();
    const { checkEmail } = useAuth(); 

    // ── Functions ──────────────────────────────────────────────
    // Fetch business name on mount
    useEffect(() => {
        if (!negocioId) {
        setNotFound(true)
        setLoadingNegocio(false)
        return
        }
        api.get(`/auth/negocio/${negocioId}`)
        .then(res => setNegocioNombre(res.data.negocio.nombre))
        .catch(() => setNotFound(true))
        .finally(() => setLoadingNegocio(false))
    }, [negocioId])

    const validateInputs = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }
        if (email !== confirmEmail) {
            alert("Los correos no coinciden");
            return;
        }
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        // Revisamos si el correo a sido usado
        try {
            await checkEmail(email)
            await api.post('/auth/register/new-contact', {
                primer_nombre:  firstName,
                segundo_nombre: middleName || undefined,
                apellidos: apellidos,
                correo: email,
                telefono: phoneNumber,
                password: password,
                genero: gender,
                negocio_id: Number(negocioId),
                platforma: platform
            })
            await api.post(`/auth/negocio/${negocioId}/nuevo-enlace`)
            navigate('/login', { state: { message: '¡Registro exitoso! Inicia sesión.' } })
        } catch(err: any) {
            setError(err.response?.data?.message || 'Error al registrarse')
        } finally {
            setLoadingNegocio(false)
        }
        
    }

    // Alertas de carga y error
    if (loadingNegocio) return <div className="backdrop"><p>Cargando...</p></div>
    if (notFound) return (
        <div className="backdrop">
        <div className="card">
            <h2>Enlace inválido</h2>
            <p>Este enlace de invitación no es válido o ha expirado.</p>
        </div>
        </div>
    )

    return (
        <div className="backdrop">
            <div className="card">
                <h1><strong>{negocioNombre}</strong> te invita a unirte</h1>
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
                        placeholder='Si no tienes segundo nombre coloca "N/A"'
                        onChange={(e) => setMiddleName(e.target.value)}
                    />}
                    {<BasicInput 
                        label='Apellidos'
                        value={apellidos}
                        type='text'
                        onChange={(e) => setApellidos(e.target.value)}
                    />}
                    {<BasicInput 
                        label='Número de Telefono'
                        value={phoneNumber}
                        type='tel'
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        maxLegnth={10}
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
                    />}<br />
                    {<BasicDropDown
                        label='¿Como oíste de nosotros?:'
                        defaultElement={platform}
                        optionsArray={['WhatsApp' , 'Facebook' , 'Instagram' , 'Web']} 
                        onChange={(e) => setPlatform(e.target.value)}
                    />}
                    {<TermsAndConditions />}
                    {error && <ErrorMessage message={error} />}
                    {<NextButton 
                        text="Crear Cuenta"
                        type='submit'
                    />}
                </form>
            </div>
        </div>
    )
}