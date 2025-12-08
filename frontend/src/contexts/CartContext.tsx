'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Product } from '@/components/ProductList'

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  isOpen: boolean
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getTotalPrice: () => number
  getTotalCarbonFootprint: () => number
  getTotalCarbonSaved: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
    setIsOpen(true)
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen((prev) => !prev)

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.precio * item.quantity, 0)
  }

  const getTotalCarbonFootprint = () => {
    return cartItems.reduce((total, item) => {
      const carbonValue = parseFloat(item.impactoAmbiental.huellaCarbono.replace('kg CO₂', '').replace('kg CO2', '').trim())
      return total + (carbonValue * item.quantity)
    }, 0)
  }

  const getTotalCarbonSaved = () => {
    // random 30% vs convencionales
    const totalFootprint = getTotalCarbonFootprint()
    const estimatedConventional = totalFootprint * 1.3
    return estimatedConventional - totalFootprint
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        openCart,
        closeCart,
        toggleCart,
        getTotalPrice,
        getTotalCarbonFootprint,
        getTotalCarbonSaved,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

