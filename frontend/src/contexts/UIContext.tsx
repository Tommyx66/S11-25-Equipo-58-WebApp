'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { AuthModal } from '@/components/AuthModal' 

interface UIContextType {
  // 1. PRODUCT MODAL
  isProductModalOpen: boolean
  openProductModal: (product: any) => void
  closeProductModal: () => void
  selectedProduct: any
  
  // 2. CHECKOUT MODAL
  isCheckoutOpen: boolean
  openCheckout: () => void
  closeCheckout: () => void

  // 3. AUTH MODAL
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void

  // 4. IMPACT MODAL 
  isImpactOpen: boolean
  openImpact: () => void
  closeImpact: () => void

  // 5. CART
  closeCart: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  // Estados
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isImpactOpen, setIsImpactOpen] = useState(false)

  // -- LOGICA PRODUCTO --
  const openProductModal = (product: any) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }
  const closeProductModal = () => {
    setIsProductModalOpen(false)
    setSelectedProduct(null)
  }

  // -- LOGICA CHECKOUT --
  const openCheckout = () => setIsCheckoutOpen(true)
  const closeCheckout = () => setIsCheckoutOpen(false)
  
  // -- LOGICA AUTH --
  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  // -- LOGICA IMPACTO --
  const openImpact = () => setIsImpactOpen(true)
  const closeImpact = () => setIsImpactOpen(false)

  // -- LOGICA CART --
  const closeCart = () => console.log("Cerrando carrito (manejado en CartContext)") 

  return (
    <UIContext.Provider
      value={{
        // Producto
        isProductModalOpen,
        openProductModal,
        closeProductModal,
        selectedProduct,
        
        // Checkout
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        
        // Auth
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,

        // Impacto
        isImpactOpen,
        openImpact,
        closeImpact,

        // Cart
        closeCart,
      }}
    >
      {children}
      
      <AuthModal open={isAuthModalOpen} onClose={closeAuthModal} />
      
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}