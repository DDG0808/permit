import { vi, beforeEach, afterEach } from 'vitest'
import { config } from '@vue/test-utils'
import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
})) as any

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
})) as any

// Mock matchMedia
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

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock as any

// Mock fetch
global.fetch = vi.fn()

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
}

// Configure Vue Test Utils
config.global.stubs = {
  transition: false,
  'transition-group': false,
}

// Mock router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      name: 'home',
      params: {},
      query: {},
      meta: {},
    }
  }
}

config.global.mocks = {
  $router: mockRouter,
  $route: mockRouter.currentRoute.value,
}

// Mock Naive UI components for testing
config.global.stubs = {
  ...config.global.stubs,
  'n-button': true,
  'n-card': true,
  'n-space': true,
  'n-icon': true,
  'n-input': true,
  'n-select': true,
  'n-checkbox': true,
  'n-radio': true,
  'n-progress': true,
  'n-tag': true,
  'n-menu': true,
  'n-breadcrumb': true,
  'n-breadcrumb-item': true,
  'n-modal': true,
  'n-dialog': true,
  'n-message': true,
  'n-notification': true,
  'n-loading-bar': true,
  'n-spin': true,
  'n-empty': true,
  'n-result': true,
  'n-collapse': true,
  'n-collapse-item': true,
  'n-list': true,
  'n-list-item': true,
  'n-grid': true,
  'n-gi': true,
  'n-slider': true,
  'n-button-group': true,
  'n-data-table': true,
}

// Setup cleanup
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})
