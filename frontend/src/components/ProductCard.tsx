import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Product } from "./ProductList"

interface ProductCardProps {
  product: Product
}


function getImpactColor(nivel: string): { bg: string; text: string } {
  switch (nivel) {
    case "Bajo impacto":
      return { bg: "#0F8354", text: "#0F8354" } // verde - bajo impacto
    case "Neutro":
      return { bg: "#006CFF", text: "#006CFF" } // azul neutro
    case "Medio impacto":
      return { bg: "#FFA500", text: "#ED6E12" } // naranja alto impacto
    default:
      return { bg: "#006CFF", text: "#006CFF" }
  }
}


function formatPrice(precio: number): string {
  const formatted = precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `$${formatted}`
}

export function ProductCard({ product }: ProductCardProps) {
  const impactColor = getImpactColor(product.impactoAmbiental.nivel)
  const formattedPrice = formatPrice(product.precio)

  return (
    <Card className="w-full max-w-[365px]  shadow-xl  pt-0">
     
      <div className="relative aspect-video  w-full">
        <Image
          src={product.imagen}
          alt={product.nombre}
          fill
          className="object-cover"
        />

    
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className="bg-white/95 backdrop-blur-sm text-foreground shadow-md px-4 py-2 text-base font-normal"
          >
            {product.impactoAmbiental.huellaCarbono}
          </Badge>
        </div>

       
        <Button
          variant="secondary"
          className="absolute h-10 font-righteous text-md flex flex-row items-center justify-center gap-1 px-2 rounded-sm top-[-10px] border border-black right-[-10px] z-10 overflow-visible bg-white/95"
          size="default"
        >
          <Image 
            src="/icons/git-compare.svg"
            alt="git icon"
            width={24}
            height={24}
            className=" self-start"
          />
          <p className=" self-end">
          Comparar
          </p>
        </Button>
      </div>

      <div className="pb-0  space-y-4">
        <div className="flex items-center justify-between px-6">
          <h3 className="text-md font-light text-[#707070]  tracking-wide uppercase">{product.marca}</h3>
          <div className="flex items-center gap-1 ">
           <Image
           src="/icons/award.svg"
           width={24}
           height={24}
           alt="Award icon"
           />
            <span className="text-lg text-md font-light text-[#707070] ">{product.certificaciones.length}</span>
          </div>
        </div>

        <h2 className="text-lg font-light font-sans leading-tight px-6">
          {product.nombre}
        </h2>

        <div className="flex flex-row gap-4 items-center w-full  justify-between px-6">
          <div 
            className="h-2 w-full rounded-full" 
            style={{ backgroundColor: impactColor.bg }}
          ></div>
          <span 
            className="text-lg font-base whitespace-nowrap"
            style={{ color: impactColor.text }}
          >
            {product.impactoAmbiental.nivel}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 px-6">
          <span className="font-sans font-normal not-italic text-[24px] leading-[24px] align-middle">{formattedPrice}</span>
          <Button size="lg" className="bg-[#0F8354] hover:bg-[#0F8354] text-white px-2 font-righteous text-md">
           <Image src="/icons/shopping-cart.svg"
           alt="Shopping Cart Icon"
           width={24}
           height={24}
           />
            Añadir
          </Button>
        </div>

        <div className="flex flex-wrap  gap-2 pt-4 border-t justify-center">
          {product.certificaciones.map((certificacion, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="bg-muted text-muted-foreground font-normal text-xs"
            >
              {certificacion}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  )
}
