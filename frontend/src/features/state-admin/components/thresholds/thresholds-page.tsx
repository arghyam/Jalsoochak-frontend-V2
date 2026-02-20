import { useState, useEffect } from 'react'
import {
  Box,
  Text,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Spinner,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/shared/hooks/use-toast'
import { ToastContainer } from '@/shared/components/common'
import {
  useSaveThresholdConfigurationMutation,
  useThresholdConfigurationQuery,
} from '../../services/query/use-state-admin-queries'

export function ThresholdsPage() {
  const { t } = useTranslation(['state-admin', 'common'])
  const { data: config, isLoading, isError } = useThresholdConfigurationQuery()
  const saveThresholdMutation = useSaveThresholdConfigurationMutation()

  const [formDraft, setFormDraft] = useState<{
    coverage?: string
    continuity?: string
    quantity?: string
    regularity?: string
  }>({})

  const toast = useToast()

  useEffect(() => {
    document.title = `${t('thresholds.title')} | JalSoochak`
  }, [t])

  const coverage = formDraft.coverage ?? config?.coverage ?? ''
  const continuity = formDraft.continuity ?? config?.continuity ?? ''
  const quantity = formDraft.quantity ?? config?.quantity ?? ''
  const regularity = formDraft.regularity ?? config?.regularity ?? ''

  const handleCancel = () => {
    setFormDraft({})
  }

  const handleSave = async () => {
    if (!coverage || !continuity || !quantity || !regularity) {
      toast.addToast(t('common:toast.fillAllFields'), 'error')
      return
    }

    try {
      await saveThresholdMutation.mutateAsync({
        coverage,
        continuity,
        quantity,
        regularity,
        isConfigured: true,
      })
      toast.addToast(t('common:toast.changesSavedShort'), 'success')
    } catch (error) {
      console.error('Failed to save threshold configuration:', error)
      toast.addToast(t('thresholds.messages.failedToSave'), 'error')
    }
  }

  const hasChanges =
    config &&
    (coverage !== config.coverage ||
      continuity !== config.continuity ||
      quantity !== config.quantity ||
      regularity !== config.regularity)

  if (isLoading) {
    return (
      <Box w="full">
        <Heading as="h1" size={{ base: 'h2', md: 'h1' }} mb={6}>
          {t('thresholds.title')}
        </Heading>
        <Flex align="center" role="status" aria-live="polite" aria-busy="true">
          <Spinner size="md" color="primary.500" mr={3} />
          <Text color="neutral.600">{t('common:loading')}</Text>
        </Flex>
      </Box>
    )
  }

  if (isError || !config) {
    return (
      <Box w="full">
        <Heading as="h1" size={{ base: 'h2', md: 'h1' }} mb={6}>
          {t('thresholds.title')}
        </Heading>
        <Text color="error.500">{t('thresholds.messages.failedToLoad')}</Text>
      </Box>
    )
  }

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Heading as="h1" size={{ base: 'h2', md: 'h1' }}>
          {t('thresholds.title')}
        </Heading>
      </Box>

      {/* Configuration Card */}
      <Box
        as="section"
        aria-labelledby="thresholds-heading"
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.100"
        borderRadius={{ base: 'lg', md: 'xl' }}
        w="full"
        minH={{ base: 'auto', lg: 'calc(100vh - 148px)' }}
        py={{ base: 4, md: 6 }}
        px={4}
      >
        <Flex
          as="form"
          role="form"
          aria-label={t('thresholds.aria.formLabel')}
          direction="column"
          w="full"
          h="full"
          justify="space-between"
          minH={{ base: 'auto', lg: 'calc(100vh - 200px)' }}
          gap={{ base: 6, lg: 0 }}
        >
          <Flex direction="column" gap={4}>
            {/* Card Header */}
            <Heading
              as="h2"
              id="thresholds-heading"
              size="h3"
              fontWeight="400"
              fontSize={{ base: 'md', md: 'xl' }}
            >
              {t('thresholds.configurationSettings')}
            </Heading>

            {/* Form Fields Grid - 2x2 Layout */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 4, md: 7 }} maxW="1200px">
              {/* Coverage */}
              <Box
                as="article"
                aria-label={t('thresholds.aria.coverageCard')}
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius={{ base: 'lg', md: 'xl' }}
                bg="neutral.50"
                py={{ base: 4, md: 6 }}
                px={4}
                minH={{ base: 'auto', lg: '174px' }}
              >
                <Heading
                  as="h3"
                  size="h3"
                  fontWeight="400"
                  fontSize={{ base: 'md', md: 'xl' }}
                  mb={1}
                >
                  {t('thresholds.coverage.title')}
                </Heading>
                <Text fontSize={{ base: '12px', md: '14px' }} lineHeight="20px" mb={4}>
                  {t('thresholds.coverage.description')}
                </Text>
                <NumberInput
                  value={coverage}
                  onChange={(valueString) =>
                    setFormDraft((prev) => ({ ...prev, coverage: valueString }))
                  }
                  min={0}
                  w={{ base: 'full', xl: '490px' }}
                >
                  <NumberInputField
                    placeholder={t('common:enter')}
                    h="36px"
                    fontSize="md"
                    borderRadius="6px"
                    borderWidth="1px"
                    borderColor="neutral.200"
                    pr="32px"
                    pl="16px"
                    aria-label={t('thresholds.aria.enterCoverage')}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>

              {/* Continuity */}
              <Box
                as="article"
                aria-label={t('thresholds.aria.continuityCard')}
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius={{ base: 'lg', md: 'xl' }}
                bg="neutral.50"
                py={{ base: 4, md: 6 }}
                px={4}
                minH={{ base: 'auto', lg: '174px' }}
              >
                <Heading
                  as="h3"
                  size="h3"
                  fontWeight="400"
                  fontSize={{ base: 'md', md: 'xl' }}
                  mb={1}
                >
                  {t('thresholds.continuity.title')}
                </Heading>
                <Text fontSize={{ base: '12px', md: '14px' }} lineHeight="20px" mb={4}>
                  {t('thresholds.continuity.description')}
                </Text>
                <NumberInput
                  value={continuity}
                  onChange={(valueString) =>
                    setFormDraft((prev) => ({ ...prev, continuity: valueString }))
                  }
                  min={0}
                  w={{ base: 'full', xl: '490px' }}
                >
                  <NumberInputField
                    placeholder={t('common:enter')}
                    h="36px"
                    fontSize="md"
                    borderRadius="6px"
                    borderWidth="1px"
                    borderColor="neutral.200"
                    pr="32px"
                    pl="16px"
                    aria-label={t('thresholds.aria.enterContinuity')}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>

              {/* Quantity (per capita) */}
              <Box
                as="article"
                aria-label={t('thresholds.aria.quantityCard')}
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius={{ base: 'lg', md: 'xl' }}
                bg="neutral.50"
                py={{ base: 4, md: 6 }}
                px={4}
                minH={{ base: 'auto', lg: '174px' }}
              >
                <Heading
                  as="h3"
                  size="h3"
                  fontWeight="400"
                  fontSize={{ base: 'md', md: 'xl' }}
                  mb={1}
                >
                  {t('thresholds.quantity.title')}
                </Heading>
                <Text fontSize={{ base: '12px', md: '14px' }} lineHeight="20px" mb={4}>
                  {t('thresholds.quantity.description')}
                </Text>
                <NumberInput
                  value={quantity}
                  onChange={(valueString) =>
                    setFormDraft((prev) => ({ ...prev, quantity: valueString }))
                  }
                  min={0}
                  w={{ base: 'full', xl: '490px' }}
                >
                  <NumberInputField
                    placeholder={t('common:enter')}
                    h="36px"
                    fontSize="md"
                    borderRadius="6px"
                    borderWidth="1px"
                    borderColor="neutral.200"
                    pr="32px"
                    pl="16px"
                    aria-label={t('thresholds.aria.enterQuantity')}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>

              {/* Regularity Threshold */}
              <Box
                as="article"
                aria-label={t('thresholds.aria.regularityCard')}
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius={{ base: 'lg', md: 'xl' }}
                bg="neutral.50"
                py={{ base: 4, md: 6 }}
                px={4}
                minH={{ base: 'auto', lg: '174px' }}
              >
                <Heading
                  as="h3"
                  size="h3"
                  fontWeight="400"
                  fontSize={{ base: 'md', md: 'xl' }}
                  mb={1}
                >
                  {t('thresholds.regularity.title')}
                </Heading>
                <Text fontSize={{ base: '12px', md: '14px' }} lineHeight="20px" mb={4}>
                  {t('thresholds.regularity.description')}
                </Text>
                <NumberInput
                  value={regularity}
                  onChange={(valueString) =>
                    setFormDraft((prev) => ({ ...prev, regularity: valueString }))
                  }
                  min={0}
                  w={{ base: 'full', xl: '490px' }}
                >
                  <NumberInputField
                    placeholder={t('common:enter')}
                    h="36px"
                    fontSize="md"
                    borderRadius="6px"
                    borderWidth="1px"
                    borderColor="neutral.200"
                    pr="32px"
                    pl="16px"
                    aria-label={t('thresholds.aria.enterRegularity')}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </SimpleGrid>
          </Flex>

          {/* Action Buttons */}
          <HStack
            spacing={3}
            justify={{ base: 'stretch', sm: 'flex-end' }}
            flexDirection={{ base: 'column-reverse', sm: 'row' }}
            mt={{ base: 4, lg: 6 }}
          >
            <Button
              variant="secondary"
              size="md"
              width={{ base: 'full', sm: '174px' }}
              onClick={handleCancel}
              isDisabled={saveThresholdMutation.isPending || !hasChanges}
            >
              {t('common:button.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              width={{ base: 'full', sm: '174px' }}
              onClick={handleSave}
              isLoading={saveThresholdMutation.isPending}
              isDisabled={!coverage || !continuity || !quantity || !regularity || !hasChanges}
            >
              {t('common:button.save')}
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
