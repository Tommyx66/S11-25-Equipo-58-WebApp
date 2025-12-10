'use client'

import { useState } from 'react'
import { X, ShoppingCart, CreditCard, Leaf, Package, Truck, MapPin, Globe, Info, Droplets, Recycle } from 'lucide-react'
import { useUI } from '@/contexts/UIContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import clsx from 'clsx'

// --- UI HELPERS ---

const TabButton = ({ active, label, onClick }: any) => (
  <button onClick={onClick} className={clsx("flex-1 py-3 text-base font-sans relative transition-colors", active ? "text-[#1A1A1B] font-bold bg-white rounded-[14px] shadow-sm" : "text-[#707070]")}>
    {label}
  </button>
)

const Badge = ({ text }: { text: string }) => (
  <span className="bg-[#EAEAEA] text-[#707070] px-3 py-1.5 rounded-[8px] text-[10px] font-medium uppercase tracking-wide">
    {text}
  </span>
)

// Card de Métrica (Estilo Figma: Texto grande, subtítulo pequeño)
const MetricItem = ({ label, value, sub }: any) => (
  <div className="bg-[#F9F9F9]/50 p-3 rounded-xl border border-gray-100 flex flex-col justify-between h-[90px]">
     <span className="text-[#0F8354] font-bold text-[10px] uppercase tracking-wider">{label}</span>
     <div>
       <span className="text-[#1A1A1B] font-righteous text-2xl leading-none block">{value}</span>
       <span className="text-gray-400 text-[10px] font-sans">{sub}</span>
     </div>
  </div>
)

const TimelineItem = ({ title, subtitle, metric, isLast }: any) => (
  <div className="relative pl-10 pb-8 last:pb-0">
     {!isLast && <div className="absolute left-[15px] top-[30px] bottom-0 w-[2px] bg-[#0F8354]/20" />}
     <div className="absolute left-0 top-0 w-[32px] h-[32px] rounded-full bg-[#EAF3EE] flex items-center justify-center border-2 border-[#0F8354] z-10">
        <div className="w-2 h-2 bg-[#0F8354] rounded-full" />
     </div>
     <div className="bg-[#F5F5F5] rounded-[12px] p-4 flex justify-between items-center">
        <div>
           <h4 className="text-base font-bold text-[#1A1A1B]">{title}</h4>
           <p className="text-[#707070] text-xs font-normal">{subtitle}</p>
        </div>
        <span className="text-xs font-bold text-[#1A1A1B] bg-white px-2 py-1 rounded border border-gray-200">{metric}</span>
     </div>
  </div>
)

