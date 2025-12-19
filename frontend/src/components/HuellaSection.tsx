"use client";

import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Award } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Righteous, Inter } from "next/font/google";
import clsx from "clsx";

// --- FUENTES ---
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

// --- DATOS ---
const cardsData = [
  {
    id: 1,
    title: "¿Qué es la huella de carbono?",
    desc: "Es la cantidad total de gases de efecto invernadero emitidos durante el ciclo de vida de un producto, desde su fabricación hasta su disposición final.",
    badge: "2.3kg CO₂ promedio",
    icon: Leaf,
    image: "/huella1-image.svg",
    color: "text-[#0F8354]",
    bgBadge: "bg-[#0F8354]/10",
    borderHover: "hover:border-[#0F8354]/30",
  },
  {
    id: 2,
    title: "Ciclo de Vida Circular",
    desc: "Analizamos cada etapa: desde la extracción de materias primas éticas hasta su reciclaje final, asegurando un retorno positivo al ecosistema.",
    badge: "70% menos emisiones",
    icon: Recycle,
    image: "/huella2-image.svg",
    color: "text-[#006CFF]",
    bgBadge: "bg-[#006CFF]/10",
    borderHover: "hover:border-[#006CFF]/30",
  },
  {
    id: 3,
    title: "Certificaciones Globales",
    desc: "No solo lo decimos nosotros. Sellos internacionales validan científicamente el compromiso ambiental de cada marca en nuestro catálogo.",
    badge: "+7 certificaciones",
    icon: Award,
    image: "/huella3-image.svg",
    color: "text-[#ED6E12]",
    bgBadge: "bg-[#ED6E12]/10",
    borderHover: "hover:border-[#ED6E12]/30",
  },
];

// --- ANIMACIONES ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 40, damping: 15 },
  },
};

export default function HuellaSection() {
  const router = useRouter();

  const handleVerProductos = () => {
    const productosSection = document.getElementById("productos");
    if (productosSection) {
      productosSection.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#productos");
    }
  };

  return (
    <section
      className={`w-full bg-white py-20 md:py-32 overflow-hidden ${inter.variable} ${righteous.variable}`}
    >
      {/* --- HEADER --- */}
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          
          {/* PUNTITOS */}
          <div className="flex items-center gap-2 shrink-0 mt-1.5 md:mt-3">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-[20px] w-[20px] md:h-[25px] md:w-[25px] rounded-full"
                style={{ backgroundColor: `rgba(15, 131, 84, ${0.1 + i * 0.11})` }}
              />
            ))}
          </div>

          {/* TEXTO */}
          <div>
            <h2 className="mb-4 font-righteous text-3xl md:text-5xl lg:text-6xl text-[#1A1A1B] leading-[1.1] text-balance">
              Entiende tu Huella y <span className="text-[#0F8354]">Aprende</span>
            </h2>
          </div>
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative">
          
          {/* COLUMNA IZQUIERD CARDS */}
          <motion.div
            className="flex flex-col gap-6 w-full lg:w-1/2 relative z-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {cardsData.map((card) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                className={clsx(
                  "group relative overflow-hidden rounded-[32px] bg-white p-6 md:p-8",
                  "border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
                  "hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500",
                  card.borderHover
                )}
              >
           
                <div className="absolute right-6 top-6 z-20 opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={clsx("rounded-2xl p-3", card.bgBadge)}>
                    <card.icon
                      className={clsx("h-6 w-6 md:h-7 md:w-7", card.color)}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center sm:items-start relative z-10">
                  {/* IMAGEN */}
                  <div className="shrink-0 relative group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent rounded-full opacity-50 blur-xl" />
                    <Image
                      src={card.image}
                      width={160}
                      height={160}
                      alt={card.title}
                      className="h-32 w-32 md:h-40 md:w-40 object-contain relative z-10 drop-shadow-sm"
                    />
                  </div>

                  {/* Texto */}
                  <div className="flex-1 text-center sm:text-left">
                  
                    <h3 className="mb-3 text-2xl font-righteous text-[#1A1A1B] group-hover:text-[#0F8354] transition-colors pr-0 sm:pr-14">
                      {card.title}
                    </h3>
                    <p className="mb-5 text-gray-500 font-sans text-sm md:text-base leading-relaxed text-pretty">
                      {card.desc}
                    </p>
                    <div
                      className={clsx(
                        "inline-flex items-center px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider",
                        card.bgBadge,
                        card.color
                      )}
                    >
                      {card.badge}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* COLUMNA DERECHA*/}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F8354]/10 to-transparent rounded-full blur-[100px] -z-10" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative w-full max-w-[600px]"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/huella-foot.png"
                  width={846}
                  height={546}
                  alt="Huella de carbono verde"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-10 lg:mt-0 relative z-20"
            >
              <Button
                size="lg"
                onClick={handleVerProductos}
                className="h-auto py-4 px-10 bg-white border-[3px] border-[#0F8354] text-[#0F8354] hover:bg-[#0F8354] hover:text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <span className="font-righteous text-xl md:text-2xl tracking-wide">
                  Ver productos de Bajo Consumo
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
