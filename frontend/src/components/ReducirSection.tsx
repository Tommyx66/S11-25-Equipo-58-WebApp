'use client'

import { Button } from "./ui/button"
import { useAuth } from "@clerk/nextjs"
import { useUI } from "@/contexts/UIContext"

export default function ReducirSection() {
  const { isSignedIn } = useAuth()
  const { openAuth, openImpact } = useUI()

  return (
    <section className="bg-[#0F8354] py-20 md:py-32 w-full">
      <div className="container mx-auto px-6 flex flex-col items-center gap-10 md:gap-14 text-white text-center">
        
        <h2 className="font-righteous font-normal text-4xl sm:text-5xl md:text-7xl leading-tight tracking-tight text-balance">
          Empieza a Reducir tu CO₂ Hoy
        </h2>
        
        <p className="font-sans font-light text-lg sm:text-2xl md:text-3xl leading-relaxed max-w-4xl text-pretty opacity-90">
          Cada compra cuenta. Conoce tu impacto en tiempo real con productos
          verificados que cuidan del planeta y de las generaciones futuras.
        </p>

        {isSignedIn ? (
          <Button
            size="lg"
            onClick={openImpact}
            className="h-auto py-6 px-10 md:px-16 text-xl md:text-2xl bg-white text-[#0F8354] 
            hover:bg-gray-100 hover:text-[#0a633e] hover:-translate-y-1 hover:shadow-2xl
            border-none rounded-none font-righteous font-medium transition-all duration-300"
          >
            Ver Mi Impacto
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={openAuth}
            className="h-auto py-6 px-10 md:px-16 text-xl md:text-2xl bg-white text-[#0F8354] 
            hover:bg-gray-100 hover:text-[#0a633e] hover:-translate-y-1 hover:shadow-2xl
            border-none rounded-none font-righteous font-medium transition-all duration-300"
          >
            Iniciar Sesión
          </Button>
        )}
      </div>
    </section>
  );
}