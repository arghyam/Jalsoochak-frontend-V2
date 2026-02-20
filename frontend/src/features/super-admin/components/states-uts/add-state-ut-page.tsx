import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  Input,
  Button,
  HStack,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SearchableSelect, ToastContainer } from '@/shared/components/common'
import { useToast } from '@/shared/hooks/use-toast'
import { INDIAN_STATES_UTS } from '../../types/states-uts'
import { ROUTES } from '@/shared/constants/routes'
import {
  useAssignedStateNamesQuery,
  useCreateStateUTMutation,
} from '../../services/query/use-super-admin-queries'

export function AddStateUTPage() {
  const { t } = useTranslation(['super-admin', 'common'])
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    document.title = `${t('statesUts.addTitle')} | JalSoochak`
  }, [t])

  const {
    data: assignedStates = [],
    isLoading: isAssignedStatesLoading,
    isError: isAssignedStatesError,
  } = useAssignedStateNamesQuery()
  const createStateMutation = useCreateStateUTMutation()

  // Form state
  const [stateName, setStateName] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [secondaryEmail, setSecondaryEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')

  // Filter available states (exclude already assigned)
  const availableStates = useMemo(() => {
    return INDIAN_STATES_UTS.filter((state) => !assignedStates.includes(state.name)).map(
      (state) => ({
        value: state.name,
        label: state.name,
      })
    )
  }, [assignedStates])

  // Auto-fill state code when state is selected
  const handleStateChange = (value: string) => {
    setStateName(value)
    const selectedState = INDIAN_STATES_UTS.find((s) => s.name === value)
    setStateCode(selectedState?.code ?? '')
  }

  // Validation
  const isValidEmail = (emailStr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailStr)
  }

  const isValidPhone = (phoneStr: string): boolean => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phoneStr)
  }

  const isFormValid = useMemo(() => {
    const requiredFieldsValid =
      stateName !== '' &&
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      phone.trim() !== ''

    const emailValid = isValidEmail(email)
    const phoneValid = isValidPhone(phone)

    // Optional fields validation (if provided)
    const secondaryEmailValid = secondaryEmail === '' || isValidEmail(secondaryEmail)
    const contactNumberValid = contactNumber === '' || isValidPhone(contactNumber)

    return (
      requiredFieldsValid && emailValid && phoneValid && secondaryEmailValid && contactNumberValid
    )
  }, [stateName, firstName, lastName, email, phone, secondaryEmail, contactNumber])

  const handleCancel = () => {
    navigate(ROUTES.SUPER_ADMIN_STATES_UTS)
  }

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.addToast(t('common:toast.fillAllFieldsCorrectly'), 'error')
      return
    }

    try {
      const newState = await createStateMutation.mutateAsync({
        name: stateName,
        code: stateCode,
        admin: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          secondaryEmail: secondaryEmail.trim() || undefined,
          contactNumber: contactNumber.trim() || undefined,
        },
      })
      toast.addToast(t('statesUts.messages.addedSuccess'), 'success')
      // Navigate to view page after short delay to show toast
      setTimeout(() => {
        navigate(ROUTES.SUPER_ADMIN_STATES_UTS_VIEW.replace(':id', newState.id))
      }, 500)
    } catch (error) {
      console.error('Failed to create state:', error)
      toast.addToast(t('statesUts.messages.failedToAdd'), 'error')
    }
  }

  return (
    <Box w="full">
      {/* Page Header with Breadcrumb */}
      <Box mb={5}>
        <Heading as="h1" size={{ base: 'h2', md: 'h1' }} mb={2}>
          {t('statesUts.addTitle')}
        </Heading>
        <Flex as="nav" aria-label="Breadcrumb" gap={2} flexWrap="wrap">
          <Text
            as="a"
            fontSize="14px"
            lineHeight="21px"
            color="neutral.500"
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            onClick={() => navigate(ROUTES.SUPER_ADMIN_STATES_UTS)}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(ROUTES.SUPER_ADMIN_STATES_UTS)}
          >
            {t('statesUts.breadcrumb.manage')}
          </Text>
          <Text fontSize="14px" lineHeight="21px" color="neutral.500" aria-hidden="true">
            /
          </Text>
          <Text fontSize="14px" lineHeight="21px" color="#26272B" aria-current="page">
            {t('statesUts.breadcrumb.addNew')}
          </Text>
        </Flex>
      </Box>

      {/* Assigned states fetch error */}
      {isAssignedStatesError && (
        <Alert status="error" borderRadius="8px" mb={4}>
          <AlertIcon />
          {t('statesUts.messages.failedToLoadAssignedStates')}
        </Alert>
      )}

      {/* Form Card */}
      <Box
        as="form"
        role="form"
        aria-label={t('statesUts.addTitle')}
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.200"
        borderRadius="12px"
        w="full"
        minH={{ base: 'auto', lg: 'calc(100vh - 180px)' }}
        py={6}
        px={{ base: 3, md: 4 }}
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <Flex
          direction="column"
          h="full"
          justify="space-between"
          minH={{ base: 'auto', lg: 'calc(100vh - 232px)' }}
        >
          <Box>
            {/* State/UT Details Section */}
            <Heading as="h2" size="h3" fontWeight="400" mb={4} id="state-details-heading">
              {t('statesUts.details.title')}
            </Heading>
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={6}
              mb={7}
              aria-labelledby="state-details-heading"
            >
              <FormControl isRequired>
                <FormLabel htmlFor="state-name-select" textStyle="h10" mb={1}>
                  {t('statesUts.details.name')}
                </FormLabel>
                <SearchableSelect
                  id="state-name-select"
                  options={availableStates}
                  value={stateName}
                  onChange={handleStateChange}
                  placeholder={t('common:select')}
                  placeholderColor="neutral.300"
                  width={{ base: '100%', xl: '486px' }}
                  disabled={isAssignedStatesLoading || isAssignedStatesError}
                />
              </FormControl>
              <FormControl>
                <FormLabel textStyle="h10" mb={1}>
                  {t('statesUts.details.code')}
                </FormLabel>
                <Input
                  value={stateCode}
                  isReadOnly
                  bg="neutral.50"
                  h={9}
                  maxW={{ base: '100%', lg: '486px' }}
                  borderColor="neutral.200"
                  aria-readonly="true"
                />
              </FormControl>
            </SimpleGrid>

            {/* State Admin Details Section */}
            <Heading as="h2" size="h3" fontWeight="400" mb={4} id="admin-details-heading">
              {t('statesUts.adminDetails.title')}
            </Heading>
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={3}
              aria-labelledby="admin-details-heading"
            >
              <FormControl isRequired>
                <FormLabel textStyle="h10" mb={1}>
                  {t('statesUts.adminDetails.firstName')}
                </FormLabel>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t('common:enter')}
                  h={9}
                  maxW={{ base: '100%', lg: '486px' }}
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.300' }}
                  aria-required="true"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel textStyle="h10" mb={1}>
                  {t('statesUts.adminDetails.lastName')}
                </FormLabel>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t('common:enter')}
                  h={9}
                  maxW={{ base: '100%', lg: '486px' }}
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.300' }}
                  aria-required="true"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel textStyle="h10" mb={1}>
                  {t('statesUts.adminDetails.email')}
                </FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('common:enter')}
                  h={9}
                  maxW={{ base: '100%', lg: '486px' }}
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.300' }}
                  aria-required="true"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel textStyle="h10" mb={1}>
                  {t('statesUts.adminDetails.phone')}
                </FormLabel>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 10) {
                      setPhone(value)
                    }
                  }}
                  placeholder="+91"
                  h={9}
                  maxW={{ base: '100%', lg: '486px' }}
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.300' }}
                  aria-required="true"
                  inputMode="numeric"
                />
              </FormControl>
              <FormControl>
                <FormLabel textStyle="h10" mb={1}>
                  {t('statesUts.adminDetails.secondaryEmail')}
                </FormLabel>
                <Input
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  placeholder={t('common:enter')}
                  h={9}
                  maxW={{ base: '100%', lg: '486px' }}
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.300' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel textStyle="h10" mb={1}>
                  {t('statesUts.adminDetails.contactNumber')}
                </FormLabel>
                <Input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 10) {
                      setContactNumber(value)
                    }
                  }}
                  placeholder={t('common:enter')}
                  h={9}
                  maxW={{ base: '100%', lg: '486px' }}
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.300' }}
                  inputMode="numeric"
                />
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Action Buttons */}
          <HStack
            spacing={3}
            justify={{ base: 'stretch', sm: 'flex-end' }}
            mt={6}
            flexDirection={{ base: 'column-reverse', sm: 'row' }}
          >
            <Button
              variant="secondary"
              size="md"
              width={{ base: 'full', sm: '174px' }}
              onClick={handleCancel}
              isDisabled={createStateMutation.isPending}
            >
              {t('common:button.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              width={{ base: 'full', sm: 'auto' }}
              maxWidth={{ base: '100%', sm: '275px' }}
              isLoading={createStateMutation.isPending}
              isDisabled={!isFormValid}
            >
              {t('statesUts.buttons.addAndSendLink')}
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
