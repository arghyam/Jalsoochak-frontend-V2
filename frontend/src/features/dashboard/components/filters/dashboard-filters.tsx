import type { Dispatch, SetStateAction } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { DateRangePicker, SearchableSelect } from '@/shared/components/common'
import type { DateRange, SearchableSelectOption } from '@/shared/components/common'
import { FilterLayout, SearchLayout } from '@/shared/components/layout'
import { useLocationSearchQuery } from '../../services/query/use-location-search-query'

type DashboardFiltersProps = {
  filterTabIndex: number
  onTabChange: (index: number) => void
  onClear: () => void
  isAdvancedEnabled: boolean
  isDepartmentStateSelected: boolean
  emptyOptions: SearchableSelectOption[]
  selectedState: string
  selectedDistrict: string
  selectedBlock: string
  selectedGramPanchayat: string
  selectedVillage: string
  selectedScheme: string
  selectedDuration: DateRange | null
  selectedDepartmentState: string
  selectedDepartmentZone: string
  selectedDepartmentCircle: string
  selectedDepartmentDivision: string
  selectedDepartmentSubdivision: string
  selectedDepartmentVillage: string
  districtOptions: SearchableSelectOption[]
  blockOptions: SearchableSelectOption[]
  gramPanchayatOptions: SearchableSelectOption[]
  villageOptions: SearchableSelectOption[]
  mockFilterStates: SearchableSelectOption[]
  mockFilterSchemes: SearchableSelectOption[]
  onStateChange: (value: string) => void
  onDistrictChange: (value: string) => void
  onBlockChange: (value: string) => void
  onGramPanchayatChange: (value: string) => void
  setSelectedVillage: Dispatch<SetStateAction<string>>
  setSelectedScheme: Dispatch<SetStateAction<string>>
  setSelectedDuration: Dispatch<SetStateAction<DateRange | null>>
  onDepartmentStateChange: (value: string) => void
  setSelectedDepartmentZone: Dispatch<SetStateAction<string>>
  setSelectedDepartmentCircle: Dispatch<SetStateAction<string>>
  setSelectedDepartmentDivision: Dispatch<SetStateAction<string>>
  setSelectedDepartmentSubdivision: Dispatch<SetStateAction<string>>
  setSelectedDepartmentVillage: Dispatch<SetStateAction<string>>
}

