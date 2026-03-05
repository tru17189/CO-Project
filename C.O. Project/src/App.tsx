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
          <Route path='/chat' element={<Chat />} />
          <Route path='/users-tiers' element={<UsersTiers />} />
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
