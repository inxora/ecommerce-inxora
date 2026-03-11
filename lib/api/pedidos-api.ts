import { apiClient, ApiError } from '@/lib/api/client'

const BASE = '/api/pedidos'

export interface PedidoDetalleInput {
  sku: number
  cantidad?: number
  precio_unitario: number
  descripcion?: string
  descuento_unitario?: number
  id_proveedor_asignado?: number
  observaciones?: string
}

export interface DireccionEntregaPedidoInput {
  direccion: string
  referencia?: string
  id_distrito?: number
  ubigeo?: string
  id_tipo_lugar_entrega?: number
  nombre_lugar?: string
  horario_recepcion?: string
  instrucciones_acceso?: string
  requiere_cita?: boolean
  latitud?: number
  longitud?: number
}

export interface CreatePedidoBody {
  id_cliente: number
  detalles: PedidoDetalleInput[]
  tipo_entrega?: 'DELIVERY' | 'RECOJO'
  direccion_entrega?: string
  direccion_entrega_pedido?: DireccionEntregaPedidoInput
  instrucciones_entrega?: string
  contacto_recepcion?: string
  telefono_contacto_entrega?: string
  /** Costo de envío: 20 si provincia en tarifa plana (Lima/Callao), 0 si no */
  costo_envio?: number
}

export interface CreatePedidoResponse {
  success: boolean
  data: {
    id: number
    numero: string
    [key: string]: unknown
  }
}

/**
 * Crea un pedido sin cotización (carrito → pedido directo).
 * Usar el token del cliente logueado (Authorization: Bearer).
 */
export async function createPedido(
  body: CreatePedidoBody,
  token: string
): Promise<CreatePedidoResponse> {
  const res = await apiClient<CreatePedidoResponse>(`${BASE}/`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 30000,
  })
  return res
}

export { ApiError }
