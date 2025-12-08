'use client'

import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, useInView } from 'framer-motion'
import { Righteous, Inter } from 'next/font/google'

// Fuente para títulos y números
const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
})

// Fuente para el subtexto (más limpia)
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const StatItem = ({ 
  targetValue, 
  suffix,
  postSuffix, 
  description, 
  subtext,
  decimals = 0 
}: { 
  targetValue: number, 
  suffix: string, 
  postSuffix?: string, // Hacemos esto opcional
  description: string, 
  subtext: string,
  decimals?: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  // Duración un poco más larga para efecto premium
  const spring = useSpring(0, { bounce: 0, duration: 2500 })
  const display = useTransform(spring, (current) => current.toFixed(decimals))

  useEffect(() => {
    if (isInView) spring.set(targetValue)
  }, [isInView, targetValue, spring])

  return (
    <div ref={ref} className="flex justify-center md:justify-start w-full">
      <div className="flex gap-4 md:gap-6 items-stretch w-full max-w-[350px]">
        
        {/* LÍNEA VERDE LATERAL */}
        {/* self-stretch asegura que la línea cubra toda la altura del contenido */}
        <div className="w-[3px] bg-[#0F8354] shrink-0 self-stretch opacity-90" />

        <div className="flex flex-col py-1">
          
          {/* NÚMERO + SUFIJOS */}
          <div className={`${righteous.className} flex items-baseline text-[#0F8354] leading-none mb-4`}>
            
            {/* Número Animado */}
            <motion.span className="text-6xl md:text-7xl tracking-tighter">
              {display}
            </motion.span>
            
            {/* Sufijo Principal (m, %, k+) - Mismo tamaño que el número */}
            <span className="text-6xl md:text-7xl tracking-tighter ml-1">
              {suffix}
            </span>

            {/* Post Sufijo (kg) - Tamaño más pequeño como en el diseño */}
            {postSuffix && (
              <span className="text-3xl md:text-4xl ml-2 opacity-90 transform -translate-y-1">
                {postSuffix}
              </span>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          {/* text-balance ayuda a que el texto se acomode mejor en líneas */}
          <h3 className={`${righteous.className} text-xl md:text-2xl text-[#1A1A1B] leading-tight mb-2 max-w-[280px]`}>
            {description}
          </h3>

          {/* SUBTEXTO */}
          <p className={`${inter.className} text-sm text-gray-500 font-medium leading-relaxed`}>
            {subtext}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ImpactStatistics() {
  return (
    <section className="bg-white w-full py-16 lg:py-24">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 items-start justify-items-center md:justify-items-start">
          
          <StatItem 
            targetValue={3.7} 
            decimals={1}
            suffix="m" 
            postSuffix="kg"
            description="de CO₂ reducido por nuestra comunidad"
            subtext="Certificado por Climate Partners"
          />

          <StatItem 
            targetValue={85} 
            suffix="%" 
            description="de productos con huella de carbono verificada"
            subtext="Verificación independiente"
          />

          <StatItem 
            targetValue={12} 
            suffix="k+"
            description="compras sostenibles realizadas este mes"
            subtext="Carbon offsetting activo"
          />

        </div>
      </div>
    </section>
  )
}