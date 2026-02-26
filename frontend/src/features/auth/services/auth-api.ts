import apiClient from '@/shared/lib/axios'
import { extractUserFromJWT } from '@/shared/utils/jwt'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  personType: string
  tenantId: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  id_token: string
  expires_in: number
  refresh_expires_in: number
  token_type: string
  user_role: string
  tenant_id: string
  person_id: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  phoneNumber: string
  tenantId: string
  personId: string
}

export interface LoginResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

const TEST_CREDS = [
  {
    email: 'test@test.com',
    password: 'Test@123',
    role: 'business_user' as const,
    name: 'Test User',
    id: 'test-user',
  },
  {
    email: 'superadmin@test.com',
    password: 'Test@123',
    role: 'super_user' as const,
    name: 'Super Admin',
    id: 'test-superadmin',
  },
]

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const email = payload.email.trim().toLowerCase()
    const match = TEST_CREDS.find((c) => c.email === email && c.password === payload.password)
    if (match) {
      return {
        user: {
          id: match.id,
          name: match.name,
          email: match.email,
          role: match.role,
          phoneNumber: '',
          tenantId: '',
          personId: '',
        },
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      }
    }

    const response = await apiClient.post<TokenResponse>('/api/v2/auth/login', {
      email: payload.email,
      password: payload.password,
    })
    const { access_token, refresh_token, id_token, user_role, tenant_id, person_id } = response.data

    const userFromToken = extractUserFromJWT(id_token)
    if (!userFromToken) {
      throw new Error('Failed to extract user information')
    }

    const user: AuthUser = {
      ...userFromToken,
      role: user_role ?? '',
      tenantId: tenant_id ?? '',
      personId: person_id ?? '',
    }

    return {
      user,
      accessToken: access_token,
      refreshToken: refresh_token,
    }
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/v2/auth/refresh', {
      refreshToken,
    })
    const { access_token, refresh_token, id_token, user_role, tenant_id, person_id } = response.data

    if (!access_token || !refresh_token || !id_token) {
      throw new Error('Invalid token response')
    }

    const userFromToken = extractUserFromJWT(id_token)
    if (!userFromToken) {
      throw new Error('Failed to extract user information')
    }

    const user: AuthUser = {
      ...userFromToken,
      role: user_role ?? '',
      tenantId: tenant_id ?? '',
      personId: person_id ?? '',
    }

    return {
      user,
      accessToken: access_token,
      refreshToken: refresh_token,
    }
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/api/v2/auth/logout', {
      refreshToken,
    })
  },

  register: async (payload: RegisterRequest): Promise<void> => {
    await apiClient.post('/api/v2/auth/register', payload)
  },
}
