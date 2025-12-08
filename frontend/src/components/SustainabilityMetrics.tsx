"use client";

import React, { useEffect, useRef } from "react";
import { Leaf, Globe, Droplets } from "lucide-react";
import { Righteous, Inter } from "next/font/google";
import { motion, useSpring, useTransform, useInView } from "framer-motion";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

export function SustainabilityMetrics() {
  return (
    <section
      className={`w-full bg-white px-6 py-20 md:px-12 lg:px-24 ${inter.variable} ${righteous.variable}`}
    >
      <div className="mx-auto max-w-7xl">
        
        {/* === HEADER === */}
        {/* CORRECCIÓN: Eliminé 'pl-4 md:pl-6' porque la sección ya tiene px-6/px-12 */}
        <div className="mb-16 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          
          {/* PUNTITOS DECORATIVOS */}
          {/* CORRECCIÓN: Cambié pt-3 a pt-4 para igualar exactamente la sección Huella */}
          <div className="flex items-start pt-4 gap-2 shrink-0">
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
              Datos Reales, <span className="text-[#0F8354]">Impacto Real</span>
            </h2>
            <p className="max-w-4xl text-xl md:text-2xl text-gray-600 font-sans text-pretty font-regular">
              Métricas basadas en productos verificados, con datos transparentes
              sobre emisiones, origen y uso de recursos.
            </p>
          </div>
        </div>

        {/* ───────────────── CARDS GRID ───────────────── */}
        <div className="grid gap-8 md:grid-cols-3 justify-items-center">
          <MetricCard
            title="100% Transparente"
            description="Huella de carbono medida y verificada en cada producto."
            number={6.7}
            decimals={1}
            suffix=" kg CO₂"
            footer="Promedio por producto"
            icon={<Leaf className="h-6 w-6 text-[#0F8354]" />}
          />

          <MetricCard
            title="Origen Verificado"
            description="Seguimos el origen y la distancia recorrida por cada producto."
            number={6}
            decimals={0}
            suffix=""
            footer="Productos de bajo impacto"
            icon={<Globe className="h-6 w-6 text-[#0F8354]" />}
          />

          <MetricCard
            title="Consumo de Agua"
            description="Registro del consumo hídrico durante toda la producción."
            number={158}
            decimals={0}
            suffix=" L"
            footer="Promedio por producto"
            icon={<Droplets className="h-6 w-6 text-[#0F8354]" />}
          />
        </div>

        {/* BANNER INFERIOR */}
        <div className="mt-12 border-2 border-[#0F8354] bg-gradient-to-r from-[#0F83541A] to-white p-8 w-full text-center rounded-2xl">
          <p className="text-lg md:text-xl text-[#1A1A1B] font-sans">
            Las marcas en{" "}
            <span className="font-righteous text-[#0F8354] text-2xl">
              EcoShop
            </span>{" "}
            cumplen con estándares de transparencia y compromiso ambiental
            verificable.
          </p>
        </div>
      </div>
    </section>
  );
}

// === METRIC CARD ===

interface MetricCardProps {
  title: string;
  description: string;
  number: number;
  decimals?: number;
  suffix?: string;
  footer: string;
  icon: React.ReactNode;
}

function MetricCard({
  title,
  description,
  number,
  decimals = 0,
  suffix = "",
  footer,
  icon,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => current.toFixed(decimals));

  useEffect(() => {
    if (isInView) spring.set(number);
  }, [isInView, number, spring]);

  return (
    <div
      ref={ref}
      className="flex flex-col justify-between rounded-[20px] border-2 border-[#0F8354] bg-gradient-to-br from-[#0F83541A] to-white p-6 shadow-sm w-full max-w-[380px] font-sans hover:shadow-md transition-shadow duration-300"
    >
      <div>
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0F83541A] border border-[#0F8354]/30">
          {icon}
        </div>

        <h3 className="text-2xl font-righteous text-[#1A1A1B] mb-2">{title}</h3>

        <p className="mb-6 text-base text-gray-600 leading-relaxed font-sans">
          {description}
        </p>
      </div>

      <div className="border-t border-[#0F8354]/20 pt-4 mt-auto">
        <div className="flex items-baseline font-righteous text-[#0F8354]">
          <motion.span className="text-4xl md:text-5xl font-bold">
            {display}
          </motion.span>
          <span className="text-2xl md:text-3xl ml-1">{suffix}</span>
        </div>
        <p className="text-sm text-gray-500 font-medium mt-1">{footer}</p>
      </div>
    </div>
  );
}