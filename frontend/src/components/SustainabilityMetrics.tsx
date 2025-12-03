"use client"
import React, { useEffect, useRef, useState } from "react"
import { Leaf, Globe, Droplets } from "lucide-react"
import { Righteous } from 'next/font/google'

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
})

export function SustainabilityMetrics() {
  return (
    <section className="flex w-full bg-white px-6 py-20 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">

        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-14 animate-fade-in-up">
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
                Datos Reales, Impacto Real
              </h2>
              <p className="text-gray-600 font-sans text-2xl ">
                Métricas basadas en productos verificados, con datos transparentes
                sobre emisiones, origen y uso de recursos.</p>
            </div>
          </div>




        </div>

        {/* ───────────────── CARDS ───────────────── */}
        <div className="grid gap-6 md:grid-cols-3">

          <MetricCard
            title="100% Transparente"
            description="Huella de carbono medida y verificada en cada producto."
            number={6.7}
            suffix=" kg CO₂"
            footer="Promedio por producto"
            icon={<Leaf className="h-6 w-6 text-[#0F8354]" />}
          />

          <MetricCard
            title="Origen Verificado"
            description="Seguimos el origen y la distancia recorrida por cada producto."
            number={6}
            suffix=""
            footer="Productos de bajo impacto"
            icon={<Globe className="h-6 w-6 text-[#0F8354]" />}
          />

          <MetricCard
            title="Consumo de Agua"
            description="Registro del consumo hídrico durante toda la producción."
            number={158}
            suffix=" L"
            footer="Promedio por producto"
            icon={<Droplets className="h-6 w-6 text-[#0F8354]" />}
          />

        </div>

        <div className="mt-10 border-2 border-[#0F8354] bg-gradient-to-r from-[#0F83541A] to-white p-10 w-full text-center font-sans">
          <p className="text-base text-[#1A1A1B]">
            Las marcas en <span className="font-semibold text-[#0F8354]">EcoShop</span> cumplen con
            estándares de transparencia y compromiso ambiental verificable.
          </p>
        </div>

      </div>
    </section>
  )
}

interface MetricCardProps {
  title: string
  description: string
  number: number
  suffix?: string
  footer: string
  icon: React.ReactNode
}

function MetricCard({
  title,
  description,
  number,
  suffix = "",
  footer,
  icon,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true)
          const duration = 1200
          const start = performance.now()

          const animate = (t: number) => {
            const progress = Math.min((t - start) / duration, 1)
            setValue(Number((number * progress).toFixed(1)))
            if (progress < 1) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [number, started])

  return (
    <div
      ref={ref}
      className="rounded-[14px] border-2 border-[#0F8354] bg-gradient-to-br from-[#0F83541A] to-white p-6 shadow-sm w-full max-w-[380px] font-sans"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0F83541A] border border-[#0F8354]">
        {icon}
      </div>

      <h3 className="text-xl font-display font-semibold text-[#1A1A1B]">
        {title}
      </h3>

      <p className="mb-6 mt-1 text-sm text-muted-foreground">{description}</p>

      <div className="border-t border-[#0F8354]/30 pt-4">
        <p className="text-3xl font-display font-bold text-[#0F8354]">
          {value}
          {suffix}
        </p>
        <p className="text-xs text-muted-foreground">{footer}</p>
      </div>
    </div>
  )
}
