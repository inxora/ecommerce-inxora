// En cliente: '' = proxy (app/api/[...path]) evita CORS. En servidor (SSR): fetch() requiere URL absoluta.
const getApiBaseUrl = () => {
  const configured = process.env.NEXT_PUBLIC_API_URL ?? ''
  if (configured) return configured
  return typeof window !== 'undefined' ? '' : 'https://app.inxora.com'
}

interface ApiOptions extends Omit<RequestInit, 'next'> {
  params?: Record<string, string | number | boolean | undefined>
  next?: { revalidate?: number | false } | { cache?: RequestCache }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: ApiOptions
): Promise<T> {
  const { params, next, ...fetchOptions } = options || {}

  const baseUrl = getApiBaseUrl()
  let url = `${baseUrl}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  try {
    // Los logs están deshabilitados por defecto para reducir ruido en la terminal
    // Solo loggear si NEXT_PUBLIC_DEBUG_API está explícitamente en 'true'
    const shouldLog = process.env.NEXT_PUBLIC_DEBUG_API === 'true'
    
    if (shouldLog) {
    console.log(`[API Client] Fetching: ${url}`)
    }
    
    // Construir headers según el método
    // Para GET: no enviar Content-Type (evita preflight)
    // Para POST/PUT: enviar Content-Type solo si hay body
    const method = fetchOptions?.method || 'GET'
    const hasBody = fetchOptions?.body !== undefined
    
    const headers: HeadersInit = {
      'Accept': 'application/json',
      ...fetchOptions?.headers,
    }
    
    // Solo agregar Content-Type si es POST/PUT/PATCH y hay body
    if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && hasBody) {
      headers['Content-Type'] = 'application/json'
    }
    
    // Crear un AbortController para timeout (10 segundos por defecto)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout
    
    let response: Response
    try {
      // ✅ FIX 3: Pasar opciones de Next.js (next.revalidate) al fetch
      const fetchConfig: RequestInit & { next?: { revalidate?: number | false } | { cache?: RequestCache } } = {
        ...fetchOptions,
        headers,
        signal: controller.signal, // Agregar signal para poder cancelar
        credentials: 'omit', // No enviar cookies para evitar problemas CORS
      }
      
      // Agregar opciones de Next.js si están presentes
      if (next) {
        fetchConfig.next = next
      }
      
      response = await fetch(url, fetchConfig as RequestInit)
      
      clearTimeout(timeoutId) // Limpiar timeout si la petición se completa
    } catch (fetchError) {
      clearTimeout(timeoutId) // Limpiar timeout en caso de error
      
      // Detectar errores de timeout/abort
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`[API Client] Request timeout for ${url} (10s)`)
        throw new Error(`Request timeout: The API request took longer than 10 seconds`)
      }
      
      throw fetchError // Re-lanzar otros errores de fetch
    }

    // Solo loggear si está habilitado el debug o si hay un error
    if (shouldLog || !response.ok) {
      if (shouldLog) {
        console.log(`[API Client] Response status: ${response.status} ${response.statusText} - ${url}`)
        if (response.ok) {
    console.log(`[API Client] Response headers:`, Object.fromEntries(response.headers.entries()))
        }
      } else if (!response.ok) {
        // Solo loggear errores si el debug no está habilitado
        console.error(`[API Client] Error ${response.status} ${response.statusText} - ${url}`)
      }
    }

    // Si hay error HTTP, intentar leer el mensaje de error del cuerpo
    if (!response.ok) {
      let errorMessage = response.statusText
      try {
        const errorText = await response.text()
        if (errorText) {
          try {
            const errorJson = JSON.parse(errorText)
            errorMessage = errorJson.message || errorJson.error || errorText
          } catch {
            errorMessage = errorText
          }
        }
      } catch (e) {
        // Si no se puede leer el cuerpo, usar el statusText
      }
      console.error(`[API Client] Error response: ${response.status} - ${errorMessage}`)
      throw new ApiError(response.status, response.statusText, errorMessage)
    }

    // Manejar respuestas vacías
    const text = await response.text()
    if (!text) {
      console.warn(`[API Client] Empty response from ${url}`)
      return {} as T
    }

    try {
      return JSON.parse(text)
    } catch (parseError) {
      console.error(`[API Client] JSON parse error for ${url}:`, parseError)
      console.error(`[API Client] Response text:`, text.substring(0, 500))
      throw new Error(`Invalid JSON response from API: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
    }
  } catch (error) {
    // Detectar errores de CORS de diferentes formas
    const isCorsError = 
      (error instanceof TypeError && error.message.includes('Failed to fetch')) ||
      (error instanceof TypeError && error.message.includes('NetworkError')) ||
      (error instanceof Error && error.message.includes('CORS')) ||
      (error instanceof Error && error.message.includes('cors'))
    
    if (isCorsError) {
      console.error(`[API Client] CORS error for ${url}`)
      // El error de CORS puede ocurrir cuando el servidor no permite el origen
      // Lanzar un error específico para que el código que llama pueda manejarlo
      const corsError = new Error(`CORS error: Failed to fetch from ${url}. The server may not allow requests from origin ${typeof window !== 'undefined' ? window.location.origin : 'server'}.`)
      corsError.name = 'CORSError'
      throw corsError
    }
    
    // Si es un ApiError, re-lanzarlo con más contexto
    if (error instanceof ApiError) {
      console.error(`[API Client] API error for ${url}:`, error.status, error.message)
      throw error
    }
    
    // Detectar errores de timeout/abort (por si acaso no se capturaron antes)
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[API Client] Request timeout for ${url} (10s)`)
      throw new Error(`Request timeout: The API request took longer than 10 seconds`)
    }
    
    // Re-lanzar otros errores con más contexto
    console.error(`[API Client] Unexpected error for ${url}:`, error)
    throw error
  }
}

// Métodos de conveniencia
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) =>
    apiClient<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: unknown) =>
    apiClient<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    apiClient<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, { method: 'DELETE' }),
}

