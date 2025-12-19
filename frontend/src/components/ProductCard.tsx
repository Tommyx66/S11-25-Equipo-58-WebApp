'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Product } from "./ProductList"
import { useCart } from "@/contexts/CartContext"
import { useUI } from "@/contexts/UIContext"
import { ShoppingCart, GitCompare, Award } from "lucide-react"

interface ProductCardProps {
  product: Product
}

// Helper para colores 
function getImpactColor(nivel: string): { bg: string; text: string; label: string } {
  const n = nivel?.toLowerCase() || "";
  
  if (n.includes("bajo")) return { bg: "#0F8354", text: "#0F8354", label: "Bajo impacto" }
  if (n.includes("medio")) return { bg: "#F59E0B", text: "#D97706", label: "Medio impacto" }
  if (n.includes("neutro")) return { bg: "#3B82F6", text: "#2563EB", label: "Neutro" }
  
  return { bg: "#3B82F6", text: "#2563EB", label: "Neutro" }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { openProductModal } = useUI()
  
  const impact = getImpactColor(product.impactoAmbiental?.nivel);
  const formattedPrice = product.precio ? `$${product.precio.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00";
  const huella = product.impactoAmbiental?.huellaCarbono || "0 kg CO₂";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Comparar", product.nombre);
  };

  return (
    <Card 
      className="group relative w-full max-w-[340px] bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
      onClick={() => openProductModal(product)}
    >
      {/* --- HEADER IMAGEN --- */}
      <div className="relative aspect-[4/3] w-full bg-[#F4F5F7] overflow-hidden">
        <Image 
          src={product.imagen || "/placeholder.png"} 
          alt={product.nombre} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" 
        />
        
        {/* Badge Co2 */}
        <div className="absolute top-3 left-3 z-10">
          <Badge 
            variant="secondary" 
            className="bg-white/90 backdrop-blur-md text-gray-700 shadow-sm px-3 py-1.5 h-auto text-xs font-bold border border-gray-100 rounded-full"
          >
            {huella}
          </Badge>
        </div>
        
        {/* Button comparar  */}
        <Button 
          variant="outline" 
          className="absolute top-3 right-3 h-8 px-2 bg-white/90 backdrop-blur border-gray-200 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg hover:bg-white"
          onClick={handleCompare}
        >
          <GitCompare className="w-3.5 h-3.5 mr-1.5" />
          Comparar
        </Button>
      </div>

      {/* --- CONTENIDO --- */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        
        <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                {product.marca}
            </span>
            <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                 <Award className="w-3.5 h-3.5" /> 
                 <span>3</span>
            </div>
        </div>

        {/* Titulo */}
        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.5rem]" title={product.nombre}>
          {product.nombre}
        </h3>

        {/* Barra de impacto */}
        <div className="w-full mt-1">
            <div className="flex justify-between items-end mb-1.5">
                <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden mr-3">
                    <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ backgroundColor: impact.bg, width: '75%' }} 
                    />
                </div>
                <span className="text-[10px] font-bold uppercase whitespace-nowrap" style={{ color: impact.text }}>
                    {impact.label}
                </span>
            </div>
        </div>

        {/* Precio y Botón */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xl font-bold text-gray-900 font-sans tracking-tight">
            {formattedPrice}
          </span>
          
          <Button 
            className="bg-[#0F8354] hover:bg-[#0B6742] text-white rounded-lg h-9 px-4 text-xs font-bold uppercase tracking-wide shadow-md shadow-green-900/10 transition-transform active:scale-95"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Añadir
          </Button>
        </div>

        {/* Footer Certificacione */}
        <div className="pt-4 mt-1 border-t border-gray-50 flex flex-wrap gap-2">
            <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-[10px] font-medium border border-gray-200">
                Carbon Neutral
            </span>
            <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-[10px] font-medium border border-gray-200">
                B-Corp
            </span>
            {product.certificaciones?.includes("FSC") && (
                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-[10px] font-medium border border-gray-200">
                    FSC Certified
                </span>
            )}
        </div>
      </div>
    </Card>
  )
}