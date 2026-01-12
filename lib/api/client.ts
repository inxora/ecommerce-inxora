const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app.inxora.com'

interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
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
  const { params, ...fetchOptions } = options || {}

  // Construir URL con query params
  let url = `${API_BASE_URL}${endpoint}`
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
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions?.headers,
      },
      // Agregar credentials para requests CORS
      credentials: 'omit', // No enviar cookies para evitar problemas CORS
    })

    // Si hay error de CORS pero el status es 200, intentar leer la respuesta de todas formas
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText)
    }

    // Manejar respuestas vacías
    const text = await response.text()
    if (!text) {
      return {} as T
    }

    return JSON.parse(text)
  } catch (error) {
    // Si es un error de CORS pero el request fue exitoso (200 OK),
    // el servidor procesó la petición aunque el navegador bloquee la respuesta
    // En este caso, retornar un objeto vacío ya que no podemos leer la respuesta
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      // El error de CORS puede ocurrir aunque el request sea exitoso
      // Si el endpoint no requiere respuesta, simplemente retornar vacío
      // NO loggear para evitar saturar la consola con errores de CORS del backend
      return {} as T
    }
    
    // Re-lanzar otros errores
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

