'use client'

import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, useInView } from 'framer-motion'
import { Righteous } from 'next/font/google'

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
})

const StatItem = ({ 
  targetValue, 
  suffix, 
  description, 
  subtext,
  decimals = 0 
}: { 
  targetValue: number, 
  suffix: string, 
  description: string, 
  subtext: string,
  decimals?: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const spring = useSpring(0, { bounce: 0, duration: 2500 })
  const display = useTransform(spring, (current) => current.toFixed(decimals))

  useEffect(() => {
    if (isInView) spring.set(targetValue)
  }, [isInView, targetValue, spring])

  return (
    <div ref={ref} className="flex justify-center w-full">
      {/* Contenedor ajustado: Menos altura mínima para que sea más sutil */}
      <div className="flex gap-5 md:gap-6 items-stretch w-full max-w-[320px] lg:max-w-[400px]">
        
        {/* LÍNEA VERDE: Más fina (3px) y sutil */}
        <div className="w-[3px] lg:w-[4px] bg-[#0F8354] rounded-full shrink-0 self-stretch opacity-90" />

        <div className="flex flex-col justify-center py-1">
          
          {/* NÚMERO + SUFIJO */}
          {/* Tamaños reducidos para que no se vea "tosco" en 900px */}
          <div className={`${righteous.className} flex items-baseline text-[#0F8354] leading-none mb-3`}>
            
            {/* Número: text-5xl en móvil/tablet (48px) -> text-7xl en monitores (72px) */}
            <motion.span className="text-5xl md:text-6xl lg:text-7xl tracking-tight">
              {display}
            </motion.span>
            
            {/* Sufijo: Acompaña el tamaño sutilmente */}
            <span className="text-5xl md:text-6xl lg:text-7xl ml-1">
              {suffix}
            </span>
          </div>

          {/* DESCRIPCIÓN */}
          {/* Texto más contenido y balanceado */}
          <h3 className={`${righteous.className} text-lg md:text-xl text-[#1A1A1B] leading-tight mb-2 text-balance`}>
            {description}
          </h3>

          {/* SUBTEXTO */}
          <p className="text-xs md:text-sm text-gray-500 font-sans font-medium">
            {subtext}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ImpactStatistics() {
  return (
    // Padding vertical reducido para que no ocupe toda la pantalla en laptops chicas
    <section className="bg-white w-full py-16 lg:py-24">
      <div className="container mx-auto px-6">
        
        {/* GRILLA: */}
        {/* En 900px (md), usaremos grid-cols-3 pero con gap moderado */}
        {/* Si se ve muy apretado, el grid baja el tamaño del contenido gracias al max-w del item */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 lg:gap-12 items-start justify-items-center">
          
          <StatItem 
            targetValue={3.7} 
            decimals={1}
            suffix="m" 
            description="kg de CO₂ reducido por nuestra comunidad"
            subtext="Certificado por Climate Partners"
          />

          <StatItem 
            targetValue={85} 
            suffix="%" 
            description="de productos con huella verificada"
            subtext="Verificación independiente"
          />

          <StatItem 
            targetValue={12} 
            suffix="k+" 
            description="compras sostenibles este mes"
            subtext="Carbon offsetting activo"
          />

        </div>
      </div>
    </section>
  )
}