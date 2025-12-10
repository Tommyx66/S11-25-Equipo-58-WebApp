'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { useUserData } from '@/contexts/UserContext'

export default function DashboardPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { isAdmin, isLoading: userLoading } = useUserData()
  const router = useRouter()

  useEffect(() => {
    if (authLoaded && !userLoading) {
      if (!isSignedIn) {
        router.push('/')
        return
      }
      if (!isAdmin) {
        router.push('/')
        return
      }
    }
  }, [isSignedIn, isAdmin, authLoaded, userLoading, router])

  if (!authLoaded || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
          <h1 className="font-righteous text-3xl text-gray-900 dark:text-white mb-4">
            Dashboard de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bienvenido al panel de administración. Aquí puedes gestionar tu aplicación.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Aquí puedes agregar más componentes del dashboard */}
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h2 className="font-righteous text-lg text-blue-900 dark:text-blue-300 mb-2">
                Gestión de Usuarios
              </h2>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Administra los usuarios de la plataforma
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <h2 className="font-righteous text-lg text-green-900 dark:text-green-300 mb-2">
                Gestión de Productos
              </h2>
              <p className="text-sm text-green-700 dark:text-green-400">
                Administra el catálogo de productos
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
              <h2 className="font-righteous text-lg text-purple-900 dark:text-purple-300 mb-2">
                Estadísticas
              </h2>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Visualiza las estadísticas de la plataforma
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

