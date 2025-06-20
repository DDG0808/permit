/**
 * 许可证生成服务测试
 */

import { describe, it, expect } from 'vitest'
import { 
  generateLicenseFile, 
  validateLicenseParams,
  previewLicenseContent,
  getSupportedFormats,
  getMimeTypeFromFilename
} from '../license-generator.service'

describe('LicenseGeneratorService', () => {
  describe('generateLicenseFile', () => {
    it('应该能生成MIT许可证文件', () => {
      const params = {
        licenseId: 'mit',
        year: '2024',
        fullname: 'John Doe'
      }

      const result = generateLicenseFile(params)

      expect(result.content).toContain('MIT License')
      expect(result.content).toContain('Copyright (c) 2024 John Doe')
      expect(result.filename).toBe('LICENSE')
      expect(result.mimeType).toBe('text/plain')
      expect(result.encoding).toBe('utf-8')
    })

    it('应该能生成Apache 2.0许可证文件', () => {
      const params = {
        licenseId: 'apache-2.0',
        year: '2024',
        fullname: 'Jane Smith'
      }

      const result = generateLicenseFile(params)

      expect(result.content).toContain('Apache License')
      expect(result.content).toContain('Copyright 2024 Jane Smith')
      expect(result.filename).toBe('LICENSE')
    })

    it('应该使用默认值填充缺失的占位符', () => {
      const params = {
        licenseId: 'mit'
      }

      const result = generateLicenseFile(params)
      const currentYear = new Date().getFullYear().toString()

      expect(result.content).toContain(`Copyright (c) ${currentYear} [Your Name]`)
    })

    it('应该支持自定义文件名', () => {
      const params = {
        licenseId: 'mit',
        filename: 'LICENSE.txt'
      }

      const result = generateLicenseFile(params)

      expect(result.filename).toBe('LICENSE.txt')
    })

    it('应该在许可证不存在时抛出错误', () => {
      const params = {
        licenseId: 'non-existent-license'
      }

      expect(() => generateLicenseFile(params)).toThrow('未找到许可证模板')
    })
  })

  describe('validateLicenseParams', () => {
    it('应该验证有效的参数', () => {
      const params = {
        licenseId: 'mit',
        year: '2024',
        fullname: 'John Doe'
      }

      const result = validateLicenseParams(params)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('应该检测缺失的许可证ID', () => {
      const params = {
        licenseId: '',
        year: '2024',
        fullname: 'John Doe'
      }

      const result = validateLicenseParams(params)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('许可证ID不能为空')
    })

    it('应该检测不支持的许可证类型', () => {
      const params = {
        licenseId: 'invalid-license',
        year: '2024',
        fullname: 'John Doe'
      }

      const result = validateLicenseParams(params)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('不支持的许可证类型: invalid-license')
    })
  })

  describe('previewLicenseContent', () => {
    it('应该能预览许可证内容', () => {
      const params = {
        licenseId: 'mit',
        year: '2024',
        fullname: 'John Doe'
      }

      const content = previewLicenseContent(params)

      expect(content).toContain('MIT License')
      expect(content).toContain('Copyright (c) 2024 John Doe')
    })

    it('应该在预览失败时抛出错误', () => {
      const params = {
        licenseId: 'invalid-license'
      }

      expect(() => previewLicenseContent(params)).toThrow('预览失败')
    })
  })

  describe('getSupportedFormats', () => {
    it('应该返回支持的文件格式', () => {
      const formats = getSupportedFormats()

      expect(formats).toHaveLength(3)
      expect(formats[0]).toEqual({
        extension: '',
        name: 'LICENSE',
        mimeType: 'text/plain'
      })
      expect(formats[1]).toEqual({
        extension: '.txt',
        name: 'LICENSE.txt',
        mimeType: 'text/plain'
      })
      expect(formats[2]).toEqual({
        extension: '.md',
        name: 'LICENSE.md',
        mimeType: 'text/markdown'
      })
    })
  })

  describe('getMimeTypeFromFilename', () => {
    it('应该根据文件扩展名返回正确的MIME类型', () => {
      expect(getMimeTypeFromFilename('LICENSE')).toBe('text/plain')
      expect(getMimeTypeFromFilename('LICENSE.txt')).toBe('text/plain')
      expect(getMimeTypeFromFilename('LICENSE.md')).toBe('text/markdown')
      expect(getMimeTypeFromFilename('LICENSE.unknown')).toBe('text/plain')
    })
  })
})
