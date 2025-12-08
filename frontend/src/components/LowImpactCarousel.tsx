"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useInView,
  Variants, // <--- 1. IMPORTANTE: Agregamos esto
} from "framer-motion";
import { Righteous, Inter } from "next/font/google";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

export const products = [
  {
    id: 1,
    brand: "LUSH",
    name: "Shampoo Sólido Citrus Burst",
    description:
      "Champú sólido con aceites esenciales cítricos y base vegetal. Dura hasta 90 lavados y reemplaza dos botellas plásticas. Ideal para cabello normal a graso.",
    price: 22.9,
    co2: "0.38 kg CO₂",
    badges: ["Zero Waste", "Vegano", "Cruelty-Free"],
    image: "/img/products/23.png",
  },
  {
    id: 2,
    brand: "LUSH",
    name: "Soft Bloom Bar Hidratante",
    description:
      "Barra sólida hidratante con aceites prensados en frío y pétalos micronizados. Libre de sulfatos y envases plásticos. Para uso diario en manos y cuerpo.",
    price: 9.9,
    co2: "0.25 kg CO₂",
    badges: ["Zero Waste", "Natural", "Cruelty-Free"],
    image: "/img/products/2.png",
  },
  {
    id: 3,
    brand: "Who Gives A Crap",
    name: "Papel Higiénico 100% Bambú",
    description:
      "Fabricado exclusivamente con bambú sostenible. Libre de tintas cloradas y empaquetado sin plástico. Certificado para bajo impacto ambiental.",
    price: 1.5,
    co2: "0.12 kg CO₂",
    badges: ["Bambú", "Sin Plástico", "Bajo Impacto"],
    image: "/img/products/3.png",
  },
  {
    id: 4,
    brand: "S’well",
    name: "Botella Reutilizable 500ml",
    description:
      "Botella térmica de acero inoxidable 18/8 de triple capa. Mantiene frío 24h y calor 12h. Diseñada para eliminar botellas desechables.",
    price: 39.0,
    co2: "0.65 kg CO₂",
    badges: ["Reutilizable", "Sin BPA", "Acero Inox"],
    image: "/img/products/4.png",
  },
  {
    id: 5,
    brand: "Allbirds",
    name: "Tree Runners Eucalipto",
    description:
      "Zapatillas ultralivianas de fibra de eucalipto FSC. Suela SweetFoam™ de caña de azúcar. Transpirables, frescas y carbono neutrales.",
    price: 98.0,
    co2: "1.19 kg CO₂",
    badges: ["Carbon Neutral", "Materiales Naturales"],
    image: "/img/products/5.png",
  },
];

interface AnimatedStatProps {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

const AnimatedStat = ({ value, suffix, label, decimals = 0 }: AnimatedStatProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => current.toFixed(decimals));

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  return (
    <div ref={ref} className="flex flex-col items-center p-4 group">
      <div
        className={`${righteous.className} text-4xl md:text-5xl text-[#0F8354] flex items-baseline transition-transform group-hover:scale-110 duration-300`}
      >
        <motion.span>{display}</motion.span>
        <span className="ml-1 text-3xl md:text-4xl">{suffix}</span>
      </div>
      <span
        className={`text-gray-500 text-sm md:text-base mt-2 font-medium ${inter.className}`}
      >
        {label}
      </span>
    </div>
  );
};

// <--- 2. Typamos esto como Variants para que TS entienda "spring"
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    scale: 1.1,
    opacity: 0,
    zIndex: 0,
  }),
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    zIndex: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.5 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    scale: 0.95,
    opacity: 0,
    zIndex: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.4 },
    },
  }),
};

