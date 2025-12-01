"use client"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"
import { Righteous } from "next/font/google"

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
})

export function Footer() {
  return (
    <footer className="text-white bg-[#1A1A1B]">
      {/* Impact Metrics Section */}
      <div className="border-b border-slate-700 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div
                className={`${righteous.className} text-4xl font-bold`}
                style={{ color: "#03C363" }}
              >
                12,450
              </div>
              <div className="mt-2 text-sm text-slate-300">
                kg CO₂ ahorrado este mes
              </div>
            </div>

            <div className="text-center">
              <div
                className={`${righteous.className} text-4xl font-bold`}
                style={{ color: "#03C363" }}
              >
                8,230
              </div>
              <div className="mt-2 text-sm text-slate-300">
                compras sostenibles
              </div>
            </div>

            <div className="text-center">
              <div
                className={`${righteous.className} text-4xl font-bold`}
                style={{ color: "#03C363" }}
              >
                45,600
              </div>
              <div className="mt-2 text-sm text-slate-300">
                litros de agua conservada
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-400">
            Datos en tiempo real basados en métricas verificadas
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Logo */}
            <div className="md:col-span-1 flex flex-col items-center sm:items-start">
              <a href="#" className="block">
                <Image
                  src="/logoWhite.png"
                  width={260}
                  height={110}
                  alt="EcoShop Logo"
                  className="object-contain"
                />
              </a>

              <p className="mt-4 text-sm leading-relaxed text-slate-300 text-center sm:text-left">
                EcoShop. E-commerce sostenible con impacto medido y verificado.
              </p>
            </div>

            {/* Navigation Columns */}
            <div className="md:col-span-1">
              <h3 className={`${righteous.className} text-lg mb-4 font-bold`} style={{ color: "#03C363" }}>
                Compra
              </h3>
              <ul className="space-y-3">
                {["Catálogo", "Bajo en CO₂", "Certificaciones"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-300 transition-colors hover:text-emerald-400"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-1">
              <h3 className={`${righteous.className} text-lg mb-4 font-bold`} style={{ color: "#03C363" }}>
                Aprende
              </h3>
              <ul className="space-y-3">
                {["Nuestro impacto", "Guía de Sostenibilidad", "Metodología CO₂"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-300 transition-colors hover:text-emerald-400"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-1">
              <h3 className={`${righteous.className} text-lg mb-4 font-bold`} style={{ color: "#03C363" }}>
                Legal
              </h3>
              <ul className="space-y-3">
                {["Términos", "Privacidad", "Transparencia"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-300 transition-colors hover:text-emerald-400"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-700 px-6 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-400">
            © 2025 EcoShop. Comercio transparente para un futuro sostenible.
          </p>

          <div className="flex gap-4">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-slate-400 transition-colors hover:text-emerald-400"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
