import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Button } from '../common';
import { ServiceCardHome } from '../servicios/ServiceCardHome';
import { LoadingSpinner } from '../common';
import { supabase } from '../../config/supabase';
import type { Servicio } from '../../types';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';

interface ServiciosDestacadosCarouselProps {
  onSolicitarCotizacion: (servicio: Servicio) => void;
}

export const ServiciosDestacadosCarousel = ({ 
  onSolicitarCotizacion 
}: ServiciosDestacadosCarouselProps) => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiciosDestacados();
  }, []);

  const fetchServiciosDestacados = async () => {
    try {
      const { data, error } = await supabase
        .from('servicios')
        .select('*, categoria:categorias_servicios(nombre)')
        .eq('activo', true)
        .eq('destacado', true)
        .order('id', { ascending: true })
        .limit(10);

      if (error) throw error;
      setServicios(data || []);
    } catch (error) {
      console.error('Error al cargar servicios destacados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si hay menos de 4, mostrar grid estático
  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Servicios Profesionales</h2>
              <p className="text-gray-600">Expertos en instalaciones y mantenimiento</p>
            </div>
            <Button variant="outline">Ver todos →</Button>
          </div>
          
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (servicios.length < 4) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Servicios Profesionales</h2>
              <p className="text-gray-600">Expertos en instalaciones y mantenimiento</p>
            </div>
            <Button variant="outline">Ver todos →</Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((servicio) => (
              <ServiceCardHome
                key={servicio.id}
                servicio={servicio}
                onSolicitarCotizacion={onSolicitarCotizacion}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Servicios Profesionales</h2>
            <p className="text-gray-600">Expertos en instalaciones y mantenimiento</p>
          </div>
          <Button variant="outline">Ver todos →</Button>
        </div>

        <div className="relative group overflow-x-hidden">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              reverseDirection: false, // Hacia la DERECHA
              pauseOnMouseEnter: false, // ✅ NO pausar
            }}
            speed={500}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="overflow-hidden"
          >
            {servicios.map((servicio) => (
              <SwiperSlide key={servicio.id} className="h-auto">
                <ServiceCardHome
                  servicio={servicio}
                  onSolicitarCotizacion={onSolicitarCotizacion}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};