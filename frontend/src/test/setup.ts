/// <reference types="node" />

import '@testing-library/jest-dom'
import { TextDecoder, TextEncoder } from 'node:util'

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder
}
