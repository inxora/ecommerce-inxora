import { apiClient } from '@/lib/api/client'

const BASE = '/api/auth'

export interface ForgotPasswordPayload {
  correo: string
}

export interface ResetPasswordPayload {
  token: string
  nueva_password: string
}

export interface AuthResponse {
  success: boolean
  data: null
  message: string
}

export const authApi = {
  async forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResponse> {
    return apiClient<AuthResponse>(`${BASE}/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ correo: payload.correo }),
      timeout: 15000,
    })
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
    return apiClient<AuthResponse>(`${BASE}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token: payload.token, nueva_password: payload.nueva_password }),
      timeout: 15000,
    })
  },
}
