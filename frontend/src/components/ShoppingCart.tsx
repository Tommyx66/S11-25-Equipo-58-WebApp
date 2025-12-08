'use client'

import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { X, Minus, Plus, Trash2, ShoppingBag, Leaf } from 'lucide-react'
import clsx from 'clsx'

function formatPrice(precio: number): string {
  const formatted = precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `$${formatted}`
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
  } = useCart()

  const totalPrice = getTotalPrice()
  const totalCarbon = getTotalCarbonFootprint()
  const carbonSaved = getTotalCarbonSaved()

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
          "fixed right-0 top-0 h-full w-full md:w-2xl  bg-white shadow-2xl z-50 flex flex-col",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        
        <div className="flex items-center justify-between p-6 ">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-2xl font-righteous">Carrito de Compras</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* items del carro */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-900">
              <ShoppingBag className="h-16 w-16 mb-4 text-gray-500" />
              <p className="text-xl font-medium font-sans text-gray-500">Tu carrito está vacío</p>
              <p className="text-lg font-base font-sans text-gray-500">Agrega productos sostenibles para empezar</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 pb-6 border-b last:border-b-0">
            
                <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.imagen}
                    alt={item.nombre}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* informacion de producto*/}
                <div className="flex-1 min-w-0">
                  <div className='flex flex-row  items-start justify-between'>

<div >


                  <h3 className="font-medium text-lg mb-1">{item.nombre}</h3>
                  <p className="text-sm text-gray-500 mb-3 uppercase">{item.marca}</p>
</div>
<div className="flex justify-end">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                  </div>

                  {/* selector cantidad y precio */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 border border-gray-300">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center  rounded hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-medium  rounded py-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center  rounded hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-[#0F8354]  text-base">
                      {formatPrice(item.precio)}
                    </span>
                  </div>

                
                </div>
              </div>
            ))
          )}
        </div>

        {/*  */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-[#EAF3EE] border-t border-b">
            <div className="flex items-start gap-3">
              <div className="text-[#508F6A] shrink-0">
                <Leaf className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#508F6A] font-base mb-4 text-base">
                  Impacto Ambiental de tu Compra
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Huella de carbono</p>
                    <p className="text-lg font-base">{totalCarbon.toFixed(1)} kg CO<span className="text-xs align-bottom">2</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CO<span className="text-xs align-bottom">2</span> ahorrado vs convencional</p>
                    <p className="text-lg font-base text-[#508F6A]">
                      -{Math.abs(carbonSaved).toFixed(1)} kg CO<span className="text-xs align-bottom">2</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* sumario orden */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t space-y-3 text-gray-500">
            <div className="flex justify-between ">
              <span>Subtotal</span>
              <span className="text-[#508F6A] font-base">
                {formatPrice(totalPrice)}
              </span>
            </div>
            {/* <div className="flex justify-between text-sm">
              <span>Envío</span>
              <span className="text-gray-500">Subtotal</span>
            </div> */}
            <div className="flex justify-between text-lg font-base text-black pt-3 border-t">
              <span>Total</span>
              <span className="text-[#0F8354]">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        )}

        {/* boton checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t">
            <Button
              className="w-full bg-[#0F8354] hover:bg-[#0a6350] text-white  font-righteous py-6 rounded-xs text-xl"
              onClick={() => {
                // logica de pago
                console.log('proceda al pago')
              }}
            >
              Proceder al Pago
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

