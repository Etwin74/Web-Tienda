import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  'https://qiyfmtqxgjbycxepxdpi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWZtdHF4Z2pieWN4ZXB4ZHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMTE0MDksImV4cCI6MjA3Nzc4NzQwOX0.N3Vxcgp1ll2dau8YnDIBySo3TOhaeRUYIjivrhoPVUE'
)

let todosLosServicios = []
let swiper = null

// Cargar servicios desde la base de datos
async function cargarServicios() {
  try {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('id', { ascending: true })

    if (error) throw error

    todosLosServicios = data || []
    
    // Inicializar carrusel con servicios destacados
    inicializarCarrusel()
    
    // Mostrar todos los servicios en el catálogo
    mostrarCatalogo(todosLosServicios)

  } catch (error) {
    console.error('Error al cargar servicios:', error)
    document.getElementById('servicios-grid').innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-500 text-lg">Error al cargar los servicios. Por favor, intenta mas tarde.</p>
      </div>
    `
  }
}

// Inicializar carrusel con servicios destacados
function inicializarCarrusel() {
  const serviciosDestacados = todosLosServicios.filter(s => s.destacado === true)
  
  const carouselWrapper = document.getElementById('carousel-wrapper')
  
  if (serviciosDestacados.length === 0) {
    carouselWrapper.innerHTML = `
      <div class="swiper-slide flex justify-center items-center py-8">
        <p class="text-gray-500">No hay servicios destacados en este momento</p>
      </div>
    `
    return
  }

  carouselWrapper.innerHTML = serviciosDestacados.map(servicio => `
    <div class="swiper-slide">
      <div class="service-card bg-white rounded-xl shadow-xl overflow-hidden max-w-md mx-auto cursor-pointer" onclick="verDetalleServicio(${servicio.id})">
        <div class="overflow-hidden h-64">
          <img src="${servicio.imagen || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2224%22%3EServicio%3C/text%3E%3C/svg%3E'}" 
               alt="${servicio.nombre}" 
               class="service-img w-full h-full object-cover"
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2224%22%3EServicio%3C/text%3E%3C/svg%3E'"
          />
          <div class="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Destacado
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-3">${servicio.nombre}</h3>
          <p class="text-gray-600 mb-4 line-clamp-3">${servicio.descripcion}</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-2xl font-bold text-orange-600">
              ${servicio.precio > 0 ? 'S/ ' + parseFloat(servicio.precio).toFixed(2) : 'Consultar'}
            </span>
            ${servicio.duracion_estimada ? `<span class="text-sm text-gray-500">${servicio.duracion_estimada}</span>` : ''}
          </div>
          <button class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-md">
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  `).join('')

  // Destruir swiper anterior si existe
  if (swiper) {
    swiper.destroy(true, true)
  }

  // Inicializar Swiper
  swiper = new Swiper('.servicios-destacados', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: serviciosDestacados.length > 1,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  })
}

// Mostrar catálogo de servicios
function mostrarCatalogo(servicios) {
  const serviciosGrid = document.getElementById('servicios-grid')
  
  if (servicios.length === 0) {
    serviciosGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <p class="text-gray-500 text-lg">No se encontraron servicios.</p>
      </div>
    `
    return
  }

  serviciosGrid.innerHTML = servicios.map(servicio => `
    <div class="service-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer" onclick="verDetalleServicio(${servicio.id})">
      <div class="overflow-hidden h-48 relative">
        <img src="${servicio.imagen || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2224%22%3EServicio%3C/text%3E%3C/svg%3E'}" 
             alt="${servicio.nombre}" 
             class="service-img w-full h-full object-cover"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2224%22%3EServicio%3C/text%3E%3C/svg%3E'"
        />
        ${servicio.destacado ? '<div class="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">Destacado</div>' : ''}
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-2">${servicio.nombre}</h3>
        <p class="text-gray-600 mb-4 line-clamp-3">${servicio.descripcion}</p>
        <div class="flex justify-between items-center mb-4">
          <span class="text-2xl font-bold text-orange-600">
            ${servicio.precio > 0 ? 'S/ ' + parseFloat(servicio.precio).toFixed(2) : 'Consultar'}
          </span>
          ${servicio.duracion_estimada ? `<span class="text-sm text-gray-500">${servicio.duracion_estimada}</span>` : ''}
        </div>
        <div class="flex gap-2">
          <button onclick="event.stopPropagation(); verDetalleServicio(${servicio.id})" class="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
            Ver detalles
          </button>
          <button onclick="event.stopPropagation(); solicitarServicio('${servicio.nombre.replace(/'/g, "\\'")}', ${servicio.id})" class="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition text-sm font-semibold">
            Solicitar
          </button>
        </div>
      </div>
    </div>
  `).join('')
}

