"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Loader2,
  MapPin,
  Check,
  Leaf,
  CreditCard,
  Calendar,
  Lock,
} from "lucide-react";
import { useUI } from "@/contexts/UIContext";
import { useCart } from "@/contexts/CartContext";
import { useUserData } from "@/contexts/UserContext";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// --- TIPOS ---
interface Provincia {
  id: string;
  nombre: string;
}
interface Localidad {
  id: string;
  nombre: string;
}

// --- ANIMACIONES CORREGIDAS (FIX TYPESCRIPT) ---
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      type: "spring" as const,
      bounce: 0,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" as const }, // ✅ Solución: as const
  }),
};

const checkAnimation = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
      delay: 0.2,
    },
  },
};

// --- UTILS: ALGORITMO DE LUHN (Validación Real de Tarjetas) ---
const isValidLuhn = (cardNumber: string) => {
  const cleanNum = cardNumber.replace(/\D/g, "");
  if (cleanNum.length < 13) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleanNum.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNum.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

// --- COMPONENTES UI ---

const StepCircle = ({
  stepNumber,
  label,
  currentStep,
}: {
  stepNumber: number;
  label: string;
  currentStep: number;
}) => {
  const isCompleted = currentStep > stepNumber;
  const isActive = currentStep === stepNumber;

  return (
    <div className="relative z-10 flex flex-col items-center">
      <motion.div
        initial={false}
        animate={{
          backgroundColor: isActive || isCompleted ? "#0F8354" : "#FFFFFF",
          borderColor: isActive || isCompleted ? "#0F8354" : "#E5E7EB",
          color: isActive || isCompleted ? "#FFFFFF" : "#9CA3AF",
          scale: isActive ? 1.2 : 1,
        }}
        className="w-8 h-8 rounded-full border-[3px] flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-sm"
      >
        {isCompleted ? <Check size={14} strokeWidth={4} /> : stepNumber}
      </motion.div>
      <span
        className={clsx(
          "text-[10px] uppercase tracking-wider font-bold absolute -bottom-6 w-max transition-colors duration-300",
          isActive || isCompleted ? "text-[#0F8354]" : "text-gray-300"
        )}
      >
        {label}
      </span>
    </div>
  );
};

const InputField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  width = "full",
  type = "text",
  maxLength,
  icon: Icon,
}: any) => (
  <div
    className={clsx(
      "flex flex-col gap-1.5",
      width === "full" ? "w-full" : "w-full md:w-1/2"
    )}
  >
    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex justify-between ml-1">
      {label}
      {error && (
        <span className="text-red-500 text-[10px] font-normal flex items-center gap-1">
          <AlertCircle size={10} /> {error}
        </span>
      )}
    </label>
    <div className="relative group">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        className={clsx(
          "w-full h-12 border rounded-xl px-4 text-sm outline-none transition-all placeholder:text-gray-300 bg-white",
          Icon ? "pl-11" : "",
          error
            ? "border-red-300 bg-red-50 focus:border-red-500"
            : "border-gray-200 focus:border-[#0F8354] focus:ring-4 focus:ring-[#0F8354]/10 hover:border-gray-300"
        )}
        value={value}
        onChange={onChange}
      />
      {Icon && (
        <Icon
          className={clsx(
            "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
            value ? "text-[#0F8354]" : "text-gray-400"
          )}
        />
      )}
    </div>
  </div>
);

