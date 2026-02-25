import type { PropsWithChildren, ReactElement } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render } from '@testing-library/react'
import theme from '@/app/theme'

function Providers({ children }: PropsWithChildren) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}

export function renderWithProviders(ui: ReactElement) {
  return render(ui, { wrapper: Providers })
}