// Ver detalle del servicio con descripción larga
window.verDetalleServicio = function(id) {
  const servicio = todosLosServicios.find(s => s.id === id)
  if (!servicio) return

  const modal = document.getElementById('service-modal')
  const modalContent = document.getElementById('service-modal-content')
  
  modalContent.innerHTML = `
    <div class="space-y-6">
      <div class="overflow-hidden rounded-lg">
        <img src="${servicio.imagen || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 400%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22800%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2232%22%3E${servicio.nombre}%3C/text%3E%3C/svg%3E'}" 
             alt="${servicio.nombre}" 
             class="w-full h-64 object-cover"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 400%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22800%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2232%22%3E${servicio.nombre}%3C/text%3E%3C/svg%3E'"
        />
      </div>

      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-3xl font-bold text-gray-800">${servicio.nombre}</h2>
          ${servicio.destacado ? '<span class="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">Destacado</span>' : ''}
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Descripcion del Servicio</h3>
          <p class="text-gray-600 leading-relaxed whitespace-pre-line">${servicio.descripcion_larga || servicio.descripcion}</p>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-6">
          <div class="bg-orange-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Precio</p>
            <p class="text-2xl font-bold text-orange-600">
              ${servicio.precio > 0 ? 'S/ ' + parseFloat(servicio.precio).toFixed(2) : 'Consultar'}
            </p>
          </div>
          
          ${servicio.duracion_estimada ? `
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Duracion Estimada</p>
            <p class="text-2xl font-bold text-blue-600">${servicio.duracion_estimada}</p>
          </div>
          ` : ''}
        </div>

        <div class="flex gap-3 pt-4">
          <button onclick="solicitarServicio('${servicio.nombre.replace(/'/g, "\\'")}', ${servicio.id})" 
                  class="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold text-lg shadow-lg">
            Solicitar Servicio
          </button>
          <button onclick="consultarWhatsApp('${servicio.nombre.replace(/'/g, "\\'")}', ${servicio.id})" 
                  class="flex-1 bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition font-semibold text-lg shadow-lg">
            Consultar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  `

  modal.classList.remove('hidden')
}

// Solicitar servicio
window.solicitarServicio = function(nombreServicio, id) {
  const mensaje = `Hola, quiero solicitar el servicio de *${nombreServicio}*. ¿Podrian darme mas informacion?`
  const url = `https://wa.me/51992763063?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}

// Consultar por WhatsApp
window.consultarWhatsApp = function(nombreServicio, id) {
  const mensaje = `Hola, necesito informacion sobre el servicio de *${nombreServicio}*. ¿Cual es el costo y disponibilidad?`
  const url = `https://wa.me/51992763063?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}

// Buscador de servicios
document.getElementById('search-servicios').addEventListener('input', (e) => {
  const busqueda = e.target.value.toLowerCase()
  
  if (!busqueda) {
    mostrarCatalogo(todosLosServicios)
    return
  }

  const serviciosFiltrados = todosLosServicios.filter(servicio =>
    servicio.nombre.toLowerCase().includes(busqueda) ||
    servicio.descripcion.toLowerCase().includes(busqueda) ||
    (servicio.descripcion_larga && servicio.descripcion_larga.toLowerCase().includes(busqueda))
  )

  mostrarCatalogo(serviciosFiltrados)
})

// Cerrar modal
document.getElementById('service-modal-close').addEventListener('click', () => {
  document.getElementById('service-modal').classList.add('hidden')
})

// Cerrar modal al hacer clic fuera
document.getElementById('service-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('service-modal')) {
    document.getElementById('service-modal').classList.add('hidden')
  }
})

// Inicializar
cargarServicios()
