# Ferreteria Wilmer - Sitio Web Completo

E-commerce y sitio corporativo para Ferreteria Wilmer en Chota, Cajamarca.

## Caracteristicas

### Panel de Administracion
- Gestion completa de productos (CRUD)
- **Gestion completa de categorias (CRUD)** - Nuevo
- Gestion de servicios con imagenes
- Gestion de administradores
- Dashboard con estadisticas

### E-commerce Funcional
- Catalogo de productos con imagenes
- Filtros por categorias y marcas
- Buscador en tiempo real
- Carrito de compras con persistencia
- Checkout via WhatsApp Business
- Modal de detalles de productos

### Pagina de Servicios
- Carrusel de servicios destacados
- Catalogo completo de servicios
- Boton "Solicitar Servicio" en cada tarjeta
- Modal con descripcion detallada
- Integracion WhatsApp

### Seccion de Contacto
- Formulario completo (Nombre, Email, Telefono, Asunto, Mensaje)
- Informacion de contacto actualizada
- Envio de mensajes via WhatsApp
- Direccion: Av. Bambamarca N 186, Chota, Cajamarca
- Telefono: +51 992 763 063

## Tecnologias

- **Frontend**: React + Vite + TypeScript
- **Estilos**: TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Despliegue**: CDN distribuido

## Estructura del Proyecto

```
/public/
  ├── index.html                (Landing corporativa)
  ├── productos.html            (E-commerce con carrito)
  ├── servicios.html            (Servicios + carrusel)
  ├── login.html                (Login admin)
  ├── dashboard.html            (Dashboard admin)
  ├── productos-admin.html      (Gestion productos)
  ├── categorias-admin.html     (Gestion categorias) - NUEVO
  ├── servicios-admin.html      (Gestion servicios)
  ├── administradores.html      (Gestion admins)
  └── assets/
      ├── productos.js          (Logica e-commerce)
      └── servicios.js          (Logica servicios)
```

## Datos Iniciales

- 20 productos con marcas (Stanley, Bosch, Makita, Truper, etc.)
- 16 categorias de productos
- Sistema completo de filtros y busqueda

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build para produccion
pnpm build

# Preview del build
pnpm preview
```

## Despliegue

El proyecto se despliega automaticamente en la CDN. Los archivos estaticos se sirven desde `/dist/`.

## Notas Importantes

### Gestion de Categorias (Nueva Funcionalidad)
- CRUD completo desde panel admin
- Validacion de nombres unicos
- Proteccion: No se puede eliminar categoria con productos asociados
- Sistema de notificaciones toast

### E-commerce
- Carrito persiste en localStorage
- Validacion de stock antes de agregar
- Filtros: categorias + marcas
- Integracion WhatsApp Business

### Contacto
- Formulario completo con validaciones
- Envio directo a WhatsApp
- Datos de contacto actualizados

## Soporte

Para soporte contactar a Ferreteria Wilmer:
- Telefono/WhatsApp: +51 992 763 063
- Email: contacto@ferreteriavilmer.com
- Direccion: Av. Bambamarca N 186, Chota, Cajamarca

---

Desarrollado con profesionalidad para Ferreteria Wilmer - 2025
