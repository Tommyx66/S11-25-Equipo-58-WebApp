"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

const ProductSkeleton = () => (
  <div className="w-full max-w-[365px] flex flex-col gap-3">
    <div className="w-full aspect-[4/3] bg-gray-200 rounded-[12px] animate-pulse" />
    <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mt-2" />
    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
    <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
    <div className="flex justify-between mt-4 items-center">
      <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 w-1/3 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
);

export interface Product {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  categoria: string;
  impactoAmbiental: {
    huellaCarbono: string;
    materialesReciclables: boolean;
    nivel: string;
  };
  imagen: string;
  certificaciones: string[];
  material: string;
  origen: string;
}

const mapBackendToFrontend = (bp: any): Product => {
  const nivelRaw = bp.ecoBadge || bp.impacto || bp.nivelImpacto || "";
  const nivel = nivelRaw.toLowerCase().includes("bajo")
    ? "Bajo impacto"
    : nivelRaw.toLowerCase().includes("neutro")
    ? "Neutro"
    : "Medio impacto";

  const imgUrl =
    bp.imagenUrl && bp.imagenUrl.startsWith("http")
      ? bp.imagenUrl
      : "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=800&q=80";

  return {
    id: bp.productoId || bp.id || Math.random(),
    nombre: bp.nombre || "Producto sin nombre",
    marca: bp.nombreMarca || bp.marca || "EcoShop",
    precio: Number(bp.precio) || 0,
    categoria: bp.categoria || "Varios",
    impactoAmbiental: {
      huellaCarbono: `${bp.huellaCarbonoTotal || 0.4} kg CO₂`,
      materialesReciclables: true,
      nivel: nivel,
    },
    imagen: imgUrl,
    certificaciones: bp.certificaciones || ["Carbon Neutral"],
    material: bp.material || "Recycled",
    origen: bp.origen || "Local",
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  useEffect(() => {
    let isMounted = true;
    const fetchAndFilterProducts = async () => {
      setLoading(true);
      try {
        const data: any = await api.products.getAll(1, 100, {});
        const listaBackend =
          data?.productos || data?.content || (Array.isArray(data) ? data : []);
        let rawProducts: Product[] = [];

        if (listaBackend && listaBackend.length > 0) {
          rawProducts = listaBackend.map(mapBackendToFrontend);
          if (isMounted && onDataLoaded) {
            const uniqueBrands = Array.from(
              new Set(rawProducts.map((p) => p.marca))
            )
              .filter(Boolean)
              .sort() as string[];
            const uniqueMaterials = Array.from(
              new Set(rawProducts.map((p) => p.material))
            )
              .filter(Boolean)
              .sort() as string[];
            onDataLoaded(uniqueBrands, uniqueMaterials);
          }
        }
        if (!isMounted) return;

        // FILTRADO
        const filtered = rawProducts.filter((p) => {
          if (filters.categoria !== "Todas") {
            const catProd = (p.categoria || "").toLowerCase().trim();
            const catFiltro = filters.categoria.toLowerCase().trim();
            if (!catProd.includes(catFiltro)) return false;
          }
          if (p.precio > filters.precioMax[0]) return false;
          if (
            filters.marca !== "all" &&
            p.marca.toLowerCase() !== filters.marca.toLowerCase()
          )
            return false;
          if (filters.impacto !== "all") {
            const imp = p.impactoAmbiental.nivel.toLowerCase();
            const target = filters.impacto.toLowerCase();
            if (target === "low" && !imp.includes("bajo")) return false;
            if (target === "neutro" && !imp.includes("neutro")) return false;
            if (target === "medium" && !imp.includes("medio")) return false;
          }
          if (
            filters.material &&
            filters.material !== "all" &&
            p.material.toLowerCase() !== filters.material.toLowerCase()
          )
            return false;
          if (
            filters.origen &&
            filters.origen !== "all" &&
            p.origen?.toLowerCase() !== filters.origen.toLowerCase()
          )
            return false;
          return true;
        });

        if (filters.ordenar === "price-asc")
          filtered.sort((a, b) => a.precio - b.precio);
        if (filters.ordenar === "price-desc")
          filtered.sort((a, b) => b.precio - a.precio);

        setProducts(filtered);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAndFilterProducts();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 500, behavior: "smooth" });
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 500, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20 justify-items-center">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <RefreshCw className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No encontramos productos
        </h3>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Intenta ajustar los filtros de búsqueda para encontrar lo que
          necesitas.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-[#0F8354] hover:bg-[#0B6742]"
        >
          Recargar catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8 justify-items-center">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-4 pt-8 border-t border-gray-100">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft size={18} />
          </Button>
          <span className="text-sm font-medium text-gray-500 font-mono tracking-widest">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="h-10 w-10 rounded-full"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
