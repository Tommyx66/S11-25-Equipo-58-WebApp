'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useSpring, useTransform, useInView, PanInfo } from 'framer-motion'
import { Righteous } from 'next/font/google'
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
})

// === Estadísticas Animadas ===
const AnimatedStat = ({ value, suffix, label, decimals = 0 }: { value: number, suffix: string, label: string, decimals?: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const spring = useSpring(0, { bounce: 0, duration: 2500 }) // Animación más lenta y suave
  const display = useTransform(spring, (current) => current.toFixed(decimals))

  useEffect(() => {
    if (isInView) spring.set(value)
  }, [isInView, value, spring])

  return (
    <div ref={ref} className="flex flex-col items-center px-4 pt-6 md:pt-0 group">
      <div className={`${righteous.className} text-5xl md:text-6xl text-[#0F8354] flex items-baseline transition-transform group-hover:scale-105`}>
        <motion.span>{display}</motion.span>
        <span className="ml-1">{suffix}</span>
      </div>
      <span className="text-gray-500 text-lg font-sans mt-3 font-medium">{label}</span>
    </div>
  )
}

// === DATOS DE PRODUCTOS  ===
export const products = [
  {
    id: 1,
    brand: "LUSH",
    name: "Shampoo Sólido Citrus Burst – Limpieza vegana sin envase",
    description:
      "Champú sólido con aceites esenciales cítricos, manteca de cacao orgánica y base vegetal. Dura entre 70 y 90 lavados y reemplaza dos botellas plásticas convencionales. Ideal para cabello normal a graso.",
    price: 22.90,
    co2: "0.38 kg CO₂",
    badges: ["Zero Waste", "Vegano", "Cruelty-Free", "Hecho a mano"],
    image: "/img/products/23.png",
  },
  {
    id: 2,
    brand: "LUSH",
    name: "Soft Bloom Bar – Jabón sólido hidratante",
    description:
      "Barra sólida hidratante elaborada con aceites vegetales prensados en frío y pétalos micronizados. Libre de sulfatos y envases plásticos. Ideal para uso diario en manos y cuerpo.",
    price: 9.90,
    co2: "0.25 kg CO₂",
    badges: ["Zero Waste", "Ingredientes Naturales", "Cruelty-Free"],
    image: "/img/products/2.png",
  },
  {
    id: 3,
    brand: "Who Gives A Crap",
    name: "Toilet Paper Premium – 100% Bambú",
    description:
      "Papel higiénico fabricado exclusivamente con bambú cultivado de forma sostenible. Libre de tintas cloradas, empaquetado con papel reciclado y certificado para un bajo impacto ambiental en su ciclo de vida.",
    price: 1.50,
    co2: "0.12 kg CO₂",
    badges: ["Sustainable Bamboo", "Plastic-Free Packaging", "Low Impact"],
    image: "/img/products/3.png",
  },
  {
    id: 4,
    brand: "S’well",
    name: "Original Reusable Bottle 500ml – Acero Inoxidable",
    description:
      "Botella térmica de triple capa fabricada en acero inoxidable 18/8. Mantiene bebidas frías durante 24 h y calientes 12 h. Diseñada para disminuir el uso de botellas plásticas descartables.",
    price: 39.0,
    co2: "0.65 kg CO₂",
    badges: ["Reutilizable", "Libre de BPA", "Stainless Steel"],
    image: "/img/products/4.png",
  },
  {
    id: 5,
    brand: "Allbirds",
    name: "Tree Runners – Fibra de Eucalipto",
    description:
      "Zapatillas ultralivianas fabricadas con fibra de eucalipto procedente de cultivos certificados FSC. Suela SweetFoam™ proveniente de caña de azúcar renovable. Transpirables, frescas y con impacto neutro en carbono.",
    price: 98.0,
    co2: "1.19 kg CO₂",
    badges: ["Carbon Neutral", "Natural Materials", "FSC Certified"],
    image: "/img/products/5.png",
  },
];




const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 }
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 }
    }
  })
};


