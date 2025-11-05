import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  'https://qiyfmtqxgjbycxepxdpi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWZtdHF4Z2pieWN4ZXB4ZHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMTE0MDksImV4cCI6MjA3Nzc4NzQwOX0.N3Vxcgp1ll2dau8YnDIBySo3TOhaeRUYIjivrhoPVUE'
)

let productos = []
let categorias = []
let marcas = []
let carrito = JSON.parse(localStorage.getItem('carrito')) || []
let filtroActual = {
  categoria: '',
  marca: '',
  busqueda: ''
}

// Cargar datos iniciales
async function cargarDatosIniciales() {
  try {
    // Cargar productos
    const { data: productosData, error: productosError } = await supabase
      .from('productos')
      .select('*, categorias(nombre)')
      .eq('activo', true)
      .order('id', { ascending: false })

    if (productosError) throw productosError
    productos = productosData || []

    // Cargar categorías
    const { data: categoriasData, error: categoriasError } = await supabase
      .from('categorias')
      .select('*')
      .eq('activa', true)
      .order('nombre')

    if (categoriasError) throw categoriasError
    categorias = categoriasData || []

    // Extraer marcas únicas de productos
    marcas = [...new Set(productos.filter(p => p.marca).map(p => p.marca))].sort()

    // Llenar filtros
    llenarFiltros()
    
    // Mostrar productos
    mostrarProductos()
    
    // Actualizar contador del carrito
    actualizarContadorCarrito()

  } catch (error) {
    console.error('Error al cargar datos:', error)
    document.getElementById('productos-grid').innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-500">Error al cargar productos. Por favor, intenta mas tarde.</p>
      </div>
    `
  }
}

// Llenar dropdowns de filtros
function llenarFiltros() {
  const categoriaSelect = document.getElementById('filter-categoria')
  const marcaSelect = document.getElementById('filter-marca')

  // Llenar categorías
  categoriaSelect.innerHTML = '<option value="">Todas las categorias</option>' +
    categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('')

  // Llenar marcas
  marcaSelect.innerHTML = '<option value="">Todas las marcas</option>' +
    marcas.map(m => `<option value="${m}">${m}</option>`).join('')
}

// Mostrar productos con filtros aplicados
function mostrarProductos() {
  let productosFiltrados = productos

  // Aplicar filtros
  if (filtroActual.categoria) {
    productosFiltrados = productosFiltrados.filter(p => p.categoria_id == filtroActual.categoria)
  }

  if (filtroActual.marca) {
    productosFiltrados = productosFiltrados.filter(p => p.marca === filtroActual.marca)
  }

  if (filtroActual.busqueda) {
    const busqueda = filtroActual.busqueda.toLowerCase()
    productosFiltrados = productosFiltrados.filter(p => 
      p.nombre.toLowerCase().includes(busqueda) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(busqueda)) ||
      (p.marca && p.marca.toLowerCase().includes(busqueda))
    )
  }

  const productosGrid = document.getElementById('productos-grid')

  if (productosFiltrados.length === 0) {
    productosGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <p class="text-gray-500 text-lg">No se encontraron productos.</p>
        <button onclick="limpiarFiltros()" class="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
          Limpiar filtros
        </button>
      </div>
    `
    return
  }

  productosGrid.innerHTML = productosFiltrados.map(producto => `
    <div class="product-card bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="relative overflow-hidden h-48">
        <img src="${producto.imagen_principal || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2218%22%3EProducto%3C/text%3E%3C/svg%3E'}" 
             alt="${producto.nombre}" 
             class="product-image w-full h-full object-cover"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2218%22%3EProducto%3C/text%3E%3C/svg%3E'"
        />
        ${producto.stock <= 5 ? '<div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Ultimas unidades</div>' : ''}
        ${producto.marca ? `<div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">${producto.marca}</div>` : ''}
      </div>
      <div class="p-4">
        <div class="mb-2">
          <span class="text-xs text-orange-600 font-semibold">${producto.categorias?.nombre || 'Sin categoria'}</span>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">${producto.nombre}</h3>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">${producto.descripcion || 'Sin descripcion'}</p>
        
        <div class="flex justify-between items-center mb-3">
          <span class="text-2xl font-bold text-orange-600">S/ ${parseFloat(producto.precio).toFixed(2)}</span>
          <span class="text-sm text-gray-500">Stock: ${producto.stock}</span>
        </div>

        <div class="flex gap-2">
          <button onclick="verDetalleProducto(${producto.id})" 
                  class="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
            Ver detalles
          </button>
          <button onclick="agregarAlCarrito(${producto.id})" 
                  class="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition text-sm font-semibold">
            Agregar
          </button>
        </div>
      </div>
    </div>
  `).join('')
}

// Limpiar filtros
window.limpiarFiltros = function() {
  filtroActual = { categoria: '', marca: '', busqueda: '' }
  document.getElementById('search-productos').value = ''
  document.getElementById('filter-categoria').value = ''
  document.getElementById('filter-marca').value = ''
  mostrarProductos()
}

// Ver detalle del producto
window.verDetalleProducto = function(id) {
  const producto = productos.find(p => p.id === id)
  if (!producto) return

  const modal = document.getElementById('product-modal')
  const modalContent = document.getElementById('product-modal-content')
  
  modalContent.innerHTML = `
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <img src="${producto.imagen_principal || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2224%22%3EProducto%3C/text%3E%3C/svg%3E'}" 
             alt="${producto.nombre}" 
             class="w-full h-64 object-cover rounded-lg"
        />
      </div>
      <div>
        <div class="mb-2">
          <span class="text-sm text-orange-600 font-semibold">${producto.categorias?.nombre || 'Sin categoria'}</span>
          ${producto.marca ? `<span class="ml-2 text-sm text-gray-500">• ${producto.marca}</span>` : ''}
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-3">${producto.nombre}</h2>
        <p class="text-gray-600 mb-4">${producto.descripcion || 'Sin descripcion disponible'}</p>
        
        <div class="mb-4">
          <span class="text-3xl font-bold text-orange-600">S/ ${parseFloat(producto.precio).toFixed(2)}</span>
        </div>

        <div class="mb-4">
          <span class="text-sm text-gray-600">Stock disponible: </span>
          <span class="font-semibold ${producto.stock <= 5 ? 'text-red-600' : 'text-green-600'}">${producto.stock} unidades</span>
        </div>

        ${producto.sku ? `<div class="mb-4"><span class="text-sm text-gray-500">SKU: ${producto.sku}</span></div>` : ''}

        <div class="flex gap-3">
          <button onclick="agregarAlCarrito(${producto.id}); document.getElementById('product-modal').classList.add('hidden')" 
                  class="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold">
            Agregar al carrito
          </button>
          <button onclick="comprarAhora(${producto.id})" 
                  class="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition font-semibold">
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  `

  modal.classList.remove('hidden')
}

// Agregar producto al carrito
window.agregarAlCarrito = function(id) {
  const producto = productos.find(p => p.id === id)
  if (!producto) return

  const itemExistente = carrito.find(item => item.id === id)
  
  if (itemExistente) {
    if (itemExistente.cantidad < producto.stock) {
      itemExistente.cantidad++
    } else {
      alert('No hay suficiente stock disponible')
      return
    }
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen_principal,
      cantidad: 1,
      stock: producto.stock
    })
  }

  localStorage.setItem('carrito', JSON.stringify(carrito))
  actualizarContadorCarrito()
  mostrarCarrito()

  // Animación del contador
  const contador = document.getElementById('cart-count')
  contador.classList.add('cart-counter')
  setTimeout(() => contador.classList.remove('cart-counter'), 300)
}

// Comprar ahora (directo a WhatsApp)
window.comprarAhora = function(id) {
  const producto = productos.find(p => p.id === id)
  if (!producto) return

  const mensaje = `Hola, quiero comprar:\n\n• ${producto.nombre}\n• Precio: S/ ${parseFloat(producto.precio).toFixed(2)}\n\n¿Esta disponible?`
  const url = `https://wa.me/51992763063?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
  const contador = document.getElementById('cart-count')
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0)
  contador.textContent = total
}

