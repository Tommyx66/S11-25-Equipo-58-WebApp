'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCart } from '@/contexts/CartContext'
import clsx from 'clsx'

interface NavItem {
  label: string;
  href: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  
  const { toggleCart, cartItems } = useCart()
  
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)


  const navItems: NavItem[] = [
    { label: 'Productos', href: '/#productos' },
    { label: 'Aprende', href: '/#aprende' },
    { label: 'Nuestro impacto', href: '/#impacto' },
    { label: 'Certificaciones', href: '/#certificaciones' },
  ]

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  if (!mounted) return null

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-40 w-full transition-all duration-300 border-b backdrop-blur-xl",
          scrolled
            ? "h-16 bg-white/80 dark:bg-slate-950/80 border-black/10 dark:border-white/10 shadow-md"
            : "h-20 bg-white/90 dark:bg-slate-950/90 border-transparent"
        )}
      >
        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden md:flex items-center h-full w-full px-10 max-w-7xl mx-auto">
          

          <Link href="/#inicio" className="flex-shrink-0 mr-12 lg:mr-20 hover:opacity-90 transition">
            <Image
              src="/logo.png"
              alt="eco SHOP"
              width={140}
              height={72}
              priority
              className="w-auto h-auto max-h-12 object-contain"
            />
          </Link>

          {/* NAV LINKS */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-6 lg:gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-righteous text-base lg:text-lg text-gray-900 dark:text-white 
                  relative group transition-all whitespace-nowrap"
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
          <div className="flex items-center gap-3 lg:gap-5 ml-4">
            
          

            <button 
              onClick={toggleCart}
              className="relative p-2 rounded-lg text-black/90 hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              <ShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0F8354] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <Link
              href="/login"
              className="font-righteous text-sm lg:text-base px-4 py-2 border-2 border-blue-600 text-blue-600 
              dark:text-blue-400 dark:border-blue-400 rounded-lg bg-white dark:bg-slate-900 
              transition-all duration-200 hover:bg-blue-600 hover:text-white 
              dark:hover:bg-blue-600 dark:hover:text-white hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
            >
              Iniciar sesión
            </Link>
          </div>
        </nav>

        {/* ================= MOBILE NAV ================= */}
        <nav className="md:hidden flex items-center justify-between h-full w-full px-4 sm:px-6">
          <Link href="/#inicio" className="hover:opacity-90 transition">
            <Image 
              src="/logo.png" 
              alt="eco SHOP" 
              width={110} 
              height={55} 
              priority 
              className="w-24 sm:w-28 object-contain"
            />
          </Link>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleCart}
              className="relative p-2 text-black/90 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-md"
            >
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#0F8354] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition text-black/90 dark:text-white"
            >
              <Menu size={28} />
            </button>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      <div
        className={clsx(
          "fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* MOBILE SIDEBAR */}
      <aside
        className={clsx(
          "fixed top-0 right-0 z-[60] w-[80%] max-w-sm h-full bg-white dark:bg-slate-950 shadow-2xl p-6 md:hidden",
          "transition-transform duration-300 ease-[cubic-bezier(.25,.8,.25,1)]",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-8">
           <span className="font-righteous text-lg text-gray-500">Menú</span>
           <button 
             onClick={() => setIsMenuOpen(false)}
             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
           >
             <X size={28} />
           </button>
        </div>

        {/* Items Mobile */}
        <div className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="font-righteous text-2xl text-gray-900 dark:text-white 
              hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {item.label}
            </Link>
          ))}

          <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />

          

          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="font-righteous mt-4 w-full py-4 border-2 border-blue-600 text-blue-600 
            dark:text-blue-400 dark:border-blue-400 rounded-xl bg-white dark:bg-slate-900 
            transition hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-center text-lg"
          >
            Iniciar sesión
          </Link>
        </div>
      </aside>
    </>
  )
}