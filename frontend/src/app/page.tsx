'use client'

import { useState } from 'react'
import { HeroLanding } from '@/components/HeroLanding'
import ImpactStatistics from '@/components/ImpactStatistics' 
import { ProductFilters } from '@/components/ProductFilters'
import { ProductList } from '@/components/ProductList'
import HuellaSection from '@/components/HuellaSection'
import { LowImpactCarousel } from '@/components/LowImpactCarousel'
import { SustainabilityMetrics } from '@/components/SustainabilityMetrics'
import SellosSection from '@/components/SellosSection'
import ReducirSection from '@/components/ReducirSection'
import { ShoppingCart } from '@/components/ShoppingCart'

export default function Home() {
  // Estado inicial de los filtros
  const [filters, setFilters] = useState({
    categoria: 'Todas',
    precioMax: [200000], 
    impacto: 'all',
    marca: 'all',
    ordenar: 'relevant'
  })

  const handleSetFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      categoria: 'Todas',
      precioMax: [200000],
      impacto: 'all',
      marca: 'all',
      ordenar: 'relevant'
    })
  }

  return (
    <main 
      className="min-h-screen bg-white dark:bg-slate-950 w-full overflow-x-hidden"
      style={{ zoom: '0.85' }} 
    >
      <section id="inicio">
        <HeroLanding />
      </section>
      
      <ImpactStatistics />
      
      <div>
        <LowImpactCarousel />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <section id="productos" className="scroll">
           {/* Controles de Filtro */}
           <ProductFilters 
              filters={filters} 
              setFilter={handleSetFilter} 
              resetFilters={resetFilters} 
           />
                      <ProductList filters={filters} />
        </section>

        <section id="aprende" className="scroll">
           <HuellaSection />
        </section>

        <section id="impacto" className="scroll">
          <SustainabilityMetrics />
        </section>
      </div>

      <section id="sellos" className="scroll-mt-24">
          <SellosSection />
      </section>

      <section id="reducir" className="scroll-mt-24">
          <ReducirSection />
      </section>
      
      <ShoppingCart />
    </main>
  );
}