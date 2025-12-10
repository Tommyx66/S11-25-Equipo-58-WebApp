'use client'

import { useState, useRef, useEffect } from 'react'
import { X, CreditCard, Wallet, AlertCircle, ChevronRight, ArrowLeft, Loader2, MapPin, Check, Leaf } from 'lucide-react'
import { useUI } from '@/contexts/UIContext'
import { useCart } from '@/contexts/CartContext'
import { useUserData } from '@/contexts/UserContext'
import { useAuth } from '@clerk/nextjs'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

// --- TIPOS ---
interface Provincia { id: string; nombre: string; }
interface Localidad { id: string; nombre: string; }

// --- ANIMACIONES CORREGIDAS (Con 'as const' para TypeScript) ---
const transitionSpring = { type: "spring" as const, stiffness: 300, damping: 30 }; // ✅ FIX AQUÍ

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};
const checkAnimation = {
  hidden: { scale: 0, rotate: -45, opacity: 0 },
  visible: { scale: 1, rotate: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 15 } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

// --- COMPONENTES UI INTERNOS ---
const StepIndicator = ({ step, label, currentStep }: { step: number, label: string, currentStep: number }) => {
  const isActive = currentStep >= step
  const isCurrent = currentStep === step
  return (
    <div className="flex items-center gap-2 relative z-10 bg-white px-2">
      <motion.div 
        initial={false}
        animate={{ 
          backgroundColor: isActive ? "#0F8354" : "#E5E7EB",
          color: isActive ? "#ffffff" : "#9CA3AF",
          scale: isCurrent ? 1.1 : 1
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-sans shadow-sm ring-2 ring-white transition-all duration-300"
      >
        {step}
      </motion.div>
      <motion.span 
        animate={{ color: isActive ? "#0F8354" : "#9CA3AF", fontWeight: isActive ? 600 : 400 }}
        className="text-sm font-sans hidden sm:block"
      >
        {label}
      </motion.span>
    </div>
  )
}

const InputField = ({ label, name, placeholder, value, onChange, error, width = "full", type = "text", maxLength, icon: Icon }: any) => (
  <div className={clsx("flex flex-col gap-1.5", width === "full" ? "w-full" : "w-full md:w-1/2")}>
    <label className="text-sm font-medium text-[#1A1A1B] flex justify-between items-center font-sans">
      {label}
      {error && <span className="text-red-500 text-xs font-normal flex items-center gap-1 animate-pulse"><AlertCircle size={12}/> {error}</span>}
    </label>
    <div className="relative group">
      <input 
        type={type}
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        className={clsx(
          "w-full h-11 border rounded-[10px] px-4 text-sm font-sans outline-none transition-all placeholder:text-gray-300 shadow-sm",
          Icon ? "pl-10" : "",
          error 
            ? "border-red-300 bg-red-50 focus:border-red-500" 
            : "border-gray-200 focus:border-[#0F8354] focus:ring-2 focus:ring-[#0F8354]/20 bg-white hover:border-gray-300"
        )}
        value={value}
        onChange={onChange}
      />
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-[#0F8354] transition-colors" />}
    </div>
  </div>
)

// --- MODAL PRINCIPAL ---
export function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout } = useUI()
  const { getTotalPrice, getTotalCarbonSaved, clearCart } = useCart()
  const { refreshUserData } = useUserData()
  const { getToken } = useAuth()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [finalSaved, setFinalSaved] = useState(0)
  const [finalPoints, setFinalPoints] = useState(0)
  
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [ciudadesSugeridas, setCiudadesSugeridas] = useState<Localidad[]>([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string | boolean>>({})
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', direccion: '', depto: '',
    provincia: '', provinciaNombre: '', ciudad: '', codPostal: '',
    metodoPago: 'stripe', cardNumber: '', cardExpiry: '', cardCvc: ''
  })

  useEffect(() => {
    if (isCheckoutOpen) {
      fetch('https://apis.datos.gob.ar/georef/api/provincias?orden=nombre&campos=id,nombre')
        .then(res => res.json()).then(data => setProvincias(data.provincias)).catch(console.error)
      
      if (typeof window !== 'undefined') {
        audioRef.current = new Audio('/sounds/success.mp3')
        audioRef.current.loop = false;
        audioRef.current.volume = 0.5
      }
    }
    return () => {
        if(audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }
  }, [isCheckoutOpen])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.provincia && formData.ciudad.length > 2) {
        fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${formData.provincia}&nombre=${formData.ciudad}&max=5&campos=id,nombre`)
          .then(res => res.json())
          .then(data => {
            setCiudadesSugeridas(data.localidades)
            setMostrarSugerencias(true)
          })
          .catch(console.error)
      } else {
        setCiudadesSugeridas([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [formData.ciudad, formData.provincia])

  if (!isCheckoutOpen) return null

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}
    let isValid = true
    if (currentStep === 1) {
      if (formData.nombre.length < 2) newErrors.nombre = "Requerido"
      if (formData.apellido.length < 2) newErrors.apellido = "Requerido"
      if (!formData.email.includes('@')) newErrors.email = "Inválido"
      if (formData.direccion.length < 5) newErrors.direccion = "Requerido"
      if (!formData.provincia) newErrors.provincia = "Selecciona..."
      if (formData.ciudad.length < 2) newErrors.ciudad = "Requerido"
      if (formData.codPostal.length < 3) newErrors.codPostal = "Requerido"
    }
    if (currentStep === 2 && formData.metodoPago === 'stripe') {
        if (formData.cardNumber.length < 16) newErrors.cardNumber = "Incompleto"
        if (formData.cardExpiry.length < 5) newErrors.cardExpiry = "Incompleto"
        if (formData.cardCvc.length < 3) newErrors.cardCvc = "Incompleto"
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      setAlertMessage("Por favor completa los campos obligatorios")
      setTimeout(() => setAlertMessage(null), 3000)
      isValid = false
    }
    return isValid
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      const newErrs = { ...errors }
      delete newErrs[field]
      setErrors(newErrs)
    }
  }

  const handleNext = async () => {
    if (!validateStep(step)) return 

    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setLoading(true)
      try {
        const token = await getToken()
        
        const savedNow = getTotalCarbonSaved() || 0
        const pointsNow = Number((getTotalPrice() * 0.1).toFixed(0)) || 0
        
        setFinalSaved(savedNow)
        setFinalPoints(pointsNow)

        if (token) {
             fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    estado: "pendiente_pago",
                    direccionEnvio: "Calle Falsa 123",
                    metodoPago: "stripe"
                })
             }).catch(console.warn)
        }

        const stored = localStorage.getItem('user_stats');
        const current = stored ? JSON.parse(stored) : {};
        
        const prevPuntos = Number(current.ecoPuntos || 0);
        const prevCO2 = Number(current.co2 || current.co2Ahorrado || 0);
        const prevAgua = Number(current.agua || current.aguaAhorrada || 0);
        const prevCompras = Number(current.compras || current.comprasSostenibles || 0);

        const newStats = {
            ecoPuntos: prevPuntos + pointsNow,
            co2: prevCO2 + savedNow,
            agua: prevAgua + (savedNow * 50),
            compras: prevCompras + 1
        };

        localStorage.setItem('user_stats', JSON.stringify(newStats));
        
        await refreshUserData()
        await clearCart()
        
        if (audioRef.current) { 
           audioRef.current.currentTime = 0;
           audioRef.current.play().catch(()=>{}); 
        }
        
        setStep(3)
      } catch (err) { console.error(err) } finally { setLoading(false) }
    } else {
      closeCheckout()
      setStep(1)
      setFormData({ nombre: '', apellido: '', email: '', direccion: '', ciudad: '', provincia: '', provinciaNombre: '', codPostal: '', depto: '', metodoPago: 'stripe', cardNumber: '', cardExpiry: '', cardCvc: '' })
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
      
      <AnimatePresence>
        {alertMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="absolute top-8 left-1/2 z-[80] bg-red-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-medium"
          >
            <AlertCircle size={14} /> {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={transitionSpring}
        className="relative w-full max-w-[750px] bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col border border-gray-100"
      >
        <div className="px-6 pt-5 pb-2 bg-white z-10 flex flex-col border-b border-gray-50/80">
           <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-righteous text-[#1A1A1B] leading-tight">Finalizar Compra</h2>
                <p className="text-gray-500 text-sm font-sans hidden sm:block font-normal">
                  Completa tu información para un envío sostenible.
                </p>
              </div>
              <button onClick={closeCheckout} className="p-1.5 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-[#1A1A1B]">
                <X size={20} />
              </button>
           </div>
           <div className="flex items-center justify-between w-full max-w-[500px] mx-auto mb-3 relative px-2">
              <div className="absolute left-4 right-4 top-[15px] h-[2px] bg-gray-100 -z-0 rounded-full" />
              <motion.div className="absolute left-4 top-[15px] h-[2px] bg-[#0F8354] -z-0 origin-left rounded-full" initial={{ width: "0%" }} animate={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }} transition={{ duration: 0.5, ease: "easeInOut" }} />
              <StepIndicator step={1} label="Envío" currentStep={step} />
              <StepIndicator step={2} label="Pago" currentStep={step} />
              <StepIndicator step={3} label="Fin" currentStep={step} />
           </div>
        </div>

        <motion.div layout className="flex-1 overflow-y-auto px-6 py-5 bg-[#FCFCFC] relative scroll-smooth">
          <AnimatePresence mode="popLayout" initial={false}>
            {step === 1 && (
              <motion.div key="step1" variants={fadeInUp} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <InputField label="Nombre" name="nombre" placeholder="Santiago" value={formData.nombre} onChange={(e:any)=>handleChange("nombre", e.target.value)} error={errors.nombre} width="half" />
                  <InputField label="Apellido" name="apellido" placeholder="Galiano" value={formData.apellido} onChange={(e:any)=>handleChange("apellido", e.target.value)} error={errors.apellido} width="half" />
                </div>
                <InputField label="Email" name="email" placeholder="ejemplo@email.com" type="email" value={formData.email} onChange={(e:any)=>handleChange("email", e.target.value)} error={errors.email} />
                <div className="flex gap-4">
                   <div className="flex-1"><InputField label="Dirección" name="direccion" placeholder="Calle falsa 123" value={formData.direccion} onChange={(e:any)=>handleChange("direccion", e.target.value)} error={errors.direccion} /></div>
                   <div className="w-[100px]"><InputField label="Depto" name="depto" placeholder="4B" value={formData.depto} onChange={(e:any)=>handleChange("depto", e.target.value)} /></div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col gap-1.5 w-full md:w-1/2">
                    <label className="text-sm font-medium text-[#1A1A1B]">Provincia</label>
                    <div className="relative">
                        <select className={clsx("w-full h-11 border rounded-[10px] px-4 text-sm font-sans outline-none bg-white transition-all cursor-pointer appearance-none", errors.provincia ? "border-red-300" : "border-gray-200 focus:border-[#0F8354] focus:ring-1 focus:ring-[#0F8354]")} value={formData.provincia} onChange={(e) => { const opt = e.target.options[e.target.selectedIndex]; setFormData(prev => ({ ...prev, provincia: e.target.value, provinciaNombre: opt.text, ciudad: '' })); if(errors.provincia) { const n = {...errors}; delete n.provincia; setErrors(n); } }}>
                            <option value="">Selecciona...</option>
                            {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full md:w-1/2 relative">
                    <label className="text-sm font-medium text-[#1A1A1B] flex justify-between">Ciudad {loading && <Loader2 size={14} className="animate-spin text-[#0F8354]" />}</label>
                    <div className="relative group">
                        <input type="text" placeholder={formData.provincia ? "Busca tu ciudad..." : "Elige provincia"} disabled={!formData.provincia} className={clsx("w-full h-11 border rounded-[10px] px-4 text-sm font-sans outline-none transition-all placeholder:text-gray-300", !formData.provincia ? "bg-gray-50 cursor-not-allowed" : "bg-white hover:border-gray-300 focus:border-[#0F8354] focus:ring-2 focus:ring-[#0F8354]/20", errors.ciudad ? "border-red-300" : "border-gray-200")} value={formData.ciudad} onChange={(e) => handleChange("ciudad", e.target.value)} onFocus={() => setMostrarSugerencias(true)} onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)} />
                        <MapPin className={clsx("absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors", formData.ciudad ? "text-[#0F8354]" : "text-gray-300")} />
                        <AnimatePresence>
                        {mostrarSugerencias && ciudadesSugeridas.length > 0 && (
                            <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-20 max-h-40 overflow-y-auto py-1 origin-top">
                                {ciudadesSugeridas.map((c) => (
                                    <div key={c.id} className="px-4 py-2 hover:bg-[#0F8354]/5 cursor-pointer text-sm text-gray-700" onClick={() => { setFormData(prev => ({...prev, ciudad: c.nombre})); setMostrarSugerencias(false) }}>{c.nombre}</div>
                                ))}
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                    <InputField label="Código Postal" name="codPostal" placeholder="7600" value={formData.codPostal} onChange={(e:any)=>handleChange("codPostal", e.target.value)} error={errors.codPostal} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={fadeInUp} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[#1A1A1B] font-sans">Método de Pago</h3>
                  <div onClick={() => handleChange("metodoPago", "stripe")} className={clsx("border rounded-[12px] p-4 cursor-pointer flex gap-4 items-center transition-all shadow-sm group bg-white", formData.metodoPago === 'stripe' ? "border-[#0F8354] bg-[#0F8354]/5 ring-1 ring-[#0F8354]" : "border-gray-200 hover:border-gray-300")}>
                    <div className={clsx("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors", formData.metodoPago === 'stripe' ? "border-[#0F8354]" : "border-gray-300")}>
                        {formData.metodoPago === 'stripe' && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-2.5 h-2.5 bg-[#0F8354] rounded-full" />}
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-[#1A1A1B] text-sm">Tarjeta de Crédito / Débito</p>
                        <p className="text-xs text-gray-500">Procesado seguro por Stripe</p>
                    </div>
                    <CreditCard size={24} className={clsx("transition-colors", formData.metodoPago === 'stripe' ? "text-[#0F8354]" : "text-gray-400")} />
                  </div>
                  
                  <AnimatePresence>
                    {formData.metodoPago === 'stripe' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="grid grid-cols-2 gap-4 pt-1 pl-1">
                                <div className="col-span-2">
                                <InputField label="Número de Tarjeta" name="cardNumber" placeholder="0000 0000 0000 0000" maxLength={19} icon={CreditCard} value={formData.cardNumber} onChange={(e:any)=>handleChange("cardNumber", e.target.value)} error={errors.cardNumber} />
                                </div>
                                <InputField label="Vencimiento" name="cardExpiry" placeholder="MM/AA" maxLength={5} value={formData.cardExpiry} onChange={(e:any)=>handleChange("cardExpiry", e.target.value)} error={errors.cardExpiry} />
                                <InputField label="CVC" name="cardCvc" placeholder="123" maxLength={3} type="password" value={formData.cardCvc} onChange={(e:any)=>handleChange("cardCvc", e.target.value)} error={errors.cardCvc} />
                            </div>
                        </motion.div>
                    )}
                   </AnimatePresence>
                  
                  <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 opacity-50 cursor-not-allowed bg-gray-50/50">
                     <div className="w-5 h-5 rounded-full border-2 border-gray-200 bg-white shrink-0"></div>
                     <div className="flex-1">
                        <p className="font-bold text-gray-500 text-sm font-sans">MercadoPago</p>
                        <p className="text-xs text-gray-400 font-sans">No disponible</p>
                     </div>
                     <Wallet size={24} className="text-gray-300" />
                  </div>
                </div>

                <div className="bg-[#E8F5E9]/50 border border-[#0F8354]/20 rounded-[15px] p-5 shadow-sm">
                    <h3 className="font-righteous text-lg text-[#0F8354] mb-3 flex items-center gap-2"><Leaf size={18}/> Tu Impacto</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Huella evitada:</span>
                            <span className="font-bold text-[#0F8354]">-{getTotalCarbonSaved().toFixed(1)} kg CO₂</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Puntos a ganar:</span>
                            <span className="font-bold text-[#0F8354]">+{ (getTotalPrice() * 0.1).toFixed(0) }</span>
                        </div>
                    </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={staggerContainer} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center text-center py-6 h-full">
                <div className="relative mb-6">
                  <motion.div variants={checkAnimation} className="relative z-10 w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center border-[4px] border-white shadow-xl ring-4 ring-[#E8F5E9]">
                    <Check size={48} className="text-[#0F8354]" strokeWidth={4} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 0.4, 0], scale: 1.8 }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="absolute top-0 left-0 w-24 h-24 bg-[#0F8354]/10 rounded-full z-0" />
                </div>
                
                <motion.div variants={fadeInUp}>
                  <h3 className="text-3xl font-bold text-[#1A1A1B] mb-2 font-righteous tracking-tight">¡Pago Exitoso!</h3>
                  <p className="text-gray-500 text-[15px] max-w-[320px] mb-8 font-sans leading-relaxed mx-auto font-medium">
                    Gracias por tu compra sostenible. Hemos enviado el comprobante a tu email.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp} className="bg-white border border-gray-100 rounded-2xl w-full max-w-[340px] shadow-xl overflow-hidden relative">
                   <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F8354] to-[#0a633e]"></div>
                   <div className="p-6">
                      <h4 className="font-bold text-[#1A1A1B] text-lg font-sans flex items-center justify-center gap-2 mb-6">
                         <Leaf size={20} className="text-[#0F8354]" /> Impacto Generado
                      </h4>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center bg-[#F9FAFB] p-3 rounded-xl border border-gray-50">
                            <span className="text-gray-500 text-sm font-medium">CO₂ Ahorrado</span>
                            <span className="font-bold text-[#0F8354] text-lg">{finalSaved.toFixed(1)} kg</span>
                         </div>
                         <div className="flex justify-between items-center bg-[#F9FAFB] p-3 rounded-xl border border-gray-50">
                            <span className="text-gray-500 text-sm font-medium">Eco-Puntos</span>
                            <span className="font-bold text-[#0F8354] text-lg">+{finalPoints.toFixed(0)}</span>
                         </div>
                      </div>
                   </div>
                   <div className="bg-[#E8F5E9] py-3 text-center text-xs text-[#0F8354] font-medium border-t border-[#0F8354]/10">
                      ¡Sigue sumando puntos!
                   </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-gray-100 flex justify-between items-center bg-white z-20 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
          {step === 1 && (
            <Button variant="ghost" onClick={closeCheckout} className="h-11 px-5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1B] rounded-xl transition-colors">Cancelar</Button>
          )}
          {step === 2 && (
            <Button variant="ghost" onClick={() => setStep(1)} className="h-11 px-5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1A1A1B] rounded-xl flex items-center gap-2 transition-colors"><ArrowLeft size={16}/> Volver</Button>
          )}
          
          {step < 3 ? (
            <Button onClick={handleNext} disabled={loading} className="bg-[#0F8354] hover:bg-[#0a633e] text-white h-11 px-8 text-sm font-bold rounded-xl shadow-md hover:shadow-lg ml-auto flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (step === 1 ? 'Continuar' : 'Pagar Ahora')}
              {!loading && <ChevronRight size={16} />}
            </Button>
          ) : (
            <div className="w-full flex justify-center">
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.8}}>
                  <Button onClick={closeCheckout} className="w-full max-w-xs h-12 bg-[#0F8354] hover:bg-[#0a633e] text-white text-base font-bold rounded-xl shadow-md font-righteous transition-all active:scale-[0.98] hover:shadow-lg">
                    Volver a la Tienda
                  </Button>
                </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}