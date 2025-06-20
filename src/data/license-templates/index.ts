/**
 * 许可证模板主入口文件
 * 统一导出所有许可证模板和工具函数
 */

import type { LicenseTemplate } from '@/types/license.types'
import { mitTemplate } from './mit'
import { apache20Template } from './apache-2.0'
import { bsd3ClauseTemplate } from './bsd-3-clause'
import { bsd2ClauseTemplate } from './bsd-2-clause'
import { gpl30Template } from './gpl-3.0'
import { lgpl30Template } from './lgptl-3.0'
import { mpl20Template } from './mpl-2.0'
import { unlicenseTemplate } from './unlicense'

// 所有许可证模板的集合
export const licenseTemplates: LicenseTemplate[] = [
  mitTemplate,
  apache20Template,
  bsd3ClauseTemplate,
  bsd2ClauseTemplate,
  gpl30Template,
  lgpl30Template,
  mpl20Template,
  unlicenseTemplate
]

// 根据ID获取许可证模板
export function getLicenseTemplate(id: string): LicenseTemplate | undefined {
  return licenseTemplates.find(template => template.id === id)
}

// 获取所有许可证模板
export function getAllTemplates(): LicenseTemplate[] {
  return [...licenseTemplates]
}

// 获取所有模板ID
export function getAllTemplateIds(): string[] {
  return licenseTemplates.map(template => template.id)
}

// 检查许可证是否有模板
export function hasTemplate(licenseId: string): boolean {
  return licenseTemplates.some(template => template.id === licenseId)
}

// 根据名称搜索模板
export function searchTemplatesByName(query: string): LicenseTemplate[] {
  const lowerQuery = query.toLowerCase()
  return licenseTemplates.filter(template => 
    template.name.toLowerCase().includes(lowerQuery) ||
    template.id.toLowerCase().includes(lowerQuery)
  )
}

// 获取支持特定占位符的模板
export function getTemplatesWithPlaceholder(placeholder: string): LicenseTemplate[] {
  return licenseTemplates.filter(template => 
    template.placeholders.includes(placeholder as any)
  )
}

// 导出单个模板（用于按需导入）
export {
  mitTemplate,
  apache20Template,
  bsd3ClauseTemplate,
  bsd2ClauseTemplate,
  gpl30Template,
  lgpl30Template,
  mpl20Template,
  unlicenseTemplate
}
