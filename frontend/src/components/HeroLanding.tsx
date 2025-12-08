'use client'

import { Righteous } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

// Configuración de la fuente
const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
})

// Constantes para la grilla
const GRID_COLS = 20
const GRID_ROWS = 8
const TOTAL_DOTS = GRID_COLS * GRID_ROWS

export function HeroLanding() {
  return (
    <section className="relative flex min-h-[700px] w-full items-center justify-center overflow-hidden bg-white">
      
      {/* === FONDO ANIMADO DE PUNTOS === */}
      <div 
        className="absolute inset-0 grid gap-4 px-4 pointer-events-none"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: TOTAL_DOTS }).map((_, i) => {
          const col = i % GRID_COLS
          
          const delay = -(GRID_COLS - col) * 0.2
          
          return (
            <div key={i} className="flex items-center justify-center">
              <div
                className="rounded-full bg-[#E0F2EB] aspect-square w-full max-w-[60px] will-change-[opacity,transform]"
                style={{
                  animation: `waveColor 8s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 text-center">
        
        <h1
          className={`${righteous.className} mb-8 text-balance font-normal text-[#1A1A1B] leading-[1.15] tracking-tight
          text-5xl sm:text-6xl md:text-[70px] lg:text-[80px]`}
        >
        
          <span className="text-[#0F8354]">Compra</span> Consciente, <span className="text-[#0F8354]">Impacto</span> Medible
        </h1>

        <p className="mx-auto mb-12 max-w-3xl font-sans text-lg leading-relaxed text-gray-700 sm:text-xl md:text-2xl">
          Cada producto viene con su huella de carbono verificada. Visualiza tu impacto ambiental en tiempo
          real y acumula puntos verdes por cada compra sostenible.
        </p>

        <div className={`${righteous.className} flex flex-col items-center justify-center gap-6 sm:flex-row`}>
          {/* Botón Principal */}
          <Button
  size="lg"
  asChild
  className="group relative h-16 bg-[#0F8354] px-10 text-xl font-normal text-white 
  transition-all duration-300 ease-out
  hover:bg-[#0a633e] hover:shadow-lg hover:shadow-[#0F8354]/20 hover:-translate-y-0.5
  active:scale-95 w-full sm:w-auto overflow-hidden"
>
  <a href="#productos">
    <span className="relative z-10 flex items-center gap-2">
      Explorar Catálogo
      <ArrowRight className="h-6 w-6 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
    </span>
  </a>
</Button>

<Button
  size="lg"
  variant="outline"
  asChild
  className="h-16 border-2 border-[#0F8354] bg-white px-10 text-xl font-normal text-[#1A1A1B] 
  transition-all duration-300 ease-out
  hover:bg-[#0F8354]/10 hover:text-[#0F8354] hover:border-[#0a633e] hover:-translate-y-0.5
  active:scale-95 w-full sm:w-auto"
>
  <a href="#impacto">Ver Impacto Real</a>
</Button>

        </div>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes waveColor {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(0.85); 
          }
          50% { 
            opacity: 1.0; 
            transform: scale(1.05); 
          }
        }
      `}</style>
    </section>
  )
}