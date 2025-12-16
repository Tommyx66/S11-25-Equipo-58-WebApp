'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from './ProductCard'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  material: string
  origen: string
}

// --- MAPPER  ---
const mapBackendToFrontend = (bp: any): Product => {
  const nivelRaw = bp.ecoBadge || bp.impacto || bp.nivelImpacto || ''; 
  const nivel = nivelRaw.toLowerCase().includes('bajo') ? "Bajo impacto" : 
                nivelRaw.toLowerCase().includes('neutro') ? "Neutro" : "Medio impacto";

  const imgUrl = (bp.imagenUrl && bp.imagenUrl.startsWith('http')) 
    ? bp.imagenUrl 
    : "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=500";

  let categoriaDetectada = bp.categoria || bp.category || bp.nombreCategoria;
  const nombre = (bp.nombre || "").toLowerCase();

  if (!categoriaDetectada || categoriaDetectada === "Varios") {
      if (nombre.includes("shampoo") || nombre.includes("jabón") || nombre.includes("crema") || nombre.includes("bar")) {
          categoriaDetectada = "Cuidado Personal";
      } else if (nombre.includes("zapatilla") || nombre.includes("remera") || nombre.includes("buzo") || nombre.includes("pantalón")) {
          categoriaDetectada = "Ropa";
      } else if (nombre.includes("botella") || nombre.includes("hogar") || nombre.includes("taper")) {
          categoriaDetectada = "Hogar";
      } else {
          categoriaDetectada = "Varios"; 
      }
  }

  let materialDetectado = bp.material || "polyester"; 
  if (nombre.includes("algodon") || nombre.includes("cotton")) materialDetectado = "cotton";
  if (nombre.includes("bambu") || nombre.includes("bamboo")) materialDetectado = "bamboo";
  if (nombre.includes("plastico") || nombre.includes("reciclado")) materialDetectado = "recycled_plastic";

  let origenDetectado = bp.origen || "international";
  if (bp.nombreMarca === "EcoLife" || bp.nombreMarca === "Lush" || nombre.includes("nacional")) origenDetectado = "local";

  return {
    id: bp.productoId || bp.id || Math.random(),
    nombre: bp.nombre || "Producto sin nombre",
    marca: bp.nombreMarca || bp.marca || "EcoShop",
    precio: Number(bp.precio) || 0,
    categoria: categoriaDetectada,
    impactoAmbiental: {
      huellaCarbono: `${bp.huellaCarbonoTotal || bp.huellaCarbonoKg || 0} kg CO₂`,
      materialesReciclables: bp.porcentajeReciclable > 0,
      nivel: nivel
    },
    imagen: imgUrl,
    certificaciones: bp.certificaciones || [],
    material: materialDetectado,
    origen: origenDetectado
  };
};

interface ProductListProps {
  filters: {
    categoria: string;
    precioMax: number[];
    impacto: string;
    marca: string;
    ordenar: string;
    material?: string;
    origen?: string;
  };
  onDataLoaded?: (brands: string[], materials: string[]) => void;
}

export function ProductList({ filters, onDataLoaded }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 8

  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  useEffect(() => {
    let isMounted = true;

    const fetchAndFilterProducts = async () => {
      setLoading(true);
      
      try {
        const data: any = await api.products.getAll(1, 100, {}); 
        const listaBackend = data?.productos || data?.content || (Array.isArray(data) ? data : []);
        let rawProducts: Product[] = [];

        if (listaBackend && listaBackend.length > 0) {
            rawProducts = listaBackend.map(mapBackendToFrontend);
            
            if (isMounted && onDataLoaded) {
                const uniqueBrands = Array.from(new Set(rawProducts.map(p => p.marca))).filter(Boolean).sort();
                const uniqueMaterials = Array.from(new Set(rawProducts.map(p => p.material))).filter(Boolean).sort();
                
                onDataLoaded(uniqueBrands, uniqueMaterials);
            }
        }

        if (!isMounted) return;

        const filtered = rawProducts.filter(p => {
             // Categoria
             if (filters.categoria !== 'Todas') {
               const catProd = (p.categoria || "").toLowerCase().trim();
               const catFiltro = filters.categoria.toLowerCase().trim();
               if (!catProd.includes(catFiltro)) return false; 
             }
             // Precio
             if (p.precio > filters.precioMax[0]) return false;
             // Marca
             if (filters.marca !== 'all') {
                if (p.marca.toLowerCase() !== filters.marca.toLowerCase()) return false;
             }
             // Impacto
             if (filters.impacto !== 'all') {
               const imp = p.impactoAmbiental.nivel.toLowerCase();
               const target = filters.impacto.toLowerCase();
               if (target === 'low' && !imp.includes('bajo')) return false;
               if (target === 'neutro' && !imp.includes('neutro')) return false;
               if (target === 'medium' && !imp.includes('medio')) return false;
             }
             // ✅ Material
             if (filters.material && filters.material !== 'all') {
                if (p.material.toLowerCase() !== filters.material.toLowerCase()) return false;
             }
             // Origen
             if (filters.origen && filters.origen !== 'all') {
                if (p.origen.toLowerCase() !== filters.origen.toLowerCase()) return false;
             }

             return true;
        });

        // Ordenamiento
        if (filters.ordenar === 'price-asc') filtered.sort((a, b) => a.precio - b.precio);
        if (filters.ordenar === 'price-desc') filtered.sort((a, b) => b.precio - a.precio);
        
        setProducts(filtered);
        
      } catch (err) {
        console.error("Error cargando productos:", err);
        setProducts([]); 
      } finally {
        if(isMounted) setLoading(false);
      }
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
        <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-medium">No se encontraron productos.</p>
            <Button variant="link" onClick={() => window.location.reload()} className="mt-4">
              Recargar página
            </Button>
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