import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '../common';
import { formatPrecio } from '../../utils/formatters';
import type { Producto } from '../../types';

interface ProductCardHomeProps {
  producto: Producto;
  onViewDetails: (producto: Producto) => void;
  onConsultar: (producto: Producto) => void;
}

export const ProductCardHome = ({ producto, onViewDetails, onConsultar }: ProductCardHomeProps) => {
  const precioFinal = producto.precio; // Asumiendo que no hay precio_oferta en la estructura actual
  const tieneDescuento = false; // No hay campo precio_oferta en el tipo actual

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {/* Imagen */}
      <div className="relative h-56 overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={producto.imagen_principal || 'https://placehold.co/400x400/e5e7eb/6b7280?text=Sin+Imagen'}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badge Destacado */}
        <div className="absolute top-3 right-3">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Destacado
          </span>
        </div>

        {/* Quick View en Hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button 
            onClick={() => onViewDetails(producto)}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform"
          >
            <Eye className="w-4 h-4" />
            Ver detalles
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        {/* Marca */}
        {producto.marca && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {producto.marca}
          </p>
        )}

        {/* Nombre con altura fija */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 h-14 flex-shrink-0">
          {producto.nombre}
        </h3>

        {/* Descripción corta */}
        {producto.descripcion && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {producto.descripcion}
          </p>
        )}

        {/* Precio y botones - siempre al fondo */}
        <div className="mt-auto flex-shrink-0">
          {/* Precio */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrecio(precioFinal)}
            </span>
            {tieneDescuento && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrecio(producto.precio)}
              </span>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onConsultar(producto)}
              disabled={producto.stock === 0}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Agregar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(producto)}
              className="px-3"
            >
              Ver
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};