// --- MODAL PRINCIPAL ---
export function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout } = useUI();
  const { cartItems, getTotalPrice, getTotalCarbonSaved, clearCart } =
    useCart();
  const { refreshUserData } = useUserData();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finalSaved, setFinalSaved] = useState(0);
  const [finalPoints, setFinalPoints] = useState(0);

  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [ciudadesSugeridas, setCiudadesSugeridas] = useState<Localidad[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | boolean>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    depto: "",
    provincia: "",
    provinciaNombre: "",
    ciudad: "",
    codPostal: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  // Carga inicial
  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      setDirection(0);
      setLoading(false);
      setFormData((prev) => ({
        ...prev,
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",
      }));

      fetch(
        "https://apis.datos.gob.ar/georef/api/provincias?orden=nombre&campos=id,nombre"
      )
        .then((res) => res.json())
        .then((data) => setProvincias(data.provincias))
        .catch(console.error);

      if (typeof window !== "undefined") {
        audioRef.current = new Audio("/sounds/success.mp3");
        audioRef.current.loop = false;
        audioRef.current.volume = 0.5;
      }
    }
  }, [isCheckoutOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.provincia && formData.ciudad.length > 2) {
        fetch(
          `https://apis.datos.gob.ar/georef/api/localidades?provincia=${formData.provincia}&nombre=${formData.ciudad}&max=5&campos=id,nombre`
        )
          .then((res) => res.json())
          .then((data) => {
            setCiudadesSugeridas(data.localidades);
            setMostrarSugerencias(true);
          })
          .catch(console.error);
      } else {
        setCiudadesSugeridas([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.ciudad, formData.provincia]);

  if (!isCheckoutOpen) return null;

  // --- VALIDACIÓN ---
  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (formData.nombre.length < 2) newErrors.nombre = "Requerido";
      if (formData.apellido.length < 2) newErrors.apellido = "Requerido";
      if (formData.direccion.length < 5)
        newErrors.direccion = "Dirección inválida";
      if (!formData.provincia) newErrors.provincia = "Seleccione una provincia";
      if (formData.ciudad.length < 2) newErrors.ciudad = "Ciudad requerida";
    }

    if (currentStep === 2) {
      // 1. Validar Algoritmo de Luhn
      if (!isValidLuhn(formData.cardNumber)) {
        newErrors.cardNumber = "Tarjeta inválida";
      }

      // 2. CVC
      if (formData.cardCvc.length < 3) newErrors.cardCvc = "Requerido";

      // 3. Fecha Vencimiento (Mes válido y año futuro)
      if (!formData.cardExpiry || formData.cardExpiry.length < 5) {
        newErrors.cardExpiry = "Incompleto";
      } else {
        const [mm, yy] = formData.cardExpiry.split("/");
        const month = parseInt(mm, 10);
        const year = parseInt(`20${yy}`, 10); // Asumiendo siglo 21
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (month < 1 || month > 12) {
          newErrors.cardExpiry = "Mes inválido";
        } else if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          newErrors.cardExpiry = "Vencida";
        }
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setAlertMessage("Por favor revisa los campos marcados");
      setTimeout(() => setAlertMessage(null), 3000);
      isValid = false;
    }
    return isValid;
  };

  // --- MANEJO DE INPUTS CON MÁSCARAS ---
  const handleChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === "cardExpiry") {
      const cleaned = value.replace(/\D/g, "");
      const truncated = cleaned.slice(0, 4);
      if (truncated.length >= 2) {
        formattedValue = `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
      } else {
        formattedValue = truncated;
      }
    }

    if (field === "cardNumber") {
      const cleaned = value.replace(/\D/g, "");
      const truncated = cleaned.slice(0, 16);
      formattedValue = truncated.replace(/(\d{4})/g, "$1 ").trim();
    }

    if (field === "cardCvc") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }));

    if (errors[field]) {
      const newErrs = { ...errors };
      delete newErrs[field];
      setErrors(newErrs);
    }
  };

  // Manejo de Pasos
  const handleNext = async () => {
    if (!validateStep(step)) return;

    if (step === 1) {
      setDirection(1);
      setStep(2);
    } else if (step === 2) {
      setLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simular espera

        const savedNow = getTotalCarbonSaved() || 0;
        const pointsNow = Number((getTotalPrice() * 0.1).toFixed(0)) || 0;

        setFinalSaved(savedNow);
        setFinalPoints(pointsNow);

        const stored = localStorage.getItem("user_stats");
        const current = stored ? JSON.parse(stored) : {};
        const prevPuntos = Number(current.ecoPuntos || 0);
        const prevCO2 = Number(current.co2 || current.co2Ahorrado || 0);
        const prevAgua = Number(current.agua || current.aguaAhorrada || 0);
        const prevCompras = Number(
          current.compras || current.comprasSostenibles || 0
        );

        const newStats = {
          ecoPuntos: prevPuntos + pointsNow,
          co2: prevCO2 + savedNow,
          agua: prevAgua + savedNow * 50,
          compras: prevCompras + 1,
        };

        localStorage.setItem("user_stats", JSON.stringify(newStats));

        await refreshUserData();
        await clearCart();

        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }

        setDirection(1);
        setStep(3);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      closeCheckout();
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="absolute top-6 left-1/2 z-[90] bg-red-500 text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wide"
          >
            <AlertCircle size={14} /> {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* HEADER */}
        <div className="px-8 pt-8 pb-6 bg-white z-10 border-b border-gray-50 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-righteous text-[#1A1A1B] leading-none mb-2">
                {step === 3
                  ? "¡Pedido Listo!"
                  : step === 2
                  ? "Método de Pago"
                  : "Datos de Envío"}
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                {step === 3
                  ? "Gracias por tu compra sostenible."
                  : "Completa la información para continuar."}
              </p>
            </div>
            <button
              onClick={closeCheckout}
              className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-[#1A1A1B]"
            >
              <X size={24} />
            </button>
          </div>

          {/* BARRA DE PROGRESO */}
          {step < 3 && (
            <div className="relative w-full max-w-[400px] mx-auto px-4 pb-2">
              <div className="absolute left-4 right-4 top-4 h-[3px] bg-gray-100 -z-0 rounded-full" />
              <motion.div
                className="absolute left-4 top-4 h-[3px] bg-[#0F8354] -z-0 rounded-full origin-left"
                initial={{ width: "0%" }}
                animate={{ width: step === 1 ? "0%" : "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <div className="flex justify-between items-center relative z-10 w-full">
                <StepCircle stepNumber={1} label="Envío" currentStep={step} />
                <StepCircle stepNumber={2} label="Pago" currentStep={step} />
                <StepCircle stepNumber={3} label="Listo" currentStep={step} />
              </div>
            </div>
          )}
        </div>

        {/* BODY */}
        <div
          className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50/50 "
          data-lenis-prevent
        >
          <AnimatePresence mode="wait" custom={direction}>
            {/* PASO 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5 max-w-2xl mx-auto"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  <InputField
                    label="Nombre"
                    name="nombre"
                    placeholder="Ej: Santiago"
                    value={formData.nombre}
                    onChange={(e: any) =>
                      handleChange("nombre", e.target.value)
                    }
                    error={errors.nombre}
                    width="half"
                  />
                  <InputField
                    label="Apellido"
                    name="apellido"
                    placeholder="Ej: Martínez"
                    value={formData.apellido}
                    onChange={(e: any) =>
                      handleChange("apellido", e.target.value)
                    }
                    error={errors.apellido}
                    width="half"
                  />
                </div>
                <InputField
                  label="Email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  type="email"
                  value={formData.email}
                  onChange={(e: any) => handleChange("email", e.target.value)}
                />
                <div className="flex gap-5">
                  <div className="flex-1">
                    <InputField
                      label="Dirección"
                      name="direccion"
                      placeholder="Ej: Av. Corrientes 1234"
                      value={formData.direccion}
                      onChange={(e: any) =>
                        handleChange("direccion", e.target.value)
                      }
                      error={errors.direccion}
                      icon={MapPin}
                    />
                  </div>
                  <div className="w-[100px]">
                    <InputField
                      label="Depto"
                      name="depto"
                      placeholder="4B"
                      value={formData.depto}
                      onChange={(e: any) =>
                        handleChange("depto", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex flex-col gap-1.5 w-full md:w-1/2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">
                      Provincia
                    </label>
                    <div className="relative">
                      <select
                        className={clsx(
                          "w-full h-12 border rounded-xl px-4 text-sm outline-none bg-white transition-all cursor-pointer appearance-none shadow-sm",
                          errors.provincia
                            ? "border-red-300"
                            : "border-gray-200 focus:border-[#0F8354] focus:ring-4 focus:ring-[#0F8354]/10"
                        )}
                        value={formData.provincia}
                        onChange={(e) => {
                          const opt = e.target.options[e.target.selectedIndex];
                          setFormData((prev) => ({
                            ...prev,
                            provincia: e.target.value,
                            provinciaNombre: opt.text,
                            ciudad: "",
                          }));
                          if (errors.provincia) {
                            const n = { ...errors };
                            delete n.provincia;
                            setErrors(n);
                          }
                        }}
                      >
                        <option value="">Selecciona...</option>
                        {provincias.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                      <ChevronRight
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none"
                        size={16}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full md:w-1/2 relative">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1 flex justify-between">
                      Ciudad{" "}
                      {loading && (
                        <Loader2
                          size={12}
                          className="animate-spin text-[#0F8354]"
                        />
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={
                          formData.provincia
                            ? "Buscar ciudad..."
                            : "Elige provincia primero"
                        }
                        disabled={!formData.provincia}
                        className={clsx(
                          "w-full h-12 border rounded-xl px-4 text-sm outline-none transition-all placeholder:text-gray-300 shadow-sm",
                          !formData.provincia
                            ? "bg-gray-100 cursor-not-allowed border-transparent"
                            : "bg-white border-gray-200 focus:border-[#0F8354] focus:ring-4 focus:ring-[#0F8354]/10",
                          errors.ciudad ? "border-red-300" : ""
                        )}
                        value={formData.ciudad}
                        onChange={(e) => handleChange("ciudad", e.target.value)}
                        onFocus={() => setMostrarSugerencias(true)}
                        onBlur={() =>
                          setTimeout(() => setMostrarSugerencias(false), 200)
                        }
                      />
                      {mostrarSugerencias && ciudadesSugeridas.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto py-1">
                          {ciudadesSugeridas.map((c) => (
                            <div
                              key={c.id}
                              className="px-4 py-2 hover:bg-[#0F8354]/5 cursor-pointer text-sm text-gray-700"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  ciudad: c.nombre,
                                }));
                                setMostrarSugerencias(false);
                              }}
                            >
                              {c.nombre}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6 max-w-xl mx-auto"
              >
                <div className="border border-[#0F8354] bg-[#0F8354]/5 rounded-2xl p-5 flex items-center justify-between shadow-sm ring-1 ring-[#0F8354]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0F8354] shadow-sm">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A1A1B] text-sm">
                        Tarjeta de Crédito / Débito
                      </h4>
                      <p className="text-xs text-gray-500">
                        Transacción segura encriptada
                      </p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-[5px] border-[#0F8354] bg-white"></div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                  <InputField
                    label="Número de Tarjeta"
                    name="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={(e: any) =>
                      handleChange("cardNumber", e.target.value)
                    }
                    error={errors.cardNumber}
                    icon={CreditCard}
                  />
                  <div className="flex gap-5">
                    <InputField
                      label="Vencimiento"
                      name="cardExpiry"
                      placeholder="MM/AA"
                      maxLength={5}
                      value={formData.cardExpiry}
                      onChange={(e: any) =>
                        handleChange("cardExpiry", e.target.value)
                      }
                      error={errors.cardExpiry}
                      icon={Calendar}
                    />
                    <InputField
                      label="CVC"
                      name="cardCvc"
                      placeholder="123"
                      maxLength={3}
                      type="password"
                      value={formData.cardCvc}
                      onChange={(e: any) =>
                        handleChange("cardCvc", e.target.value)
                      }
                      error={errors.cardCvc}
                      icon={Lock}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center px-2">
                  <span className="font-righteous text-lg text-[#1A1A1B]">
                    Total a Pagar
                  </span>
                  <span className="font-righteous text-2xl text-[#0F8354]">
                    ${getTotalPrice().toLocaleString()}
                  </span>
                </div>
              </motion.div>
            )}

            {/* PASO 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={checkAnimation}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center text-center py-8"
              >
                <div className="w-24 h-24 bg-[#0F8354] rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 mb-6">
                  <Check size={48} className="text-white" strokeWidth={4} />
                </div>
                <h3 className="text-3xl font-bold text-[#1A1A1B] mb-2 font-righteous">
                  ¡Pago Exitoso!
                </h3>
                <p className="text-gray-500 text-sm max-w-[300px] mb-8 leading-relaxed">
                  Tu orden ha sido procesada correctamente. Recibirás un correo
                  con los detalles de seguimiento.
                </p>
                <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-sm p-6 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#0F8354]"></div>
                  <h4 className="font-bold text-[#1A1A1B] text-sm mb-4 flex items-center justify-center gap-2">
                    <Leaf size={16} className="text-[#0F8354]" /> Impacto
                    Generado
                  </h4>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-500">CO₂ Ahorrado</span>
                    <span className="font-bold text-[#0F8354]">
                      {finalSaved.toFixed(1)} kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Puntos Ganados</span>
                    <span className="font-bold text-[#0F8354]">
                      +{finalPoints.toFixed(0)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-gray-100 bg-white z-20 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
          {step === 1 && (
            <Button
              variant="ghost"
              onClick={closeCheckout}
              className="text-gray-500 hover:text-red-500 hover:bg-red-50 h-12 px-6 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </Button>
          )}
          {step === 2 && (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-gray-600 hover:text-[#1A1A1B] hover:bg-gray-100 h-12 px-6 rounded-xl font-medium flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Atrás
            </Button>
          )}

          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={loading}
              className="bg-[#0F8354] hover:bg-[#0a633e] text-white h-12 px-8 text-base font-bold rounded-xl shadow-lg shadow-green-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] ml-auto flex items-center gap-2 min-w-[140px] justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : step === 1 ? (
                "Continuar"
              ) : (
                "Pagar Ahora"
              )}
              {!loading && <ChevronRight size={18} strokeWidth={3} />}
            </Button>
          ) : (
            <div className="w-full flex justify-center">
              <Button
                onClick={closeCheckout}
                className="w-full max-w-xs h-14 bg-[#1A1A1B] hover:bg-black text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] font-righteous tracking-wide"
              >
                Volver a la Tienda
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
