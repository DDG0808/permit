/**
 * 许可证模板数据库 - 重构版本
 * 现在使用模块化的许可证模板系统
 *
 * @deprecated 请使用 src/data/license-templates/index.ts 中的新模块化系统
 */

// 重新导出新的模块化许可证模板系统
export {
  licenseTemplates,
  getLicenseTemplate,
  getAllTemplates,
  getAllTemplateIds,
  hasTemplate,
  searchTemplatesByName,
  getTemplatesWithPlaceholder
} from './license-templates/index'