// Mostrar/ocultar carrito
function toggleCarrito() {
  const sidebar = document.getElementById('cart-sidebar')
  const overlay = document.getElementById('cart-overlay')
  
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open')
    overlay.classList.add('hidden')
  } else {
    sidebar.classList.add('open')
    overlay.classList.remove('hidden')
    mostrarCarrito()
  }
}

// Mostrar contenido del carrito
function mostrarCarrito() {
  const cartItems = document.getElementById('cart-items')
  const cartTotal = document.getElementById('cart-total')

  if (carrito.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center text-gray-500 py-8">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8L3 3H1m6 10v6a2 2 0 002 2h8a2 2 0 002-2v-6M7 13v-1a5 5 0 0110 0v1M9 21v-2m6 2v-2"></path>
        </svg>
        <p>Tu carrito esta vacio</p>
      </div>
    `
    cartTotal.textContent = 'S/ 0.00'
    return
  }

  cartItems.innerHTML = carrito.map(item => `
    <div class="flex gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
      <img src="${item.imagen || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'}" 
           alt="${item.nombre}" 
           class="w-16 h-16 object-cover rounded">
      <div class="flex-1">
        <h4 class="font-semibold text-sm mb-1">${item.nombre}</h4>
        <p class="text-orange-600 font-bold text-sm">S/ ${parseFloat(item.precio).toFixed(2)}</p>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="cambiarCantidad(${item.id}, -1)" class="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">-</button>
          <span class="font-semibold">${item.cantidad}</span>
          <button onclick="cambiarCantidad(${item.id}, 1)" class="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">+</button>
          <button onclick="eliminarDelCarrito(${item.id})" class="ml-auto text-red-500 hover:text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `).join('')

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  cartTotal.textContent = `S/ ${total.toFixed(2)}`
}

// Cambiar cantidad en el carrito
window.cambiarCantidad = function(id, cambio) {
  const item = carrito.find(i => i.id === id)
  if (!item) return

  const nuevaCantidad = item.cantidad + cambio
  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(id)
    return
  }

  if (nuevaCantidad <= item.stock) {
    item.cantidad = nuevaCantidad
    localStorage.setItem('carrito', JSON.stringify(carrito))
    actualizarContadorCarrito()
    mostrarCarrito()
  } else {
    alert('No hay suficiente stock disponible')
  }
}