export function LowImpactCarousel() {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0])
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Función para calcular el índice de manera segura (circular)
  const getIndex = useCallback((index: number) => {
    return (index + products.length) % products.length
  }, [])

  // Navegación
  const paginate = useCallback((newDirection: number) => {
    setCurrentIndex([getIndex(currentIndex + newDirection), newDirection])
  }, [currentIndex, getIndex])

  const goToSlide = (index: number) => {
    setCurrentIndex([index, index > currentIndex ? 1 : -1])
  }

  // === AUTOPLAY  ===
  useEffect(() => {
    if (isPaused) return

    timeoutRef.current = setTimeout(() => {
      paginate(1)
    }, 5000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [currentIndex, isPaused, paginate])


  // === GESTOS  ===
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1); //   -> 
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1); //   <-
    }
  };


  const currentProduct = products[currentIndex]

  return (
    <section className="w-full bg-white py-5 overflow-hidden">
      <div className="container mx-auto px-4 md:px-0">

        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-15 animate-fade-in-up">
          <div className="flex gap-3">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`h-6 w-6 rounded-full transition-colors duration-500 ${i < 5 ? 'bg-[#0F8354]/30' : 'bg-[#0F8354]'}`}
              />
            ))}
          </div>
          <div>
            <h2 className={`${righteous.className} text-3xl md:text-5xl text-[#1A1A1B] mb-2`}>
              Productos con Menor Huella
            </h2>
            <p className="text-gray-600 font-sans text-2xl ">
              Descubre nuestros productos con el menor impacto ambiental            </p>
          </div>
        </div>

        {/* === CAROUSEL CONTAINER === */}
        <div
          className="relative w-full h-[750px] rounded-[32px] overflow-hidden shadow-2xl group/carousel  "
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          <AnimatePresence initial={false} custom={direction} mode='popLayout'>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              {/* IMAGEN DE FONDO */}
              <div className="relative w-full h-full">
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/carousel:scale-105"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* CONTENIDO OVERLAY */}
              <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center pointer-events-none">
                <div className="max-w-3xl space-y-7 pointer-events-auto">

                  {/* Badge CO2 y Marca */}
                  <div className="flex items-center gap-4 animate-fade-in-right delay-100">
                    <span className="inline-block bg-[#0F8354] text-white px-4 py-1.5 rounded-full font-medium text-sm tracking-wide shadow-sm">
                      {currentProduct.co2}
                    </span>
                    <h3 className="text-gray-300 text-sm uppercase tracking-[0.2em] font-semibold">
                      {currentProduct.brand}
                    </h3>
                  </div>

                  {/* Nombre */}
                  <h2 className={`${righteous.className} text-4xl md:text-5xl lg:text-6xl text-white leading-tight drop-shadow-lg animate-fade-in-right delay-200`}>
                    {currentProduct.name}
                  </h2>

                  {/* Descripción */}
                  <p className="text-gray-100 text-lg md:text-xl font-light leading-relaxed max-w-2xl drop-shadow-md animate-fade-in-right delay-300">
                    {currentProduct.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-3 animate-fade-in-right delay-400">
                    {currentProduct.badges.map((badge, idx) => (
                      <span key={idx} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-md text-xs uppercase tracking-wider font-medium shadow-sm">
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Precio y Botones */}
                  <div className="pt-4 animate-fade-in-right delay-500">
                    <div className=" text-4xl text-white mb-9 drop-shadow-lg">
                      ${currentProduct.price.toFixed(2)}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-8">
                      <Button
                        className={`${righteous.className} bg-[#0F8354] hover:bg-[#0a633e] text-white h-14 px-8 rounded-s text-3xl font-medium group transition-all duration-300 shadow-lg hover:shadow-[#0F8354]/30 hover:-translate-y-0.5"
                  `}>
                        <ShoppingCart className="mr-2 h-20 w-20 transition-transform group-hover:scale-1" />
                        Añadir al carrito
                      </Button>
                      <Button
                        className={`${righteous.className} bg-white hover:bg-[#0a633e] text-dark h-14 px-8 rounded-s text-3xl font-medium group transition-all duration-300 shadow-lg hover:shadow-[#0F8354]/30 hover:-translate-y-0.5"
                  `}>
                        Ver todos los productos
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* === FLECHAS DE NAVEGACIÓN  === */}
          <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => paginate(-1)}
              className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-all hover:scale-110 shadow-lg pointer-events-auto"
              aria-label="Anterior"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <button
              onClick={() => paginate(1)}
              className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-all hover:scale-110 shadow-lg pointer-events-auto"
              aria-label="Siguiente"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>

        </div>

        <div className="flex justify-center gap-3 mt-8 z-20">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-3 rounded-full transition-all duration-500 ease-out ${idx === currentIndex
                  ? 'bg-[#0F8354] w-10'
                  : 'bg-gray-300 w-3 hover:bg-[#0F8354]/50'
                }`}
              aria-label={`Ir a diapositiva ${idx + 1}`}
            />
          ))}
        </div>

        {/* === ESTADÍSTICAS ANIMADAS === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200/50 border-t border-gray-200/50 pt-12 animate-fade-in-up delay-300">
          <AnimatedStat value={6} suffix="" label="Productos con bajo impacto" />
          <AnimatedStat value={1.8} decimals={1} suffix="kg" label="CO₂ promedio" />
          <AnimatedStat value={81} suffix="%" label="Materiales reciclables" />
        </div>

      </div>
    </section>
  )
}