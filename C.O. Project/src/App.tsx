import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chat from './Views/Chat'
import Dashboard from './Views/Dashboard'
import ForgotMyPassword from './Views/ForgotMyPassword'
import Login from './Views/Login'
import NewPassword from './Views/NewPassword'
import Signup from './Views/Signup'
import UsersTiers from './Views/UsersTiers'
import WelcomeNewUser from './Views/WelcomeNewUser'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotMyPassword />} />
          <Route path='/new-password' element={<NewPassword />} />
          <Route path='/welcome-new-user' element={<WelcomeNewUser />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/users-tiers' element={<UsersTiers />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
