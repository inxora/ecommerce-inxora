/**
 * Servicio de pedidos: crea pedidos sin cotización (carrito → pedido directo).
 * Consume POST /api/pedidos/ con Authorization del cliente.
 */

import {
  createPedido as createPedidoApi,
  type CreatePedidoBody,
  type CreatePedidoResponse,
  type PedidoDetalleInput,
  ApiError,
} from '@/lib/api/pedidos-api'

export type { CreatePedidoBody, CreatePedidoResponse, PedidoDetalleInput }
export { ApiError }

export const pedidosService = {
  /**
   * Crea un pedido sin cotización.
   * @param body - id_cliente, detalles (sku, cantidad, precio_unitario) y opcionales de entrega
   * @param token - Token del cliente (Bearer)
   */
  async crearPedido(body: CreatePedidoBody, token: string): Promise<CreatePedidoResponse> {
    return createPedidoApi(body, token)
  },
}
