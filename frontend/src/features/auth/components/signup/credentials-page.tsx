import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import { ROUTES } from '@/shared/constants/routes'

type CredentialsPageProps = {
  email: string
}

export function CredentialsPage({ email: _email }: CredentialsPageProps) {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isPhoneValid = /^\d{10}$/.test(phoneNumber)
  const canSubmit = firstName && isPhoneValid

  return (
    <>
      <Text textStyle="h5" fontWeight="600" mb="0.25rem">
        Profile Details
      </Text>
      <Text textStyle="bodyText5" fontWeight="400" mb="1.25rem">
        Complete your profile information.
      </Text>

      <Flex gap="1rem" mb="1rem">
        <FormControl>
          <FormLabel>
            <Text textStyle="bodyText6" mb="4px">
              First name
              <Text as="span" color="error.500">
                *
              </Text>
            </Text>
          </FormLabel>
          <Input
            placeholder="Enter"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value.replace(/[^A-Za-z]/g, ''))}
            h="36px"
            px="12px"
            py="8px"
            borderRadius="4px"
            borderColor="neutral.300"
            _placeholder={{ color: 'neutral.300' }}
            fontSize="sm"
            focusBorderColor="primary.500"
          />
        </FormControl>

        <FormControl>
          <FormLabel>
            <Text textStyle="bodyText6" mb="4px">
              Last name
            </Text>
          </FormLabel>
          <Input
            placeholder="Enter"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value.replace(/[^A-Za-z]/g, ''))}
            h="36px"
            px="12px"
            py="8px"
            borderRadius="4px"
            borderColor="neutral.300"
            _placeholder={{ color: 'neutral.300' }}
            fontSize="sm"
            focusBorderColor="primary.500"
          />
        </FormControl>
      </Flex>

      <FormControl mb="1.25rem" isInvalid={!isPhoneValid && !!phoneNumber}>
        <FormLabel>
          <Text textStyle="bodyText6" mb="4px">
            Phone Number
            <Text as="span" color="error.500">
              *
            </Text>
          </Text>
        </FormLabel>
        <Input
          type="tel"
          placeholder="+91"
          autoComplete="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
          maxLength={10}
          h="36px"
          px="12px"
          py="8px"
          borderRadius="4px"
          borderColor="neutral.300"
          _placeholder={{ color: 'neutral.300' }}
          fontSize="sm"
          focusBorderColor="primary.500"
        />
        <FormErrorMessage>Phone number must be 10 digits.</FormErrorMessage>
      </FormControl>

      <Button
        w="full"
        fontSize="16px"
        fontWeight="600"
        isDisabled={!canSubmit || isSubmitting}
        isLoading={isSubmitting}
        loadingText="Signing up..."
        _loading={{ bg: 'primary.500', color: 'white' }}
        onClick={() => {
          setIsSubmitting(true)
          navigate(ROUTES.LOGIN)
        }}
      >
        Sign up
      </Button>
    </>
  )
}
