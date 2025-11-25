import { ProductCard } from './ProductCard'


export interface Product {
  id: number
  nombre: string
  marca: string
  precio: number
  impactoAmbiental: {
    huellaCarbono: string
    materialesReciclables: boolean
    nivel: "Bajo impacto" | "Neutro" | "Medio impacto"
  }
  imagen: string
  certificaciones: string[]
}


const products: Product[] = [
  {
    id: 1,
    nombre: "Allbirds Tree Runners - Zapatillas Sostenibles",
    marca: "ALLBIRDS",
    precio: 99000,
    impactoAmbiental: {
      huellaCarbono: "7.6kg CO₂",
      materialesReciclables: true,
      nivel: "Neutro"
    },
    imagen: "/mocks/product1.png",
    certificaciones: ["Carbon Neutral", "B-Corp", "FSC Certified"]
  },
  {
    id: 2,
    nombre: "Who Gives A Crap - Papel Higiénico de Bambú",
    marca: "WHO GIVES A CRAP",
    precio: 29990,
    impactoAmbiental: {
      huellaCarbono: "1.2kg CO₂",
      materialesReciclables: true,
      nivel: "Bajo impacto"
    },
    imagen: "/mocks/product2.png",
    certificaciones: ["Carbon Neutral", "B-Corp", "FSC Certified", "Plastic Free"]
  },
  {
    id: 3,
    nombre: "S'well Bottle - Botella Térmica de Acero",
    marca: "SWELL",
    precio: 45000,
    impactoAmbiental: {
      huellaCarbono: "7.6kg CO₂",
      materialesReciclables: true,
      nivel: "Medio impacto"
    },
    imagen: "/mocks/product3.png",
    certificaciones: ["Carbon Neutral", "B-Corp", "FSC Certified"]
  },
  {
    id: 4,
    nombre: "Lush Shampoo Bar - Champú Sólido Naked",
    marca: "LUSH",
    precio: 14990,
    impactoAmbiental: {
      huellaCarbono: "7.6kg CO₂",
      materialesReciclables: true,
      nivel: "Bajo impacto"
    },
    imagen: "/mocks/product4.png",
    certificaciones: ["Carbon Neutral", "B-Corp", "FSC Certified"]
  },
  {
    id: 5,
    nombre: "Patagonia Better Sweater - Chaqueta Reciclada",
    marca: "PATAGONIA",
    precio: 129990,
    impactoAmbiental: {
      huellaCarbono: "9.2kg CO₂",
      materialesReciclables: true,
      nivel: "Neutro"
    },
    imagen: "/mocks/product2.png",
    certificaciones: ["Recycled Materials", "B-Corp", "Fair Trade"]
  },
  {
    id: 6,
    nombre: "EcoVessel Insulated Tumbler - Taza Térmica",
    marca: "ECOVESSEL",
    precio: 34990,
    impactoAmbiental: {
      huellaCarbono: "3.5kg CO₂",
      materialesReciclables: true,
      nivel: "Bajo impacto"
    },
    imagen: "/mocks/product4.png",
    certificaciones: ["Carbon Neutral", "BPA Free", "Recyclable"]
  },
  {
    id: 7,
    nombre: "Toms Alpargatas - Zapatos Sostenibles",
    marca: "TOMS",
    precio: 59990,
    impactoAmbiental: {
      huellaCarbono: "5.8kg CO₂",
      materialesReciclables: true,
      nivel: "Bajo impacto"
    },
    imagen: "/mocks/product3.png",
    certificaciones: ["Carbon Neutral", "B-Corp", "One for One"]
  },
  {
    id: 8,
    nombre: "Method All-Purpose Cleaner - Limpiador Natural",
    marca: "METHOD",
    precio: 8990,
    impactoAmbiental: {
      huellaCarbono: "2.3kg CO₂",
      materialesReciclables: true,
      nivel: "Bajo impacto"
    },
    imagen: "/shoe.png",
    certificaciones: ["Carbon Neutral", "B-Corp", "Plastic Free", "Biodegradable"]
  }
]

export function ProductList() {
  return (
    <div className="grid p-6 grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-red-20 justify-items-center">
      {products.map((product) => (
        <ProductCard key={product.id} product={product}/>
      ))}
    </div>
  )
}
