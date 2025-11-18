'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Moon, Sun, ShoppingCart } from 'lucide-react'
import { useTheme } from 'next-themes'
import clsx from 'clsx'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  const navItems = [
    { label: 'Productos', href: '#' },
    { label: 'Nuestro impacto', href: '#' },
    { label: 'Aprende', href: '#' },
  ]

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Evitamos scroll en el body cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  if (!mounted) return null

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-xl",
        scrolled
          ? "h-18 bg-white/80 dark:bg-slate-950/80 border-black/10 dark:border-white/10 shadow-md"
          : "h-24 bg-white/90 dark:bg-slate-950/90 border-transparent"
      )}
    >
      {/* --- DESKTOP NAV --- */}
      <nav className="hidden md:flex items-center h-full px-10">
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 mr-20 hover:opacity-90 transition">
          <Image
            src="/logo.png"
            alt="eco SHOP"
            width={140}
            height={72}
            priority
            className="object-contain"
          />
        </Link>

        {/* LINKS */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-12">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-righteous text-lg text-gray-900 dark:text-white relative group transition-all"
              >
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.label}
                </span>
                <span
                  className="absolute -bottom-1 left-1/2 w-0 h-[3px] bg-blue-600 dark:bg-blue-400 
                  group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* ICONOS + LOGIN */}
        <div className="flex items-center gap-5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-black/90 hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10 transition"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          {/* Corregido el typo "p-2<" */}
          <button className="p-2 rounded-lg text-black/90 hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10 transition">
            <ShoppingCart size={24} />
          </button>

          <Link
            href="/login"
            className="font-righteous text-base px-5 py-2 border-2 border-blue-600 text-blue-600 
            dark:text-blue-400 dark:border-blue-400 rounded-lg bg-white dark:bg-slate-900 
            transition-all duration-200 hover:bg-blue-600 hover:text-white 
            dark:hover:bg-blue-600 dark:hover:text-white hover:shadow-lg hover:-translate-y-0.5"
          >
            Iniciar sesión
          </Link>
        </div>
      </nav>

      {/* --- MOBILE NAV BAR --- */}
      <nav className="md:hidden flex items-center justify-between h-full px-6 relative z-50">
        <Link href="/" className="hover:opacity-90 transition">
          <Image src="/logo.png" alt="eco SHOP" width={110} height={55} priority className="object-contain"/>
        </Link>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          <Menu size={28} />
        </button>
      </nav>

      {/* --- MOBILE MENU OVERLAY & ASIDE --- */}
      
      {/* Overlay oscuro */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer Lateral */}
      <aside
        className={clsx(
          "fixed top-0 right-0 w-[80%] max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl z-[60] md:hidden flex flex-col",
          "transition-transform duration-300 ease-[cubic-bezier(.25,.8,.25,1)]",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header del Drawer (Botón Cerrar) */}
        <div className="flex items-center justify-end p-6 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
          >
            <X size={28} />
          </button>
        </div>

        {/* Contenido del Menú */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <nav className="flex flex-col gap-6 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="font-righteous text-2xl text-gray-800 dark:text-gray-100 
                hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-between group"
              >
                {item.label}
                {/* Pequeña flecha visual para UX */}
                <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500">
                  &rarr;
                </span>
              </Link>
            ))}
          </nav>

          {/* Footer del Menú (Botones) */}
          <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-medium"
              >
                {theme === 'dark' ? (
                  <> <Sun size={20} /> Claro </>
                ) : (
                  <> <Moon size={20} /> Oscuro </>
                )}
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-medium">
                <ShoppingCart size={20} /> Carrito
              </button>
            </div>

            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="w-full font-righteous text-center py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </aside>
    </header>
  )
}