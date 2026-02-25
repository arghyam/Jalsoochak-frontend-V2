import { screen } from '@testing-library/react'
import { describe, expect, it, jest } from '@jest/globals'
import type { SearchableSelectOption } from '@/shared/components/common'
import { renderWithProviders } from '@/test/render-with-providers'
import { DashboardFilters } from './dashboard-filters'

const emptyOptions: SearchableSelectOption[] = []

describe('DashboardFilters', () => {
  it('keeps duration control enabled even when advanced filters are disabled', () => {
    renderWithProviders(
      <DashboardFilters
        filterTabIndex={1}
        onTabChange={jest.fn()}
        onClear={jest.fn()}
        isAdvancedEnabled={false}
        isDepartmentStateSelected={false}
        emptyOptions={emptyOptions}
        selectedState=""
        selectedDistrict=""
        selectedBlock=""
        selectedGramPanchayat=""
        selectedVillage=""
        selectedScheme=""
        selectedDuration={null}
        selectedDepartmentState=""
        selectedDepartmentZone=""
        selectedDepartmentCircle=""
        selectedDepartmentDivision=""
        selectedDepartmentSubdivision=""
        selectedDepartmentVillage=""
        districtOptions={emptyOptions}
        blockOptions={emptyOptions}
        gramPanchayatOptions={emptyOptions}
        villageOptions={emptyOptions}
        mockFilterStates={emptyOptions}
        mockFilterSchemes={emptyOptions}
        onStateChange={jest.fn()}
        onDistrictChange={jest.fn()}
        onBlockChange={jest.fn()}
        onGramPanchayatChange={jest.fn()}
        setSelectedVillage={jest.fn()}
        setSelectedScheme={jest.fn()}
        setSelectedDuration={jest.fn()}
        onDepartmentStateChange={jest.fn()}
        setSelectedDepartmentZone={jest.fn()}
        setSelectedDepartmentCircle={jest.fn()}
        setSelectedDepartmentDivision={jest.fn()}
        setSelectedDepartmentSubdivision={jest.fn()}
        setSelectedDepartmentVillage={jest.fn()}
      />
    )

    const durationButton = screen.getByRole('button', { name: 'Duration' }) as HTMLButtonElement
    expect(durationButton.disabled).toBe(false)
  })
})
