'use client'

import { useState } from 'react'
import { useSignIn, useSignUp } from '@clerk/nextjs'
import { X } from 'lucide-react'
import clsx from 'clsx'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

type AuthMode = 'signin' | 'signup'

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [error, setError] = useState<string | null>(null)

  const { isLoaded: signInLoaded, signIn } = useSignIn()
  const { isLoaded: signUpLoaded, signUp } = useSignUp()

  if (!open) return null

  const handleOAuth = async (strategy: 'oauth_google' | 'oauth_microsoft') => {
    setError(null)
    try {
      if (mode === 'signin') {
        if (!signInLoaded || !signIn) {
          setError('El sistema de autenticación no está listo. Intenta nuevamente.')
          return
        }
        await signIn.authenticateWithRedirect({
          strategy,
          redirectUrl: '/',
          redirectUrlComplete: '/',
        })
      } else {
        if (!signUpLoaded || !signUp) {
          setError('El sistema de autenticación no está listo. Intenta nuevamente.')
          return
        }
        await signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: '/',
          redirectUrlComplete: '/',
        })
      }
    } catch (err: unknown) {
      const clerkError = (err as { errors?: Array<{ longMessage?: string; message?: string }> })?.errors?.[0]?.longMessage || 
                         (err as { errors?: Array<{ longMessage?: string; message?: string }> })?.errors?.[0]?.message
      setError(clerkError ?? `No se pudo autenticar con ${strategy === 'oauth_google' ? 'Google' : 'Microsoft'}.`)
    }
  }

  const isLoaded = mode === 'signin' ? signInLoaded : signUpLoaded

  return (
    <div className="fixed inset-0 z-[70]  bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={clsx(
          "relative w-full max-w-[550px] bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-gray-200 dark:border-slate-800",
          "p-6 sm:p-8"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        {/* <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-slate-800">
          <button
            onClick={() => {
              setMode('signin')
              setError(null)
            }}
            className={clsx(
              "flex-1 py-3 font-righteous text-base transition-colors",
              mode === 'signin'
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => {
              setMode('signup')
              setError(null)
            }}
            className={clsx(
              "flex-1 py-3 font-righteous text-base transition-colors",
              mode === 'signup'
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            Crear cuenta
          </button>
        </div> */}

        <div className="mb-6 gap-2 flex flex-col">
          <p className="font-righteous text-2xl text-center text-gray-900 dark:text-white">
          Bienvenido a ECOSHOP
          </p>
          <p className="text-md font-sans text-center text-[#1A1A1B] dark:text-gray-400 mt-1">
            {mode === 'signin' 
              ? 'Inicia sesión rápidamente para comenzar a comprar productos y medir tu impacto ambiental.'
              : 'Regístrate con tu cuenta de Google o Microsoft.'}
          </p>
        </div>

     
        <div className="space-y-3">
          <button
            onClick={() => handleOAuth('oauth_google')}
            disabled={!isLoaded}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-sm border border-gray-600 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-righteous text-md text-[#1A1A1B] dark:text-gray-300">
              {mode === 'signin' ? 'Continuar con Google' : 'Registrarse con Google'}
            </span>
          </button>

          <button
            onClick={() => handleOAuth('oauth_microsoft')}
            disabled={!isLoaded}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-sm border border-gray-600 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
              <path fill="#F25022" d="M0 0h11v11H0z" />
              <path fill="#00A4EF" d="M12 0h11v11H12z" />
              <path fill="#7FBA00" d="M0 12h11v11H0z" />
              <path fill="#FFB900" d="M12 12h11v11H12z" />
            </svg>
            <span className="font-righteous text-md text-[#1A1A1B] dark:text-gray-300">
              {mode === 'signin' ? 'Continuar con Microsoft' : 'Registrarse con Microsoft'}
            </span>
          </button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-500 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <p className="text-md md:mb-20 text-gray-800 dark:text-gray-400 mt-6 text-center">
          {mode === 'signin' ? (
            <>¿No tienes cuenta?{' '}
              <button
                onClick={() => {
                  setMode('signup')
                  setError(null)
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Regístrate aquí
              </button>
            </>
          ) : (
            <>¿Ya tienes cuenta?{' '}
              <button
                onClick={() => {
                  setMode('signin')
                  setError(null)
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Inicia sesión aquí
              </button>
            </>
          )}
        </p>
      <p className="text-sm text-[#1A1A1B] dark:text-gray-500 mt-4 text-center">
        Al continuar, aceptas nuestros{' '}
        <a
          href="/terminos"
          className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          Términos de Servicio
        </a>{' '}
        y{' '}
        <a
          href="/privacidad"
          className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          Política de Privacidad
        </a>
        .
      </p>
      </div>
    </div>
  )
}
