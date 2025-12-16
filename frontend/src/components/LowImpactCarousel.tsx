"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useInView,
  Variants,
} from "framer-motion";
import { Righteous, Inter } from "next/font/google";
import { ChevronLeft, ChevronRight, ShoppingCart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import type { Product } from "./ProductList";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

// --- SKELETON ---
const CarouselSkeleton = () => (
  <section className={`w-full bg-white py-12 md:py-20 overflow-hidden ${inter.variable} ${righteous.variable}`}>
    <div className="container mx-auto px-4 xl:px-0">
      <div className="mb-10 flex flex-col md:flex-row gap-6 items-start md:pl-6 animate-pulse">
        <div className="flex items-center gap-2 shrink-0">
           {[...Array(9)].map((_, i) => (
             <div key={i} className="h-5 w-5 rounded-full bg-gray-200" />
           ))}
        </div>
        <div className="w-full space-y-4">
           <div className="h-10 md:h-12 w-3/4 max-w-xl bg-gray-200 rounded-xl" />
           <div className="h-6 md:h-8 w-1/2 max-w-md bg-gray-200 rounded-lg" />
        </div>
      </div>
      <div className="relative w-full h-[720px] md:h-[600px] rounded-[32px] md:rounded-[40px] bg-gray-100 overflow-hidden shadow-sm animate-pulse">
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-8 space-y-6">
           <div className="h-10 w-2/3 bg-gray-300 rounded-2xl" />
           <div className="h-6 w-full max-w-sm bg-gray-300 rounded-lg" />
           <div className="h-14 w-full md:w-64 bg-gray-300 rounded-2xl" />
        </div>
      </div>
    </div>
  </section>
);

// --- ANIMATED STATS ---
interface AnimatedStatProps {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

const AnimatedStat = ({ value, suffix, label, decimals = 0 }: AnimatedStatProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { bounce: 0, duration: 2500 });
  const display = useTransform(spring, (current) => current.toFixed(decimals));

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  return (
    <div ref={ref} className="flex flex-col items-center p-6 md:p-8 group cursor-default transition-all duration-300 hover:bg-gray-50/80 rounded-2xl">
      <div className={`${righteous.className} text-4xl md:text-5xl lg:text-6xl text-[#0F8354] flex items-baseline transition-transform group-hover:scale-105 duration-500`}>
        <motion.span>{display}</motion.span>
        <span className="ml-1 text-2xl md:text-3xl lg:text-4xl opacity-80">{suffix}</span>
      </div>
      <span className={`text-gray-500 text-xs md:text-sm uppercase tracking-[0.2em] mt-3 font-bold ${inter.className} text-center`}>
        {label}
      </span>
    </div>
  );
};

// --- VARIANTS ---
const slideVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, scale: 1.15, zIndex: 1 }),
  center: {
    opacity: 1,
    scale: 1,
    zIndex: 1,
    transition: {
      opacity: { duration: 0.7, ease: "easeInOut" },
      scale: { duration: 8, ease: "linear" }, 
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    zIndex: 0,
    transition: { opacity: { duration: 0.7, ease: "easeInOut" } },
  }),
};

const textContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

// --- MAPPER ---
const mapToCarouselItem = (p: any) => {
  let displayBadges = p.certificaciones || [];
  if (p.ecoBadge?.includes("impacto")) {
    displayBadges = [p.ecoBadge.replace("_", " ").toUpperCase(), ...displayBadges];
  }
  displayBadges = displayBadges.slice(0, 3);

  const safeImage = p.imagenUrl?.startsWith("http")
      ? p.imagenUrl
      : "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=1600&q=90";

  return {
    display: {
      id: p.productoId,
      brand: p.nombreMarca || "EcoShop",
      name: p.nombre,
      description: p.descripcion,
      price: p.precio,
      co2: `${p.huellaCarbonoTotal || 0} kg CO₂`,
      badges: displayBadges,
      image: safeImage,
    },
    originalProduct: {
      id: p.productoId,
      nombre: p.nombre,
      marca: p.nombreMarca || "EcoShop",
      precio: p.precio,
      categoria: "Varios",
      impactoAmbiental: {
        huellaCarbono: `${p.huellaCarbonoTotal || 0} kg CO₂`,
        materialesReciclables: p.porcentajeReciclable > 0,
        nivel: p.ecoBadge === "bajo_impacto" ? "Bajo impacto" : "Medio impacto",
      },
      imagen: safeImage,
      certificaciones: p.certificaciones || [],
    } as Product,
  };
};

