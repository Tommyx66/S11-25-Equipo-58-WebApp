'use client'

//import Righteous font

import { Righteous } from 'next/font/google'

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
})


import { Button } from '@/components/ui/button'
import ArrowRight from './icons/ArrowRight'

export default function HeroLanding() {
  return (
    <section className="relative h-[650px] max-h-[650px] overflow-hidden bg-white flex items-center justify-center">
      <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(7,1fr)] gap-3 px-2">
        {Array.from({ length: 20 * 7 }).map((_, i) => {
          const col = i % 20
          return (
            <div
              key={i}
              className="flex items-center justify-center"
            >
              <div
                className="rounded-full aspect-square"
                style={{
                  backgroundColor: `#d2e3dc`,
                  animation: `waveColor 8s linear infinite`,
                  animationDelay: `${-col * 0.15}s`,
                  height: 'calc((650px - (6 * 12px)) / 7)',
                  width: 'calc((650px - (6 * 12px)) / 7)',
                  maxHeight: 'calc((650px - (6 * 12px)) / 7)',
                  maxWidth: 'calc((650px - (6 * 12px)) / 7)',
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="relative z-10  mx-auto px-4 py-20 text-center">
        <h1
          className={`${righteous.className} font-normal mb-6 text-balance`}
          style={{
            fontSize: '70px',
            color: '#1A1A1B',
            letterSpacing: '0',
            lineHeight: '1.2',
          }}
        >
          Compra Consciente, Impacto Medible
        </h1>
        <p
          className="mb-10 max-w-7xl mx-auto text-[#1A1A1B] font-sans font-normal text-2xl leading-[1.5] tracking-normal"
        >
          Cada producto viene con su huella de carbono verificada. Visualiza tu impacto ambiental en tiempo
          real y acumula puntos verdes por cada compra sostenible.
        </p>
        <div className={`${righteous.className} flex flex-col sm:flex-row gap-4 items-center justify-center`}>
          <Button size="lg" className="bg-[#0F8354] hover:bg-[#0F8354] text-lg font-normal  cursor-pointer text-white rounded-sm py-6">
            Explorar Catálogo
           <ArrowRight/>
          </Button>
          <Button size="lg" className="bg-white hover:bg-white text-lg font-normal  cursor-pointer text-black border border-black rounded-sm py-6">
            Ver Impacto Real
          </Button>
        </div>
      </div>

     
      <style jsx>{`
        @keyframes waveColor {
          0% {
            opacity: 0.25;
          }
          5% {
            opacity: 0.30;
          }
          10% {
            opacity: 0.35;
          }
          15% {
            opacity: 0.48;
          }
          20% {
            opacity: 0.58;
          }
          25% {
            opacity: 0.68;
          }
          30% {
            opacity: 0.78;
          }
          35% {
            opacity: 0.8;
          }
          40% {
            opacity: 0.85;
          }
          45% {
            opacity: 0.9;
          }
          50% {
            opacity: 0.95;
          }
          55% {
            opacity: 1.0;
          }
          60% {
            opacity: 0.95;
          }
          65% {
            opacity: 0.9;
          }
          70% {
            opacity: 0.85;
          }
          75% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.5;
          }
          95% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  )
}
