/**
 * 许可证文件生成服务
 * 提供许可证文件生成和下载功能
 */

import type { 
  LicenseGenerationParams, 
  LicenseGenerationResult,
  LicensePlaceholder 
} from '@/types/license.types'
import { getLicenseTemplate } from '@/data/license-templates/index'

/**
 * 生成许可证文件内容
 * @param params 生成参数
 * @returns 生成结果
 */
export function generateLicenseFile(params: LicenseGenerationParams): LicenseGenerationResult {
  const { licenseId, year, fullname, project, description, email, organization, filename } = params

  // 获取许可证模板
  const template = getLicenseTemplate(licenseId)
  if (!template) {
    throw new Error(`未找到许可证模板: ${licenseId}`)
  }

  // 准备占位符替换映射
  const placeholderMap: Record<LicensePlaceholder, string> = {
    year: year || new Date().getFullYear().toString(),
    fullname: fullname || '[Your Name]',
    project: project || '[Project Name]',
    description: description || '[Project Description]',
    email: email || '[your.email@example.com]',
    organization: organization || '[Your Organization]'
  }

  // 替换模板中的占位符
  let content = template.content
  template.placeholders.forEach(placeholder => {
    const value = placeholderMap[placeholder]
    const regex = new RegExp(`\\[${placeholder}\\]`, 'g')
    content = content.replace(regex, value)
  })

  // 确定文件名
  const finalFilename = filename || template.defaultFilename

  return {
    content,
    filename: finalFilename,
    mimeType: 'text/plain',
    encoding: template.encoding
  }
}

/**
 * 下载许可证文件
 * @param params 生成参数
 * @param onSuccess 成功回调
 * @param onError 错误回调
 */
export function downloadLicenseFile(
  params: LicenseGenerationParams,
  onSuccess?: (filename: string) => void,
  onError?: (error: Error) => void
): void {
  try {
    // 生成许可证文件
    const result = generateLicenseFile(params)

    // 创建 Blob 对象
    const blob = new Blob([result.content], { 
      type: result.mimeType + ';charset=' + result.encoding 
    })

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = result.filename
    a.style.display = 'none'

    // 触发下载
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    // 清理 URL 对象
    URL.revokeObjectURL(url)

    // 调用成功回调
    onSuccess?.(result.filename)
  } catch (error) {
    // 调用错误回调
    onError?.(error as Error)
  }
}

/**
 * 批量下载多个许可证文件（打包为ZIP）
 * 注意：此功能需要安装 jszip 依赖包
 * @param licenseParams 多个许可证参数
 * @param zipFilename ZIP文件名
 * @param onSuccess 成功回调
 * @param onError 错误回调
 */
export async function downloadMultipleLicenses(
  licenseParams: LicenseGenerationParams[],
  zipFilename: string = 'licenses.zip',
  onSuccess?: (filename: string) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    // 暂时不支持批量下载功能，因为项目中没有安装 jszip
    throw new Error('批量下载功能暂未启用，请单独下载各个许可证文件')
  } catch (error) {
    onError?.(error as Error)
  }
}

/**
 * 预览许可证文件内容
 * @param params 生成参数
 * @returns 生成的许可证内容
 */
export function previewLicenseContent(params: LicenseGenerationParams): string {
  try {
    const result = generateLicenseFile(params)
    return result.content
  } catch (error) {
    throw new Error(`预览失败: ${(error as Error).message}`)
  }
}

/**
 * 验证许可证生成参数
 * @param params 生成参数
 * @returns 验证结果
 */
export function validateLicenseParams(params: LicenseGenerationParams): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // 检查必需的许可证ID
  if (!params.licenseId) {
    errors.push('许可证ID不能为空')
  }

  // 检查许可证模板是否存在
  const template = getLicenseTemplate(params.licenseId)
  if (!template) {
    errors.push(`不支持的许可证类型: ${params.licenseId}`)
  }

  // 检查必需的占位符
  if (template) {
    if (template.placeholders.includes('fullname') && !params.fullname) {
      errors.push('作者姓名不能为空')
    }
    if (template.placeholders.includes('year') && !params.year) {
      errors.push('年份不能为空')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 获取支持的文件格式
 * @returns 支持的文件格式列表
 */
export function getSupportedFormats(): Array<{
  extension: string
  name: string
  mimeType: string
}> {
  return [
    { extension: '', name: 'LICENSE', mimeType: 'text/plain' },
    { extension: '.txt', name: 'LICENSE.txt', mimeType: 'text/plain' },
    { extension: '.md', name: 'LICENSE.md', mimeType: 'text/markdown' }
  ]
}

/**
 * 根据文件扩展名获取MIME类型
 * @param filename 文件名
 * @returns MIME类型
 */
export function getMimeTypeFromFilename(filename: string): string {
  const extension = filename.toLowerCase().split('.').pop()
  
  switch (extension) {
    case 'md':
      return 'text/markdown'
    case 'txt':
      return 'text/plain'
    default:
      return 'text/plain'
  }
}
