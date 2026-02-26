import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FocusEvent, ReactNode } from 'react'
import type { ButtonProps, InputProps } from '@chakra-ui/react'
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Box,
  Text,
  Icon,
  useOutsideClick,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { FiChevronDown, FiDownload } from 'react-icons/fi'

export type SearchStateOption = {
  value: string
  label: string
}

interface BreadcrumbPanelProps {
  stateOptions: SearchStateOption[]
  totalStatesCount: number
  onStateSelect?: (stateValue: string) => void
}

interface SearchLayoutProps {
  placeholder?: string
  actionLabel?: string
  onActionClick?: () => void
  inputProps?: InputProps
  actionProps?: ButtonProps
  filterSlot?: ReactNode
  rightSlot?: ReactNode
  breadcrumbPanelProps?: BreadcrumbPanelProps
  selectionTrail?: string[]
}

export function SearchLayout({
  placeholder = 'Search by state/UT, district, block, gram panchayat, village',
  actionLabel = 'Download Report',
  onActionClick,
  inputProps,
  actionProps,
  filterSlot,
  rightSlot,
  breadcrumbPanelProps,
  selectionTrail,
}: SearchLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const [isBreadcrumbPanelOpen, setIsBreadcrumbPanelOpen] = useState(false)
  const [selectedStateValue, setSelectedStateValue] = useState('')
  const panelContainerRef = useRef<HTMLDivElement>(null)

  const showBreadcrumbPanel = Boolean(breadcrumbPanelProps)
  const hasExternalSelectionTrail = selectionTrail !== undefined
  const totalStatesCount = breadcrumbPanelProps?.totalStatesCount ?? 0
  const inputValue = inputProps?.value !== undefined ? String(inputProps.value ?? '') : searchValue
  const selectedState = useMemo(
    () => breadcrumbPanelProps?.stateOptions.find((option) => option.value === selectedStateValue),
    [breadcrumbPanelProps?.stateOptions, selectedStateValue]
  )
  const effectiveSelectionTrail = useMemo(() => {
    if (hasExternalSelectionTrail) {
      return selectionTrail ?? []
    }

    return selectedState ? [selectedState.label] : []
  }, [hasExternalSelectionTrail, selectionTrail, selectedState])
  const selectedStateLabel = effectiveSelectionTrail[0]
  const filteredStateOptions = useMemo(() => {
    if (!breadcrumbPanelProps) {
      return []
    }

    const query = inputValue.trim().toLowerCase()
    if (!query) {
      return breadcrumbPanelProps.stateOptions
    }

    return breadcrumbPanelProps.stateOptions.filter((option) =>
      option.label.toLowerCase().includes(query)
    )
  }, [breadcrumbPanelProps, inputValue])

  useOutsideClick({
    ref: panelContainerRef,
    handler: () => {
      setIsBreadcrumbPanelOpen(false)
    },
  })

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (showBreadcrumbPanel) {
      setIsBreadcrumbPanelOpen(true)
    }
    inputProps?.onFocus?.(event)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (inputProps?.value === undefined) {
      setSearchValue(event.target.value)
    }
    inputProps?.onChange?.(event)
  }

  const handleStateSelect = (stateValue: string) => {
    setSelectedStateValue(stateValue)
    setIsBreadcrumbPanelOpen(false)
    breadcrumbPanelProps?.onStateSelect?.(stateValue)
  }

  return (
    <Box
      as="section"
      w="full"
      borderRadius="12px"
      p="16px"
      bg="neutral.25"
      border="0.5px solid"
      borderColor="neutral.200"
      position="relative"
      ref={panelContainerRef}
    >
      <Flex
        w="full"
        align={{ base: 'stretch', lg: 'center' }}
        justify="space-between"
        gap="24px"
        direction={{ base: 'column', lg: 'row' }}
      >
        <Flex w="full" flex="1" maxW="none" gap={3} wrap={{ base: 'wrap' }}>
          <InputGroup
            w={{ base: 'full', lg: '782px' }}
            maxW={{ base: 'full', lg: '782px' }}
            minW={0}
          >
            <InputLeftElement pointerEvents="none" p="12px" w="auto" h="32px" alignItems="center">
              <SearchIcon mr="4px" color="neutral.300" />
            </InputLeftElement>
            <Input
              px="12px"
              pl="32px"
              placeholder={placeholder}
              fontSize="14px"
              h="32px"
              borderColor="neutral.300"
              _placeholder={{ color: 'neutral.300' }}
              value={inputValue}
              onFocus={handleFocus}
              onChange={handleInputChange}
              {...inputProps}
            />
          </InputGroup>
          {filterSlot}
        </Flex>
        {rightSlot ?? (
          <Button
            onClick={onActionClick}
            h="32px"
            w={{ base: 'full', lg: '160px' }}
            minW={{ lg: '160px' }}
            fontSize="14px"
            variant="primary"
            leftIcon={<FiDownload size="16" />}
            {...actionProps}
          >
            {actionLabel}
          </Button>
        )}
      </Flex>
      {effectiveSelectionTrail.length > 0 && !isBreadcrumbPanelOpen ? (
        <Flex mt="12px" align="center" gap="8px" wrap="wrap">
          {effectiveSelectionTrail.map((item, index) => {
            const isLast = index === effectiveSelectionTrail.length - 1

            if (isLast) {
              return (
                <Button
                  key={`${item}-${index}`}
                  h="26px"
                  minW="66px"
                  px="8px"
                  py="4px"
                  borderRadius="16px"
                  borderColor="neutral.300"
                  bg="primary.25"
                  color="primary.600"
                  fontSize="14px"
                  fontWeight="400"
                  variant="ghost"
                  _hover={{ bg: 'neutral.100' }}
                  _active={{ bg: 'neutral.100' }}
                >
                  {item}
                </Button>
              )
            }

            return (
              <Flex key={`${item}-${index}`} align="center" gap="8px">
                <Text fontSize="16px" color="neutral.500">
                  {item}
                </Text>
                <Icon
                  as={FiChevronDown}
                  color="neutral.500"
                  boxSize="14px"
                  transform="rotate(-90deg)"
                />
              </Flex>
            )
          })}
        </Flex>
      ) : null}
      {showBreadcrumbPanel && isBreadcrumbPanelOpen ? (
        <Box
          position="absolute"
          top="56px"
          left="0"
          mt="16px"
          width="798px"
          maxW="100%"
          height="375px"
          borderRadius="12px"
          border="1px solid"
          borderColor="neutral.200"
          bg="white"
          zIndex={10}
          overflowY="auto"
          boxShadow="0px 8px 24px rgba(0, 0, 0, 0.08)"
        >
          <Box bg="neutral.100" borderTopRadius="12px" px="16px" py="8px">
            <Flex align="center">
              <Text textStyle="bodyText4" color="neutral.500" fontWeight="400px">
                All States/UTs
              </Text>
              {selectedStateLabel ? (
                <>
                  <Icon
                    as={FiChevronDown}
                    color="neutral.500"
                    boxSize="20px"
                    transform="rotate(-90deg)"
                  />
                  <Text textStyle="bodyText4" color="neutral.800" fontWeight="400px">
                    {selectedStateLabel}
                  </Text>
                </>
              ) : null}
            </Flex>
          </Box>
          <Box px="16px" mt="12px">
            <Text textStyle="bodyText5" fontWeight="500" color="neutral.950" mb="8px">
              States ({totalStatesCount})
            </Text>
            <Flex direction="column" gap="8px">
              {filteredStateOptions.map((state) => (
                <Button
                  key={state.value}
                  variant="ghost"
                  justifyContent="flex-start"
                  fontWeight="400"
                  textStyle="bodyText5"
                  color="neutral.950"
                  p={0}
                  h="auto"
                  fontSize="14px"
                  onClick={() => handleStateSelect(state.value)}
                  _hover={{ bg: 'transparent' }}
                  _active={{ bg: 'transparent' }}
                >
                  {state.label}
                </Button>
              ))}
              {filteredStateOptions.length === 0 ? (
                <Text fontSize="14px" color="neutral.300">
                  No states found
                </Text>
              ) : null}
            </Flex>
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
