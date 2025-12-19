'use client'

import { Button } from "./ui/button"
import { useAuth } from "@clerk/nextjs"
import { useUI } from "@/contexts/UIContext"
import { Righteous, Inter } from "next/font/google"
import { motion } from "framer-motion"

// FUENTES
const righteous = Righteous({ subsets: ["latin"], weight: "400", variable: "--font-righteous" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function ReducirSection() {
  const { isSignedIn } = useAuth()
  const { openAuthModal, openImpact } = useUI()

  return (
    <section className={`relative w-full py-32 md:py-48 overflow-hidden ${inter.variable} ${righteous.variable}`}>
      
      <div className="absolute inset-0 z-0">
       {/*  <img 
            src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2532&auto=format&fit=crop" 
            alt="Fondo Bosque" 
            className="w-full h-full object-cover"
        /> */}
        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F8354]/90 to-black/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" /> 
      </div>

      {/* --- CONTENIDO --- */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center text-white">
        
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="font-righteous text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight mb-6 drop-shadow-lg"
        >
          Empieza a Reducir <br className="hidden md:block"/> tu CO₂ Hoy
        </motion.h2>
        
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="font-sans font-light text-lg md:text-2xl text-slate-200 max-w-3xl leading-relaxed mb-12 text-pretty"
        >
          Cada compra cuenta. Conoce tu impacto en tiempo real con productos verificados que cuidan del planeta y de las generaciones futuras.
        </motion.p>

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "backOut" }}
            viewport={{ once: true }}
        >
            <Button
              size="lg"
              onClick={isSignedIn ? openImpact : openAuthModal}
              className="h-auto py-5 px-12 md:py-6 md:px-16 text-xl md:text-2xl 
              bg-white text-[#0F8354] border border-transparent
              hover:bg-[#0F8354] hover:text-white hover:border-white
              rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(15,131,84,0.6)]
              font-righteous tracking-wide transition-all duration-500 transform hover:-translate-y-1"
            >
              {isSignedIn ? "Ver Mi Impacto" : "Iniciar Sesión"}
            </Button>
        </motion.div>

      </div>
    </section>
  );
}