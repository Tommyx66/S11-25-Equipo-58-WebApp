"use client";

import { useState } from "react";
import {
  X,
  Info,
  Leaf,
  Droplets,
  Recycle,
  Truck,
  MapPin,
  Factory,
  Package,
  Home,
} from "lucide-react";
import { useUI } from "@/contexts/UIContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { useUser } from "@clerk/nextjs";
import { Inter, Righteous } from "next/font/google";

// --- FUENTES ---
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

// --- VARIANTES  ---
const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(12px)",
    transition: { duration: 0.4, ease: "easeOut" as const }, // ✅ Fix
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeIn" as const }, // ✅ Fix
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const contentContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4 },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: 20, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    x: -20,
    filter: "blur(5px)",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

// --- SUB-COMPONENTES UI ---

const TabButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex-1 py-2.5 text-sm rounded-lg transition-all duration-300 z-10 relative font-righteous tracking-wide border",
      active
        ? "bg-white text-[#0F8354] border-gray-200 shadow-sm"
        : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-white/50"
    )}
  >
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-white rounded-lg shadow-sm"
        initial={false}
        transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
      />
    )}
    <span className="relative z-10">{label}</span>
  </button>
);

const Badge = ({ text }: { text: string }) => (
  <motion.span
    variants={itemVariants}
    className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-200 font-inter"
  >
    {text}
  </motion.span>
);

