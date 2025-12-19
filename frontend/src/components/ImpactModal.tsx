'use client'

import { useEffect } from 'react'
import { X, Leaf, Droplets, ShoppingBag, Trophy } from 'lucide-react'
import { useUI } from '@/contexts/UIContext'
import { useUserData } from '@/contexts/UserContext'
import { Button } from './ui/button'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { Inter, Righteous } from 'next/font/google'

// --- FUENTES ---
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const righteous = Righteous({ subsets: ['latin'], weight: '400', variable: '--font-righteous' })
// --- VARIANTES  ---
const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { opacity: 1, backdropFilter: "blur(12px)", transition: { duration: 0.5 } },
  exit: { opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.3 } }
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring" as const, damping: 25, stiffness: 300, mass: 0.8 } 
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } }
}

// --- NÚMERO ANIMADO ---
function AnimatedNumber({ value, decimals = 0 }: { value: number, decimals?: number }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => current.toFixed(decimals));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

// --- COMPONENTE PRINCIPAL ---
export function ImpactModal() {
  const { isImpactOpen, closeImpact } = useUI()
  const { userData } = useUserData()
  // Evitamos renderizar si no está abierto, pero dejamos el animatePresence envolviendo
  // el contenido dentro del return principal para manejar la salida.
  const co2 = userData?.metricas?.co2Ahorrado ?? 0
  const agua = userData?.metricas?.aguaAhorrada ?? 0
  const compras = userData?.metricas?.comprasSostenibles ?? 0
  const puntos = userData?.ecoPuntos ?? 0
  const metaCO2 = 50
  const metaPuntos = 500
  // Porcentajes para las barras 
  const pctCO2 = Math.min((co2 / metaCO2) * 100, 100)
  const pctPuntos = Math.min((puntos / metaPuntos) * 100, 100)

  return (
    <AnimatePresence>
      {isImpactOpen && (
        <motion.div 
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 font-sans ${inter.variable} ${righteous.variable}`}
          onClick={(e) => e.target === e.currentTarget && closeImpact()}
        >
          <motion.div 
            variants={modalVariants}
            className="relative w-full max-w-[850px] bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            
            {/* Header */}
            <div className="px-8 pt-8 pb-4 flex justify-between items-start border-b border-gray-50 bg-white z-10">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.1 }}
                  className="font-righteous text-3xl text-[#1A1A1B] leading-none mb-2"
                >
                  Mi Impacto
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.2 }}
                  className="font-sans text-gray-500 text-sm font-medium"
                >
                  Tu huella positiva en el planeta.
                </motion.p>
              </div>
              <motion.button 
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeImpact} 
                className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-black rounded-full transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Contenido Scrollable */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              data-lenis-prevent
              className="p-8 overflow-y-auto space-y-8 custom-scrollbar"
            >
              
              {/* 1. GRID DE MÉTRICAS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Card CO2 */}
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#E8F5E9] border border-[#0F8354]/20 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                     <span className="text-[#0F8354] font-bold text-[10px] uppercase tracking-wide">CO₂ Ahorrado</span>
                     <Leaf className="text-[#0F8354]" size={18} />
                  </div>
                  <div>
                    <span className="text-[#0F8354] font-righteous text-3xl flex items-baseline gap-1">
                      <AnimatedNumber value={co2} decimals={1} />
                      <span className="text-sm font-sans font-medium opacity-80">kg</span>
                    </span>
                    <p className="text-[#0F8354]/70 text-[10px] mt-1 font-medium">≈ {Math.ceil(co2 / 5)} árboles</p>
                  </div>
                </motion.div>

                {/* Card Agua */}
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#E3F2FD] border border-[#006CFF]/20 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                     <span className="text-[#006CFF] font-bold text-[10px] uppercase tracking-wide">Agua</span>
                     <Droplets className="text-[#006CFF]" size={18} />
                  </div>
                  <div>
                    <span className="text-[#006CFF] font-righteous text-3xl flex items-baseline gap-1">
                      <AnimatedNumber value={agua} decimals={0} />
                      <span className="text-sm font-sans font-medium opacity-80">L</span>
                    </span>
                    <p className="text-[#006CFF]/70 text-[10px] mt-1 font-medium">≈ {Math.ceil(agua / 150)} duchas</p>
                  </div>
                </motion.div>

                {/* Card Compras */}
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#F3E5F5] border border-[#AF01FF]/20 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                     <span className="text-[#AF01FF] font-bold text-[10px] uppercase tracking-wide">Compras</span>
                     <ShoppingBag className="text-[#AF01FF]" size={18} />
                  </div>
                  <div>
                    <span className="text-[#AF01FF] font-righteous text-3xl">
                      <AnimatedNumber value={compras} />
                    </span>
                    <p className="text-[#AF01FF]/70 text-[10px] mt-1 font-medium">Sostenibles</p>
                  </div>
                </motion.div>

                {/* Card Puntos */}
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#FFF3E0] border border-[#ED6E12]/20 rounded-2xl p-5 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                     <span className="text-[#ED6E12] font-bold text-[10px] uppercase tracking-wide">Puntos</span>
                     <Trophy className="text-[#ED6E12]" size={18} />
                  </div>
                  <div>
                    <span className="text-[#ED6E12] font-righteous text-3xl">
                      <AnimatedNumber value={puntos} />
                    </span>
                    <p className="text-[#ED6E12]/70 text-[10px] mt-1 font-medium">{puntos > 500 ? 'Nivel Platino' : 'Nivel Oro'}</p>
                  </div>
                </motion.div>
              </div>

              {/* 2. OBJETIVOS */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                <h3 className="font-righteous text-lg text-[#1A1A1B]">Tus Metas</h3>
                
                <div className="space-y-5">
                  {/* Meta CO2 */}
                  <div>
                    <div className="flex justify-between mb-2 text-xs">
                      <span className="text-gray-500 font-bold uppercase tracking-wider">Meta CO₂</span>
                      <span className="text-[#1A1A1B] font-bold">{co2.toFixed(1)} / {metaCO2} kg</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pctCO2}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        className="h-full bg-[#0F8354] rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 text-right">Faltan {(metaCO2 - co2).toFixed(1)} kg para el siguiente nivel</p>
                  </div>

                  {/* Meta Puntos */}
                  <div>
                    <div className="flex justify-between mb-2 text-xs">
                      <span className="text-gray-500 font-bold uppercase tracking-wider">Meta Puntos</span>
                      <span className="text-[#1A1A1B] font-bold">{puntos.toFixed(0)} / {metaPuntos}</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pctPuntos}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        className="h-full bg-[#ED6E12] rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 text-right">Faltan {(metaPuntos - puntos).toFixed(0)} puntos para canjear</p>
                  </div>
                </div>
              </motion.div>

              {/* 3. BANNER TOTAL */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-r from-[#0F8354] to-[#085e3c] rounded-2xl p-6 text-white shadow-xl shadow-green-900/10 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <h3 className="font-righteous text-xl mb-2 flex items-center gap-2">
                    <Leaf className="text-[#8dfac6]" size={20} />
                    ¡Gracias por tu impacto!
                  </h3>
                  <p className="font-sans text-sm font-light opacity-90 leading-relaxed text-balance">
                    Con tus acciones has evitado <strong className="text-[#8dfac6] font-bold text-base"><AnimatedNumber value={co2} decimals={1}/> kg de CO₂</strong> y ahorrado <strong className="text-[#8dfac6] font-bold text-base"><AnimatedNumber value={agua} decimals={0}/> L de agua</strong>.
                  </p>
                </div>
                <Button 
                  onClick={closeImpact} 
                  className="bg-white text-[#0F8354] hover:bg-gray-100 px-8 h-12 text-sm font-bold rounded-xl shadow-sm transition-transform active:scale-95 font-righteous tracking-wide whitespace-nowrap"
                >
                  Seguir Ayudando
                </Button>
              </motion.div>

            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}