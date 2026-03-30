import { getCategorias } from '@/lib/supabase'

export async function loadCategoriasForChatSara() {
  const categoriasResult = await Promise.race([
    getCategorias(),
    new Promise<{ data: [] }>((resolve) => setTimeout(() => resolve({ data: [] }), 5000)),
  ])

  return (categoriasResult.data ?? []).filter(
    (cat) => cat.nombre.toUpperCase() !== 'DESPACHO DE PRODUCTOS' && cat.logo_url?.trim()
  )
}
