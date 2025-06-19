/**
 * 许可证静态数据库
 */

import type { License } from '@/types/license.types'

export const licenses: License[] = [
  {
    id: 'mit',
    name: 'MIT',
    fullName: 'MIT License',
    description: '最流行的宽松许可证，允许几乎任何用途，只需保留版权声明',
    category: 'permissive',
    permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'],
    conditions: ['include-copyright', 'include-license'],
    limitations: ['liability', 'warranty'],
    compatibility: ['apache-2.0', 'bsd-3-clause', 'bsd-2-clause', 'isc'],
    popularity: 10,
    complexity: 1,
    url: 'https://opensource.org/licenses/MIT',
    spdxId: 'MIT'
  },
  {
    id: 'apache-2.0',
    name: 'Apache 2.0',
    fullName: 'Apache License 2.0',
    description: '宽松许可证，提供专利保护，适合商业项目',
    category: 'permissive',
    permissions: ['commercial-use', 'modifications', 'distribution', 'private-use', 'patent-use'],
    conditions: ['include-copyright', 'include-license', 'document-changes'],
    limitations: ['liability', 'warranty', 'trademark-use'],
    compatibility: ['mit', 'bsd-3-clause', 'bsd-2-clause'],
    popularity: 9,
    complexity: 3,
    url: 'https://www.apache.org/licenses/LICENSE-2.0',
    spdxId: 'Apache-2.0'
  },
  {
    id: 'gpl-3.0',
    name: 'GPL v3',
    fullName: 'GNU General Public License v3.0',
    description: '强著佐权许可证，要求衍生作品也必须开源',
    category: 'copyleft',
    permissions: ['commercial-use', 'modifications', 'distribution', 'private-use', 'patent-use'],
    conditions: ['include-copyright', 'include-license', 'document-changes', 'disclose-source', 'same-license'],
    limitations: ['liability', 'warranty'],
    compatibility: ['lgpl-3.0', 'agpl-3.0'],
    popularity: 7,
    complexity: 8,
    url: 'https://www.gnu.org/licenses/gpl-3.0.html',
    spdxId: 'GPL-3.0'
  },
  {
    id: 'bsd-3-clause',
    name: 'BSD 3-Clause',
    fullName: 'BSD 3-Clause "New" or "Revised" License',
    description: '宽松许可证，禁止使用项目名称进行推广',
    category: 'permissive',
    permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'],
    conditions: ['include-copyright', 'include-license'],
    limitations: ['liability', 'warranty'],
    compatibility: ['mit', 'apache-2.0', 'bsd-2-clause'],
    popularity: 6,
    complexity: 2,
    url: 'https://opensource.org/licenses/BSD-3-Clause',
    spdxId: 'BSD-3-Clause'
  },
  {
    id: 'bsd-2-clause',
    name: 'BSD 2-Clause',
    fullName: 'BSD 2-Clause "Simplified" License',
    description: '简化的BSD许可证，更加宽松',
    category: 'permissive',
    permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'],
    conditions: ['include-copyright', 'include-license'],
    limitations: ['liability', 'warranty'],
    compatibility: ['mit', 'apache-2.0', 'bsd-3-clause'],
    popularity: 5,
    complexity: 1,
    url: 'https://opensource.org/licenses/BSD-2-Clause',
    spdxId: 'BSD-2-Clause'
  },
  {
    id: 'lgpl-3.0',
    name: 'LGPL v3',
    fullName: 'GNU Lesser General Public License v3.0',
    description: '弱著佐权许可证，允许链接到专有软件',
    category: 'weak-copyleft',
    permissions: ['commercial-use', 'modifications', 'distribution', 'private-use', 'patent-use'],
    conditions: ['include-copyright', 'include-license', 'document-changes', 'disclose-source'],
    limitations: ['liability', 'warranty'],
    compatibility: ['gpl-3.0', 'agpl-3.0'],
    popularity: 4,
    complexity: 6,
    url: 'https://www.gnu.org/licenses/lgpl-3.0.html',
    spdxId: 'LGPL-3.0'
  },
  {
    id: 'mpl-2.0',
    name: 'MPL 2.0',
    fullName: 'Mozilla Public License 2.0',
    description: '弱著佐权许可证，文件级别的copyleft',
    category: 'weak-copyleft',
    permissions: ['commercial-use', 'modifications', 'distribution', 'private-use', 'patent-use'],
    conditions: ['include-copyright', 'include-license', 'disclose-source'],
    limitations: ['liability', 'warranty', 'trademark-use'],
    compatibility: ['apache-2.0', 'gpl-3.0'],
    popularity: 3,
    complexity: 5,
    url: 'https://www.mozilla.org/en-US/MPL/2.0/',
    spdxId: 'MPL-2.0'
  },
  {
    id: 'unlicense',
    name: 'Unlicense',
    fullName: 'The Unlicense',
    description: '将作品释放到公有领域，没有任何限制',
    category: 'permissive',
    permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'],
    conditions: [],
    limitations: ['liability', 'warranty'],
    compatibility: ['mit', 'apache-2.0', 'bsd-3-clause', 'bsd-2-clause'],
    popularity: 2,
    complexity: 1,
    url: 'https://unlicense.org/',
    spdxId: 'Unlicense'
  }
]

// 根据ID获取许可证
export function getLicenseById(id: string): License | undefined {
  return licenses.find(license => license.id === id)
}

// 根据SPDX ID获取许可证
export function getLicenseBySpdxId(spdxId: string): License | undefined {
  return licenses.find(license => license.spdxId === spdxId)
}

// 获取所有许可证ID
export function getAllLicenseIds(): string[] {
  return licenses.map(license => license.id)
}
