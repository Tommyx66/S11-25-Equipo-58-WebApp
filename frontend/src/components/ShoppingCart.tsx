'use client'

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingBag, Leaf } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useUI } from "@/contexts/UIContext";
import clsx from "clsx"; 

function formatPrice(precio: number): string {
  const formatted = precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$${formatted}`;
}

export function ShoppingCart() {
  const {
    cartItems,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalCarbonFootprint,
    getTotalCarbonSaved,
  } = useCart();
  
  const { isSignedIn } = useAuth();
  const { openAuth, openCheckout } = useUI();
  
  const totalPrice = getTotalPrice();
  const totalCarbon = getTotalCarbonFootprint();
  const carbonSaved = getTotalCarbonSaved();

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      <div
        className={clsx(
          "fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#0F8354]" />
            <h2 className="text-2xl font-righteous text-[#1A1A1B]">Carrito de Compras</h2>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-900">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-xl font-medium font-sans text-gray-900">Tu carrito está vacío</p>
              <p className="text-sm font-sans text-gray-500 mt-2 text-center">
                Agrega productos sostenibles para empezar a reducir tu huella.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0">
                <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-gray-200">
                  <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-base text-[#1A1A1B] leading-tight line-clamp-2">{item.nombre}</h3>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{item.marca}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-gray-600 transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center font-medium text-sm text-[#1A1A1B]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-gray-600 transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-[#0F8354] font-bold text-lg">{formatPrice(item.precio)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t bg-white">
            <div className="bg-[#EAF3EE] p-4 mx-6 mt-6 rounded-xl border border-[#0F8354]/20 flex items-start gap-3">
              <div className="bg-[#0F8354]/10 p-2 rounded-full shrink-0">
                <Leaf className="h-5 w-5 text-[#0F8354]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#0F8354] font-bold text-sm mb-1">Impacto de tu compra</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Huella total:</span>
                  <span className="font-medium text-[#1A1A1B]">{totalCarbon.toFixed(1)} kg CO₂</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Ahorro estimado:</span>
                  <span className="font-bold text-[#0F8354] -ml-1">-{Math.abs(carbonSaved).toFixed(1)} kg CO₂</span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-gray-500 text-lg">Total</span>
                <span className="text-3xl font-righteous text-[#1A1A1B]">{formatPrice(totalPrice)}</span>
              </div>
              <Button
                className="w-full bg-[#0F8354] hover:bg-[#0a633e] text-white font-righteous py-7 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => {
                  closeCart();
                  if (isSignedIn) openCheckout();
                  else openAuth();
                }}
              >
                {isSignedIn ? "Proceder al Pago" : "Inicia Sesión para Pagar"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}