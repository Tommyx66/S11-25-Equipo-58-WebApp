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
      {/* DESKTOP */}
      <nav className="hidden md:flex items-center h-full px-10">

        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 mr-20 hover:opacity-90 transition">
          <Image
            src="/logo.png"
            alt="eco SHOP"
            width={140}
            height={72}
            priority
          />
        </Link>

        {/* NAV LINKS CENTRADOS */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-12">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-righteous text-lg text-gray-900 dark:text-white 
                relative group transition-all"
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

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-black/90  hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          {/* Cart */}
          <button className="p-2 rounded-lg text-black/90 hover:bg-black/5 dark:hover:bg-white/10 transition">
            <ShoppingCart size={24} />
          </button>

          {/* Login */}
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

      {/* MOBILE */}
      <nav className="md:hidden flex items-center justify-between h-full px-6">
        <Link href="/" className="hover:opacity-90 transition">
          <Image src="/logo.png" alt="eco SHOP" width={110} height={55} priority />
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      <aside
        className={clsx(
          "fixed top-0 right-0 w-72 h-full bg-white dark:bg-slate-900 shadow-xl p-6 md:hidden",
          "transition-transform duration-300 ease-[cubic-bezier(.25,.8,.25,1)]",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Items */}
        <div className="flex flex-col gap-8 mt-12">

          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="font-righteous text-xl text-gray-900 dark:text-white 
              hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {item.label}
            </Link>
          ))}

          <div className="flex items-center gap-5 pt-8 border-t border-gray-300 dark:border-gray-700">

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 transition rounded-lg"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 transition rounded-lg">
              <ShoppingCart size={24} />
            </button>
          </div>

          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="font-righteous mt-6 px-6 py-3 border-2 border-blue-600 text-blue-600 
            dark:text-blue-400 dark:border-blue-400 rounded-lg bg-white dark:bg-slate-900 
            transition hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-center"
          >
            Iniciar sesión
          </Link>
        </div>
      </aside>
    </header>
  )
}
