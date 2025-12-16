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
    ordenar: 'relevant',
    material: 'all',
    origen: 'all'
  })

  // ✅ ESTADOS PARA DATOS DINÁMICOS
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([])

  const handleSetFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      categoria: 'Todas',
      precioMax: [200000],
      impacto: 'all',
      marca: 'all',
      ordenar: 'relevant',
      material: 'all',
      origen: 'all'
    })
  }

  const handleDataLoaded = (brands: string[], materials: string[]) => {
    if (brands.length > 0 && availableBrands.length === 0) {
        setAvailableBrands(brands);
    }
    if (materials.length > 0 && availableMaterials.length === 0) {
        setAvailableMaterials(materials);
    }
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
           <ProductFilters 
              filters={filters} 
              setFilter={handleSetFilter} 
              resetFilters={resetFilters} 
              availableBrands={availableBrands}
              availableMaterials={availableMaterials}
           />
           
           <ProductList 
              filters={filters} 
              onDataLoaded={handleDataLoaded}
           />
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