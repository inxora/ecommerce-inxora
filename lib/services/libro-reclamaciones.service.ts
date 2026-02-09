/**
 * Servicio para Libro de Reclamaciones (Ley N° 29571)
 * Consume el endpoint /api/libro-reclamaciones del backend
 */

import { api } from '@/lib/api/client'

export interface LibroReclamacionesPayload {
  nombre: string
  apellido1: string
  apellido2?: string
  tipoDoc?: string
  numDoc: string
  celular: string
  email: string
  departamento?: string
  provincia?: string
  distrito?: string
  direccion?: string
  referencia?: string
  menorEdad?: boolean | string
  tutorNombre?: string
  tutorEmail?: string
  tutorTipoDoc?: string
  tutorNumDoc?: string
  tipoReclamo?: string
  tipoConsumo?: string
  numPedido?: string
  fechaReclamo?: string
  idEmpresaEmisora?: number
  monto?: number | string
  descripcion: string
  fechaCompra?: string
  fechaConsumo?: string
  fechaCaducidad?: string
  detalle: string
  pedidoCliente?: string
  acepta: boolean | string
}

export interface LibroReclamacionesResponse {
  success: boolean
  data?: {
    id: number
    id_cliente?: number
    id_direccion_cliente?: number
    id_pedido?: number
    message?: string
  }
  message?: string
  error?: string
}

export const LibroReclamacionesService = {
  /**
   * Enviar reclamo al backend
   */
  async crearReclamo(payload: LibroReclamacionesPayload): Promise<LibroReclamacionesResponse> {
    const body = {
      nombre: payload.nombre,
      apellido1: payload.apellido1,
      apellido2: payload.apellido2 || null,
      tipoDoc: payload.tipoDoc || 'DNI',
      numDoc: payload.numDoc,
      celular: payload.celular,
      email: payload.email,
      departamento: payload.departamento || null,
      provincia: payload.provincia || null,
      distrito: payload.distrito || null,
      direccion: payload.direccion || null,
      referencia: payload.referencia || null,
      menorEdad: payload.menorEdad === 'si' || payload.menorEdad === true,
      tutorNombre: payload.tutorNombre || null,
      tutorEmail: payload.tutorEmail || null,
      tutorTipoDoc: payload.tutorTipoDoc || null,
      tutorNumDoc: payload.tutorNumDoc || null,
      tipoReclamo: payload.tipoReclamo || 'Reclamación',
      tipoConsumo: payload.tipoConsumo || 'Producto',
      numPedido: payload.numPedido || null,
      fechaReclamo: payload.fechaReclamo || null,
      idEmpresaEmisora: payload.idEmpresaEmisora ?? 1,
      monto: payload.monto ? Number(payload.monto) : null,
      descripcion: payload.descripcion,
      fechaCompra: payload.fechaCompra || null,
      fechaConsumo: payload.fechaConsumo || null,
      fechaCaducidad: payload.fechaCaducidad || null,
      detalle: payload.detalle,
      pedidoCliente: payload.pedidoCliente || null,
      acepta: payload.acepta === true || String(payload.acepta).toLowerCase() === 'si',
    }

    return api.post<LibroReclamacionesResponse>('/api/libro-reclamaciones/', body)
  },
}
