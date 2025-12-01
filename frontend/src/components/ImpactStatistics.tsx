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
  postSuffix, 
  description, 
  subtext,
  decimals = 0 
}: { 
  targetValue: number, 
  suffix: string, 
  postSuffix: string,
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
      <div className="flex gap-5 md:gap-6 items-stretch w-full max-w-[320px] lg:max-w-[400px]">
        
        {/* LÍNEA VERDE */}
        <div className="w-[3px] lg:w-[4px] bg-[#0F8354] rounded-full shrink-0 self-stretch opacity-90" />

        <div className="flex flex-col justify-center py-1">
          
          {/* NÚMERO + SUFIJO */}
          <div className={`${righteous.className} flex items-baseline text-[#0F8354] leading-none mb-3`}>
            
            <motion.span className="text-5xl md:text-6xl lg:text-7xl tracking-tight">
              {display}
            </motion.span>
            
            <span className="text-5xl md:text-6xl lg:text-8xl ml-1 text">
              {suffix}
            </span>
            <span className="text-3xl md:text-4xl lg:text-5xl ml-3 ">
              {postSuffix}
            </span>
          </div>

          {/* DESCRIPCIÓN */}
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
    <section className="bg-white w-full py-16 lg:py-24">
      <div className=" mx-auto px-0">
        
   
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 lg:gap-12 items-start justify-items-center">
          
          <StatItem 
            targetValue={3.7} 
            decimals={1}
            suffix="m" 
            postSuffix="kg"
            description="kg de CO₂ reducido por nuestra comunidad"
            subtext="Certificado por Climate Partners"
          />

          <StatItem 
            targetValue={85} 
            suffix="%" 
            postSuffix=""
            description="de productos con huella verificada"
            subtext="Verificación independiente"
          />

          <StatItem 
            targetValue={12} 
            suffix="k+"
            postSuffix="" 
            description="compras sostenibles este mes"
            subtext="Carbon offsetting activo"
          />

        </div>
      </div>
    </section>
  )
}