'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function LuxuryEffects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-white">
      
      <div 
        className="absolute inset-0 z-[20] opacity-[0.04] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div 
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#0F8354] rounded-full blur-[100px] opacity-[0.06]"
        style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
        }}
      />

      <motion.div 
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 40, -40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#86efac] rounded-full blur-[120px] opacity-[0.08]"
        style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
        }}
      />

      <div 
        className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] bg-white rounded-full blur-[80px] opacity-[0.6] mix-blend-soft-light"
      />
    </div>
  )
}