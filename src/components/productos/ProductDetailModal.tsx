import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import type { Producto } from '../../types'

interface ProductDetailModalProps {
  producto: Producto | null
  isOpen: boolean
  onClose: () => void
  onConsultar: (producto: Producto) => void
}

export const ProductDetailModal = ({ 
  producto, 
  isOpen, 
  onClose, 
  onConsultar 
}: ProductDetailModalProps) => {
  if (!producto) return null

  const whatsappNumber = '51992763063' // Obtener de config si es necesario
  const message = `Hola, me interesa el producto "${producto.nombre}" por un precio de S/ ${producto.precio.toFixed(2)}`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Detalles del Producto
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Imagen del producto */}
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={producto.imagen_principal || 'https://placehold.co/400x300/e5e7eb/6b7280?text=Sin+Imagen'}
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Información básica */}
                  <div className="space-y-3">
                    {producto.marca && (
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        {producto.marca}
                      </p>
                    )}
                    <h2 className="text-2xl font-bold text-gray-900">{producto.nombre}</h2>
                    <p className="text-3xl font-bold text-amber-600">
                      S/ {producto.precio.toFixed(2)}
                    </p>
                  </div>

                  {/* Descripción */}
                  {producto.descripcion && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                      <p className="text-sm text-gray-600">{producto.descripcion}</p>
                    </div>
                  )}

                  {/* SKU y Stock - ELIMINADOS */}
                  <div className="space-y-1">
                    {/* Estos campos han sido removidos para uso interno únicamente */}
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm font-medium text-gray-500">Disponibilidad:</span>
                      <span className={`text-sm font-medium ${
                        producto.stock > 10 ? 'text-green-600' : 
                        producto.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {producto.stock > 0 ? 'Disponible' : 'Sin Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => onConsultar(producto)}
                      disabled={producto.stock <= 0}
                      className="flex-1 bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center"
                    >
                      Consultar por WhatsApp
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}