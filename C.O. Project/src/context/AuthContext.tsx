import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react';
import api from '../api/axios'

interface User {
  id:            number
  primer_nombre: string
  segundo_nombre: string | null
  apellidos:     string
  correo:         string
  telefono:      string
  es_negocio:    boolean
}

interface AuthContextType {
  user:     User | null
  loading:  boolean
  login:    (correo: string, password: string) => Promise<void>
  logout:   () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on app load
  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (correo: string, password: string) => {
    const res = await api.post('/auth/login', { correo, password })
    setUser(res.data.user)
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy access
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}