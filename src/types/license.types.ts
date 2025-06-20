/**
 * 许可证相关类型定义
 */

// 许可证权限类型
export type LicensePermission = 
  | 'commercial-use'      // 商业使用
  | 'modifications'       // 修改
  | 'distribution'        // 分发
  | 'private-use'         // 私人使用
  | 'patent-use'          // 专利使用

// 许可证条件类型
export type LicenseCondition = 
  | 'include-copyright'   // 包含版权声明
  | 'include-license'     // 包含许可证文本
  | 'document-changes'    // 记录修改
  | 'disclose-source'     // 公开源代码
  | 'same-license'        // 使用相同许可证

// 许可证限制类型
export type LicenseLimitation = 
  | 'liability'           // 责任限制
  | 'warranty'            // 保证限制
  | 'trademark-use'       // 商标使用限制

// 许可证类别
export type LicenseCategory = 
  | 'permissive'          // 宽松许可证
  | 'copyleft'            // 强著佐权
  | 'weak-copyleft'       // 弱著佐权

// 许可证接口
export interface License {
  id: string
  name: string
  fullName: string
  description: string
  category: LicenseCategory
  permissions: LicensePermission[]
  conditions: LicenseCondition[]
  limitations: LicenseLimitation[]
  compatibility: string[]  // 兼容的许可证ID列表
  popularity: number       // 流行度评分 (1-10)
  complexity: number       // 复杂度评分 (1-10)
  url: string             // 官方链接
  spdxId: string          // SPDX标识符
}

// 许可证比较结果
export interface LicenseComparison {
  licenses: License[]
  differences: {
    permissions: LicensePermission[]
    conditions: LicenseCondition[]
    limitations: LicenseLimitation[]
  }
  recommendations: string[]
}

// 许可证搜索过滤器
export interface LicenseFilter {
  category?: LicenseCategory[]
  permissions?: LicensePermission[]
  conditions?: LicenseCondition[]
  limitations?: LicenseLimitation[]
  complexity?: {
    min: number
    max: number
  }
  popularity?: {
    min: number
    max: number
  }
}

// 许可证模板占位符类型
export type LicensePlaceholder =
  | 'year'          // 年份
  | 'fullname'      // 完整姓名
  | 'project'       // 项目名称
  | 'description'   // 项目描述
  | 'email'         // 邮箱地址
  | 'organization'  // 组织名称

// 许可证模板接口
export interface LicenseTemplate {
  id: string                    // 许可证ID，与License.id对应
  name: string                  // 许可证名称
  content: string               // 许可证文本模板
  placeholders: LicensePlaceholder[]  // 支持的占位符列表
  defaultFilename: string       // 默认文件名
  encoding: string              // 文件编码
}

// 许可证生成参数
export interface LicenseGenerationParams {
  licenseId: string
  year?: string
  fullname?: string
  project?: string
  description?: string
  email?: string
  organization?: string
  filename?: string
}

// 许可证生成结果
export interface LicenseGenerationResult {
  content: string
  filename: string
  mimeType: string
  encoding: string
}
