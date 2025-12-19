"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { Righteous, Inter } from "next/font/google";
import clsx from "clsx";

// --- FUENTES ---
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});
const StatItem = ({
  targetValue,
  suffix,
  unit, 
  description,
  subtext,
  decimals = 0,
  delay = 0,
}: {
  targetValue: number;
  suffix: string;
  unit?: string;
  description: string;
  subtext: string;
  decimals?: number;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { mass: 1, stiffness: 40, damping: 25 });
  const display = useTransform(spring, (current) => current.toFixed(decimals));

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        spring.set(targetValue);
      }, delay * 200); 
    }
  }, [isInView, targetValue, spring, delay]);

  return (
    <div ref={ref} className="w-full flex justify-center md:justify-start group">
      <div className="flex gap-5 md:gap-6 items-stretch w-full max-w-[400px]">
        
        {/* LÍNEA VERDE LATERAL */}
        <motion.div 
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.8, delay: delay * 0.1, ease: "circOut" }}
            className="w-[4px] bg-[#0F8354] rounded-full shrink-0 origin-top" 
        />

        <div className="flex flex-col py-1">
          
          {/* NÚMERO + UNIDADES */}
          <div className={`${righteous.className} flex items-baseline text-[#0F8354] leading-none mb-3`}>
            <motion.span className="text-6xl sm:text-7xl font-normal tracking-tighter">
              {display}
            </motion.span>
                        <span className="text-6xl sm:text-7xl font-normal tracking-tighter">
              {suffix}
            </span>
            {unit && (
              <span className="text-3xl sm:text-4xl ml-2 text-[#0F8354] opacity-90 font-normal transform -translate-y-1">
                {unit}
              </span>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <h3 className={`${righteous.className} text-xl md:text-[22px] text-[#1A1A1B] leading-[1.2] mb-2 max-w-[300px] tracking-wide`}>
            {description}
          </h3>

          {/* SUBTEXTO */}
          <p className={`${inter.className} text-xs md:text-sm text-gray-500 font-medium leading-relaxed tracking-wide`}>
            {subtext}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function ImpactStatistics() {
  return (
    <section className={`w-full bg-white py-12 md:py-20 border-b border-gray-50 ${inter.variable} ${righteous.variable}`}>
      <div className="container mx-auto px-6 md:px-12 xl:px-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
          
          <StatItem 
            targetValue={3.7} 
            decimals={1}
            suffix="m" 
            unit="kg"
            description="de CO₂ reducido por nuestra comunidad"
            subtext="Certificado por Climate Partners"
            delay={0}
          />

          <StatItem 
            targetValue={85} 
            suffix="" 
            unit="%"
            description="de productos con huella de carbono verificada"
            subtext="Verificación independiente"
            delay={1}
          />

          <StatItem 
            targetValue={12} 
            suffix="k"
            unit="+"
            description="compras sostenibles realizadas este mes"
            subtext="Carbon offsetting activo"
            delay={2}
          />

        </div>
      </div>
    </section>
  );
}