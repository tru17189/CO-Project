import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Chat from './Views/Chat'
import ProtectedRoute  from './Components/ProtectedRoute'
import Dashboard from './Views/Dashboard'
import ForgotMyPassword from './Views/ForgotMyPassword'
import Login from './Views/Login'
import NewPassword from './Views/NewPassword'
import Signup from './Views/Signup'
import UsersTiers from './Views/UsersTiers'
import WelcomeNewUser from './Views/WelcomeNewUser'
import SignupBusiness from './Views/SignupBusiness'
// New contacts sign up imports
import SignupNewContact from './Views/NewContact/SignupNewContact'
import WelcomeNewContact from './Views/NewContact/WelcomeNewContact'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signup/business' element={<SignupBusiness />} />
          <Route path='/forgot-password' element={<ForgotMyPassword />} />
          <Route path='/new-password' element={<NewPassword />} />
          <Route path='/welcome-new-user' element={<WelcomeNewUser />} />
          <Route path='/signup/users-tiers' element={<UsersTiers />} />
          <Route path='/chat' element={<Chat />} />
          {/* Roots for new contacts*/}
          <Route path='/signup/new-contact' element={<SignupNewContact />} />
          <Route path='/signup/welcome-new-contact' element={<WelcomeNewContact />} />
          {/* Protected routes */}
          <Route path='/dashboard' 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
          }/>
          {/* Default redirect */}
          < Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
