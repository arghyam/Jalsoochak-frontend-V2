import { screen } from '@testing-library/react'
import { describe, expect, it } from '@jest/globals'
import { SearchLayout } from './search-layout'
import { renderWithProviders } from '@/test/render-with-providers'

describe('SearchLayout', () => {
  it('renders default search placeholder and download button', () => {
    renderWithProviders(<SearchLayout />)

    const searchInput = screen.getByPlaceholderText(
      'Search by state/UT, district, block, gram panchayat, village'
    )
    const downloadButton = screen.getByRole('button', { name: 'Download Report' })

    expect(searchInput).toBeTruthy()
    expect(downloadButton).toBeTruthy()
  })
})
