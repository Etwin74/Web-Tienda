import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qiyfmtqxgjbycxepxdpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWZtdHF4Z2pieWN4ZXB4ZHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMTE0MDksImV4cCI6MjA3Nzc4NzQwOX0.N3Vxcgp1ll2dau8YnDIBySo3TOhaeRUYIjivrhoPVUE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de base de datos
export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  imagen: string | null
  activa: boolean
  orden: number
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria_id: number
  imagen_principal: string | null
  activo: boolean
  destacado: boolean
  sku: string | null
  marca: string | null
}

export interface Servicio {
  id: number
  nombre: string
  descripcion: string
  precio: number
  imagen: string | null
  activo: boolean
  destacado: boolean
  duracion_estimada: string | null
}

export interface Configuracion {
  id: number
  clave: string
  valor: string
  tipo: string
  descripcion: string | null
}
