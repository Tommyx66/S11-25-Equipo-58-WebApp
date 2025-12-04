import { HeroLanding } from '@/components/HeroLanding'
import  ImpactStatistics  from '@/components/ImpactStatistics' 
import { ProductFilters } from '@/components/ProductFilters'
import { ProductList } from '@/components/ProductList'
import HuellaSection from '@/components/HuellaSection'
import { LowImpactCarousel } from '@/components/LowImpactCarousel'
import { SustainabilityMetrics } from '@/components/SustainabilityMetrics'
import SellosSection from '@/components/SellosSection'
import ReducirSection from '@/components/ReducirSection'


export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      
      {/* Inicio */}
      <section id="inicio">
        <HeroLanding />
      </section>
        <ImpactStatistics />
      <div>
        <LowImpactCarousel />
      </div>
      <div className="container mx-auto px-4 py-8 space-y-20">
        
        {/* === SECCIÓN PRODUCTOS === */}
        <section id="productos" className="scroll-mt-24 space-y-8">
           <ProductFilters />
           <ProductList />
        </section>

        {/* === SECCIÓN APRENDE === */}
        <section id="aprende" className="scroll-mt-24">
           <HuellaSection />
        </section>

        {/* === SECCIÓN IMPACTO */}
        
        <section id="impacto" className="scroll-mt-24">
          <SustainabilityMetrics />
        </section>


        
      </div>

      <section id="sellos" className="scroll-mt-24">
          <SellosSection />
        </section>

        <section id="reducir" className="scroll-mt-24">
          <ReducirSection />
        </section>
    </main>
  );
}