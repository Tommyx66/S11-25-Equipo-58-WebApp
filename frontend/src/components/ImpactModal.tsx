'use client'

import { X, Leaf, Droplets, ShoppingBag, Trophy } from 'lucide-react'
import { useUI } from '@/contexts/UIContext'
import { useUserData } from '@/contexts/UserContext'
import { Button } from './ui/button'
import { motion } from 'framer-motion'

export function ImpactModal() {
  const { isImpactOpen, closeImpact } = useUI()
  const { userData } = useUserData()

  if (!isImpactOpen) return null

  // 🛠️ CORRECCIÓN: Leemos solo de 'metricas' porque UserContext ya normaliza los datos ahí.
  // Eliminamos el '?? userData?.co2Ahorrado' porque TypeScript sabe que eso no existe en la interfaz.
  const co2 = userData?.metricas?.co2Ahorrado ?? 0
  const agua = userData?.metricas?.aguaAhorrada ?? 0
  const compras = userData?.metricas?.comprasSostenibles ?? 0
  const puntos = userData?.ecoPuntos ?? 0

  // Metas visuales
  const metaCO2 = 50
  const metaPuntos = 500

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="relative w-full max-w-[850px] bg-white rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        
        {/* Header Compacto */}
        <div className="px-8 pt-6 pb-2 flex justify-between items-start border-b border-gray-50">
          <div>
            <h2 className="font-righteous text-2xl text-[#1A1A1B] leading-none mb-1">Mi Impacto</h2>
            <p className="font-sans text-gray-500 text-sm">Tu huella positiva en el planeta.</p>
          </div>
          <button onClick={closeImpact} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          
          {/* 1. GRID COMPACTO DE MÉTRICAS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* CO2 */}
            <div className="bg-[#E8F5E9] border border-[#0F8354]/20 rounded-2xl p-4 flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                 <span className="text-[#0F8354] font-bold text-[10px] uppercase tracking-wide">CO₂ Ahorrado</span>
                 <Leaf className="text-[#0F8354]" size={16} />
              </div>
              <div>
                <span className="text-[#0F8354] font-righteous text-2xl">{co2.toFixed(1)} <span className="text-sm font-sans">kg</span></span>
                <p className="text-[#0F8354]/70 text-[10px] mt-0.5">≈ {Math.ceil(co2 / 5)} árboles</p>
              </div>
            </div>

            {/* Agua */}
            <div className="bg-[#E3F2FD] border border-[#006CFF]/20 rounded-2xl p-4 flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                 <span className="text-[#006CFF] font-bold text-[10px] uppercase tracking-wide">Agua</span>
                 <Droplets className="text-[#006CFF]" size={16} />
              </div>
              <div>
                <span className="text-[#006CFF] font-righteous text-2xl">{agua.toFixed(0)} <span className="text-sm font-sans">L</span></span>
                <p className="text-[#006CFF]/70 text-[10px] mt-0.5">≈ {Math.ceil(agua / 150)} duchas</p>
              </div>
            </div>

            {/* Compras */}
            <div className="bg-[#F3E5F5] border border-[#AF01FF]/20 rounded-2xl p-4 flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                 <span className="text-[#AF01FF] font-bold text-[10px] uppercase tracking-wide">Compras</span>
                 <ShoppingBag className="text-[#AF01FF]" size={16} />
              </div>
              <div>
                <span className="text-[#AF01FF] font-righteous text-2xl">{compras}</span>
                <p className="text-[#AF01FF]/70 text-[10px] mt-0.5">Verificadas</p>
              </div>
            </div>

            {/* Puntos */}
            <div className="bg-[#FFF3E0] border border-[#ED6E12]/20 rounded-2xl p-4 flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                 <span className="text-[#ED6E12] font-bold text-[10px] uppercase tracking-wide">Puntos</span>
                 <Trophy className="text-[#ED6E12]" size={16} />
              </div>
              <div>
                <span className="text-[#ED6E12] font-righteous text-2xl">{puntos.toFixed(0)}</span>
                <p className="text-[#ED6E12]/70 text-[10px] mt-0.5">{puntos > 500 ? 'Platino' : 'Oro'}</p>
              </div>
            </div>
          </div>

          {/* 2. OBJETIVOS (Barras finas) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h3 className="font-righteous text-base text-[#1A1A1B]">Tus Metas</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-gray-500 font-medium">Meta CO₂</span>
                  <span className="text-[#1A1A1B] font-bold">{co2.toFixed(1)} / {metaCO2} kg</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F8354] rounded-full transition-all duration-1000" style={{ width: `${Math.min((co2/metaCO2)*100, 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-gray-500 font-medium">Meta Puntos</span>
                  <span className="text-[#1A1A1B] font-bold">{puntos.toFixed(0)} / {metaPuntos}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ED6E12] rounded-full transition-all duration-1000" style={{ width: `${Math.min((puntos/metaPuntos)*100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* 3. BANNER TOTAL */}
          <div className="bg-gradient-to-r from-[#0F8354] to-[#085e3c] rounded-2xl p-5 text-white shadow-lg flex items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="font-righteous text-lg mb-1">¡Gracias por tu impacto!</h3>
              <p className="font-sans text-xs font-light opacity-90 leading-relaxed">
                Has evitado <strong className="text-[#8dfac6]">{co2.toFixed(1)} kg de CO₂</strong> y ahorrado <strong className="text-[#8dfac6]">{agua.toFixed(0)} L de agua</strong>.
              </p>
            </div>
            <Button onClick={closeImpact} className="bg-white text-[#0F8354] hover:bg-gray-100 px-5 h-9 text-xs font-bold rounded-xl shadow-sm transition-transform active:scale-95">
              Cerrar
            </Button>
          </div>

        </div>
      </motion.div>
    </div>
  )
}