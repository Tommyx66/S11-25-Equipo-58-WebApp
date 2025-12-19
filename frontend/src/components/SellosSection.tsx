"use client";

import Image from "next/image";
import { Righteous, Inter } from "next/font/google";

// --- FUENTES ---
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

// --- DATOS DE SELLOS ---
const logos = [
  { src: "/img/sellos/1.svg", alt: "EU Ecolabel", w: 178, h: 203 },
  { src: "/img/sellos/2.svg", alt: "Fairtrade", w: 212, h: 217 },
  { src: "/img/sellos/3.svg", alt: "Carbon Neutral", w: 298, h: 173 },
  { src: "/img/sellos/4.svg", alt: "Organic Textile", w: 267, h: 251 },
  { src: "/img/sellos/5.svg", alt: "Lab Global", w: 223, h: 223 },
  { src: "/img/sellos/6.svg", alt: "CNIC", w: 244, h: 233 },
  { src: "/img/sellos/7.svg", alt: "Carbon Trust", w: 258, h: 171 },
];

export default function SellosSection() {
  return (
    <section
      className={`w-full bg-white py-15 md:py-20 overflow-hidden ${inter.variable} ${righteous.variable}`}
    >
      {/* --- HEADER --- */}
        <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          
          {/* PUNTITOS  */}
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
              Sellos de <span className="text-[#0F8354]">Confianza</span>
            </h2>
            <p className="max-w-3xl text-lg md:text-xl font-sans text-gray-500 font-medium leading-relaxed text-pretty">
              Trabajamos exclusivamente con productos certificados por las principales organizaciones ambientales a nivel global.
            </p>
          </div>
        </div>
      </div>

      {/* --- CARRUSEL INFINITO --- */}
      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-60 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-60 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="flex overflow-hidden w-full group">
          <div className="flex gap-16 md:gap-32 animate-scroll items-center whitespace-nowrap py-4 px-4">
            {[...logos, ...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="relative shrink-0 transition-all duration-500 hover:scale-110 cursor-pointer"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.w}
                  height={logo.h}
                  className="object-contain w-auto h-20 md:h-32 filter grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 ease-out"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ANIMACIÓN --- */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
