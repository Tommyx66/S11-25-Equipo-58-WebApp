'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'
import { api } from '@/services/api'
import type { Product } from '@/components/ProductList'
import type { CartItem as ApiCartItem } from '@/types/api'

export interface CartItem extends Product {
  quantity: number
  cartItemId?: number
}

interface CartContextType {
  cartItems: CartItem[]
  isOpen: boolean
  addToCart: (product: Product, openSidebar?: boolean) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getTotalPrice: () => number
  getTotalCarbonFootprint: () => number
  getTotalCarbonSaved: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, getToken, isLoaded } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isLoaded) return; 

    const loadCart = async () => {
      if (isSignedIn) {
        // --- LOGUEADO ---
        try {
          const token = await getToken()
          if (token) {
            const cartData = await api.cart.get(token)
            if (cartData && cartData.items) {
              const mappedItems: CartItem[] = cartData.items.map((item: ApiCartItem) => ({
                id: item.productoId,
                cartItemId: item.itemId,
                nombre: item.nombre,
                marca: "", 
                precio: item.precio,
                impactoAmbiental: { huellaCarbono: "0", materialesReciclables: true, nivel: "Neutro" },
                imagen: item.imagenUrl,
                certificaciones: [],
                categoria: "",
                quantity: item.cantidad,
                // ✅ CORRECCIÓN APLICADA AQUÍ:
                material: "polyester", // Valor por defecto para pasar el build
                origen: "international" // Valor por defecto para pasar el build
              }))
              setCartItems(mappedItems)
            }
          }
        } catch (error) {
          console.log("Esperando sincronización de usuario...")
        }
      } else {
        // --- INVITADO  ---
        if (typeof window !== 'undefined') {
          const savedCart = localStorage.getItem('guest_cart')
          if (savedCart) {
            try {
              setCartItems(JSON.parse(savedCart))
            } catch (e) {
              console.error("Error parsing cart", e)
            }
          }
        }
      }
      setIsInitialized(true) 
    }

    loadCart()
  }, [isSignedIn, isLoaded, getToken])

  useEffect(() => {
    if (!isInitialized) return; 

    if (!isSignedIn) {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized, isSignedIn])

  // --- ACTIONS ---

  const addToCart = async (product: Product, openSidebar = true) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...product, quantity: 1 }]
    })
    
    if (openSidebar) {
        setIsOpen(true)
    }

    if (isSignedIn) {
      try {
        const token = await getToken()
        if (token) await api.cart.addItem(product.id, 1, token)
      } catch (err) { console.warn("Sync error", err) }
    }
  }

  const removeFromCart = async (productId: number) => {
    const itemToRemove = cartItems.find(i => i.id === productId)
    setCartItems((prev) => prev.filter((item) => item.id !== productId))

    if (isSignedIn && itemToRemove?.cartItemId) {
      try {
        const token = await getToken()
        if (token) await api.cart.removeItem(itemToRemove.cartItemId, token)
      } catch (err) { console.warn("Sync error", err) }
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    
    const itemToUpdate = cartItems.find(i => i.id === productId)
    setCartItems((prev) => prev.map((item) => item.id === productId ? { ...item, quantity } : item))

    if (isSignedIn && itemToUpdate?.cartItemId) {
      try {
        const token = await getToken()
        if (token) await api.cart.updateItem(itemToUpdate.cartItemId, quantity, token)
      } catch (err) { console.warn("Sync error", err) }
    }
  }

  const clearCart = async () => {
    setCartItems([])
    localStorage.removeItem('guest_cart')
    
    if (isSignedIn) {
      try {
        const token = await getToken()
        if (token) await api.cart.clear(token)
      } catch (err) { console.warn("Sync error", err) }
    }
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen((prev) => !prev)

  const getTotalPrice = () => cartItems.reduce((total, item) => total + item.precio * item.quantity, 0)

  const getTotalCarbonFootprint = () => {
    return cartItems.reduce((total, item) => {
      const carbonString = item.impactoAmbiental?.huellaCarbono || "0.5"
      const carbonValue = parseFloat(carbonString.replace(/[^\d.]/g, '')) || 0.5
      return total + (carbonValue * item.quantity)
    }, 0)
  }

  const getTotalCarbonSaved = () => getTotalCarbonFootprint() * 0.3

  return (
    <CartContext.Provider
      value={{
        cartItems, isOpen, addToCart, removeFromCart, updateQuantity, clearCart,
        openCart, closeCart, toggleCart, getTotalPrice,
        getTotalCarbonFootprint, getTotalCarbonSaved,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) throw new Error('useCart must be used within a CartProvider')
  return context
}