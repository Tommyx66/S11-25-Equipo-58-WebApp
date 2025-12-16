"use client"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import { Righteous, Inter } from "next/font/google"

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export function Footer() {
  return (
    <footer className={`bg-[#1A1A1B] text-white ${inter.variable}`}>

      {/* Metrics Section */}
      <div className="border-b border-white/10 px-6 py-12 md:py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 md:mb-12 grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            
            <div className="flex flex-col items-center">
              <span className={`${righteous.className} text-4xl sm:text-5xl lg:text-6xl mb-2`} style={{ color: "#03C363" }}>
                12,450
              </span>
              <span className="text-sm md:text-base lg:text-lg text-slate-300 font-light">
                kg CO₂ ahorrado este mes
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className={`${righteous.className} text-4xl sm:text-5xl lg:text-6xl mb-2`} style={{ color: "#03C363" }}>
                8,230
              </span>
              <span className="text-sm md:text-base lg:text-lg text-slate-300 font-light">
                compras sostenibles
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className={`${righteous.className} text-4xl sm:text-5xl lg:text-6xl mb-2`} style={{ color: "#03C363" }}>
                45,600
              </span>
              <span className="text-sm md:text-base lg:text-lg text-slate-300 font-light">
                litros de agua conservada
              </span>
            </div>
          </div>

          <div className="text-center text-slate-500 text-xs md:text-sm font-light">
            Datos en tiempo real basados en métricas verificadas
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-12 md:py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">

            {/* === LOGO COLUMN  === */}
            <div className="flex flex-col items-center lg:items-start lg:col-span-4">
              <Link href="/" className="mb-6 block w-fit">
                 <Image
                  src="/logoWhitee.png"
                  width={220}
                  height={110}
                  alt="EcoShop Logo"
                  className="object-contain h-auto w-auto"
                  priority
                />
              </Link>
              
              <p className="text-base leading-relaxed text-slate-300 max-w-sm text-center lg:text-left">
                EcoShop E-commerce Platform sostenible con impacto medido y verificado.
              </p>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8 lg:pl-12">
              
              {/* Bloque Compra */}
              <div className="text-center sm:text-left">
                <h3 className={`${righteous.className} text-lg md:text-xl mb-4 md:mb-6`} style={{ color: "#03C363" }}>
                  Compra
                </h3>
                <ul className="space-y-3 md:space-y-4">
                  {["Catalogo", "Bajo en CO₂", "Certificaciones"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-sm text-slate-300 hover:text-[#03C363] transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bloque Aprende */}
              <div className="text-center sm:text-left">
                <h3 className={`${righteous.className} text-lg md:text-xl mb-4 md:mb-6`} style={{ color: "#03C363" }}>
                  Aprende
                </h3>
                <ul className="space-y-3 md:space-y-4">
                  {["Nuestro impacto", "Guia de Sostenibilidad", "Metodología CO₂"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-sm text-slate-300 hover:text-[#03C363] transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bloque Legal */}
              <div className="text-center sm:text-left">
                <h3 className={`${righteous.className} text-lg md:text-xl mb-4 md:mb-6`} style={{ color: "#03C363" }}>
                  Legal
                </h3>
                <ul className="space-y-3 md:space-y-4">
                  {["Términos", "Privacidad", "Transparencia"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-sm text-slate-300 hover:text-[#03C363] transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="px-6 pb-12 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col-reverse items-center justify-between gap-6 sm:flex-row">
          
          <p className="text-xs md:text-sm text-slate-400 text-center sm:text-left">
            © 2025 EcoShop. Comercio transparente para un futuro sostenible.
          </p>

          <div className="flex gap-6">
            <Link href="#" className="text-white hover:text-[#03C363] transition-colors">
              <Facebook strokeWidth={1.5} size={24} className="md:w-7 md:h-7" />
            </Link>
            <Link href="#" className="text-white hover:text-[#03C363] transition-colors">
              <Instagram strokeWidth={1.5} size={24} className="md:w-7 md:h-7" />
            </Link>
            <Link href="#" className="text-white hover:text-[#03C363] transition-colors">
              <Linkedin strokeWidth={1.5} size={24} className="md:w-7 md:h-7" />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}