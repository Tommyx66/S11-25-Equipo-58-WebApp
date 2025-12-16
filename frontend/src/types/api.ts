// Definición de un ítem del carrito
export interface CartItem {
  itemId: number;
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
}

// Definición del Carrito completo
export interface Cart {
  carritoId: number;
  usuarioId: number;
  items: CartItem[];
  total: number;
}

// Definición de Paginación
export interface Page<T> {
  content: T[];      
  productos?: T[];   
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

// Tipos para Trazabilidad
export interface TraceabilityStep {
  titulo: string;
  subtitulo: string;
  detalle: string;
  metrica: string;
  icono?: string;
}

// Tipos para Métricas Ambientales
export interface EnvironmentalMetrics {
  huellaCarbono: number;
  aguaAhorrada: number;
  porcentajeReciclable: number;
  distanciaTransporte: number;
  origen: string;
}

// Tipos para Dashboard de Impacto
export interface ImpactDashboard {
  co2AhorradoTotal: number;
  aguaAhorradaTotal: number;
  ecoPuntosTotal: number;
  nivelSostenibilidad: string;
  comprasSostenibles: number;
}