import './CSS/Signup.css'
import GoogleButton from "../Components/GoogleButton";
import Divider from '../Components/Divider';
import BasicInput from '../Components/BasicInput';
import { use, useState } from 'react';
import BirthdayInput from '../Components/BirthdayInput';
import GenderInput from '../Components/GenderInput';
import TermsAndConditions from '../Components/TermsAndConditions';
import NextButton from '../Components/NextButton';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

    // ── Functions ──────────────────────────────────────────────
    const validateInputs = () => {
        event?.preventDefault();
        console.log("First Name: ", firstName); 
        console.log("Middle Name: ", middleName);
        console.log("Apellidos: ", apellidos);
        console.log("Phone number: ", phoneNumber);
        console.log("Birthday: ", `${birthMonth}/${birthDay}/${birthYear}`)
        console.log("Gender: ", gender);
        console.log("Email: ", email);
        console.log("Confirm Email: ", confirmEmail);
        email === confirmEmail ? console.log("Emails match") : console.log("Emails do not match");
        console.log("Password: ", password);
        console.log("Confirm Password: ", password);
        password === confirmPassword ? console.log("Passwords match") : console.log("Passwords do not match");
        navigate('/welcome-new-user');
    }

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
                    type='password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                {<BasicInput 
                    label='Número de Telefono'
                    value={phoneNumber}
                    type='phoneNumber'
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                />}
                {<TermsAndConditions />}
                {<NextButton 
                    text="Crear Cuenta"
                    onClick={validateInputs}
                />}
            </div>
        </div>
    )
}