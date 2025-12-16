'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface ProductFiltersProps {
  filters: {
    categoria: string;
    precioMax: number[];
    impacto: string;
    marca: string;
    ordenar: string;
    material: string;
    origen: string;
  };
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
  availableBrands: string[];
  availableMaterials: string[];
}

export function ProductFilters({ 
  filters, 
  setFilter, 
  resetFilters,
  availableBrands,
  availableMaterials 
}: ProductFiltersProps) {
  
  const categories = ['Todas', 'Ropa', 'Hogar', 'Accesorios', 'Cuidado Personal']

  return (
    <div className="mb-8 font-sans">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-righteous flex items-center gap-2 text-lg font-medium">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtrar por categoría
        </h2>
        <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground hover:text-foreground">
          Limpiar filtro
        </Button>
      </div>

      {/* CATEGORÍAS Y PRECIO */}
      <div className='flex flex-col md:flex-row gap-6'>
        <div className="mb-6 flex flex-wrap w-full gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filters.categoria === category ? 'default' : 'outline'}
              onClick={() => setFilter('categoria', category)}
              className={filters.categoria === category ? 'bg-[#0F8354] rounded-sm text-white hover:bg-[#0F8354]/90' : ''}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="w-full">
           <div className="space-y-2">
             <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Precio máximo: ${filters.precioMax[0].toLocaleString()}</label>
             </div>
             <Slider
               value={filters.precioMax}
               onValueChange={(val) => setFilter('precioMax', val)}
               max={200000} step={1000}
               className="[&_div[data-slider-range]]:bg-[#0F8354]"
             />
             <div className="flex justify-between text-xs text-muted-foreground">
               <span>$0</span>
               <span>$200k</span>
             </div>
           </div>
        </div>
      </div>

      {/* FILTROS AVANZADOS */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* IMPACTO */}
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium">Impacto</label>
          <Select value={filters.impacto} onValueChange={(val) => setFilter('impacto', val)}>
            <SelectTrigger className='w-full'><SelectValue placeholder="Niveles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="low">Bajo</SelectItem>
              <SelectItem value="medium">Medio</SelectItem>
              <SelectItem value="neutro">Neutro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ✅ MARCA DINÁMICA */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Marca</label>
          <Select value={filters.marca} onValueChange={(val) => setFilter('marca', val)}>
            <SelectTrigger className='w-full'><SelectValue placeholder="Todas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {availableBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ✅ MATERIAL DINÁMICO */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Material</label>
          <Select value={filters.material} onValueChange={(val) => setFilter('material', val)}>
            <SelectTrigger className='w-full'><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {availableMaterials.map((mat) => (
                <SelectItem key={mat} value={mat.toLowerCase()}>
                  {/* Capitalizar primera letra para que se vea bonito */}
                  {mat.charAt(0).toUpperCase() + mat.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ORIGEN */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Origen</label>
          <Select value={filters.origen} onValueChange={(val) => setFilter('origen', val)}>
            <SelectTrigger className='w-full'><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="international">Internacional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* ORDENAR */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Ordenar</label>
          <Select value={filters.ordenar} onValueChange={(val) => setFilter('ordenar', val)}>
            <SelectTrigger className='w-full'><SelectValue placeholder="Relevancia" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="relevant">Relevancia</SelectItem>
              <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="newest">Más Nuevos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}