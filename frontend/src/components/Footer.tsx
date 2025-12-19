"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { Righteous, Inter } from "next/font/google";

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export function Footer() {
  
  // --- DEFINICIÓN DE LINKS ---
  const shopLinks = [
    { label: "Catálogo Completo", href: "#productos" },
    { label: "Bajo en CO₂", href: "#productos" }, 
    { label: "Certificaciones", href: "#sellos" },
  ];

  const learnLinks = [
    { label: "Nuestro Impacto", href: "#impacto" }, 
    { label: "Guía de Sostenibilidad", href: "#aprende" }, 
    { label: "Metodología CO₂", href: "#reducir" }, 
  ];

  const legalLinks = [
    { label: "Términos y Condiciones", href: "#" },
    { label: "Política de Privacidad", href: "#" },
    { label: "Transparencia", href: "#impacto" },
  ];

  return (
    <footer
      className={`bg-[#0A0A0A] text-white ${inter.variable} ${righteous.variable} border-t border-white/5`}
    >
      {/* --- METRICS BAR  --- */}
      <div className="border-b border-white/5 bg-black/20">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 text-center divide-y md:divide-y-0 md:divide-x divide-white/5">
            {/* Metrica 1 */}
            <div className="flex flex-col items-center py-4 md:py-0">
              <span className="font-righteous text-5xl md:text-6xl text-[#03C363] mb-2 tracking-tight">
                12,450
              </span>
              <span className="text-sm uppercase tracking-widest text-slate-500 font-medium">
                kg CO₂ Ahorrado
              </span>
            </div>

            {/* Metrica 2 */}
            <div className="flex flex-col items-center py-4 md:py-0">
              <span className="font-righteous text-5xl md:text-6xl text-[#03C363] mb-2 tracking-tight">
                8,230
              </span>
              <span className="text-sm uppercase tracking-widest text-slate-500 font-medium">
                Compras Sostenibles
              </span>
            </div>

            {/* Metrica 3 */}
            <div className="flex flex-col items-center py-4 md:py-0">
              <span className="font-righteous text-5xl md:text-6xl text-[#03C363] mb-2 tracking-tight">
                45,600
              </span>
              <span className="text-sm uppercase tracking-widest text-slate-500 font-medium">
                Litros de Agua
              </span>
            </div>
          </div>

          <div className="mt-12 text-center">
            <span className="inline-flex items-center rounded-full bg-white/5 px-4 py-1 text-xs text-slate-400 border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#03C363] mr-2 animate-pulse"></span>
              Datos verificados en tiempo real
            </span>
          </div>
        </div>
      </div>

      {/* --- MAIN LINKS AREA --- */}
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Logo & Brand */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-6">
            <Link
              href="/"
              className="block opacity-90 hover:opacity-100 transition-opacity"
            >
              <Image
                src="/logoWhitee.png"
                width={180}
                height={90}
                alt="EcoShop Logo"
                className="object-contain"
              />
            </Link>
            <p className="text-slate-400 font-light leading-relaxed text-center lg:text-left max-w-sm">
              EcoShop E-commerce Platform sostenible con impacto medido y
              verificado.{" "}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10 lg:pl-20">
            {/* Columna Compra */}
            <div className="flex flex-col space-y-6">
              <h3 className="font-righteous text-lg text-white tracking-wide">
                Compra
              </h3>
              <ul className="space-y-4">
                {shopLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group flex items-center text-slate-400 hover:text-[#03C363] transition-colors text-sm"
                    >
                      {item.label}
                      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna Aprende */}
            <div className="flex flex-col space-y-6">
              <h3 className="font-righteous text-lg text-white tracking-wide">
                Aprende
              </h3>
              <ul className="space-y-4">
                {learnLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group flex items-center text-slate-400 hover:text-[#03C363] transition-colors text-sm"
                    >
                      {item.label}
                      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna Legal */}
            <div className="flex flex-col space-y-6">
              <h3 className="font-righteous text-lg text-white tracking-wide">
                Legal
              </h3>
              <ul className="space-y-4">
                {legalLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group flex items-center text-slate-400 hover:text-[#03C363] transition-colors text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER BOTTOM --- */}
      <div className="border-t border-white/5 bg-black/40 px-6 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 font-light">
            © 2025 EcoShop. Comercio transparente para un futuro sostenible.
          </p>

          <div className="flex gap-6">
            {[
              { Icon: Facebook, href: "#" },
              { Icon: Instagram, href: "#" },
              { Icon: Linkedin, href: "#" },
            ].map(({ Icon, href }, i) => (
              <Link
                key={i}
                href={href}
                className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Icon strokeWidth={1.5} size={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}