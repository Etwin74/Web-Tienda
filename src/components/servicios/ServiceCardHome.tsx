import { MessageSquare, Wrench } from 'lucide-react';
import { Button } from '../common';
import { formatPrecio } from '../../utils/formatters';
import type { Servicio } from '../../types';

interface ServiceCardHomeProps {
  servicio: Servicio;
  onSolicitarCotizacion: (servicio: Servicio) => void;
}

export const ServiceCardHome = ({ servicio, onSolicitarCotizacion }: ServiceCardHomeProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 flex-shrink-0">
        {servicio.imagen ? (
          <img
            src={servicio.imagen}
            alt={servicio.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Wrench className="h-16 w-16 text-primary-600" />
          </div>
        )}
        
        {/* Badge Destacado */}
        <div className="absolute top-3 right-3">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Destacado
          </span>
        </div>
      </div>

      {/* Contenido con altura controlada */}
      <div className="p-5 flex flex-col flex-1">
        {/* Categoría */}
        {servicio.categoria && (
          <p className="text-xs text-primary-600 uppercase tracking-wide mb-2 font-semibold">
            {servicio.categoria?.nombre}
          </p>
        )}

        {/* Nombre con altura fija */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 h-14 flex-shrink-0">
          {servicio.nombre}
        </h3>

        {/* Descripción - con flex-1 para empujar contenido hacia abajo */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
          {servicio.descripcion}
        </p>

        {/* Duración (si existe) */}
        {servicio.duracion_estimada && (
          <p className="text-xs text-gray-500 mb-3">
            ⏱️ Duración estimada: {servicio.duracion_estimada}
          </p>
        )}

        {/* Precio y botón - SIEMPRE AL FONDO con mt-auto */}
        <div className="mt-auto flex-shrink-0">
          {/* Precio */}
          <div className="text-2xl font-bold text-primary-600 mb-4">
            {servicio.precio > 0 
              ? `Desde ${formatPrecio(servicio.precio)}`
              : 'Cotización personalizada'
            }
          </div>

          {/* Botón alineado */}
          <Button
            variant="primary"
            onClick={() => onSolicitarCotizacion(servicio)}
            className="w-full flex items-center justify-center gap-2 py-3"
          >
            <MessageSquare className="w-5 h-5" />
            Solicitar Cotización
          </Button>
        </div>
      </div>
    </div>
  );
};