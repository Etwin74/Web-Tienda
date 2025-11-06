import { useEffect } from 'react'
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

  const whatsappNumber = '51992763063'
  const message = `Hola, me interesa el producto "${producto.nombre}" por un precio de S/ ${producto.precio.toFixed(2)}`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Detalles del Producto
          </h3>
          <button
            type="button"
            className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
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

          {/* Disponibilidad - Sin SKU ni stock específico */}
          <div className="space-y-1">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-gray-500">Disponibilidad:</span>
              <span className={`text-sm font-medium ${
                producto.stock > 10 ? 'text-green-600' : 
                producto.stock > 0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {producto.stock > 0 ? 'Disponible' : 'Sin Stock'}
              </span>
            </div>
            {/* ✅ MODIFICACIÓN: SKU removido de vista pública */}
            {/* ✅ MODIFICACIÓN: Stock específico removido, solo mostrar estado */}
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

        {/* Cerrar al hacer clic en el fondo */}
        <div 
          className="absolute inset-0 -z-10" 
          onClick={onClose}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}