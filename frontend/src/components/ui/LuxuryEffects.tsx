'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function LuxuryEffects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    window.addEventListener('resize', checkMobile)
    if (!isMobile) window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMobile])

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-white">
      
      {/* TEXTURA DE RUIDO  */}
      {!isMobile && (
        <div 
          className="absolute inset-0 z-[20] opacity-[0.03] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* LUZ SUPERIOR */}
      <motion.div 
        animate={isMobile ? {} : {
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-15%] left-[-15%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-[#0F8354] rounded-full blur-[80px] md:blur-[120px] opacity-[0.07] will-change-transform"
        style={!isMobile ? {
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
        } : {}}
      />

      {/* LUZ INFERIOR */}
      <motion.div 
        animate={isMobile ? {} : {
          x: [0, -40, 40, 0],
          y: [0, 40, -40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[#86efac] rounded-full blur-[80px] md:blur-[150px] opacity-[0.06] will-change-transform"
        style={!isMobile ? {
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
        } : {}}
      />
    </div>
  )
}