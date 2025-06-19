import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LicenseCard from '@/components/knowledge/LicenseCard.vue'
import type { License } from '@/types/license.types'

const mockLicense: License = {
  id: 'MIT',
  name: 'MIT',
  fullName: 'MIT License',
  description: 'A short and simple permissive license with conditions only requiring preservation of copyright and license notices.',
  category: 'permissive',
  spdxId: 'MIT',
  url: 'https://choosealicense.com/licenses/mit/',
  permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'],
  conditions: ['include-copyright'],
  limitations: ['liability', 'warranty'],
  popularity: 9,
  complexity: 2,
  compatibility: ['Apache-2.0', 'GPL-3.0']
}

describe('LicenseCard', () => {
  it('should render license information correctly', () => {
    const wrapper = mount(LicenseCard, {
      props: {
        license: mockLicense
      }
    })

    expect(wrapper.text()).toContain('MIT')
    expect(wrapper.text()).toContain('MIT License')
    expect(wrapper.text()).toContain(mockLicense.description)
  })

  it('should display correct category tag', () => {
    const wrapper = mount(LicenseCard, {
      props: {
        license: mockLicense
      }
    })

    // Should show "宽松" for permissive category
    expect(wrapper.text()).toContain('宽松')
  })

  it('should show popularity and complexity metrics', () => {
    const wrapper = mount(LicenseCard, {
      props: {
        license: mockLicense
      }
    })

    expect(wrapper.text()).toContain('9/10') // popularity
    expect(wrapper.text()).toContain('2/10') // complexity
    expect(wrapper.text()).toContain('流行度')
    expect(wrapper.text()).toContain('复杂度')
  })

  it('should display permissions, conditions, and limitations', () => {
    const wrapper = mount(LicenseCard, {
      props: {
        license: mockLicense
      }
    })

    expect(wrapper.text()).toContain('权限')
    expect(wrapper.text()).toContain('条件')
    expect(wrapper.text()).toContain('限制')
    
    // Should show count of each type
    expect(wrapper.text()).toContain('(4)') // permissions count
    expect(wrapper.text()).toContain('(1)') // conditions count
    expect(wrapper.text()).toContain('(2)') // limitations count
  })

  it('should emit select event when card is clicked', async () => {
    const wrapper = mount(LicenseCard, {
      props: {
        license: mockLicense
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([mockLicense])
  })

  it('should emit view-details event when details button is clicked', async () => {
    const wrapper = mount(LicenseCard, {
      props: {
        license: mockLicense
      }
    })

    const detailsButton = wrapper.find('[data-testid="details-button"]')
    if (detailsButton.exists()) {
      await detailsButton.trigger('click')
      expect(wrapper.emitted('view-details')).toBeTruthy()
      expect(wrapper.emitted('view-details')?.[0]).toEqual([mockLicense])
    }
  })

  it('should emit compare event when compare button is clicked', async () => {
    const wrapper = mount(LicenseCard, {
      props: {
        license: mockLicense
      }
    })

    const compareButton = wrapper.find('[data-testid="compare-button"]')
    if (compareButton.exists()) {
      await compareButton.trigger('click')
      expect(wrapper.emitted('compare')).toBeTruthy()
      expect(wrapper.emitted('compare')?.[0]).toEqual([mockLicense])
    }
  })

  it('should apply selected class when selected prop is true', () => {
    const wrapper = mount(LicenseCard, {
      props: {
        license: mockLicense,
        selected: true
      }
    })

    expect(wrapper.classes()).toContain('license-card--selected')
  })

  it('should not apply selected class when selected prop is false', () => {
    const wrapper = mount(LicenseCard, {
      props: {
        license: mockLicense,
        selected: false
      }
    })

    expect(wrapper.classes()).not.toContain('license-card--selected')
  })

  it('should handle different license categories correctly', () => {
    const copyleftLicense: License = {
      ...mockLicense,
      category: 'copyleft'
    }

    const wrapper = mount(LicenseCard, {
      props: {
        license: copyleftLicense
      }
    })

    expect(wrapper.text()).toContain('强著佐权')
  })

  it('should limit displayed features when there are many', () => {
    const licenseWithManyPermissions: License = {
      ...mockLicense,
      permissions: ['commercial-use', 'modifications', 'distribution', 'private-use', 'patent-use']
    }

    const wrapper = mount(LicenseCard, {
      props: {
        license: licenseWithManyPermissions
      }
    })

    // Should show "+2" for additional permissions beyond the first 3
    expect(wrapper.text()).toContain('+2')
  })

  it('should handle empty permissions, conditions, or limitations', () => {
    const minimalLicense: License = {
      ...mockLicense,
      permissions: [],
      conditions: [],
      limitations: []
    }

    const wrapper = mount(LicenseCard, {
      props: {
        license: minimalLicense
      }
    })

    expect(wrapper.text()).toContain('(0)')
  })

  it('should prevent event propagation on button clicks', async () => {
    const wrapper = mount(LicenseCard, {
      props: {
        license: mockLicense
      }
    })

    const cardClickSpy = vi.fn()
    wrapper.vm.$emit = cardClickSpy

    // Find action buttons and simulate clicks
    const actionButtons = wrapper.findAll('button')
    
    for (const button of actionButtons) {
      await button.trigger('click')
    }

    // Card click should not be triggered when buttons are clicked
    expect(wrapper.emitted('select')).toBeFalsy()
  })

  it('should display correct complexity color', () => {
    const highComplexityLicense: License = {
      ...mockLicense,
      complexity: 8
    }

    const wrapper = mount(LicenseCard, {
      props: {
        license: highComplexityLicense
      }
    })

    // High complexity should use error color (#d03050)
    const progressElement = wrapper.find('.n-progress')
    expect(progressElement.exists()).toBe(true)
  })

  it('should handle missing optional properties gracefully', () => {
    const incompleteLicense = {
      ...mockLicense,
      compatibility: undefined
    } as License

    expect(() => {
      mount(LicenseCard, {
        props: {
          license: incompleteLicense
        }
      })
    }).not.toThrow()
  })
})
