// Tipos principales de la aplicación

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_principal?: string;
  categoria_id?: number;
  marca?: string;
  sku?: string;
  stock: number;
  activo: boolean;
  destacado?: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  orden: number;
  activa: boolean;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio?: number;
  imagen?: string;
  categoria?: {
    nombre: string;
  };
  duracion_estimada?: string;
  activo: boolean;
}

export interface Configuracion {
  id: number;
  clave: string;
  valor: string;
}

// Tipos para el carrito
export interface CartItem {
  producto: Producto;
  cantidad: number;
}