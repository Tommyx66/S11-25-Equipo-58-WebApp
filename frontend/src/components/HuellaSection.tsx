"use client";

import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Award } from "lucide-react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 },
  },
};

export default function HuellaSection() {
  const router = useRouter();

  const handleVerProductos = () => {
    // Intentamos buscar la sección en la página actual
    const productosSection = document.getElementById("productos");

    if (productosSection) {
      // Si existe, hacemos scroll suave
      productosSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Si no estamos en la home, redirigimos al ancla
      router.push("/#productos");
    }
  };

  return (
    <section className="py-20 w-full overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* HEADER */}
        <div className="mb-16 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          <div className="flex items-center pt-2 gap-2 shrink-0">
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
          <div>
            <h2 className="mb-4 font-righteous text-3xl md:text-5xl text-[#1A1A1B] leading-tight text-balance">
              Entiende tu Huella y Aprende
            </h2>
            <p className="max-w-4xl text-lg md:text-2xl font-sans text-gray-600 text-pretty">
              De kilogramos a kilómetros: Aprende a interpretar las métricas
              ambientales y tomar decisiones informadas.
            </p>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-center justify-center gap-12">
          {/* COLUMNA DE CARDS */}
          <motion.div
            className="flex flex-col gap-6 w-full max-w-[900px]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* CARD 1 */}
            <motion.div
              variants={cardVariants}
              className="relative overflow-hidden rounded-3xl border border-[#0F8354] bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute right-4 top-4">
                <div className="rounded-xl bg-[#0F83541A] p-2">
                  <Leaf className="h-6 w-6 md:h-8 md:w-8 text-[#0F8354]" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="shrink-0">
                  <Image
                    src="/huella1-image.svg"
                    width={100}
                    height={100}
                    alt="Huella Verde"
                    className="h-28 w-28 md:h-32 md:w-32 object-contain"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="mb-2 text-2xl font-righteous text-[#1A1A1B]">
                    ¿Qué es la huella de carbono?
                  </h3>
                  <p className="mb-4 text-gray-600 font-sans text-base md:text-lg text-pretty">
                    Es la cantidad total de gases de efecto invernadero emitidos
                    durante el ciclo de vida de un producto.
                  </p>
                  <div className="inline-block rounded-full bg-[#0F83541A] px-4 py-1">
                    <span className="text-sm font-bold text-[#0F8354]">
                      2.3kg CO₂ promedio
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 2 */}
            <motion.div
              variants={cardVariants}
              className="relative overflow-hidden rounded-3xl border border-[#006CFF] bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute right-4 top-4">
                <div className="rounded-xl bg-[#006CFF1A] p-2">
                  <Recycle className="h-6 w-6 md:h-8 md:w-8 text-[#006CFF]" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="shrink-0">
                  <Image
                    src="/huella2-image.svg"
                    width={100}
                    height={100}
                    alt="Reciclaje"
                    className="h-28 w-28 md:h-32 md:w-32 object-contain"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="mb-2 text-2xl font-righteous text-[#1A1A1B]">
                    Ciclo de Vida
                  </h3>
                  <p className="mb-4 text-gray-600 font-sans text-base md:text-lg text-pretty">
                    Analizamos desde la extracción de materias primas hasta su
                    reciclaje final.
                  </p>
                  <div className="inline-block rounded-full bg-[#006CFF1A] px-4 py-1">
                    <span className="text-sm font-bold text-[#006CFF]">
                      70% menos emisiones
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 3 */}
            <motion.div
              variants={cardVariants}
              className="relative overflow-hidden rounded-3xl border border-[#ED6E12] bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute right-4 top-4">
                <div className="rounded-xl bg-[#ED6E121A] p-2">
                  <Award className="h-6 w-6 md:h-8 md:w-8 text-[#ED6E12]" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="shrink-0">
                  <Image
                    src="/huella3-image.svg"
                    width={100}
                    height={100}
                    alt="Certificaciones"
                    className="h-28 w-28 md:h-32 md:w-32 object-contain"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="mb-2 text-2xl font-righteous text-[#1A1A1B]">
                    Certificaciones
                  </h3>
                  <p className="mb-4 text-gray-600 font-sans text-base md:text-lg text-pretty">
                    Sellos internacionales que validan el compromiso ambiental
                    de cada marca.
                  </p>
                  <div className="inline-block rounded-full bg-[#ED6E121A] px-4 py-1">
                    <span className="text-sm font-bold text-[#ED6E12]">
                      +7 certificaciones
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="flex flex-col items-center justify-center w-full max-w-[600px] relative mt-10 xl:mt-0">
            <div className="relative w-full">
              <Image
                src="/huella-foot.png"
                width={846}
                height={546}
                alt="Huella de carbono verde"
                className="h-auto w-full lg:-mt-4 object-contain drop-shadow-lg"
              />
            </div>

            <div className="mt-8 md:-mt-8 lg:-mt-12 relative z-10">
              {/* BOTÓN DE ACCIÓN */}
              <Button
                size="lg"
                variant="outline"
                onClick={handleVerProductos}
                className="text-lg md:text-2xl border-2 border-[#0F8354] bg-white text-[#0F8354] hover:bg-[#0F8354] hover:text-white font-righteous py-6 px-10 shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl"
              >
                Ver productos de Bajo Consumo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