export function ProductDetailModal() {
  const { isProductModalOpen, closeProductModal, selectedProduct, openCheckout } = useUI()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState<'impacto' | 'trazabilidad'>('impacto')

  if (!isProductModalOpen || !selectedProduct) return null

  // Datos Mock simulados
  const traceability = [
    { title: "Origen", subtitle: "Australia", metric: "0.5 kg CO₂" },
    { title: "Empaque", subtitle: "Centro dist.", metric: "0.2 kg CO₂" },
    { title: "Transporte", subtitle: "15000 km", metric: "0.4 kg CO₂" },
    { title: "Entrega", subtitle: "Tu hogar", metric: "0.1 kg CO₂" },
  ]

  const handleAddToCart = () => { addToCart(selectedProduct); closeProductModal(); }
  const handleBuyNow = () => { addToCart(selectedProduct); closeProductModal(); setTimeout(()=>openCheckout(), 300); }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-[900px] bg-white rounded-[25px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* COLUMNA IZQ: IMAGEN */}
        <div className="w-full md:w-[45%] bg-[#F9F9F9] p-6 flex flex-col justify-center relative">
           <button onClick={closeProductModal} className="absolute left-5 top-5 md:hidden p-2 bg-white rounded-full shadow-sm z-20"><X size={20}/></button>
           <div className="relative aspect-[4/5] w-full rounded-[20px] overflow-hidden shadow-sm border border-white bg-white mb-4">
             <Image src={selectedProduct.imagen} alt={selectedProduct.nombre} fill className="object-cover" />
           </div>
           <div className="flex flex-wrap gap-2 justify-center">
              <Badge text="Carbon Neutral" />
              <Badge text="B-Corp" />
              <Badge text="Plastic Free" />
           </div>
        </div>

        {/* COLUMNA DER: INFO */}
        <div className="w-full md:w-[55%] flex flex-col bg-white h-full max-h-[90vh]">
           <div className="pt-8 px-8 pb-2 relative">
              <button onClick={closeProductModal} className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition hidden md:block"><X size={24} color="#707070"/></button>
              <span className="text-[#707070] text-xs font-bold tracking-[0.15em] uppercase mb-1 block opacity-70">{selectedProduct.marca}</span>
              <h1 className="text-3xl font-sans font-medium text-[#1A1A1B] leading-tight mb-2">{selectedProduct.nombre}</h1>
              <p className="text-[#0F8354] text-3xl font-sans font-medium tracking-tight">${selectedProduct.precio.toLocaleString()}</p>
           </div>

           <div className="px-8 mt-2">
              <div className="bg-[#EAEAEA] p-1 rounded-[16px] flex gap-1 mb-6">
                 <TabButton active={activeTab === 'impacto'} label="Impacto" onClick={() => setActiveTab('impacto')} />
                 <TabButton active={activeTab === 'trazabilidad'} label="Trazabilidad" onClick={() => setActiveTab('trazabilidad')} />
              </div>

              <div className="h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                 <AnimatePresence mode="wait">
                    {activeTab === 'impacto' && (
                      <motion.div key="impacto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                         <h3 className="font-righteous text-lg text-[#1A1A1B] mb-4">Métricas ambientales</h3>
                         <div className="grid grid-cols-2 gap-3 mb-4">
                            <MetricItem label="Huella Carbono" value={selectedProduct.impactoAmbiental.huellaCarbono} sub="Baja emisión" />
                            <MetricItem label="Consumo Agua" value="60 L" sub="Ahorro estimado" />
                            <MetricItem label="Reciclable" value={selectedProduct.impactoAmbiental.materialesReciclables ? "100%" : "80%"} sub="Materiales" />
                            <MetricItem label="Transporte" value="15k km" sub="Distancia" />
                         </div>
                         <div className="bg-[#006CFF]/10 border border-[#006CFF]/30 rounded-[12px] p-4 flex gap-3 items-start">
                            <Info className="text-[#006CFF] shrink-0 mt-0.5" size={20} />
                            <p className="text-[#006CFF] text-sm leading-snug">Este producto ahorra <strong>0.5 kg CO₂</strong> comparado con alternativas estándar.</p>
                         </div>
                      </motion.div>
                    )}

                    {activeTab === 'trazabilidad' && (
                      <motion.div key="trazabilidad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                         <h3 className="font-righteous text-lg text-[#1A1A1B] mb-4">Viaje del producto</h3>
                         <div className="pl-2">
                            {traceability.map((t, i) => <TimelineItem key={i} {...t} isLast={i === traceability.length - 1} />)}
                         </div>
                         <div className="mt-4 bg-[#E8F5E9] border border-[#0F8354] rounded-[12px] p-3 text-center">
                            <p className="text-[#0F8354] text-sm font-bold">Huella Total: 1.2 kg CO₂</p>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           <div className="p-6 border-t border-gray-100 flex gap-3 bg-white mt-auto z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
              <Button onClick={handleAddToCart} className="flex-1 h-[55px] bg-[#0F8354] hover:bg-[#0a633e] text-white text-lg font-righteous rounded-lg shadow-md active:scale-95 transition-transform">
                Añadir al carrito
              </Button>
              <Button onClick={handleBuyNow} className="flex-1 h-[55px] bg-[#1A1A1B] hover:bg-black text-white text-lg font-righteous rounded-lg shadow-md active:scale-95 transition-transform">
                Proceder al pago
              </Button>
           </div>
        </div>
      </motion.div>
    </div>
  )
}