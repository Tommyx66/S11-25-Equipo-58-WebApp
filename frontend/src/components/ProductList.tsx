'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from './ProductCard'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

// --- DATOS DE RESPALDO (Por si el backend explota) ---
const PRODUCTOS_RESPALDO: Product[] = [
  {
    id: 1,
    nombre: "Botella Térmica EcoLife",
    marca: "EcoLife",
    precio: 14990,
    categoria: "Hogar",
    impactoAmbiental: { huellaCarbono: "0.8 kg CO₂", materialesReciclables: true, nivel: "Bajo impacto" },
    imagen: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500",
    certificaciones: ["B-Corp"]
  },
  {
    id: 2,
    nombre: "Shampoo Sólido Natural",
    marca: "Lush",
    precio: 8500,
    categoria: "Cuidado Personal",
    impactoAmbiental: { huellaCarbono: "0.2 kg CO₂", materialesReciclables: true, nivel: "Bajo impacto" },
    imagen: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=500",
    certificaciones: ["Cruelty Free"]
  },
  {
    id: 3,
    nombre: "Zapatillas Recicladas",
    marca: "GreenTech",
    precio: 89000,
    categoria: "Ropa",
    impactoAmbiental: { huellaCarbono: "5.5 kg CO₂", materialesReciclables: true, nivel: "Medio impacto" },
    imagen: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=500",
    certificaciones: ["Recycled"]
  }
];

export interface Product {
  id: number
  nombre: string
  marca: string
  precio: number
  categoria: string
  impactoAmbiental: {
    huellaCarbono: string
    materialesReciclables: boolean
    nivel: "Bajo impacto" | "Neutro" | "Medio impacto"
  }
  imagen: string
  certificaciones: string[]
}

// --- MAPPER INTELIGENTE (Backend -> Frontend) ---
const mapBackendToFrontend = (bp: any): Product => {
  let nivel: "Bajo impacto" | "Neutro" | "Medio impacto" = "Medio impacto";
  const badge = bp.ecoBadge || 'medio_impacto';
  
  if (badge === "bajo_impacto") nivel = "Bajo impacto";
  else if (badge === "neutro") nivel = "Neutro";

  // URL Segura para imagen
  const imgUrl = (bp.imagenUrl && bp.imagenUrl.startsWith('http')) 
    ? bp.imagenUrl 
    : "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=500";

  return {
    id: bp.productoId || bp.id,
    nombre: bp.nombre || "Producto sin nombre",
    marca: bp.nombreMarca || "EcoShop",
    precio: bp.precio || 0,
    categoria: bp.categoria || 'Varios',
    impactoAmbiental: {
      // Tu backend usa 'huellaCarbonoTotal', cubrimos ambos casos
      huellaCarbono: `${bp.huellaCarbonoTotal || bp.huellaCarbonoKg || 0} kg CO₂`,
      materialesReciclables: bp.porcentajeReciclable > 0,
      nivel: nivel
    },
    imagen: imgUrl,
    certificaciones: bp.certificaciones || []
  };
};

interface ProductListProps {
  filters: {
    categoria: string;
    precioMax: number[];
    impacto: string;
    marca: string;
    ordenar: string;
  };
}

export function ProductList({ filters }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // PAGINACIÓN 
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 8

  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  useEffect(() => {
    let isMounted = true;

    const fetchAndFilterProducts = async () => {
      setLoading(true);
      let rawProducts: Product[] = [];

      try {
        console.log("📡 Conectando con Backend...");
        
        // Timeout de seguridad de 3 segundos
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout")), 3000)
        );

        // Pedimos TODOS (size=100) para filtrar en cliente si hace falta
        const apiCall = api.products.getAll(1, 100, filters);
        
        const data: any = await Promise.race([apiCall, timeoutPromise]);
        
        // 🚨 AQUÍ ESTÁ LA CLAVE: Tu backend devuelve { productos: [...] }
        const listaBackend = data?.productos || data?.content || (Array.isArray(data) ? data : []);
        
        if (listaBackend.length > 0) {
            console.log("✅ Productos recibidos:", listaBackend.length);
            rawProducts = listaBackend.map(mapBackendToFrontend);
        } else {
            console.warn("Backend devolvió lista vacía");
            // Si el backend responde pero vacío, no usamos respaldo (asumimos que no hay stock)
            // A menos que quieras forzar respaldo siempre, descomenta abajo:
            // throw new Error("Lista vacía"); 
        }

      } catch (err) {
        console.warn("⚠️ Backend lento o caído. Activando MODO RESPALDO.", err);
        rawProducts = PRODUCTOS_RESPALDO;
      }

      if (!isMounted) return;

      // --- FILTRADO EN CLIENTE ---
      const filtered = rawProducts.filter(p => {
           if (filters.categoria !== 'Todas' && p.categoria !== filters.categoria) return false;
           if (p.precio > filters.precioMax[0]) return false;
           if (filters.marca !== 'all' && p.marca !== filters.marca) return false;
           if (filters.impacto !== 'all') {
              if (filters.impacto === 'low' && p.impactoAmbiental.nivel !== 'Bajo impacto') return false;
              if (filters.impacto === 'neutro' && p.impactoAmbiental.nivel !== 'Neutro') return false;
              if (filters.impacto === 'medium' && p.impactoAmbiental.nivel !== 'Medio impacto') return false;
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

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="h-10 w-10 animate-spin text-[#0F8354]"/></div>;
  
  if (products.length === 0) {
      return (
        <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-medium">No se encontraron productos.</p>
            <p className="text-sm">Intenta ajustar tus filtros de búsqueda.</p>
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