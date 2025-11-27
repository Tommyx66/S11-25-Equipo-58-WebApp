import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Award } from "lucide-react";
import Image from "next/image";

export default function HuellaSection() {
  return (
    <div className="min-h-screen mx-auto     p-6 md:p-12">
      <div className="mx-auto w-fit  ">
        <div className="  mb-12 flex flex-row gap-10">
          <div className=" flex items-start pt-4 gap-2 ">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-[25px] w-[25px] rounded-full"
                style={{
                  backgroundColor: `rgba(16, 185, 129, ${0.2 + i * 0.1})`,
                }}
              />
            ))}
          </div>
          <div>
            <h2 className="mb-4 font-righteous text-4xl  font-light text-balance md:text-5xl">
              Entiende tu Huella y Aprende
            </h2>
            <p className="max-w-4xl text-2xl font-regular font-sans text-gray-700 text-pretty">
              De kilogramos a kilómetros: Aprende a interpretar las métricas
              ambientales y tomar decisiones informadas para un futuro
              sostenible.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row ">
          <div className="flex flex-col gap-6 w-full max-w-[1000px]   justify-center">
            <div className="relative overflow-hidden flex flex-col justify-around  md:min-h-[306px] rounded-2xl border-2 border-[#0F8354] p-6 shadow-sm w-full ">
              <div className="absolute right-4 top-4 ">
                <div className="rounded-xl bg-[#0F83541A] p-2">
                  <Leaf className="h-8 w-8 text-[#0F8354]" />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0">
                  <Image
                    src="/huella1-image.svg"
                    width={100}
                    height={100}
                    alt="Reciclaje"
                    className="h-42 w-42 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 text-3xl font-regular">
                    ¿Qué es la huella de carbono?
                  </h3>
                  <p className="mb-4 text-[#707070] font-regular text-pretty font-sans text-2xl">
                    Es la cantidad total de gases de efecto invernadero emitidos
                    durante el ciclo de vida de un producto, desde su
                    fabricación hasta su disposición final.
                  </p>
                  <div className="inline-block rounded-full bg-[#0F83541A] px-4 py-2">
                    <span className="text-sm font-medium text-[#0F8354]">
                      2.3kg CO₂ promedio
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-[#006CFF] bg-white p-6 shadow-sm  flex flex-col justify-around  md:min-h-[306px] ">
              <div className="absolute right-4 top-4">
                <div className="rounded-lg bg-[#006CFF1A] p-2">
                  <Recycle className="h-8 w-8 text-[#006CFF]" />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0">
                  <Image
                    src="/huella2-image.svg"
                    width={100}
                    height={100}
                    alt="Reciclaje"
                    className="h-42 w-42 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 text-3xl font-regular">
                    ¿Qué es la huella de carbono?
                  </h3>
                  <p className="mb-4 text-[#707070] font-regular text-pretty font-sans text-2xl">
                    Es la cantidad total de gases de efecto invernadero emitidos
                    durante el ciclo de vida de un producto, desde su
                    fabricación hasta su disposición final.
                  </p>
                  <div className="inline-block rounded-full bg-blue-100 px-4 py-2">
                    <span className="text-sm font-medium text-blue-700">
                      70% menos emisiones
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-[#ED6E12] bg-white p-6 shadow-sm  flex flex-col justify-around  md:min-h-[306px] ">
              <div className="absolute right-4 top-4">
                <div className="rounded-lg bg-[#ED6E1233] p-2">
                  <Award className="h-8 w-8 text-[#ED6E12]" />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0">
                  <Image
                    src="/huella3-image.svg"
                    width={100}
                    height={100}
                    alt="Reciclaje"
                    className="h-42 w-42 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 text-3xl font-regular">
                    ¿Qué es la huella de carbono?
                  </h3>
                  <p className="mb-4 text-[#707070] font-regular text-pretty font-sans text-2xl">
                    Es la cantidad total de gases de efecto invernadero emitidos
                    durante el ciclo de vida de un producto, desde su
                    fabricación hasta su disposición final.
                  </p>
                  <div className="inline-block rounded-full bg-[#ED6E1233] px-4 py-2">
                    <span className="text-sm font-medium text-[#ED6E12]">
                      +7 certificaciones
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative">
              <Image
                src="/huella-foot.png"
                width={846}
                height={546}
                alt="Huella de carbono verde"
                className="h-auto w-full max-w-[800px]  rounded-lg object-contain  "
              />
              <div className="  flex flex-col items-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-[25px] border-2 border-[#0F8354] rounded-none text-[#0F8354]
                   hover:bg-emerald-50 hover:text-emerald-800 font-righteous font-medium py-7 px-8 shadow-xl"
                >
                  Ver productos de Bajo Consumo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
