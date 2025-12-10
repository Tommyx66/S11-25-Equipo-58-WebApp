'use client'

import { useEffect, useRef } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useUserData } from '@/contexts/UserContext'

export function ClerkTokenLogger() {
  const { isSignedIn, getToken, userId } = useAuth()
  const { user } = useUser()
  const { refreshUserData } = useUserData()
  const hasLoggedToken = useRef(false)
  const hasSynced = useRef(false)

  useEffect(() => {
    const logTokenAndSync = async () => {
      if (isSignedIn && userId && !hasLoggedToken.current) {
        try {
          const token = await getToken()
          hasLoggedToken.current = true
          
          console.log('=== Clerk Token ===')
          console.log('User ID:', userId)
          console.log('Token:', token)
          console.log('==================')

          // sincronizar con el backend si es un nuevo usuario
          if (user && user.createdAt && !hasSynced.current) {
            const createdAt = new Date(user.createdAt)
            const now = new Date()
            const timeDiff = now.getTime() - createdAt.getTime()
            const minutesDiff = timeDiff / (1000 * 60)

            // usuario nuevo  = 5 minutos
            const isNewUser = minutesDiff < 5

            if (isNewUser) {
              await syncUserWithBackend(userId, token)
              hasSynced.current = true
              // refrescar los datos del usuario después de sincronizar
              await refreshUserData()
            }
          }
        } catch (error) {
          console.error('Error obteniendo el token de Clerk:', error)
        }
      }
    }

    logTokenAndSync()
  }, [isSignedIn, getToken, userId, user, refreshUserData])

  // reset cuando el usuario cierra sesión
  useEffect(() => {
    if (!isSignedIn) {
      hasLoggedToken.current = false
      hasSynced.current = false
    }
  }, [isSignedIn])

  const syncUserWithBackend = async (userId: string, token: string | null) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      
      if (!backendUrl) {
        console.error('NEXT_PUBLIC_BACKEND_URL no está configurado en el .env')
        return
      }

      const syncUrl = `${backendUrl}/api/v1/test/clerk/sync-user/${userId}`
      
      console.log('Sincronizando usuario con backend:', syncUrl)

      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`Error en la sincronización: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Usuario sincronizado exitosamente:', data)
    } catch (error) {
      console.error('Error sincronizando usuario con backend:', error)
    }
  }

  return null
}

