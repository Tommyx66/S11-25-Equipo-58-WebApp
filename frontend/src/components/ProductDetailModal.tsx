'use client'

import { useState } from 'react'
import { X, ShoppingCart, CreditCard, Info } from 'lucide-react'
import { useUI } from '@/contexts/UIContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import clsx from 'clsx'
import { useUser } from '@clerk/nextjs'

// --- HELPER COMPONENTS ---

const TabButton = ({ active, label, onClick }: any) => (
  <button onClick={onClick} className={clsx("flex-1 py-2 text-sm font-sans relative transition-all duration-200", active ? "text-[#1A1A1B] font-bold bg-white rounded-[10px] shadow-sm" : "text-[#707070] hover:text-[#1A1A1B]")}>
    {label}
  </button>
)

const Badge = ({ text }: { text: string }) => (
  <span className="bg-white/90 md:bg-[#EAEAEA] backdrop-blur-sm text-[#707070] px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wide border border-gray-100 shadow-sm md:shadow-none">
    {text}
  </span>
)

const MetricItem = ({ label, value, sub }: any) => (
  <div className="bg-[#F9F9F9] p-3 rounded-xl border border-gray-100 flex flex-col justify-between min-h-[80px]">
     <span className="text-[#0F8354] font-bold text-[9px] uppercase tracking-wider">{label}</span>
     <div>
       <span className="text-[#1A1A1B] font-righteous text-xl leading-none block">{value}</span>
       <span className="text-gray-400 text-[10px] font-sans">{sub}</span>
     </div>
  </div>
)

const TimelineItem = ({ title, subtitle, metric, isLast }: any) => (
  <div className="relative pl-10 pb-6 last:pb-0">
     {!isLast && <div className="absolute left-[15px] top-[25px] bottom-0 w-[2px] bg-[#0F8354]/20" />}
     <div className="absolute left-0 top-0 w-[30px] h-[30px] rounded-full bg-[#EAF3EE] flex items-center justify-center border-2 border-[#0F8354] z-10">
        <div className="w-2 h-2 bg-[#0F8354] rounded-full" />
     </div>
     <div className="bg-[#F5F5F5] rounded-[10px] p-3 flex justify-between items-center border border-gray-100">
        <div>
           <h4 className="text-sm font-bold text-[#1A1A1B]">{title}</h4>
           <p className="text-[#707070] text-[10px] font-normal">{subtitle}</p>
        </div>
        <span className="text-[10px] font-bold text-[#1A1A1B] bg-white px-2 py-0.5 rounded border border-gray-200 whitespace-nowrap ml-2">{metric}</span>
     </div>
  </div>
)

// --- MAIN COMPONENT ---

