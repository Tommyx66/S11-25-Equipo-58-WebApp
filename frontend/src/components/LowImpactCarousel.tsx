"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Righteous, Inter } from "next/font/google";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import clsx from "clsx";
import type { Product } from "./ProductList";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

// --- SKELETON ---
const CarouselSkeleton = () => (
  <section className={`w-full bg-white py-20 md:py-32 overflow-hidden ${inter.variable} ${righteous.variable}`}>
    <div className="container mx-auto px-6 md:px-12">
      <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-6 md:gap-10 items-start animate-pulse">
        <div className="flex items-center gap-2 shrink-0 mt-1.5 md:mt-3">
           {[...Array(9)].map((_, i) => (
             <div key={i} className="h-[20px] w-[20px] md:h-[25px] md:w-[25px] rounded-full bg-gray-200" />
           ))}
        </div>
        <div className="w-full space-y-4">
           <div className="h-10 md:h-16 w-3/4 max-w-xl bg-gray-200 rounded-xl" />
           <div className="h-6 md:h-8 w-1/2 max-w-md bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>

    <div className="w-full max-w-[1800px] mx-auto px-0 md:px-4">
      <div className="relative w-full h-[80vh] min-h-[500px] md:h-[550px] rounded-[32px] md:rounded-[40px] bg-gray-100 overflow-hidden shadow-sm animate-pulse border border-gray-200">
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-8 space-y-6 md:p-20">
           <div className="h-10 w-2/3 bg-gray-300 rounded-2xl" />
           <div className="h-6 w-full max-w-sm bg-gray-300 rounded-lg" />
           <div className="h-14 w-full md:w-64 bg-gray-300 rounded-2xl" />
        </div>
      </div>
    </div>
  </section>
);

// --- MAPPER ---
const mapToCarouselItem = (p: any) => {
  const safeImage = p.imagenUrl?.startsWith("http")
    ? p.imagenUrl
    : "https://images.unsplash.com/photo-1617957770621-071a30cd6fab?q=80&w=2574&auto=format&fit=crop";

  return {
    display: {
      id: p.productoId,
      brand: p.nombreMarca || "EcoSelection",
      name: p.nombre,
      description: p.descripcion,
      price: p.precio,
      co2: p.huellaCarbonoTotal || 0.4,
      image: safeImage,
      tags: p.certificaciones?.length ? p.certificaciones : ["Bajo Impacto", "Empresa B"],
    },
    originalProduct: { ...p, imagen: safeImage } as Product,
  };
};

