'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'

interface UserData {
  usuarioId: number
  clerkId: string
  email: string
  nombre: string
  direccionDefault: string | null
  rol: string
  fechaRegistro: string
  isAdmin: boolean
}

interface UserContextType {
  userData: UserData | null
  isAdmin: boolean
  isLoading: boolean
  refreshUserData: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, getToken, userId } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = async () => {
    if (!isSignedIn || !userId) {
      setUserData(null)
      setIsLoading(false)
      return
    }

    try {
      const token = await getToken()
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

      if (!backendUrl) {
        console.error('NEXT_PUBLIC_BACKEND_URL no está configurado en el .env')
        setIsLoading(false)
        return
      }

      const response = await fetch(`${backendUrl}/api/v1/usuarios/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })



      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('Usuario no autenticado o sin permisos')
          setUserData(null)
        } else {
          throw new Error(`Error al obtener datos del usuario: ${response.status}`)
        }
      } else {
        const data = await response.json()
        console.log(data)
        setUserData(data)
        console.log('Datos del usuario obtenidos:', data)
      }
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error)
      setUserData(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isSignedIn && userId) {
      fetchUserData()
    } else {
      setUserData(null)
      setIsLoading(false)
    }
  }, [isSignedIn, userId])

  const refreshUserData = async () => {
    setIsLoading(true)
    await fetchUserData()
  }

  return (
    <UserContext.Provider
      value={{
        userData,
        isAdmin: userData?.isAdmin ?? false,
        isLoading,
        refreshUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUserData() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserProvider')
  }
  return context
}

