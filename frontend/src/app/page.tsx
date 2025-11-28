import { HeroLanding } from '@/components/HeroLanding'
import ImpactStatistics from '@/components/ImpactStatistics'
import { ProductFilters } from '@/components/ProductFilters'
import { ProductList } from '@/components/ProductList'
import HuellaSection from '@/components/HuellaSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      
      {/* 1. SECCIÓN INICIO */}
      <section id="inicio">
        <HeroLanding />
      </section>

      {/* 2. ESTADÍSTICAS */}
      <ImpactStatistics />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="container mx-auto px-4 py-8 space-y-20">
        
        {/* 3. SECCIÓN PRODUCTOS */}
        <section id="productos" className="scroll-mt-28 space-y-8">
           <ProductFilters />
           <ProductList />
        </section>

        {/* 4. SECCIÓN APRENDE */}
        <section id="aprende" className="scroll-mt-28">
           {/* Aquí iría el componente Aprende en el futuro */}
        </section>

        {/* 5. SECCIÓN IMPACTO */}
        <section id="impacto" className="scroll-mt-28">
           <HuellaSection />
        </section>

        {/* 6. SECCIÓN CERTIFICACIONES */}
        <section id="certificaciones" className="scroll-mt-28">
           {/* Aquí irían las certificaciones */}
        </section>
        
      </div>
    </main>
  );
}