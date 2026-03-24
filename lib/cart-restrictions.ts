import { getCurrencyByCode, type CurrencyCode } from '@/lib/constants/currencies'
import type { Product, ProveedorProducto } from '@/lib/supabase'
import { formatPriceWithThousands } from '@/lib/utils'

type RestrictionProduct = Pick<Product, 'nombre' | 'proveedores' | 'proveedor_principal' | 'condicion_precio_venta'>

export interface CartRestrictionIssue {
  code: 'min_quantity' | 'min_amount'
  message: string
  minimumQuantity?: number
  suggestedQuantity?: number
  minimumAmount?: number
  currentAmount?: number
  currencyCode?: CurrencyCode
}

const MONEDA_ID_TO_CODE: Record<number, CurrencyCode> = {
  1: 'PEN',
  2: 'USD',
}

export function getProveedorPrincipal(product: RestrictionProduct): ProveedorProducto | null {
  return product.proveedor_principal ?? product.proveedores?.find((p) => p.es_proveedor_principal) ?? product.proveedores?.[0] ?? null
}

export function getMinimoPedido(product: RestrictionProduct): number {
  const minimo = getProveedorPrincipal(product)?.minimo_pedido
  return minimo && minimo > 1 ? Math.ceil(minimo) : 1
}

export function getCondicionPrecioVenta(product: RestrictionProduct): string | null {
  const condition = product.condicion_precio_venta ?? getProveedorPrincipal(product)?.condicion_precio_venta ?? null
  return condition && condition.trim() ? condition.trim() : null
}

function resolveCurrencyCodeById(monedaId: number | null | undefined): CurrencyCode | null {
  if (!monedaId) return null
  return MONEDA_ID_TO_CODE[monedaId] ?? null
}

function formatCurrencyAmount(amount: number, currencyCode: CurrencyCode): string {
  const symbol = getCurrencyByCode(currencyCode).symbol
  return `${symbol} ${formatPriceWithThousands(amount)}`
}

export function getMinimumAmountRequirement(product: RestrictionProduct): { amount: number; currencyCode: CurrencyCode; formatted: string } | null {
  const proveedorPrincipal = getProveedorPrincipal(product)
  const amount = proveedorPrincipal?.minimo_monto_compra
  const currencyCode = resolveCurrencyCodeById(proveedorPrincipal?.id_moneda_minimo_monto ?? proveedorPrincipal?.id_moneda_costo)
  const symbolFromApi = proveedorPrincipal?.simbolo_moneda_minimo_monto?.trim()

  if (amount == null || amount <= 0 || !currencyCode) return null

  return {
    amount,
    currencyCode,
    formatted: symbolFromApi
      ? `${symbolFromApi} ${formatPriceWithThousands(amount)}`
      : formatCurrencyAmount(amount, currencyCode),
  }
}

function convertAmount(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode, exchangeRate?: number | null): number {
  if (fromCurrency === toCurrency) return amount
  if (!exchangeRate || exchangeRate <= 0) return amount

  if (fromCurrency === 'PEN' && toCurrency === 'USD') {
    return amount / exchangeRate
  }

  if (fromCurrency === 'USD' && toCurrency === 'PEN') {
    return amount * exchangeRate
  }

  return amount
}

function getCurrentAmountInMinimumCurrency(proveedor: ProveedorProducto, quantity: number): { amount: number; currencyCode: CurrencyCode | null; unitAmount: number } {
  const sourceCurrencyCode = resolveCurrencyCodeById(proveedor.id_moneda_costo)
  const targetCurrencyCode = resolveCurrencyCodeById(proveedor.id_moneda_minimo_monto ?? proveedor.id_moneda_costo)
  const unitAmount = Number(proveedor.costo_venta_con_igv ?? 0)

  if (!sourceCurrencyCode || !targetCurrencyCode || !Number.isFinite(unitAmount)) {
    return { amount: unitAmount * quantity, currencyCode: targetCurrencyCode, unitAmount }
  }

  const convertedUnitAmount = convertAmount(unitAmount, sourceCurrencyCode, targetCurrencyCode, proveedor.tipo_cambio_usado)
  return {
    amount: convertedUnitAmount * quantity,
    currencyCode: targetCurrencyCode,
    unitAmount: convertedUnitAmount,
  }
}

export function validateCartItem(product: RestrictionProduct, quantity: number): CartRestrictionIssue[] {
  const issues: CartRestrictionIssue[] = []
  const proveedorPrincipal = getProveedorPrincipal(product)

  if (!proveedorPrincipal) return issues

  const minimumQuantity = getMinimoPedido(product)
  if (quantity < minimumQuantity) {
    issues.push({
      code: 'min_quantity',
      message: `Este producto tiene un pedido mínimo de ${minimumQuantity} unidades.`,
      minimumQuantity,
      suggestedQuantity: minimumQuantity,
    })
  }

  const minimumAmount = proveedorPrincipal.minimo_monto_compra
  if (minimumAmount != null && minimumAmount > 0) {
    const { amount: currentAmount, currencyCode, unitAmount } = getCurrentAmountInMinimumCurrency(proveedorPrincipal, quantity)

    if (currentAmount + 0.0001 < minimumAmount && currencyCode) {
      issues.push({
        code: 'min_amount',
        message: `Este producto requiere una compra mínima de ${formatCurrencyAmount(minimumAmount, currencyCode)}. Tu monto actual es ${formatCurrencyAmount(currentAmount, currencyCode)}.`,
        minimumAmount,
        currentAmount,
        currencyCode,
        suggestedQuantity: unitAmount > 0 ? Math.ceil(minimumAmount / unitAmount) : undefined,
      })
    }
  }

  return issues
}

