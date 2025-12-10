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
  };
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
}

export function ProductFilters({ filters, setFilter, resetFilters }: ProductFiltersProps) {
  
  const categories = ['Todas', 'Ropa', 'Hogar', 'Accesorios', 'Cuidado Personal']

  return (
    <div className="mb-8 font-sans">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-righteous flex items-center gap-2 text-lg font-medium">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtrar por categoría
        </h2>
        <Button
          variant="ghost"
          onClick={resetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          Limpiar filtro
        </Button>
      </div>

      {/* BOTONES CATEGORÍA Y SLIDER */}
      <div className='flex flex-col md:flex-row gap-6'>

        <div className="mb-6 flex flex-wrap w-full gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filters.categoria === category ? 'default' : 'outline'}
              onClick={() => setFilter('categoria', category)}
              className={
                filters.categoria === category
                  ? 'bg-[#0F8354] rounded-sm text-white hover:bg-[#0F8354]/90'
                  : ''
              }
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
              max={200000} 
              step={1000}
              className="[&_div[data-slider-range]]:bg-[#0F8354]"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$200k</span>
            </div>
          </div>
        </div>
      </div>

      {/* SELECTORES INFERIORES */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium">Impacto de Huella de Carbono</label>
          <Select 
            value={filters.impacto} 
            onValueChange={(val) => setFilter('impacto', val)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Niveles de impacto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Niveles de impacto</SelectItem>
              <SelectItem value="low">Bajo</SelectItem>
              <SelectItem value="medium">Medio</SelectItem>
              <SelectItem value="neutro">Neutro (Alto)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Marca</label>
          <Select 
            value={filters.marca} 
            onValueChange={(val) => setFilter('marca', val)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="EcoLife">EcoLife</SelectItem>
              <SelectItem value="GreenTech">GreenTech</SelectItem>
              <SelectItem value="Lush">Lush</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Material</label>
          <Select defaultValue="all">
            <SelectTrigger className='w-full'><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="cotton">Algodón</SelectItem>
              <SelectItem value="polyester">Poliéster</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Origen</label>
          <Select defaultValue="all">
            <SelectTrigger className='w-full'><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="international">Internacional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Ordenar por</label>
          <Select 
            value={filters.ordenar} 
            onValueChange={(val) => setFilter('ordenar', val)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Mas relevantes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevant">Mas relevantes</SelectItem>
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