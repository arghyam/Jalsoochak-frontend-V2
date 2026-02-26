import { apiClient } from '@/shared/lib/axios'
import type { StateUtSearchResponse } from '../../types'
import { locationSearchMockService } from '../mock/location-search-mock'

type LocationSearchProvider = {
  getStatesUts: () => Promise<StateUtSearchResponse>
}

const httpProvider: LocationSearchProvider = {
  getStatesUts: async () => {
    const response = await apiClient.get<StateUtSearchResponse>('/api/dashboard/states-uts')
    return response.data
  },
}

const mockProvider: LocationSearchProvider = {
  getStatesUts: () => {
    return locationSearchMockService.getStatesUts()
  },
}

const LOCATION_SEARCH_PROVIDER =
  typeof window !== 'undefined' &&
  (window as { APP_CONFIG?: { LOCATION_SEARCH_PROVIDER?: string } }).APP_CONFIG
    ?.LOCATION_SEARCH_PROVIDER === 'http'
    ? 'http'
    : 'mock'

const provider: LocationSearchProvider =
  LOCATION_SEARCH_PROVIDER === 'http' ? httpProvider : mockProvider

export const locationSearchApi = {
  getStatesUts: (): Promise<StateUtSearchResponse> => {
    return provider.getStatesUts()
  },
}
