'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from './ProductCard'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// --- SKELETON ---
const ProductSkeleton = () => (
  <div className="w-full max-w-[365px] flex flex-col gap-3">
    <div className="w-full aspect-video bg-gray-200 rounded-[12px] animate-pulse" />
    <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mt-2" />
    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
    <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
    <div className="flex justify-between mt-4 items-center">
        <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-1/3 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
)

export interface Product {
  id: number
  nombre: string
  marca: string
  precio: number
  categoria: string
  impactoAmbiental: {
    huellaCarbono: string
    materialesReciclables: boolean
    nivel: string
  }
  imagen: string
  certificaciones: string[]
}

// --- MAPPER ---
const mapBackendToFrontend = (bp: any): Product => {
  const nivel = bp.ecoBadge === 'bajo_impacto' ? "Bajo impacto" : bp.ecoBadge === 'neutro' ? "Neutro" : "Medio impacto";
  const imgUrl = (bp.imagenUrl && bp.imagenUrl.startsWith('http')) ? bp.imagenUrl : "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500";

  return {
    id: bp.productoId || bp.id,
    nombre: bp.nombre || "Producto sin nombre",
    marca: bp.nombreMarca || "EcoShop",
    precio: bp.precio || 0,
    categoria: bp.categoria || 'Varios', 
    impactoAmbiental: {
      huellaCarbono: `${bp.huellaCarbonoTotal || 0} kg CO₂`,
      materialesReciclables: bp.porcentajeReciclable > 0,
      nivel: nivel
    },
    imagen: imgUrl,
    certificaciones: bp.certificaciones || []
  };
};

interface ProductListProps {
  filters: { categoria: string; precioMax: number[]; impacto: string; marca: string; ordenar: string; };
}

export function ProductList({ filters }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 8

  useEffect(() => { setCurrentPage(0); }, [filters]);

  useEffect(() => {
    let isMounted = true;

    const fetchAndFilterProducts = async () => {
      setLoading(true);
      let rawProducts: Product[] = [];

      try {
        console.log("📡 Solicitando productos al backend...");
        
        const data: any = await api.products.getAll(1, 100, filters);
        const listaBackend = data?.productos || data?.content || (Array.isArray(data) ? data : []);
        
        if (isMounted && Array.isArray(listaBackend)) {
            rawProducts = listaBackend.map(mapBackendToFrontend);
        }
      } catch (err) {
        console.error("Error al obtener productos:", err);
        // Ya no usamos respaldo, la lista quedará vacía si falla.
      }

      if (!isMounted) return;

      // --- FILTRADO INTELIGENTE EN CLIENTE ---
      const filtered = rawProducts.filter(p => {
           
           // 1. FILTRO CATEGORÍA (Flexible: minúsculas y espacios)
           if (filters.categoria !== 'Todas') {
               const catProducto = (p.categoria || '').toLowerCase().trim();
               const catFiltro = filters.categoria.toLowerCase().trim();
               if (catProducto !== catFiltro) return false;
           }

           // 2. FILTRO PRECIO
           if (p.precio > filters.precioMax[0]) return false;

           // 3. FILTRO MARCA
           if (filters.marca !== 'all') {
               if (p.marca.toLowerCase() !== filters.marca.toLowerCase()) return false;
           }

           // 4. FILTRO IMPACTO
           if (filters.impacto !== 'all') {
              const nivel = p.impactoAmbiental.nivel;
              if (filters.impacto === 'low' && nivel !== 'Bajo impacto') return false;
              if (filters.impacto === 'neutro' && nivel !== 'Neutro') return false;
              if (filters.impacto === 'medium' && nivel !== 'Medio impacto') return false;
           }
           
           return true;
      });

      // Ordenamiento
      if (filters.ordenar === 'price-asc') filtered.sort((a, b) => a.precio - b.precio);
      if (filters.ordenar === 'price-desc') filtered.sort((a, b) => b.precio - a.precio);

      setProducts(filtered);
      setLoading(false);
    };

    fetchAndFilterProducts();

    return () => { isMounted = false; }
  }, [filters]);

  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handlePrevPage = () => { if (currentPage > 0) setCurrentPage(p => p - 1); };
  const handleNextPage = () => { if (currentPage < totalPages - 1) setCurrentPage(p => p + 1); };

  if (loading) {
      return (
        <div className="grid p-6 grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center pb-20">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      )
  }
  
  if (products.length === 0) {
      return (
        <div className="text-center py-20 text-gray-500 font-sans">
            <p className="text-xl font-medium mb-2">No encontramos productos con esos filtros.</p>
            <p className="text-sm">Intenta seleccionar otra categoría o rango de precios.</p>
        </div>
      )
  }

  return (
    <div className="flex flex-col gap-10 pb-10">
      <div className="grid p-6 grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product}/>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 0}>
            <ChevronLeft size={20}/> Anterior
          </Button>
          <span className="text-gray-600">Página {currentPage + 1} de {totalPages}</span>
          <Button variant="outline" onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
            Siguiente <ChevronRight size={20}/>
          </Button>
        </div>
      )}
    </div>
  )
}