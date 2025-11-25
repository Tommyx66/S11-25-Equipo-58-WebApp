import { Card, CardContent, CardFooter } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
import { ProductCard } from './ProductCard'

// Sample product data
const products = [
  {
    id: 1,
    name: 'Camiseta Orgánica',
    price: 29.99,
    image: '/logo.png',
    category: 'Ropa',
    impact: 'Bajo',
    brand: 'EcoWear',
  },
  {
    id: 2,
    name: 'Vela de Soja Natural',
    price: 18.50,
    image: '/logo.png',
    category: 'Hogar',
    impact: 'Bajo',
    brand: 'GreenHome',
  },
  {
    id: 3,
    name: 'Bolsa de Algodón',
    price: 15.00,
    image: '/logo.png',
    category: 'Accesorios',
    impact: 'Bajo',
    brand: 'EcoStyle',
  },
  {
    id: 4,
    name: 'Champú Sólido',
    price: 12.99,
    image: '/logo.png',
    category: 'Cuidado Personal',
    impact: 'Bajo',
    brand: 'PureNature',
  },
  {
    id: 5,
    name: 'Jeans Sostenibles',
    price: 79.99,
    image: '/logo.png',
    category: 'Ropa',
    impact: 'Medio',
    brand: 'EcoWear',
  },
  {
    id: 6,
    name: 'Set de Toallas Bambú',
    price: 45.00,
    image: '/logo.png',
    category: 'Hogar',
    impact: 'Bajo',
    brand: 'GreenHome',
  },
  {
    id: 7,
    name: 'Gafas de Sol Madera',
    price: 65.00,
    image: '/logo.png',
    category: 'Accesorios',
    impact: 'Medio',
    brand: 'EcoStyle',
  },
  {
    id: 8,
    name: 'Crema Facial Natural',
    price: 24.99,
    image: '/logo.png',
    category: 'Cuidado Personal',
    impact: 'Bajo',
    brand: 'PureNature',
  },
]

export function ProductList() {
  return (
    <div className="grid p-6 grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-red-20 justify-items-center">
      {products.map((product) => (
        <ProductCard key={product.id}/>
      ))}
    </div>
  )
}
