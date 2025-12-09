'use client'

import { Righteous } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

// Configuración de la fuente
const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
})

export function HeroLanding() {
  // Estado para columnas: 10 en móvil, 20 en desktop
  const [gridCols, setGridCols] = useState(10)

  useEffect(() => {
    const handleResize = () => {
      setGridCols(window.innerWidth < 768 ? 10 : 20)
    }
    // Detectar tamaño inicial
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const GRID_ROWS = 8
  const TOTAL_DOTS = gridCols * GRID_ROWS

  return (
    <section className="relative flex min-h-[600px] lg:min-h-[750px] w-full items-center justify-center overflow-hidden bg-white">
      
      {/* === FONDO ANIMADO DE PUNTOS === */}
      <div 
        className="absolute inset-0 grid gap-3 md:gap-4 px-4 pointer-events-none"
        style={{
          // Usamos la variable de estado gridCols
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: TOTAL_DOTS }).map((_, i) => {
          const col = i % gridCols
          
          // Cálculo del delay para la ola
          const delay = -(gridCols - col) * 0.2
          
          return (
            <div key={i} className="flex items-center justify-center">
              <div
                // Ajuste de tamaño responsive: max-w-[40px] en movil, 60px en desktop
                className="rounded-full bg-[#E0F2EB] aspect-square w-full max-w-[40px] md:max-w-[60px] will-change-[opacity,transform]"
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
      <div className="relative z-10 container mx-auto px-6 py-12 md:py-24 text-center">
        
        <h1
          className={`${righteous.className} mb-6 md:mb-8 text-balance font-normal text-[#1A1A1B] leading-[1.15] tracking-tight
          text-4xl sm:text-5xl md:text-[70px] lg:text-[80px]`}
        >
          <span className="text-[#0F8354]">Compra</span> Consciente, <br className="hidden md:block" />
          <span className="text-[#0F8354]">Impacto</span> Medible
        </h1>

        <p className="mx-auto mb-10 md:mb-12 max-w-3xl font-sans text-base sm:text-lg leading-relaxed text-gray-700 md:text-2xl">
          Cada producto viene con su huella de carbono verificada. Visualiza tu impacto ambiental en tiempo
          real y acumula puntos verdes por cada compra sostenible.
        </p>

        <div className={`${righteous.className} flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6`}>
          {/* Botón Principal */}
          <Button 
            size="lg" 
            asChild
            className="group relative h-14 md:h-16 bg-[#0F8354] px-8 md:px-10 text-lg md:text-xl font-normal text-white 
            transition-all duration-300 ease-out
            hover:bg-[#0a633e] hover:shadow-lg hover:shadow-[#0F8354]/20 hover:-translate-y-0.5
            active:scale-95 w-full sm:w-auto overflow-hidden"
          >
            <a href="#productos">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explorar Catálogo
                <ArrowRight className="h-5 w-5 md:h-6 md:w-6 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
              </span>
            </a>
          </Button>

          {/* Botón Secundario */}
          <Button 
            size="lg" 
            variant="outline" 
            asChild
            className="h-14 md:h-16 border-2 border-[#0F8354] bg-white px-8 md:px-10 text-lg md:text-xl font-normal text-[#1A1A1B] 
            transition-all duration-300 ease-out
            hover:bg-[#0F8354]/10 hover:text-[#0F8354] hover:border-[#0a633e] hover:-translate-y-0.5
            active:scale-95 w-full sm:w-auto"
          >
            <a href="#impacto">Ver Impacto Real</a>
          </Button>
        </div>
      </div>

      {/* Estilos de animación (Intactos como pediste) */}
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