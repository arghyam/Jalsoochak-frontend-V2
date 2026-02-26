import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const mockApiGet = jest.fn()
const mockGetStatesUts = jest.fn()

jest.mock('@/shared/lib/axios', () => ({
  apiClient: {
    get: (...args: unknown[]) => mockApiGet(...args),
  },
}))

jest.mock('../mock/location-search-mock', () => ({
  locationSearchMockService: {
    getStatesUts: (...args: unknown[]) => mockGetStatesUts(...args),
  },
}))

describe('locationSearchApi', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    delete (window as Window & { APP_CONFIG?: { LOCATION_SEARCH_PROVIDER?: string } }).APP_CONFIG
  })

  it('uses mock provider by default', async () => {
    const mockResponse = {
      totalStatesCount: 36,
      states: [{ value: 'telangana', label: 'Telangana' }],
    }
    mockGetStatesUts.mockImplementation(async () => mockResponse)

    const { locationSearchApi } = await import('./location-search-api')
    const response = await locationSearchApi.getStatesUts()

    expect(response).toEqual(mockResponse)
    expect(mockGetStatesUts).toHaveBeenCalledTimes(1)
    expect(mockApiGet).not.toHaveBeenCalled()
  })

  it('uses http provider when APP_CONFIG enables it', async () => {
    ;(window as Window & { APP_CONFIG?: { LOCATION_SEARCH_PROVIDER?: string } }).APP_CONFIG = {
      API_BASE_URL: 'http://localhost:3000',
      LOCATION_SEARCH_PROVIDER: 'http',
    } as Window['APP_CONFIG'] & { LOCATION_SEARCH_PROVIDER: string }

    const apiResponse = {
      data: {
        totalStatesCount: 36,
        states: [{ value: 'telangana', label: 'Telangana' }],
      },
    }
    mockApiGet.mockImplementation(async () => apiResponse)

    const { locationSearchApi } = await import('./location-search-api')
    const response = await locationSearchApi.getStatesUts()

    expect(mockApiGet).toHaveBeenCalledWith('/api/dashboard/states-uts')
    expect(response).toEqual(apiResponse.data)
    expect(mockGetStatesUts).not.toHaveBeenCalled()
  })
})
