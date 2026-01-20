import { api } from '@/lib/api/client'

export const ProductsService = {
  /**
   * Incrementa el contador de visualizaciones de un producto
   * @param sku - SKU del producto
   */
  incrementarVisualizacion: (sku: number | string) =>
    api.post(`/api/productos/${sku}/incrementar-visualizacion`),
}