const MetricRow = ({
  label,
  value,
  index,
}: {
  label: string;
  value: string | undefined;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex justify-between items-center py-2.5 border-b border-[#0F8354]/10 last:border-0 last:pb-0"
  >
    <span className="text-[#0F8354] font-medium text-sm font-inter flex items-center gap-2">
      {label}
    </span>
    <span className="text-[#1A1A1B] font-bold text-sm text-right font-inter">
      {value || "N/A"}
    </span>
  </motion.div>
);

// --- COMPONENTE TIMELINE  ---
const TimelineItem = ({
  title,
  subtitle,
  metric,
  icon: Icon,
  isLast,
  index,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative pl-14 pb-8 last:pb-0"
  >
    {/* LÍNEA CONECTORA */}
    {!isLast && (
      <div className="absolute left-[19px] top-10 bottom-[-10px] w-[2px] bg-[#0F8354]/20 rounded-full" />
    )}

    {/* ICONO */}
    <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#0F8354] border-[3px] border-white shadow-sm z-10">
      <Icon size={18} />
    </div>

    {/* CONTENIDO */}
    <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow group cursor-default">
      <div>
        <h4 className="text-sm font-bold font-righteous text-[#1A1A1B] group-hover:text-[#0F8354] transition-colors">
          {title}
        </h4>
        <p className="text-xs text-gray-500 font-inter">{subtitle}</p>
      </div>
      <span className="text-[10px] font-bold text-[#0F8354] bg-[#E8F5E9] px-2 py-1 rounded-full whitespace-nowrap ml-2 border border-[#0F8354]/10">
        {metric}
      </span>
    </div>
  </motion.div>
);

// --- COMPONENTE PRINCIPAL ---

export function ProductDetailModal() {
  const {
    isProductModalOpen,
    closeProductModal,
    selectedProduct,
    openCheckout,
    openAuthModal,
  } = useUI();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<"impacto" | "trazabilidad">(
    "impacto"
  );
  const { isSignedIn } = useUser();

  const handleAddToCart = () => {
    if (selectedProduct) addToCart(selectedProduct);
    closeProductModal();
  };
  const handleBuyNow = () => {
    if (selectedProduct) addToCart(selectedProduct, false);
    closeProductModal();
    isSignedIn ? openCheckout() : openAuthModal();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeProductModal();
  };

  // Helpers de datos seguros
  const safeImage = selectedProduct?.imagen?.startsWith("http")
    ? selectedProduct.imagen
    : "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=800";

  const displayBadges = selectedProduct?.certificaciones?.length
    ? selectedProduct.certificaciones
    : ["Carbon Neutral", "B-Corp", "Plastic Free"];

  const safeMetrics = [
    {
      label: "Huella de Carbono",
      value: selectedProduct?.impactoAmbiental?.huellaCarbono || "0.5 kg CO₂",
    },
    { label: "Consumo de Agua", value: "60 litros" },
    {
      label: "Material Reciclable",
      value: selectedProduct?.impactoAmbiental?.materialesReciclables
        ? "100%"
        : "85%",
    },
    { label: "Origen", value: selectedProduct?.origen || "Australia" },
  ];

  const traceabilityData = [
    {
      title: "Origen",
      subtitle: "Recolección ética de materiales",
      metric: "0.5 kg",
      icon: MapPin,
    },
    {
      title: "Producción",
      subtitle: "Fábrica con energía solar",
      metric: "0.3 kg",
      icon: Factory,
    },
    {
      title: "Empaque",
      subtitle: "Cartón reciclado y biodegradable",
      metric: "0.1 kg",
      icon: Package,
    },
    {
      title: "Transporte",
      subtitle: "Logística compensada",
      metric: "0.2 kg",
      icon: Truck,
    },
    {
      title: "Tu Hogar",
      subtitle: "Entrega última milla",
      metric: "0.1 kg",
      icon: Home,
    },
  ];

  return (
    <AnimatePresence>
      {isProductModalOpen && selectedProduct && (
        <motion.div
          key="backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
          className={`fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/60 font-sans cursor-pointer ${inter.variable} ${righteous.variable}`}
        >
          <motion.div
            key="modal"
            variants={modalVariants}
            className="relative w-full max-w-[800px] bg-white sm:rounded-3xl shadow-2xl flex flex-col h-full sm:h-auto sm:max-h-[90vh] cursor-default overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* BOTÓN CERRAR */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeProductModal}
              className="absolute right-4 top-4 z-50 p-2 bg-white/80 backdrop-blur text-gray-400 hover:text-gray-900 hover:bg-white rounded-full shadow-sm border border-gray-100"
            >
              <X size={20} />
            </motion.button>

            {/* CONTENIDO SCROLLABLE */}
            <motion.div
              variants={contentContainerVariants}
              initial="hidden"
              animate="visible"
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar"
            >
              {/* 1. TOP SECTION */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
                <motion.div
                  variants={itemVariants}
                  className="w-full md:w-[380px] shrink-0"
                >
                  <div className="relative aspect-video bg-[#F7F7F8] rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center group">
                    <Image
                      src={safeImage}
                      alt={selectedProduct.nombre}
                      fill
                      className="object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </motion.div>

                <div className="flex-1 flex flex-col justify-center">
                  <motion.span
                    variants={itemVariants}
                    className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-3 font-inter block"
                  >
                    {selectedProduct.marca || "ECO COLLECTION"}
                  </motion.span>
                  <motion.h1
                    variants={itemVariants}
                    className="text-3xl md:text-4xl text-gray-900 leading-[1.1] mb-4 font-righteous"
                  >
                    {selectedProduct.nombre}
                  </motion.h1>
                  <motion.div variants={itemVariants} className="mb-5">
                    <p className="text-[#0F8354] text-4xl font-righteous">
                      ${selectedProduct.precio?.toLocaleString()}
                    </p>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap gap-2"
                  >
                    {displayBadges.map((badge: string, i: number) => (
                      <Badge key={i} text={badge} />
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* 2. DESCRIPTION */}
              <motion.div
                variants={itemVariants}
                className="mb-4 border-t border-gray-100 pt-6"
              >
                <p className="text-gray-600 text-base leading-relaxed font-inter">
                  {selectedProduct.descripcion ||
                    "Este producto ha sido cuidadosamente seleccionado por su bajo impacto ambiental."}
                </p>
              </motion.div>

              {/* 3. TABS SECTION */}
              <motion.div variants={itemVariants}>
                <div className="bg-gray-100 p-1.5 rounded-xl flex gap-1 mb-6 w-full max-w-md mx-auto">
                  <TabButton
                    active={activeTab === "impacto"}
                    label="Impacto Ambiental"
                    onClick={() => setActiveTab("impacto")}
                  />
                  <TabButton
                    active={activeTab === "trazabilidad"}
                    label="Trazabilidad"
                    onClick={() => setActiveTab("trazabilidad")}
                  />
                </div>

                <div className="min-h-[200px]">
                  <AnimatePresence mode="wait">
                    {activeTab === "impacto" ? (
                      <motion.div
                        key="impacto"
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="bg-[#E8F5E9] rounded-2xl p-6 mb-4 border border-[#0F8354]/10 shadow-sm">
                          <h3 className="text-[#1A1A1B] text-base mb-4 font-righteous tracking-wide">
                            Métricas ambientales
                          </h3>
                          <div className="space-y-0.5">
                            {safeMetrics.map((m, i) => (
                              <MetricRow
                                key={i}
                                index={i}
                                label={m.label}
                                value={m.value}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="bg-[#E3F2FD] rounded-xl p-4 flex gap-3 border border-blue-100 items-start">
                          <Info
                            className="text-[#1976D2] shrink-0 mt-0.5"
                            size={18}
                          />
                          <p className="text-[#1565C0] text-sm leading-relaxed font-inter font-medium">
                            Este producto ahorra aprox.{" "}
                            <strong className="font-bold">0.5 kg CO₂</strong>.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="trazabilidad"
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="pt-2 px-1"
                      >
                        {traceabilityData.map((item, i) => (
                          <TimelineItem
                            key={i}
                            index={i}
                            {...item}
                            isLast={i === traceabilityData.length - 1}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* FOOTER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-3 shrink-0 z-20 shadow-[0_-5px_30px_rgba(0,0,0,0.03)] rounded-b-3xl"
            >
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-[#0F8354] hover:bg-[#0B6742] text-white text-base rounded-xl shadow-lg shadow-green-900/10 transition-all active:scale-[0.98] font-righteous tracking-wide"
              >
                Añadir al carrito
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 h-14 bg-[#1A1A1B] hover:bg-black text-white text-base rounded-xl shadow-lg transition-all active:scale-[0.98] font-righteous tracking-wide"
              >
                Proceder al pago
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
