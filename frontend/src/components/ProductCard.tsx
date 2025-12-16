'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Product } from "./ProductList"
import { useCart } from "@/contexts/CartContext"
import { useUI } from "@/contexts/UIContext"

interface ProductCardProps {
  product: Product
}

// --- FUNCIONES AUXILIARES ---

function getImpactColor(nivel: string): { bg: string; text: string } {
  // Normalizamos a minúsculas para comparar seguro
  const n = nivel?.toLowerCase() || "";
  
  if (n.includes("bajo")) return { bg: "#0F8354", text: "#0F8354" } // verde
  if (n.includes("medio")) return { bg: "#FFA500", text: "#ED6E12" } // naranja
  if (n.includes("neutro")) return { bg: "#006CFF", text: "#006CFF" } // azul
  
  return { bg: "#006CFF", text: "#006CFF" } // default azul
}

function formatPrice(precio: number | undefined | null): string {
  if (precio === undefined || precio === null) return "$0";
  // Usamos toLocaleString que es más estándar para internacionalización
  return `$${precio.toLocaleString("es-AR")}`;
}

// --- COMPONENTE ---

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { openProductModal } = useUI()
  
  // Fallbacks seguros para evitar Hidratación Mismatch
  const nivel = product.impactoAmbiental?.nivel || "Neutro";
  const impactColor = getImpactColor(nivel)
  const formattedPrice = formatPrice(product.precio)
  const huella = product.impactoAmbiental?.huellaCarbono || "0 kg CO₂";

  const handleOpenModal = () => {
    openProductModal(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir el modal
    e.nativeEvent.stopImmediatePropagation();
    addToCart(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir el modal
    console.log("Comparar", product.nombre);
  };

  return (
    <Card 
      className="w-full max-w-[365px] shadow-xl pt-0 cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-2xl group bg-white border border-gray-100 flex flex-col overflow-hidden"
      onClick={handleOpenModal}
    >
      
      <div className="relative aspect-video w-full overflow-hidden bg-gray-50">
        <Image 
          src={product.imagen || "/placeholder.png"} 
          alt={product.nombre || "Producto"} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        <div className="absolute top-4 left-4 z-10">
          <Badge 
            variant="secondary" 
            className="bg-white/95 backdrop-blur-sm text-foreground shadow-sm px-3 py-1 text-sm font-medium border-none"
          >
            {huella}
          </Badge>
        </div>
        
        <Button 
          variant="secondary" 
          className="absolute h-9 top[-40px] right-4 z-20 bg-white/90 backdrop-blur opacity-0 group-hover:top-4 group-hover:opacity-100 transition-all duration-300 shadow-md text-xs font-bold" 
          size="sm"
          onClick={handleCompare}
        >
          <Image 
            src="/icons/git-compare.svg" 
            alt="comparar" 
            width={16} 
            height={16} 
            className="mr-2"
          />
          Comparar
        </Button>
      </div>

      <div className="flex flex-col gap-3 pb-6 flex-1">
        <div className="flex items-center justify-between px-6 pt-5">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase truncate max-w-[150px]">
            {product.marca || "Genérico"}
          </h3>
          <div className="flex items-center gap-1 opacity-60">
            <Image src="/icons/award.svg" width={18} height={18} alt="Award" />
            <span className="text-xs font-medium text-gray-500">
              {product.certificaciones?.length || 0}
            </span>
          </div>
        </div>

        <h2 className="text-lg font-medium text-[#1A1A1B] leading-tight px-6 line-clamp-2 h[3.5rem]" title={product.nombre}>
          {product.nombre}
        </h2>

        <div className="flex flex-row gap-3 items-center px-6 mt-auto">
          <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
             <div className="h-full rounded-full" style={{ backgroundColor: impactColor.bg, width: '70%' }}></div>
          </div>
          <span className="text-xs font-bold uppercase whitespace-nowrap" style={{ color: impactColor.text }}>
            {nivel}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 px-6 mt-auto">
          <span className="text-2xl font-sans font-semibold text-[#1A1A1B]">{formattedPrice}</span>
          
          <Button 
            size="lg" 
            className="bg-[#0F8354] hover:bg-[#0a633e] text-white px-5 h-11 font-righteous text-sm rounded-lg shadow-md transition-transform active:scale-95 z-20"
            onClick={handleAddToCart}
          >
            <Image src="/icons/shopping-cart.svg" alt="Cart" width={20} height={20} className="mr-2 invert brightness-0"/>
            Añadir
          </Button>
        </div>
        
        {/* Footer badges: Manejo defensivo con '?.' */}
        {product.certificaciones && product.certificaciones.length > 0 && (
           <div className="px-6 flex flex-wrap gap-2 mt-2">
              {product.certificaciones.slice(0, 2).map((c, i) => (
                 <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md border border-gray-200">
                    {c}
                 </span>
              ))}
           </div>
        )}
      </div>
    </Card>
  )
}