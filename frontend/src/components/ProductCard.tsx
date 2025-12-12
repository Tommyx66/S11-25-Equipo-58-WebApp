'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Product } from "./ProductList"
import { useCart } from "@/contexts/CartContext"
import { useUI } from "@/contexts/UIContext" // Importar Contexto UI

interface ProductCardProps {
  product: Product
}

// --- FUNCIONES AUXILIARES QUE FALTABAN ---

function getImpactColor(nivel: string): { bg: string; text: string } {
  switch (nivel) {
    case "Bajo impacto":
      return { bg: "#0F8354", text: "#0F8354" } // verde
    case "Neutro":
      return { bg: "#006CFF", text: "#006CFF" } // azul
    case "Medio impacto":
      return { bg: "#FFA500", text: "#ED6E12" } // naranja
    default:
      return { bg: "#006CFF", text: "#006CFF" }
  }
}

function formatPrice(precio: number): string {
  // Manejo seguro por si precio viene undefined
  const val = precio || 0;
  const formatted = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `$${formatted}`
}

// --- COMPONENTE ---

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { openProductModal } = useUI()
  
  // Usamos un fallback seguro para el nivel
  const nivel = product.impactoAmbiental?.nivel || "Neutro";
  const impactColor = getImpactColor(nivel)
  const formattedPrice = formatPrice(product.precio)

  return (
    <Card 
      className="w-full max-w-[365px] shadow-xl pt-0 cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-2xl group bg-white border border-gray-100"
      onClick={() => openProductModal(product)}
    >
      
      <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
        <Image 
          src={product.imagen} 
          alt={product.nombre} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        <div className="absolute top-4 left-4">
          <Badge 
            variant="secondary" 
            className="bg-white/95 backdrop-blur-sm text-foreground shadow-sm px-3 py-1 text-sm font-medium"
          >
            {product.impactoAmbiental.huellaCarbono}
          </Badge>
        </div>
        
        <Button 
          variant="secondary" 
          className="absolute h-9 top-[-40px] right-4 z-10 bg-white/90 backdrop-blur opacity-0 group-hover:top-4 group-hover:opacity-100 transition-all duration-300 shadow-md text-xs font-bold" 
          size="sm"
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

      <div className="flex flex-col gap-3 pb-6">
        <div className="flex items-center justify-between px-6 pt-5">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">{product.marca}</h3>
          <div className="flex items-center gap-1 opacity-60">
            <Image src="/icons/award.svg" width={18} height={18} alt="Award" />
            <span className="text-xs font-medium text-gray-500">{product.certificaciones.length}</span>
          </div>
        </div>

        <h2 className="text-lg font-medium text-[#1A1A1B] leading-tight px-6 line-clamp-2 h-[3rem]">
          {product.nombre}
        </h2>

        <div className="flex flex-row gap-3 items-center px-6">
          <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
             <div className="h-full rounded-full" style={{ backgroundColor: impactColor.bg, width: '70%' }}></div>
          </div>
          <span className="text-xs font-bold uppercase whitespace-nowrap" style={{ color: impactColor.text }}>
            {nivel}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 px-6">
          <span className="text-2xl font-sans text-[#1A1A1B]">{formattedPrice}</span>
          
          <Button 
            size="lg" 
            className="bg-[#0F8354] hover:bg-[#0a633e] text-white px-5 h-11 font-righteous text-sm rounded-lg shadow-md transition-transform active:scale-95 z-20"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <Image src="/icons/shopping-cart.svg" alt="Cart" width={20} height={20} className="mr-2 "/>
            Añadir
          </Button>
        </div>
        
        {/* Footer badges opcional */}
        <div className="px-6 flex flex-wrap gap-2 mt-1">
           {product.certificaciones.slice(0, 2).map((c, i) => (
               <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{c}</span>
           ))}
        </div>
      </div>
    </Card>
  )
}