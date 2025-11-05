import { useState, useEffect } from 'react'
import { ShoppingCart, Phone, Mail, MapPin, Clock, Menu, X } from 'lucide-react'
import { supabase, Producto, Categoria, Servicio, Configuracion } from './lib/supabase'

interface CartItem {
  producto: Producto
  cantidad: number
}

function App() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [config, setConfig] = useState<Record<string, string>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    loadData()
    loadCart()
  }, [])

  const loadData = async () => {
    const [prodRes, catRes, servRes, confRes] = await Promise.all([
      supabase.from('productos').select('*').eq('activo', true).order('id'),
      supabase.from('categorias').select('*').eq('activa', true).order('orden').limit(8),
      supabase.from('servicios').select('*').eq('activo', true).order('id').limit(4),
      supabase.from('configuraciones').select('*')
    ])

    if (prodRes.data) setProductos(prodRes.data)
    if (catRes.data) setCategorias(catRes.data)
    if (servRes.data) setServicios(servRes.data)
    if (confRes.data) {
      const configMap: Record<string, string> = {}
      confRes.data.forEach(c => {
        configMap[c.clave] = c.valor
      })
      setConfig(configMap)
    }
  }

  const loadCart = () => {
    const saved = sessionStorage.getItem('cart')
    if (saved) setCart(JSON.parse(saved))
  }

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart)
    sessionStorage.setItem('cart', JSON.stringify(newCart))
  }

  const addToCart = (producto: Producto) => {
    const existing = cart.find(item => item.producto.id === producto.id)
    if (existing) {
      saveCart(cart.map(item =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
    } else {
      saveCart([...cart, { producto, cantidad: 1 }])
    }
  }

  const updateQuantity = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productoId)
    } else {
      saveCart(cart.map(item =>
        item.producto.id === productoId ? { ...item, cantidad } : item
      ))
    }
  }

  const removeFromCart = (productoId: number) => {
    saveCart(cart.filter(item => item.producto.id !== productoId))
  }

  const clearCart = () => {
    saveCart([])
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0)
  }

  const sendToWhatsApp = () => {
    const whatsapp = config.whatsapp || '51992763063'
    let message = '*NUEVA COMPRA - FERRETERÍA WILMER*\n\n'
    message += '*Productos:*\n'
    
    cart.forEach(item => {
      message += `\n• ${item.producto.nombre}\n`
      message += `  Cantidad: ${item.cantidad}\n`
      message += `  Precio: S/ ${item.producto.precio.toFixed(2)}\n`
      message += `  Subtotal: S/ ${(item.producto.precio * item.cantidad).toFixed(2)}\n`
    })
    
    message += `\n*TOTAL: S/ ${getTotal().toFixed(2)}*\n\n`
    message += 'Gracias por su preferencia'
    
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const filteredProducts = productos.filter(p => {
    const matchesCategory = !selectedCategoria || p.categoria_id === selectedCategoria
    const matchesSearch = !searchTerm || 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/images/logo-ferreteria.png" alt="Logo" className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md" />
              <h1 className="text-2xl font-bold">{config.nombre_empresa || 'Ferretería Wilmer'}</h1>
            </div>
            
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-amber-800 rounded-lg transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 md:top-auto w-full md:w-auto bg-amber-700 md:bg-transparent md:space-x-6 p-4 md:p-0 shadow-lg md:shadow-none`}>
              <a href="#inicio" className="py-2 md:py-0 hover:text-amber-200 transition-colors">Inicio</a>
              <a href="#productos" className="py-2 md:py-0 hover:text-amber-200 transition-colors">Productos</a>
              <a href="#servicios" className="py-2 md:py-0 hover:text-amber-200 transition-colors">Servicios</a>
              <a href="#contacto" className="py-2 md:py-0 hover:text-amber-200 transition-colors">Contacto</a>
              <a href="/admin.html" className="py-2 md:py-0 hover:text-amber-200 transition-colors">Admin</a>
            </nav>

            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-3 bg-white text-amber-600 rounded-full hover:bg-amber-50 transition-all shadow-md hover:shadow-lg"
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section id="inicio" className="relative bg-gradient-to-r from-amber-800 to-amber-900 text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/hero-ferreteria.png" alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl font-bold mb-4">Bienvenido a Ferretería Wilmer</h2>
          <p className="text-xl mb-8">Tu socio confiable en materiales de construcción y ferretería</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#productos" className="bg-white text-amber-800 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl">
              Ver Productos
            </a>
            <a href={`https://wa.me/${config.whatsapp || '51992763063'}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-all shadow-lg hover:shadow-xl">
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Nuestras Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.map(cat => (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategoria(cat.id)
                  document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
              >
                <h3 className="font-bold text-lg text-center text-amber-800">{cat.nombre}</h3>
                <p className="text-sm text-gray-600 text-center mt-2">{cat.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="productos" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Nuestros Productos</h2>
          
          <div className="mb-6 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <select
              value={selectedCategoria || ''}
              onChange={(e) => setSelectedCategoria(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(producto => (
              <div key={producto.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden transform hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <img
                    src={producto.imagen_principal || '/images/producto-martillo.png'}
                    alt={producto.nombre}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{producto.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{producto.descripcion}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-amber-600">S/ {producto.precio.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">Stock: {producto.stock}</span>
                  </div>
                  <button
                    onClick={() => addToCart(producto)}
                    disabled={producto.stock <= 0}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
                  >
                    {producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="servicios" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicios.map(servicio => (
              <div key={servicio.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden transform hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
                  <img
                    src={servicio.imagen || '/images/seccion-herramientas.png'}
                    alt={servicio.nombre}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-blue-800">{servicio.nombre}</h3>
                  <p className="text-gray-700 mb-4">{servicio.descripcion}</p>
                  {servicio.precio > 0 ? (
                    <p className="text-lg font-semibold text-blue-600">Desde S/ {servicio.precio.toFixed(2)}</p>
                  ) : (
                    <p className="text-lg font-semibold text-blue-600">{servicio.duracion_estimada || 'Consultar'}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-12 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Contáctanos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <MapPin className="mx-auto mb-3 text-amber-600" size={32} />
              <h3 className="font-bold mb-2">Dirección</h3>
              <p className="text-gray-600">{config.direccion || config.empresa_direccion}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Phone className="mx-auto mb-3 text-amber-600" size={32} />
              <h3 className="font-bold mb-2">Teléfono</h3>
              <p className="text-gray-600">{config.telefono || config.empresa_telefono}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Mail className="mx-auto mb-3 text-amber-600" size={32} />
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-gray-600">{config.email || config.empresa_email}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Clock className="mx-auto mb-3 text-amber-600" size={32} />
              <h3 className="font-bold mb-2">Horario</h3>
              <p className="text-gray-600 text-sm">{config.horario || config.horario_atencion}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">2025 Ferretería Wilmer - Todos los derechos reservados</p>
          <p className="text-gray-400">Desarrollado con tecnología moderna</p>
        </div>
      </footer>

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Carrito de Compras</h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-amber-800 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">El carrito está vacío</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.producto.id} className="flex items-center gap-4 border-b py-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.producto.imagen_principal || '/images/producto-martillo.png'}
                          alt={item.producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{item.producto.nombre}</h3>
                        <p className="text-amber-600 font-semibold">S/ {item.producto.precio.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-bold"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.producto.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-amber-600">S/ {getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={clearCart}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-all font-semibold"
                      >
                        Vaciar Carrito
                      </button>
                      <button
                        onClick={sendToWhatsApp}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                      >
                        Finalizar por WhatsApp
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
