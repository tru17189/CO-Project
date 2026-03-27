import { createContext, useContext, useState, useEffect, use } from 'react'
import type { ReactNode } from 'react';
import api from '../api/axios'

// ── PROPERTIES ────────────────────────────────────
/*
  En esta seccion se encuentran todas propiedades relacionadas con la autenticacion, 
  como el tipo de usuario, el contexto de autenticacion, etc.
*/

interface User {
  id:             number
  primer_nombre:  string
  segundo_nombre: string | null
  apellidos:      string
  correo:         string
  telefono:       string
  genero:         string | null
  es_negocio:     boolean
  negocio: {
    id:            number
    nombre:        string
    telefono:      string
    correo:        string
    num_empleados: number | null
    plan:          'basico' | 'pro' | 'premium'
    total_contactos:number
    total_compradores: number
    enlaces_enviados: number
  } | null
}

// Extend the AuthContextType to include register function
export interface RegisterData {
  // Step 1
  primer_nombre:   string
  segundo_nombre?: string
  apellidos:       string
  genero:          string
  correo:          string
  telefono:        string
  password:        string
  // Step 2
  nombre_negocio:    string
  telefono_negocio:  string
  correo_negocio:    string
  num_empleados?:    number
  plan:              'basico' | 'pro' | 'premium'
}

interface RegisterNewContactData {
  primer_nombre:   string
  segundo_nombre?: string
  apellidos:       string
  genero:          string
  correo:          string
  telefono:        string
  password:        string
  platforma:       'WhatsApp' | 'Facebook' | 'Instagram' | 'Web'
  contactedBy:      number
}

interface AuthContextType {
  user:     User | null
  loading:  boolean
  login:    (correo: string, password: string) => Promise<void>
  logout:   () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  checkEmail: (correo: string) => Promise<void>
  registerNewContact: (data: RegisterNewContactData) => Promise<void>
  clients: clientProps[]
}

// Propiedades de un cliente asignado a un negocio
interface clientProps {
  contacto_id: number
  negocio_id: number
  primer_nombre: string
  apellidos: string
  es_negocio: boolean
  telefono: string,
  plataforma: 'WhatsApp' | 'Facebook' | 'Instagram' | 'Web'
}

// ── CONTEXT ────────────────────────────────────
/*
  En esta seccion se encuentra el contexto de autenticacion, que es el encargado de manejar 
  toda la logica relacionada con la autenticacion en el frontend, como el login, logout, 
  registro, etc. Este contexto se puede consumir en cualquier componente del frontend para 
  obtener la informacion del usuario autenticado o para realizar acciones de autenticacion.
*/
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<clientProps[]>([]) // Estado para almacenar los clientes del negocio

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

  const register = async (data: RegisterData) => {
    await api.post('/auth/register', data)
  }

  const registerNewContact = async (data: RegisterNewContactData) => {
    await api.post('/auth/register/new-contact', data)
  }

  const checkEmail = async (correo: string) => {
    await api.post('/auth/check-email', { correo })
  }

  // Obtener los clientes del negocio cuando el usuario es un negocio
  useEffect(() => {
    if (user && user.es_negocio) {
      api.post('/auth/show-business-clients')
        .then(res => setClients(res.data.contactos_negocio))
        .catch(err => console.error('Error fetching business clients:', err))
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, checkEmail, clients, registerNewContact }}>
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

