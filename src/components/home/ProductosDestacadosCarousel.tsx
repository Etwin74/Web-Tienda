import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Button } from '../common';
import { ProductCardHome } from '../productos/ProductCardHome';
import { LoadingSpinner } from '../common';
import { supabase } from '../../config/supabase';
import type { Producto } from '../../types';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';

interface ProductosDestacadosCarouselProps {
  onViewDetails: (producto: Producto) => void;
  onConsultar: (producto: Producto) => void;
}

export const ProductosDestacadosCarousel = ({ 
  onViewDetails, 
  onConsultar 
}: ProductosDestacadosCarouselProps) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductosDestacados();
  }, []);

  const fetchProductosDestacados = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .eq('destacado', true)
        .order('id', { ascending: true })
        .limit(12);

      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error('Error al cargar productos destacados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si hay menos de 4, mostrar grid estático
  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
              <p className="text-gray-600">Los mejores productos para tu proyecto</p>
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

  if (productos.length < 4) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
              <p className="text-gray-600">Los mejores productos para tu proyecto</p>
            </div>
            <Button variant="outline">Ver todos →</Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <ProductCardHome
                key={producto.id}
                producto={producto}
                onViewDetails={onViewDetails}
                onConsultar={onConsultar}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
            <p className="text-gray-600">Los mejores productos para tu proyecto</p>
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
              reverseDirection: true, // Hacia la IZQUIERDA
              pauseOnMouseEnter: false, // ✅ DESACTIVAR PAUSA
            }}
            speed={500}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="overflow-hidden"
          >
            {productos.map((producto) => (
              <SwiperSlide key={producto.id} className="h-auto">
                <ProductCardHome
                  producto={producto}
                  onViewDetails={onViewDetails}
                  onConsultar={onConsultar}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};