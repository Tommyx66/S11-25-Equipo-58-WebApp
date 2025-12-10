'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Product } from '@/components/ProductList' 

interface UIContextType {
  isAuthOpen: boolean; openAuth: () => void; closeAuth: () => void;
  isImpactOpen: boolean; openImpact: () => void; closeImpact: () => void;
  isCheckoutOpen: boolean; openCheckout: () => void; closeCheckout: () => void;
  
  // NUEVO
  isProductModalOpen: boolean;
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isImpactOpen, setIsImpactOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const closeProductModal = () => {
    setIsProductModalOpen(false)
    setTimeout(() => setSelectedProduct(null), 300) 
  }

  return (
    <UIContext.Provider
      value={{
        isAuthOpen, openAuth: () => setIsAuthOpen(true), closeAuth: () => setIsAuthOpen(false),
        isImpactOpen, openImpact: () => setIsImpactOpen(true), closeImpact: () => setIsImpactOpen(false),
        isCheckoutOpen, openCheckout: () => setIsCheckoutOpen(true), closeCheckout: () => setIsCheckoutOpen(false),
        isProductModalOpen, selectedProduct, openProductModal, closeProductModal
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) throw new Error('useUI must be used within a UIProvider')
  return context
}