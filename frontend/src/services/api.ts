import { Cart, Page, TraceabilityStep, EnvironmentalMetrics, ImpactDashboard } from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://ecoshop-backend-mm8u.onrender.com/api/v1';

async function handleResponse<T>(response: Response): Promise<T | null> {
  // Si no hay acceso, devolvemos null para manejarlo en la UI sin crashear
  if (response.status === 401 || response.status === 403) return null;
  
  if (!response.ok) {
     console.warn(`⚠️ API Error ${response.status} en ${response.url}`);
     return null; 
  }
  if (response.status === 204) return null;
  return response.json();
}

const getHeaders = (token?: string | null) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const api = {
  products: {
    getAll: async (page = 1, size = 6, filters: any = {}): Promise<Page<any>> => {
      // 1. Si hay búsqueda, usamos el endpoint de buscar directamente
      if (filters.q) {
         const searchUrl = `${API_BASE}/productos/buscar?q=${filters.q}&pagina=${page}&tamano=${size}`;
         return (await handleResponse(await fetch(searchUrl, { headers: getHeaders() }))) as Page<any>;
      }

      // 2. Si no, usamos el endpoint normal con filtros
      const params = new URLSearchParams({ pagina: page.toString(), tamano: size.toString() });
      
      if (filters.categoria && filters.categoria !== 'Todas') params.append('categoria', filters.categoria);
      if (filters.precioMax && filters.precioMax[0]) params.append('precioMax', filters.precioMax[0].toString());
      if (filters.marca && filters.marca !== 'all') params.append('marca', filters.marca);
      
      if (filters.impacto && filters.impacto !== 'all') {
         const map: Record<string, string> = { 'low': 'bajo_impacto', 'medium': 'medio_impacto', 'high': 'alto_impacto', 'neutro': 'neutro' };
         if (map[filters.impacto]) params.append('impacto', map[filters.impacto]);
      }

      // IMPORTANTE: cache: 'no-store' para asegurar datos frescos
      const res = await fetch(`${API_BASE}/productos?${params.toString()}`, { headers: getHeaders(), cache: 'no-store' });
      const data = await handleResponse<Page<any>>(res);
      
      return data || { content: [], totalPages: 0, totalElements: 0, last: true, size, number: 0, first: true, empty: true } as Page<any>;
    },

    getById: async (id: number) => handleResponse(await fetch(`${API_BASE}/productos/${id}`, { headers: getHeaders() })),
    
    // Dejamos search por si se usa individualmente en otro lado
    search: async (q: string, page = 1, size = 6) => 
      handleResponse<Page<any>>(await fetch(`${API_BASE}/productos/buscar?q=${q}&pagina=${page}&tamano=${size}`, { headers: getHeaders() })),
    
    getMetrics: async (id: number): Promise<EnvironmentalMetrics | null> => 
        handleResponse(await fetch(`${API_BASE}/productos/${id}/metricas-ambientales`, { headers: getHeaders() })),
    
    getTraceability: async (id: number): Promise<TraceabilityStep[] | null> => 
        handleResponse(await fetch(`${API_BASE}/productos/${id}/trazabilidad`, { headers: getHeaders() })),
    
    getJourney: async (id: number) => handleResponse(await fetch(`${API_BASE}/productos/${id}/viaje`, { headers: getHeaders() })),
    
    compare: async (ids: number[]) => handleResponse(await fetch(`${API_BASE}/productos/comparar?ids=${ids.join(',')}`, { headers: getHeaders() })),
  },

  users: {
    me: async (token: string) => handleResponse(await fetch(`${API_BASE}/usuarios/me`, { headers: getHeaders(token) })),
    getEcoPoints: async (userId: number, token: string) => handleResponse(await fetch(`${API_BASE}/usuarios/${userId}/eco-puntos`, { headers: getHeaders(token) })),
    getImpactDashboard: async (userId: number, token: string): Promise<ImpactDashboard | null> => 
        handleResponse(await fetch(`${API_BASE}/usuarios/${userId}/dashboard-impacto`, { headers: getHeaders(token) })),
    syncClerk: async (clerkId: string, data: any, token: string) => 
        fetch(`${API_BASE}/test/clerk/sync-user/${clerkId}`, { method: 'POST', headers: getHeaders(token), body: JSON.stringify(data) })
  },

  cart: {
    get: async (token: string) => handleResponse<Cart>(await fetch(`${API_BASE}/carrito`, { headers: getHeaders(token), cache: 'no-store' })),
    addItem: async (productoId: number, cantidad: number, token: string) => handleResponse<Cart>(await fetch(`${API_BASE}/carrito/items`, { method: 'POST', headers: getHeaders(token), body: JSON.stringify({ productoId, cantidad }) })),
    updateItem: async (itemId: number, cantidad: number, token: string) => handleResponse<Cart>(await fetch(`${API_BASE}/carrito/items/${itemId}?cantidad=${cantidad}`, { method: 'PUT', headers: getHeaders(token) })),
    removeItem: async (itemId: number, token: string) => handleResponse<Cart>(await fetch(`${API_BASE}/carrito/items/${itemId}`, { method: 'DELETE', headers: getHeaders(token) })),
    clear: async (token: string) => handleResponse<void>(await fetch(`${API_BASE}/carrito/vaciar`, { method: 'DELETE', headers: getHeaders(token) })),
    getImpact: async (token: string) => handleResponse(await fetch(`${API_BASE}/carrito/impacto-ambiental`, { headers: getHeaders(token) })),
  },

  orders: {
    create: async (data: any, token: string) => handleResponse(await fetch(`${API_BASE}/pedidos`, { method: 'POST', headers: getHeaders(token), body: JSON.stringify(data) })),
    calculateImpact: async (token: string) => handleResponse(await fetch(`${API_BASE}/checkout/calcular-impacto`, { method: 'POST', headers: getHeaders(token) })),
  }
};