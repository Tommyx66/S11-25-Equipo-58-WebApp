import HuellaSection from "@/components/HuellaSection";
import { ProductFilters } from "@/components/ProductFilters"; 
import { ProductList } from "@/components/ProductList";
export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      
      <div className="container mx-auto px-4 py-8">
        

        {/* Filtros */}
        <ProductFilters />

        
        {/* Lista de Productos */}
        <ProductList />

        {/* Sección de la Huella (Banner) */}
      <HuellaSection />

        
      </div>
    </main>
  );
}