export function DashboardFilters({
  filterTabIndex,
  onTabChange,
  onClear,
  isAdvancedEnabled,
  isDepartmentStateSelected,
  emptyOptions,
  selectedState,
  selectedDistrict,
  selectedBlock,
  selectedGramPanchayat,
  selectedVillage,
  selectedScheme,
  selectedDuration,
  selectedDepartmentState,
  selectedDepartmentZone,
  selectedDepartmentCircle,
  selectedDepartmentDivision,
  selectedDepartmentSubdivision,
  selectedDepartmentVillage,
  districtOptions,
  blockOptions,
  gramPanchayatOptions,
  villageOptions,
  mockFilterStates,
  mockFilterSchemes,
  onStateChange,
  onDistrictChange,
  onBlockChange,
  onGramPanchayatChange,
  setSelectedVillage,
  setSelectedScheme,
  setSelectedDuration,
  onDepartmentStateChange,
  setSelectedDepartmentZone,
  setSelectedDepartmentCircle,
  setSelectedDepartmentDivision,
  setSelectedDepartmentSubdivision,
  setSelectedDepartmentVillage,
}: DashboardFiltersProps) {
  const { data: locationSearchData } = useLocationSearchQuery()
  const breadcrumbStateOptions = locationSearchData?.states ?? [
    { value: 'telangana', label: 'Telangana' },
  ]
  const totalStatesCount = locationSearchData?.totalStatesCount ?? 36
  const findLabel = (value: string, options: SearchableSelectOption[]): string | null => {
    if (!value) return null
    return options.find((option) => option.value === value)?.label ?? null
  }
  const selectionTrail = [
    findLabel(selectedState, breadcrumbStateOptions),
    findLabel(selectedDistrict, districtOptions),
    findLabel(selectedBlock, blockOptions),
    findLabel(selectedGramPanchayat, gramPanchayatOptions),
    findLabel(selectedVillage, villageOptions),
  ].filter((item): item is string => Boolean(item))
  const hasSelectedState = Boolean(selectedState)
  const hasSelectedDistrict = Boolean(selectedDistrict)
  const hasSelectedBlock = Boolean(selectedBlock)
  const hasSelectedGramPanchayat = Boolean(selectedGramPanchayat)
  const breadcrumbPanelConfig = hasSelectedGramPanchayat
    ? {
        options: villageOptions,
        label: 'Villages',
        totalCount: villageOptions.length,
        noOptionsText: 'No villages found',
        onSelect: setSelectedVillage,
      }
    : hasSelectedBlock
      ? {
          options: gramPanchayatOptions,
          label: 'Gram Panchayats',
          totalCount: gramPanchayatOptions.length,
          noOptionsText: 'No gram panchayats found',
          onSelect: onGramPanchayatChange,
        }
      : hasSelectedDistrict
        ? {
            options: blockOptions,
            label: 'Blocks',
            totalCount: blockOptions.length,
            noOptionsText: 'No blocks found',
            onSelect: onBlockChange,
          }
        : hasSelectedState
          ? {
              options: districtOptions,
              label: 'Districts',
              totalCount: districtOptions.length,
              noOptionsText: 'No districts found',
              onSelect: onDistrictChange,
            }
          : {
              options: breadcrumbStateOptions,
              label: 'States',
              totalCount: totalStatesCount,
              noOptionsText: 'No states found',
              onSelect: onStateChange,
            }

  const trailSelectionValues = [
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedGramPanchayat,
    selectedVillage,
  ] as const
  const trailSelectionHandlers = [
    onStateChange,
    onDistrictChange,
    onBlockChange,
    onGramPanchayatChange,
    setSelectedVillage,
  ] as const

  const handleTrailSelect = (trailIndex: number) => {
    if (trailIndex < 0) {
      onStateChange('')
      return
    }

    const selectedValue = trailSelectionValues[trailIndex]
    const handleSelection = trailSelectionHandlers[trailIndex]
    if (selectedValue && handleSelection) {
      handleSelection(selectedValue)
    }
  }

  return (
    <>
      <SearchLayout
        selectionTrail={selectionTrail}
        breadcrumbPanelProps={{
          stateOptions: breadcrumbStateOptions,
          totalStatesCount,
          options: breadcrumbPanelConfig.options,
          optionsLabel: breadcrumbPanelConfig.label,
          totalOptionsCount: breadcrumbPanelConfig.totalCount,
          noOptionsText: breadcrumbPanelConfig.noOptionsText,
          onOptionSelect: breadcrumbPanelConfig.onSelect,
          onTrailSelect: handleTrailSelect,
          showTabs: hasSelectedState,
          activeTab: filterTabIndex,
          onTabChange,
        }}
        filterSlot={
          <Flex align="center" gap={3} wrap="wrap">
            <DateRangePicker
              value={selectedDuration}
              onChange={setSelectedDuration}
              placeholder="Duration"
              width="160px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.400"
              borderColor="neutral.400"
              disabled={false}
              isFilter={true}
            />
            <Button
              variant="link"
              size="sm"
              onClick={onClear}
              _hover={{ textDecoration: 'underline', textDecorationColor: 'neutral.300' }}
            >
              <Text textStyle="h10" fontWeight="600" color="neutral.300">
                Clear all filters
              </Text>
            </Button>
          </Flex>
        }
      />
      <FilterLayout activeTab={filterTabIndex} onTabChange={onTabChange} rightSlot={<></>}>
        {filterTabIndex === 0 ? (
          <>
            <SearchableSelect
              options={mockFilterStates}
              value={selectedState}
              onChange={onStateChange}
              placeholder="States/UTs"
              required
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.400"
              borderColor="neutral.400"
              isFilter={true}
            />
            <SearchableSelect
              options={districtOptions}
              value={selectedDistrict}
              onChange={onDistrictChange}
              placeholder="District"
              required
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.400"
              borderColor="neutral.400"
              isFilter={true}
            />
            <SearchableSelect
              options={blockOptions}
              value={selectedBlock}
              onChange={onBlockChange}
              placeholder="Block"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
              isFilter={true}
            />
            <SearchableSelect
              options={gramPanchayatOptions}
              value={selectedGramPanchayat}
              onChange={onGramPanchayatChange}
              placeholder="Gram Panchayat"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
              isFilter={true}
            />
            <SearchableSelect
              options={villageOptions}
              value={selectedVillage}
              onChange={setSelectedVillage}
              placeholder="Village"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
              isFilter={true}
            />

            <SearchableSelect
              options={mockFilterSchemes}
              value={selectedScheme}
              onChange={setSelectedScheme}
              placeholder="Scheme"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
              isFilter={true}
            />
          </>
        ) : (
          <>
            <SearchableSelect
              options={mockFilterStates}
              value={selectedDepartmentState}
              onChange={onDepartmentStateChange}
              placeholder="States/UTs"
              required
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.400"
              borderColor="neutral.400"
              isFilter={true}
            />
            <SearchableSelect
              options={emptyOptions}
              value={selectedDepartmentZone}
              onChange={setSelectedDepartmentZone}
              placeholder="Zone"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isDepartmentStateSelected ? 'neutral.400' : 'neutral.300'}
              borderColor={isDepartmentStateSelected ? 'neutral.400' : 'neutral.300'}
              disabled={!isDepartmentStateSelected}
              isFilter={true}
            />
            <SearchableSelect
              options={emptyOptions}
              value={selectedDepartmentCircle}
              onChange={setSelectedDepartmentCircle}
              placeholder="Circle"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isDepartmentStateSelected ? 'neutral.400' : 'neutral.300'}
              borderColor={isDepartmentStateSelected ? 'neutral.400' : 'neutral.300'}
              disabled={!isDepartmentStateSelected}
              isFilter={true}
            />
            <SearchableSelect
              options={emptyOptions}
              value={selectedDepartmentDivision}
              onChange={setSelectedDepartmentDivision}
              placeholder="Division"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isDepartmentStateSelected ? 'neutral.400' : 'neutral.300'}
              borderColor={isDepartmentStateSelected ? 'neutral.400' : 'neutral.300'}
              disabled={!isDepartmentStateSelected}
              isFilter={true}
            />
            <SearchableSelect
              options={emptyOptions}
              value={selectedDepartmentSubdivision}
              onChange={setSelectedDepartmentSubdivision}
              placeholder="Subdivision"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isDepartmentStateSelected ? 'neutral.400' : 'neutral.300'}
              borderColor={isDepartmentStateSelected ? 'neutral.400' : 'neutral.300'}
              disabled={!isDepartmentStateSelected}
              isFilter={true}
            />
            <SearchableSelect
              options={emptyOptions}
              value={selectedDepartmentVillage}
              onChange={setSelectedDepartmentVillage}
              placeholder="Village"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isDepartmentStateSelected ? 'neutral.400' : 'neutral.300'}
              borderColor={isDepartmentStateSelected ? 'neutral.400' : 'neutral.300'}
              disabled={!isDepartmentStateSelected}
              isFilter={true}
            />
          </>
        )}
      </FilterLayout>
    </>
  )
}