// --- COMPONENTE PRINCIPAL ---
export function LowImpactCarousel() {
  const { addToCart } = useCart();
  const { openProductModal } = useUI();
  const [products, setProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: any = await api.products.getAll(1, 5, { impacto: "low" });
        if (data?.productos?.length) {
          setProducts(data.productos.map(mapToCarouselItem));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0 || isHovered) return;
    autoplayRef.current = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [currentIndex, products.length, isHovered]);

  const paginate = useCallback(
    (newDirection: number) => {
      setCurrentIndex(
        (prev) => (prev + newDirection + products.length) % products.length
      );
    },
    [products.length]
  );

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;
  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) paginate(1);
    else if (swipe > swipeConfidenceThreshold) paginate(-1);
  };

  if (loading) return <CarouselSkeleton />;
  if (!products.length) return null;

  const current = products[currentIndex];
  const { display, originalProduct } = current;

  // --- ANIMACIONES  ---
  const imageVariants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 1.2, ease: "easeInOut" as const },
        scale: { duration: 8, ease: "linear" as const },
      },
    },
    exit: { opacity: 0, transition: { duration: 1.0, ease: "easeInOut" as const } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: 0.4 + custom * 0.15,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
    exit: {
      opacity: 0,
      y: -10,
      filter: "blur(5px)",
      transition: { duration: 0.4 },
    },
  };

  return (
    <section
      className={`w-full bg-white py-20 md:py-32 overflow-hidden ${inter.variable} ${righteous.variable}`}
    >
      {/* HEADER */}
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          <div className="flex items-center gap-2 shrink-0 mt-1.5 md:mt-3">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-[20px] w-[20px] md:h-[25px] md:w-[25px] rounded-full"
                style={{ backgroundColor: `rgba(15, 131, 84, ${0.1 + i * 0.11})` }}
              />
            ))}
          </div>
          <div>
            <h2 className="mb-4 font-righteous text-3xl md:text-5xl lg:text-6xl text-[#1A1A1B] leading-[1.1] text-balance">
              Productos con <span className="text-[#0F8354]">Menor Huella</span>
            </h2>
            <p className="max-w-3xl text-lg md:text-xl font-sans text-gray-500 font-medium leading-relaxed text-pretty">
              Descubre nuestra selección curada de productos diseñados para un futuro sostenible.
            </p>
          </div>
        </div>
      </div>

      {/* CARRUSEL */}
      <div className="w-full max-w-[1800px] mx-auto px-0 md:px-4">
        <div
          className="relative w-full h-[80vh] min-h-[500px] md:h-[550px] md:rounded-[40px] overflow-hidden shadow-2xl group bg-gray-900"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Flechas */}
          <button
            onClick={() => paginate(-1)}
            className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full items-center justify-center text-white/30 transition-all duration-500 opacity-0 group-hover:opacity-100 
                hover:text-white hover:bg-white/5 hover:backdrop-blur-md hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 border border-transparent hover:border-white/10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-12 h-12 drop-shadow-md" strokeWidth={1} />
          </button>

          <button
            onClick={() => paginate(1)}
            className="hidden md:flex absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full items-center justify-center text-white/30 transition-all duration-500 opacity-0 group-hover:opacity-100 
                hover:text-white hover:bg-white/5 hover:backdrop-blur-md hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 border border-transparent hover:border-white/10"
            aria-label="Siguiente"
          >
            <ChevronRight
              className="w-12 h-12 drop-shadow-md"
              strokeWidth={1}
            />
          </button>

          {/* Imagen Fondo */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full z-10"
            >
              <Image
                src={display.image}
                alt={display.name}
                fill
                priority
                className="object-cover pointer-events-none"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent md:hidden opacity-100 pointer-events-none" />
              <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 pointer-events-none" />
              <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent opacity-70 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Contenido Flotante */}
          <div className="absolute inset-0 flex flex-col justify-end md:justify-center md:items-start px-5 pb-20 md:px-20 md:pb-0 pointer-events-none z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentIndex}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="pointer-events-auto w-full md:max-w-[550px] lg:max-w-[600px] 
                                   bg-transparent md:backdrop-blur-xl md:bg-black/20 md:border md:border-white/10 
                                   p-0 md:p-8 rounded-none md:rounded-3xl"
              >
                {/* Tags & Badges */}
                <motion.div
                  custom={0}
                  variants={contentVariants}
                  className="flex flex-wrap items-center gap-2 mb-2 md:mb-4"
                >
                  <span className="bg-[#0F8354] text-white px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-lg">
                    {display.co2} kg CO₂
                  </span>
                  {display.tags.map((tag: string, i: number) => (
                     <span key={i} className="bg-white/10 backdrop-blur-md border border-white/20 text-white/90 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase">
                        {tag}
                     </span>
                  ))}
                  <span
                    className={`text-white/90 text-xs md:text-sm tracking-[0.2em] uppercase font-bold pl-2 ${righteous.className}`}
                  >
                    {display.brand}
                  </span>
                </motion.div>

                {/* Título */}
                <motion.h2
                  custom={1}
                  variants={contentVariants}
                  className={`text-3xl md:text-5xl lg:text-6xl text-white mb-2 md:mb-3 leading-[1] ${righteous.className} drop-shadow-lg text-balance`}
                >
                  {display.name}
                </motion.h2>

                {/* Descripción */}
                <motion.p
                  custom={2}
                  variants={contentVariants}
                  className="text-gray-200 text-sm md:text-lg leading-relaxed mb-4 md:mb-6 font-sans font-medium line-clamp-2 md:line-clamp-2 opacity-90 text-pretty"
                >
                  {display.description}
                </motion.p>

                {/* Precio y Botones */}
                <motion.div
                  custom={4}
                  variants={contentVariants}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 pt-2 md:pt-4 md:border-t md:border-white/10"
                >
                  <div>
                    <span className="text-gray-300 text-[10px] uppercase font-bold tracking-wider hidden md:block mb-1">
                      Precio
                    </span>
                    <span
                      className={`text-3xl md:text-5xl text-white ${righteous.className}`}
                    >
                      ${display.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-row gap-3 w-full md:w-auto mt-2 md:mt-0 md:ml-auto">
                    <Button
                      onClick={() => addToCart(originalProduct)}
                      className={`flex-1 md:flex-none h-12 md:h-14 px-4 md:px-8 bg-[#0F8354] hover:bg-[#0a633e] text-white rounded-xl shadow-lg transition-transform active:scale-95 text-xs sm:text-sm md:text-base ${righteous.className}`}
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      <span className="hidden sm:inline">
                        Añadir al carrito
                      </span>
                      <span className="sm:hidden">Añadir</span>
                    </Button>

                    <Button
                      onClick={() => openProductModal(originalProduct)}
                      variant="outline"
                      className={`flex-1 md:flex-none h-12 md:h-14 px-4 md:px-8 bg-white/10 border-white/20 text-white hover:bg-white hover:text-black rounded-xl backdrop-blur-md transition-colors text-xs sm:text-sm md:text-base ${righteous.className}`}
                    >
                      <Info size={18} className="mr-2" />
                      <span className="hidden sm:inline">Ver detalles</span>
                      <span className="sm:hidden">Detalles</span>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controles Puntos */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                }}
                className={clsx(
                  "h-1.5 md:h-2 rounded-full transition-all duration-500 shadow-sm",
                  idx === currentIndex
                    ? "w-8 md:w-10 bg-[#0F8354]"
                    : "w-2 md:w-2.5 bg-white/40 hover:bg-white/80"
                )}
                aria-label={`Ir a slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}