// Eliminar del carrito
window.eliminarDelCarrito = function(id) {
  carrito = carrito.filter(item => item.id !== id)
  localStorage.setItem('carrito', JSON.stringify(carrito))
  actualizarContadorCarrito()
  mostrarCarrito()
}

// Checkout por WhatsApp
document.getElementById('checkout-whatsapp').addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('Tu carrito esta vacio')
    return
  }

  let mensaje = 'Hola, quiero hacer el siguiente pedido:\n\n'
  carrito.forEach(item => {
    mensaje += `• ${item.nombre} x${item.cantidad} - S/ ${(item.precio * item.cantidad).toFixed(2)}\n`
  })
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  mensaje += `\n*Total: S/ ${total.toFixed(2)}*`
  
  const url = `https://wa.me/51992763063?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
})

// Event listeners
document.getElementById('cart-toggle').addEventListener('click', toggleCarrito)
document.getElementById('cart-close').addEventListener('click', toggleCarrito)
document.getElementById('cart-overlay').addEventListener('click', toggleCarrito)
document.getElementById('product-modal-close').addEventListener('click', () => {
  document.getElementById('product-modal').classList.add('hidden')
})

// Filtros
document.getElementById('search-productos').addEventListener('input', (e) => {
  filtroActual.busqueda = e.target.value
  mostrarProductos()
})

document.getElementById('filter-categoria').addEventListener('change', (e) => {
  filtroActual.categoria = e.target.value
  mostrarProductos()
})

document.getElementById('filter-marca').addEventListener('change', (e) => {
  filtroActual.marca = e.target.value
  mostrarProductos()
})

// Inicializar
cargarDatosIniciales()
