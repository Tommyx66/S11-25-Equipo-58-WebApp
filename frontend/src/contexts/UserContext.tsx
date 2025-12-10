'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'

interface UserData {
  usuarioId: number
  clerkId: string
  email: string
  nombre: string
  rol: string
  ecoPuntos: number
  metricas: {
    co2Ahorrado: number
    aguaAhorrada: number
    comprasSostenibles: number
  }
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
  const { user } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecoshop-backend-mm8u.onrender.com/api/v1';

  const fetchUserData = async () => {
    if (!isSignedIn) {
      setUserData(null)
      setIsLoading(false)
      return
    }

    try {
      // 1. OBTENER DATOS LOCALES 
      const localStr = typeof window !== 'undefined' ? localStorage.getItem('user_stats') : null;
      const local = localStr ? JSON.parse(localStr) : {};
      
      const localPoints = Number(local.ecoPuntos || 0);
      const localCO2 = Number(local.co2 || local.co2Ahorrado || 0);
      const localAgua = Number(local.agua || local.aguaAhorrada || 0);
      const localCompras = Number(local.compras || local.comprasSostenibles || 0);

      // 2. OBTENER DATOS BACKEND
      let backendData: any = {};
      try {
        const token = await getToken();
        if (token) {
           const res = await fetch(`${API_URL}/usuarios/me`, {
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              cache: 'no-store'
           });
           if (res.ok) backendData = await res.json();
        }
      } catch (e) { console.warn("Backend offline o error") }

      // 3. FUSIÓN 
      const backendMetricas = backendData.metricas || {};

      const mergedMetrics = {
          co2Ahorrado: Math.max(localCO2, Number(backendMetricas.co2Ahorrado || 0)),
          aguaAhorrada: Math.max(localAgua, Number(backendMetricas.aguaAhorrada || 0)),
          comprasSostenibles: Math.max(localCompras, Number(backendMetricas.comprasSostenibles || 0))
      };
      
      const mergedPoints = Math.max(localPoints, Number(backendData.ecoPuntos || 0));

      // 4. GUARDAR ESTADO FINAL
      setUserData({
        usuarioId: backendData.usuarioId || 999,
        clerkId: userId || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
        nombre: user?.fullName || "Usuario",
        rol: backendData.rol || "USER",
        ecoPuntos: mergedPoints,
        metricas: mergedMetrics
      })

    } catch (error) {
      console.error('Error user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [isSignedIn, userId])

  return (
    <UserContext.Provider
      value={{
        userData,
        isAdmin: userData?.rol === 'ADMIN',
        isLoading,
        refreshUserData: fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUserData() {
  const context = useContext(UserContext)
  if (context === undefined) throw new Error('useUserData must be used within a UserProvider')
  return context
}