// --- MAIN COMPONENT ---
export function LowImpactCarousel() {
  const { addToCart } = useCart();
  const { openProductModal } = useUI();

  const [products, setProducts] = useState<any[]>([]);
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data: any = await api.products.getAll(1, 5, { impacto: "low" });
        const content = data?.productos || [];
        if (content.length > 0) {
          setProducts(content.map(mapToCarouselItem));
        }
      } catch (e) {
        console.error("Error carousel:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const paginate = useCallback((newDirection: number) => {
    setCurrentIndex(prev => {
      const nextIndex = (prev[0] + newDirection + products.length) % products.length;
      return [nextIndex, newDirection];
    });
  }, [products.length]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex([index, index > currentIndex ? 1 : -1]);
  };

  useEffect(() => {
    if (isPaused || products.length === 0) return;
    timeoutRef.current = setTimeout(() => paginate(1), 6000); // 6 segundos
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [currentIndex, isPaused, paginate, products.length]);

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -10000) paginate(1);
    else if (swipe > 10000) paginate(-1);
    setIsPaused(false);
  };

  if (loading) return <CarouselSkeleton />;
  if (products.length === 0) return null;

  const { display, originalProduct } = products[currentIndex];

  return (
    <section className={`w-full bg-white py-12 md:py-20 overflow-hidden ${inter.variable} ${righteous.variable}`}>
      <div className="container mx-auto px-4 xl:px-0">
        
        {/* HEADER  */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row gap-4 md:gap-10 items-start md:pl-10">
          <div className="flex items-center pt-2 gap-2 shrink-0">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-[20px] w-[20px] md:h-[25px] md:w-[25px] rounded-full"
                style={{ backgroundColor: `rgba(15, 131, 84, ${0.1 + i * 0.11})` }}
              />
            ))}
          </div>
          <div>
            <h2 className="mb-2 md:mb-4 font-righteous text-3xl md:text-5xl text-gray-900 leading-tight text-balance">
              Productos con <span className="text-[#0F8354]">Menor Huella</span>
            </h2>
            <p className="max-w-4xl text-lg md:text-2xl text-gray-600 font-sans text-pretty font-regular">
              Descubre nuestra selección curada de productos diseñados para un futuro sostenible.
            </p>
          </div>
        </div>

   
        <div
          className="relative w-full h-[720px] md:h-[600px] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] group/carousel bg-gray-900 border border-gray-100/10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing will-change-transform"
            >
              <Image
                src={display.image}
                alt={display.name}
                fill
                className="object-cover"
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1600px"
                unoptimized={display.image.includes("ibb.co")}
              />
              
              {/* GRADIENTS  */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-60 md:opacity-40" />
              
              {/* CONTENT OVERLAY */}
              <div className="absolute inset-0 flex flex-col justify-end pointer-events-none pb-12 px-6 md:pb-14 md:px-12 lg:pb-16 lg:px-20">
                <motion.div
                  className="w-full md:max-w-3xl lg:max-w-4xl space-y-4 pointer-events-auto"
                  variants={textContainerVariants}
                  initial="hidden"
                  animate="show"
                  key={`text-${currentIndex}`}
                >
                  {/* TAGS */}
                  <motion.div variants={textItemVariants} className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center bg-[#0F8354] text-white px-3 py-1 rounded-full font-bold text-[11px] md:text-xs uppercase tracking-wider shadow-lg shadow-[#0F8354]/20 backdrop-blur-md">
                      {display.co2} Ahorrado
                    </span>
                    <span className="text-white/80 text-[11px] md:text-xs uppercase tracking-[0.25em] font-bold drop-shadow-md font-sans border-l border-white/30 pl-3">
                      {display.brand}
                    </span>
                  </motion.div>

                  {/* TITLE & DESC 
                  */}
                  <div className="space-y-2 md:space-y-3">
                    <motion.h2
                      variants={textItemVariants}
                      className="font-righteous text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] drop-shadow-xl text-balance max-w-full"
                    >
                      {display.name}
                    </motion.h2>
                    <motion.p
                      variants={textItemVariants}
                      className="text-gray-200 text-sm md:text-base lg:text-lg font-sans font-medium leading-relaxed max-w-xl md:max-w-2xl drop-shadow-md line-clamp-2 opacity-90"
                    >
                      {display.description}
                    </motion.p>
                  </div>

                  {/* BADGES */}
                  <motion.div variants={textItemVariants} className="flex flex-wrap gap-2">
                    {display.badges.map((badge: string, idx: number) => (
                      <span key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 text-white/90 px-3 py-1 rounded-md text-[10px] md:text-xs uppercase tracking-wider font-semibold shadow-sm font-sans hover:bg-white/10 transition-colors cursor-default">
                        {badge}
                      </span>
                    ))}
                  </motion.div>

                  {/* PRICE & BUTTONS */}
                  <motion.div 
                    variants={textItemVariants} 
                    className="pt-4 md:pt-6 flex flex-col lg:flex-row lg:items-end gap-5 lg:gap-8 pb-2"
                  >
                    <div>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1 ml-1">Precio</p>
                        <p className="text-4xl md:text-5xl font-righteous text-white drop-shadow-lg leading-none">
                            ${display.price.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto lg:ml-auto">
                      <Button
                        onClick={() => addToCart(originalProduct)}
                        className="h-14 md:h-16 px-6 md:px-10 bg-[#0F8354] hover:bg-[#0a633e] text-white rounded-xl font-righteous text-base md:text-lg shadow-xl hover:shadow-[#0F8354]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <ShoppingCart size={20} /> Añadir al carrito
                      </Button>

                      <Button
                        onClick={() => openProductModal(originalProduct)}
                        variant="outline"
                        className="h-14 md:h-16 px-6 md:px-10 bg-white/5 border-white/20 text-white hover:bg-white hover:text-black hover:border-white rounded-xl font-righteous text-base md:text-lg backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto hover:-translate-y-0.5"
                      >
                        <Info size={20} /> Ver Detalles
                      </Button>
                    </div>
                  </motion.div>

                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ARROWS */}
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 flex justify-between px-4 md:px-6 pointer-events-none z-30">
            <button
              onClick={() => paginate(-1)}
              className="hidden md:flex bg-black/20 hover:bg-black/50 backdrop-blur-md text-white p-3 rounded-full transition-all hover:scale-110 pointer-events-auto border border-white/10 group"
            >
              <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="hidden md:flex bg-black/20 hover:bg-black/50 backdrop-blur-md text-white p-3 rounded-full transition-all hover:scale-110 pointer-events-auto border border-white/10 group"
            >
              <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* DOTS */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 z-30 flex gap-2">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-500 ease-out backdrop-blur-md shadow-sm border border-transparent",
                  idx === currentIndex
                    ? "w-8 bg-[#0F8354]"
                    : "w-2 bg-white/30 hover:bg-white/60 hover:border-white/20"
                )}
                aria-label={`Ir a diapositiva ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* --- STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mt-12 md:mt-20 pt-8 border-t border-gray-100">
          <AnimatedStat value={products.length} suffix="+" label="Productos Curados" />
          <AnimatedStat value={1.8} decimals={1} suffix="kg" label="CO₂ Evitado (Promedio)" />
          <AnimatedStat value={100} suffix="%" label="Calidad Garantizada" />
        </div>
      </div>
    </section>
  );
}