export function ProductDetailModal() {
  const { isProductModalOpen, closeProductModal, selectedProduct, openCheckout, openAuthModal } = useUI()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState<'impacto' | 'trazabilidad'>('impacto')
  const { isSignedIn } = useUser()

  if (!isProductModalOpen || !selectedProduct) return null

  const traceability = [
    { title: "Origen", subtitle: "Producción Ética", metric: "0.5 kg" },
    { title: "Empaque", subtitle: "Sin plásticos", metric: "0.2 kg" },
    { title: "Transporte", subtitle: "Logística verde", metric: "0.4 kg" },
    { title: "Entrega", subtitle: "Última milla", metric: "0.1 kg" },
  ]

  const handleAddToCart = () => { 
      addToCart(selectedProduct); 
      closeProductModal(); 
  }

  const handleBuyNow = () => { 
      addToCart(selectedProduct, false); 
      closeProductModal(); 
      if (!isSignedIn) {
          openAuthModal(); 
      } else { 
          openCheckout(); 
      }
  }

  const safeImage = selectedProduct.imagen && selectedProduct.imagen.startsWith('http') 
    ? selectedProduct.imagen 
    : "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=800";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      
      {/* CONTENEDOR PRINCIPAL */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full h-full md:h-auto md:max-h-[90vh] max-w-[850px] bg-white md:rounded-[20px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* BOTÓN CERRAR FLOTANTE */}
        <button 
            onClick={closeProductModal} 
            className="absolute right-4 top-4 z-50 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-[#1A1A1B] transition-all hover:scale-110 cursor-pointer border border-gray-100"
        >
           <X size={20} />
        </button>

        {/* --- COLUMNA 1: IMAGEN (Responsive: Banner arriba en móvil / Columna en desktop) --- */}
        <div className="relative w-full h-56 shrink-0 md:h-auto md:w-[45%] bg-[#FAFAFA] md:p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
           
           {/* Imagen Wrapper */}
           <div className="relative w-full h-full md:aspect-square md:rounded-[15px] overflow-hidden md:shadow-sm md:border md:border-white md:bg-white group">
             <Image 
                src={safeImage} 
                alt={selectedProduct.nombre} 
                fill 
                className="object-cover md:object-contain transition-transform duration-700 group-hover:scale-105" 
             />
           </div>

           {/* Badges (Flotantes en móvil, Debajo en desktop) */}
           <div className="absolute top-4 left-4 md:static md:mt-4 flex flex-wrap gap-2 justify-start md:justify-center pointer-events-none">
              <Badge text="Carbon Neutral" />
              <Badge text={selectedProduct.impactoAmbiental.nivel} />
           </div>
        </div>

        {/* --- COLUMNA 2: INFO (Scrollable independiente) --- */}
        <div className="flex-1 flex flex-col bg-white min-h-0">
           
           {/* Header Info */}
           <div className="pt-6 px-6 pb-2 shrink-0">
              <span className="text-[#707070] text-[10px] font-bold tracking-[0.2em] uppercase mb-1 block opacity-60">{selectedProduct.marca}</span>
              <h1 className="text-2xl md:text-3xl font-sans font-medium text-[#1A1A1B] leading-tight mb-1 line-clamp-2">{selectedProduct.nombre}</h1>
              <p className="text-[#0F8354] text-2xl font-sans font-bold tracking-tight">${selectedProduct.precio.toLocaleString()}</p>
           </div>

           {/* Tabs + Contenido Scrollable */}
           <div className="px-6 mt-2 flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="bg-[#F0F0F0] p-1 rounded-[12px] flex gap-1 mb-3 shrink-0">
                 <TabButton active={activeTab === 'impacto'} label="Impacto" onClick={() => setActiveTab('impacto')} />
                 <TabButton active={activeTab === 'trazabilidad'} label="Trazabilidad" onClick={() => setActiveTab('trazabilidad')} />
              </div>

              {/* Scroll Area: Esto permite que el contenido scrollee sin tapar el botón de compra */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
                 <AnimatePresence mode="wait">
                    {activeTab === 'impacto' && (
                      <motion.div key="impacto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                             <MetricItem label="Huella" value={selectedProduct.impactoAmbiental.huellaCarbono} sub="Baja emisión" />
                             <MetricItem label="Agua" value="~60 L" sub="Ahorro estimado" />
                             <MetricItem label="Reciclable" value={selectedProduct.impactoAmbiental.materialesReciclables ? "100%" : "80%"} sub="Materiales" />
                             <MetricItem label="Transporte" value="Neutro" sub="Compensado" />
                          </div>
                          <div className="bg-[#006CFF]/5 border border-[#006CFF]/20 rounded-[12px] p-3 flex gap-3 items-start">
                             <Info className="text-[#006CFF] shrink-0 mt-0.5" size={18} />
                             <p className="text-[#006CFF] text-xs leading-relaxed">Este producto ahorra <strong>0.5 kg CO₂</strong> comparado con alternativas estándar.</p>
                          </div>
                      </motion.div>
                    )}

                    {activeTab === 'trazabilidad' && (
                      <motion.div key="trazabilidad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                          <div className="pl-2">
                             {traceability.map((t, i) => <TimelineItem key={i} {...t} isLast={i === traceability.length - 1} />)}
                          </div>
                          <div className="mt-4 bg-[#E8F5E9] border border-[#0F8354] rounded-[10px] p-3 text-center">
                             <p className="text-[#0F8354] text-xs font-bold">Huella Total Verificada: 1.2 kg CO₂</p>
                          </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* Footer Buttons (Sticky al fondo del modal) */}
           <div className="p-5 border-t border-gray-100 flex gap-3 bg-white shrink-0 z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] safe-area-pb">
              <Button onClick={handleAddToCart} className="flex-1 py-4 h-12 md:h-auto bg-[#0F8354] hover:bg-[#0a633e] text-white text-sm md:text-base font-righteous rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 mr-2" /> <span className="hidden md:inline">Añadir al carrito</span><span className="md:hidden">Añadir</span>
              </Button>
              <Button onClick={handleBuyNow} className="flex-1 py-4 h-12 md:h-auto bg-[#1A1A1B] hover:bg-black text-white text-sm md:text-base font-righteous rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center">
                <CreditCard className="w-4 h-4 mr-2" /> <span className="hidden md:inline">Proceder al pago</span><span className="md:hidden">Comprar</span>
              </Button>
           </div>
        </div>
      </motion.div>
    </div>
  )
}