import { HeroLanding } from '@/components/HeroLanding'
import  ImpactStatistics  from '@/components/ImpactStatistics' 
import { ProductFilters } from '@/components/ProductFilters'
import { ProductList } from '@/components/ProductList'
import HuellaSection from '@/components/HuellaSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      
      {/* Inicio */}
      <section id="inicio">
        <HeroLanding />
      </section>
        <ImpactStatistics />

      <div className="container mx-auto px-4 py-8 space-y-20">
        
        {/* === SECCIÓN PRODUCTOS === */}
        <section id="productos" className="scroll-mt-24 space-y-8">
           <ProductFilters />
           <ProductList />
        </section>

        {/* === SECCIÓN IMPACTO === */}
        <section id="impacto" className="scroll-mt-24">
           <HuellaSection />
        </section>

        {/* === SECCIÓN APRENDE */}
        <section id="aprende" className="scroll-mt-24">
        </section>
        
      </div>
    </main>
  );
}