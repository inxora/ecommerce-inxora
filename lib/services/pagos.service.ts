/**
 * Servicio de pagos: genera token Izipay y valida resultado del widget.
 * Consume POST /api/pagos/crear-token y POST /api/pagos/validar
 *
 * Flujo completo:
 *  1. crearTokenIzipay(idPedido, token)  → obtiene formToken + publicKey
 *  2. [Frontend renderiza widget Izipay con esos datos]
 *  3. [Usuario completa pago → widget emite kr_answer + kr_hash]
 *  4. validarPagoIzipay(krAnswer, krHash, token) → confirma PAID/UNPAID
 */

import {
  crearTokenPago,
  crearTokenSinPedido as crearTokenSinPedidoApi,
  validarPago,
  type CrearTokenRequest,
  type CrearTokenResponse,
  type ValidarPagoRequest,
  type ValidarPagoResponse,
  ApiError,
} from '@/lib/api/pagos-api'

export type {
  CrearTokenRequest,
  CrearTokenResponse,
  ValidarPagoRequest,
  ValidarPagoResponse,
}
export { ApiError }

export const pagosService = {
  /**
   * Genera el formToken de Izipay para un pedido ya creado.
   * Debe llamarse DESPUÉS de crear el pedido exitosamente.
   *
   * @param idPedido  - ID del pedido recién creado
   * @param token     - Bearer token del cliente autenticado
   * @returns         - { formToken, publicKey } para inicializar el widget
   * @throws ApiError si el pedido no existe (404) o hay error en Izipay (502)
   */
  async crearTokenIzipay(
    idPedido: number,
    token: string
  ): Promise<CrearTokenResponse> {
    return crearTokenPago({ id_pedido: idPedido }, token)
  },

  /**
   * Genera formToken de Izipay usando solo el monto, sin pedido creado.
   * Para mostrar el widget inmediatamente al seleccionar Tarjeta.
   */
  async crearTokenSinPedido(monto: number, token: string): Promise<CrearTokenResponse> {
    return crearTokenSinPedidoApi({ monto }, token)
  },

  /**
   * Valida la firma HMAC-SHA256 y confirma el resultado del pago.
   * Recibe los datos tal como los emite el evento onSubmit del widget de Izipay.
   *
   * @param krAnswer  - String JSON emitido por el widget (campo kr-answer)
   * @param krHash    - Firma HMAC recibida del widget (campo kr-hash)
   * @param token     - Bearer token del cliente autenticado
   * @returns         - { orderStatus: 'PAID' | 'UNPAID', orderId }
   * @throws ApiError si la firma es inválida (400) o error de servidor (500+)
   */
  async validarPagoIzipay(
    krAnswer: string,
    krHash: string,
    token: string
  ): Promise<ValidarPagoResponse> {
    return validarPago({ kr_answer: krAnswer, kr_hash: krHash }, token)
  },
}
