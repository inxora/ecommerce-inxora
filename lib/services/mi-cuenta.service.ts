import { apiClient } from '@/lib/api/client'

// ─── Pedidos ──────────────────────────────────────────────────────────────────

export interface PedidoEstado {
  id: number
  codigo: string
  nombre: string
  color?: string | null
  es_estado_final?: boolean
  es_exitoso?: boolean
}

export interface PedidoMoneda {
  id?: number
  codigo: string
  simbolo: string
  nombre?: string
}

export interface PedidoListItem {
  id: number
  numero: string
  fecha_creacion: string
  fecha_entrega_estimada?: string | null
  estado: string | PedidoEstado
  estado_label?: string | null
  total: string | number
  moneda?: string | null
  moneda_pedido?: PedidoMoneda | null
  tipo_entrega?: string | null
  cantidad_productos?: number | null
  subtotal?: string | number | null
  igv?: string | number | null
  [key: string]: unknown
}

export interface PedidosListResponse {
  success: boolean
  data: {
    pedidos: PedidoListItem[]
    total?: number
  }
  message?: string
}

export interface PedidoItemDetalle {
  id: number
  descripcion?: string | null
  cantidad?: number | null
  precio_unitario?: string | number | null
  precio_unitario_cliente?: string | number | null
  total?: string | number | null
  subtotal?: string | number | null
  producto?: {
    id?: number | null
    nombre?: string | null
    sku?: string | null
    codigo?: string | null
    imagen_url?: string | null
    imagen_principal?: string | null
    [key: string]: unknown
  } | null
  imagen_url?: string | null
  [key: string]: unknown
}

export interface PedidoDetalle extends PedidoListItem {
  items?: PedidoItemDetalle[] | null
  lineas?: PedidoItemDetalle[] | null
  lineas_pedido?: PedidoItemDetalle[] | null
  direccion_entrega?: string | null
  observaciones?: string | null
  asesor_ventas?: {
    nombre: string
    apellidos: string
    correo?: string | null
    telefono_directo?: string | null
  } | null
  [key: string]: unknown
}

export interface PedidoDetalleResponse {
  success: boolean
  data: PedidoDetalle
}

// ─── Cotizaciones ─────────────────────────────────────────────────────────────

export interface CotizacionEstado {
  id: number
  codigo: string
  nombre: string
  color?: string | null
  es_estado_final?: boolean
  es_exitoso?: boolean
}

export interface CotizacionMoneda {
  id?: number
  codigo: string
  nombre?: string
  simbolo: string
}

export interface CotizacionListItem {
  id: number
  numero: string
  /** ISO date string (YYYY-MM-DD) */
  fecha_emision: string
  fecha_vencimiento?: string | null
  estado: CotizacionEstado
  total: string | number
  subtotal?: string | number | null
  igv?: string | number | null
  moneda_cotizacion?: CotizacionMoneda | null
  pdf_url?: string | null
  url_descarga?: string | null
  url_pdf?: string | null
}

export interface CotizacionesListResponse {
  success: boolean
  data: {
    cotizacion: CotizacionListItem[]
    total?: number
  }
  message?: string
}

// ─── Detalle de cotización ────────────────────────────────────────────────────

export interface CotizacionItemDetalle {
  id: number
  descripcion?: string | null
  /** Nombre del producto tal como viene en la API (/api/cotizaciones/:id) */
  producto_nombre?: string | null
  descripcion_personalizada?: string | null
  cantidad?: number | null
  unidad?: string | null
  precio_unitario?: string | number | null
  /** Precio unitario final aplicado al cliente */
  precio_unitario_final?: string | number | null
  precio_unitario_cliente?: string | number | null
  total?: string | number | null
  subtotal?: string | number | null
  descuento?: string | number | null
  /** SKU numérico o código de producto */
  sku?: number | string | null
  marca?: string | null
  proveedor?: string | null
  producto?: {
    id?: number | null
    nombre?: string | null
    sku?: string | null
    codigo?: string | null
    imagen_url?: string | null
    imagen_principal?: string | null
    [key: string]: unknown
  } | null
  imagen_url?: string | null
  [key: string]: unknown
}

export interface CotizacionDetalle extends CotizacionListItem {
  /** Campo real de la API: /api/cotizaciones/:id → data.cotizacion_detalle */
  cotizacion_detalle?: CotizacionItemDetalle[] | null
  items?: CotizacionItemDetalle[] | null
  lineas?: CotizacionItemDetalle[] | null
  lineas_cotizacion?: CotizacionItemDetalle[] | null
  observaciones?: string | null
  telefono_contacto?: string | null
  /** Puede ser string ("Sara IA") u objeto con nombre/apellidos */
  asesor_ventas?: string | {
    nombre: string
    apellidos: string
    correo?: string | null
    telefono_directo?: string | null
  } | null
  [key: string]: unknown
}

export interface CotizacionDetalleResponse {
  success: boolean
  data: CotizacionDetalle
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export const miCuentaService = {
  async getPedidosByCliente(clienteId: number, token: string): Promise<PedidosListResponse> {
    return apiClient<PedidosListResponse>('/api/pedidos/', {
      params: { cliente_id: clienteId },
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  /** Lista cotizaciones del cliente autenticado (el id no se envía al API; el token define el cliente). */
  async getCotizacionesByCliente(_clienteId: number, token: string): Promise<CotizacionesListResponse> {
    return apiClient<CotizacionesListResponse>('/api/cotizaciones/mi-cuenta', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async getCotizacionDetalle(cotizacionId: number, token: string): Promise<CotizacionDetalleResponse> {
    return apiClient<CotizacionDetalleResponse>(`/api/cotizaciones/${cotizacionId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    })
  },

  async getPedidoDetalle(pedidoId: number, token: string): Promise<PedidoDetalleResponse> {
    return apiClient<PedidoDetalleResponse>(`/api/pedidos/show/${pedidoId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    })
  },
}
