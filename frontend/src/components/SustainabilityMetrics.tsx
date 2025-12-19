"use client";

import React, { useEffect, useRef } from "react";
import { Leaf, Globe, Droplets } from "lucide-react";
import { Righteous, Inter } from "next/font/google";
import {
  motion,
  useSpring,
  useTransform,
  useInView,
  Variants,
} from "framer-motion";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 },
  },
};

export function SustainabilityMetrics() {
  return (
    <section
      className={`w-full bg-white py-12 md:py-20 overflow-hidden ${inter.variable} ${righteous.variable}`}
    >
      {/* --- HEADER  --- */}
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          {/* PUNTITOS */}
          <div className="flex items-center gap-2 shrink-0 mt-1.5 md:mt-3">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-[20px] w-[20px] md:h-[25px] md:w-[25px] rounded-full"
                style={{
                  backgroundColor: `rgba(15, 131, 84, ${0.1 + i * 0.11})`,
                }}
              />
            ))}
          </div>

          {/* TEXTO */}
          <div>
            <h2 className="mb-4 font-righteous text-3xl md:text-5xl lg:text-6xl text-[#1A1A1B] leading-[1.1] text-balance">
              Datos Reales, <span className="text-[#0F8354]">Impacto Real</span>
            </h2>
            <p className="max-w-3xl text-lg md:text-xl font-sans text-gray-500 font-medium leading-relaxed text-pretty">
              Métricas basadas en productos verificados, con datos transparentes
              sobre emisiones, origen y uso de recursos.
            </p>
          </div>
        </div>

        {/* CARDS */}
        <motion.div
          className="grid gap-8 grid-cols-1 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={cardVariants}>
            <MetricCard
              icon={Leaf}
              title="100% Transparente"
              description="Huella de carbono medida y verificada en cada producto."
              number={6.7}
              decimals={1}
              suffix=" kg CO₂"
              footer="Promedio por producto"
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <MetricCard
              icon={Globe}
              title="Origen Verificado"
              description="Seguimos el origen y la distancia recorrida por cada producto."
              number={6}
              decimals={0}
              suffix=""
              footer="Productos de bajo impacto"
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <MetricCard
              icon={Droplets}
              title="Consumo de Agua"
              description="Registro del consumo hídrico durante toda la producción."
              number={158}
              decimals={0}
              suffix="L"
              footer="Promedio por producto"
            />
          </motion.div>
        </motion.div>

        {/* BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 md:mt-24"
        >
          <div className="relative border border-[#0F8354] bg-white rounded-none md:rounded-full p-8 md:p-10 text-center shadow-[0_10px_40px_rgba(15,131,84,0.05)] hover:shadow-[0_20px_60px_rgba(15,131,84,0.1)] transition-all duration-500">
            <p className="text-xl md:text-2xl text-[#1A1A1B] font-sans font-light leading-relaxed max-w-5xl mx-auto">
              Cada marca en{" "}
              <span className="font-righteous text-[#0F8354] font-bold">
                EcoShop
              </span>{" "}
              cumplen con estándares de transparencia y compromiso ambiental
              verificable.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface MetricCardProps {
  title: string;
  description: string;
  number: number;
  decimals?: number;
  suffix?: string;
  footer: string;
  icon: React.ElementType;
}
function MetricCard({
  title,
  description,
  number,
  decimals = 0,
  suffix = "",
  footer,
  icon: Icon,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { bounce: 0, duration: 2500 });
  const display = useTransform(spring, (current) => current.toFixed(decimals));
  useEffect(() => {
    if (isInView) spring.set(number);
  }, [isInView, number, spring]);
  return (
    <div
      ref={ref}
      className="group flex flex-col justify-between h-full bg-white rounded-[24px] p-8 border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-[#0F8354]/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
    >
      <div className="absolute -right-4 -top-4 text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <Icon size={140} />
      </div>
      <div className="relative z-10">
        <div className="mb-6 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#0F8354]/10 text-[#0F8354]">
          <Icon size={28} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-righteous text-[#1A1A1B] mb-3 tracking-wide">
          {title}
        </h3>
        <p className="text-gray-500 font-sans leading-relaxed text-base mb-6 min-h-[48px]">
          {description}
        </p>
      </div>
      <div className="w-full h-px bg-gray-100 mb-6 group-hover:bg-[#0F8354]/20 transition-colors duration-500" />
      <div className="relative z-10">
        <div className="flex items-baseline text-[#0F8354]">
          <motion.span className="text-4xl md:text-5xl font-bold font-righteous">
            {display}
          </motion.span>
          <span className="text-xl md:text-2xl font-medium text-gray-400 ml-1 font-righteous">
            {suffix}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-400 mt-2 font-inter">
          {footer}
        </p>
      </div>
    </div>
  );
}
