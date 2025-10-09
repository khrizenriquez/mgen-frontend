/**
 * Test setup file for Vitest
 */
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import '../i18n' // Initialize i18n for tests

// Extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// Mock @restart/hooks for React Bootstrap
vi.mock('@restart/hooks', () => ({
  useBreakpoint: vi.fn(() => 'lg'),
  useMediaQuery: vi.fn(() => true),
}))

// Mock matchMedia for React Bootstrap
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})