// <--- 3. Typamos esto también
const textContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// <--- 4. Y esto
const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function LowImpactCarousel() {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getIndex = useCallback((index: number) => {
    return (index + products.length) % products.length;
  }, []);

  const paginate = useCallback(
    (newDirection: number) => {
      setCurrentIndex([getIndex(currentIndex + newDirection), newDirection]);
    },
    [currentIndex, getIndex]
  );

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex([index, index > currentIndex ? 1 : -1]);
  };

  useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = setTimeout(() => paginate(1), 6000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused, paginate]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) paginate(1);
    else if (swipe > swipeConfidenceThreshold) paginate(-1);
    setIsPaused(false);
  };

  const currentProduct = products[currentIndex];

  return (
    <section
      className={`w-full bg-white py-10 md:py-16 overflow-hidden ${inter.variable} ${righteous.variable}`}
    >
      <div className="container mx-auto px-4 xl:px-0">
        
        {/* === HEADER CON PUNTITOS === */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 md:gap-10 items-start pl-8 md:pl-10">
          
          {/* PUNTITOS DECORATIVOS */}
          <div className="flex items-start pt-3 gap-2 shrink-0">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-[25px] w-[25px] rounded-full shrink-0"
                style={{
                  backgroundColor: `rgba(16, 185, 129, ${0.2 + i * 0.1})`,
                }}
              />
            ))}
          </div>

          {/* TEXTO DEL HEADER */}
          <div>
            <h2 className="mb-4 font-righteous text-4xl md:text-5xl text-gray-900 leading-tight text-balance">
              Productos con <span className="text-[#0F8354]">Menor Huella</span>
            </h2>
            <p className="max-w-4xl text-xl md:text-2xl text-gray-600 font-sans text-pretty font-regular">
              Descubre nuestra selección curada de productos diseñados para un
              futuro sostenible, sin comprometer la calidad.
            </p>
          </div>
        </div>

        {/* === CAROUSEL CONTAINER === */}
        <div
          className="relative w-full h-[550px] md:h-[500px] lg:h-[550px]
                      rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group/carousel bg-gray-900"
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
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing will-change-transform"
            >
              <Image
                src={currentProduct.image}
                alt={currentProduct.name}
                fill
                className="object-cover"
                priority={true}
                sizes="(max-width: 768px) 100vw, 85vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />

              <div className="absolute inset-0 flex flex-col justify-end pointer-events-none pb-20 md:pb-16 px-14 md:px-24 lg:px-28">
                <motion.div
                  className="max-w-4xl space-y-4 md:space-y-6 pointer-events-auto"
                  variants={textContainerVariants}
                  initial="hidden"
                  animate="show"
                  key={`text-${currentIndex}`}
                >
                  <motion.div
                    variants={textItemVariants}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <span className="inline-block bg-[#0F8354] text-white px-3 py-1 rounded-full font-bold text-sm tracking-wider shadow-sm">
                      {currentProduct.co2}
                    </span>
                    <span className="text-gray-300 text-sm uppercase tracking-[0.2em] font-bold drop-shadow-sm font-sans">
                      {currentProduct.brand}
                    </span>
                  </motion.div>

                  <motion.h2
                    variants={textItemVariants}
                    className="font-righteous text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1] drop-shadow-xl text-balance"
                  >
                    {currentProduct.name}
                  </motion.h2>

                  <motion.p
                    variants={textItemVariants}
                    className="text-gray-200 text-base md:text-xl font-sans font-medium leading-relaxed max-w-2xl drop-shadow-md"
                  >
                    {currentProduct.description}
                  </motion.p>

                  <motion.div
                    variants={textItemVariants}
                    className="flex flex-wrap gap-2 pt-2"
                  >
                    {currentProduct.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-md text-xs uppercase tracking-wider font-semibold shadow-sm font-sans"
                      >
                        {badge}
                      </span>
                    ))}
                  </motion.div>

                  <motion.div
                    variants={textItemVariants}
                    className="pt-6 flex flex-col xl:flex-row xl:items-center gap-6"
                  >
                    <div className="text-4xl md:text-5xl font-righteous text-white drop-shadow-lg">
                      ${currentProduct.price.toFixed(2)}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      <Button className="font-righteous bg-[#0F8354] hover:bg-[#0a633e] text-white h-14 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-[#0F8354]/40 hover:-translate-y-1 flex items-center justify-center gap-2 flex-1 sm:flex-none">
                        <ShoppingCart className="h-5 w-5" />
                        Añadir al carrito
                      </Button>
                      <Button className="font-righteous bg-white text-black hover:bg-gray-100 h-14 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 flex-1 sm:flex-none">
                        Ver todos los productos
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 flex justify-between p-2 md:p-4 pointer-events-none z-20">
            <button
              onClick={() => paginate(-1)}
              className="bg-black/20 hover:bg-black/50 backdrop-blur-md text-white p-2 md:p-3 rounded-full transition-all hover:scale-110 pointer-events-auto border border-white/10"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </button>

            <button
              onClick={() => paginate(1)}
              className="bg-black/20 hover:bg-black/50 backdrop-blur-md text-white p-2 md:p-3 rounded-full transition-all hover:scale-110 pointer-events-auto border border-white/10"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8 z-20">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                idx === currentIndex
                  ? "bg-[#0F8354] w-8"
                  : "bg-gray-300 w-2.5 hover:bg-[#0F8354]/60"
              }`}
              aria-label={`Ir a diapositiva ${idx + 1}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200/50 border-t border-gray-200/50 pt-12">
          <AnimatedStat value={6} suffix="" label="Productos destacados" />
          <AnimatedStat
            value={1.8}
            decimals={1}
            suffix="kg"
            label="CO₂ evitado promedio"
          />
          <AnimatedStat value={81} suffix="%" label="Materiales reciclables" />
        </div>
      </div>
    </section>
  );
}