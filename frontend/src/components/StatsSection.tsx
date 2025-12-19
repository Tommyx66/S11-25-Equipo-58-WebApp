"use client";

import { useEffect, useRef } from "react";
import { useInView, useSpring, useTransform, motion } from "framer-motion";
import { Righteous, Inter } from "next/font/google";
import clsx from "clsx";

// --- FUENTES ---
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

const AnimatedStat = ({
  value,
  suffix = "",
  label,
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const spring = useSpring(0, { mass: 1, stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) => current.toFixed(decimals));

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="flex items-baseline mb-2">
        <motion.span className="text-6xl md:text-7xl text-[#0F8354] font-righteous tracking-tight">
          {display}
        </motion.span>
        <span className="text-3xl md:text-4xl text-[#0F8354] font-righteous ml-1">
          {suffix}
        </span>
      </div>
      <span className="text-sm md:text-base text-gray-500 font-sans font-medium uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function StatsSection() {
  return (
    <section
      className={`w-full bg-white pb-12 md:pb-20 border-b border-gray-50 ${inter.variable} ${righteous.variable}`}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Stat 1 */}
          <AnimatedStat
            value={6}
            suffix=""
            label="Productos con bajo impacto"
          />

          {/* Stat 2 */}
          <AnimatedStat
            value={1.8}
            decimals={1}
            suffix="kg"
            label="CO₂ Promedio Evitado"
          />

          {/* Stat 3 */}
          <AnimatedStat value={81} suffix="%" label="Materiales Reciclables" />
        </div>
      </div>
    </section>
  );
}
