/**
 * 问答题目数据
 */

import type { WizardQuestion, WizardConfig } from '@/types/wizard.types'

export const wizardQuestions: WizardQuestion[] = [
  {
    id: 'commercial-use',
    title: '您是否希望允许他人将您的代码用于商业目的？',
    description: '这决定了其他人是否可以在商业产品中使用您的代码',
    type: 'single',
    required: true,
    options: [
      {
        value: 'yes',
        label: '是，允许商业使用',
        description: '其他人可以在商业产品中使用您的代码',
        weights: {
          'mit': 10,
          'apache-2.0': 10,
          'bsd-3-clause': 10,
          'bsd-2-clause': 10,
          'gpl-3.0': 8,
          'lgpl-3.0': 9,
          'mpl-2.0': 9,
          'unlicense': 10
        }
      },
      {
        value: 'no',
        label: '否，仅限非商业使用',
        description: '限制代码仅用于非商业目的',
        weights: {
          'mit': 0,
          'apache-2.0': 0,
          'bsd-3-clause': 0,
          'bsd-2-clause': 0,
          'gpl-3.0': 0,
          'lgpl-3.0': 0,
          'mpl-2.0': 0,
          'unlicense': 0
        }
      },
      {
        value: 'unsure',
        label: '不确定',
        description: '需要更多信息来决定',
        weights: {
          'mit': 5,
          'apache-2.0': 5,
          'bsd-3-clause': 5,
          'bsd-2-clause': 5,
          'gpl-3.0': 4,
          'lgpl-3.0': 4,
          'mpl-2.0': 4,
          'unlicense': 5
        }
      }
    ],
    helpText: '大多数开源项目都允许商业使用，这有助于项目的广泛采用'
  },
  {
    id: 'derivative-works',
    title: '如果他人修改了您的代码，您是否要求他们也必须开源？',
    description: '这涉及到copyleft的概念，即衍生作品是否必须使用相同的许可证',
    type: 'single',
    required: true,
    options: [
      {
        value: 'yes-strong',
        label: '是，强制要求开源（强copyleft）',
        description: '任何使用您代码的项目都必须完全开源',
        weights: {
          'mit': 0,
          'apache-2.0': 0,
          'bsd-3-clause': 0,
          'bsd-2-clause': 0,
          'gpl-3.0': 10,
          'lgpl-3.0': 3,
          'mpl-2.0': 2,
          'unlicense': 0
        }
      },
      {
        value: 'yes-weak',
        label: '部分要求开源（弱copyleft）',
        description: '只要求修改的部分开源，可以与专有软件结合',
        weights: {
          'mit': 2,
          'apache-2.0': 2,
          'bsd-3-clause': 2,
          'bsd-2-clause': 2,
          'gpl-3.0': 5,
          'lgpl-3.0': 10,
          'mpl-2.0': 10,
          'unlicense': 1
        }
      },
      {
        value: 'no',
        label: '否，不要求开源',
        description: '允许他人在专有软件中使用而不公开源代码',
        weights: {
          'mit': 10,
          'apache-2.0': 10,
          'bsd-3-clause': 10,
          'bsd-2-clause': 10,
          'gpl-3.0': 0,
          'lgpl-3.0': 3,
          'mpl-2.0': 3,
          'unlicense': 10
        }
      }
    ],
    helpText: 'Copyleft确保代码保持开源，但可能限制采用率'
  },
  {
    id: 'patent-protection',
    title: '您是否需要专利保护？',
    description: '某些许可证提供专利授权和保护条款',
    type: 'single',
    required: true,
    options: [
      {
        value: 'yes',
        label: '是，需要专利保护',
        description: '希望许可证包含专利授权条款',
        weights: {
          'mit': 3,
          'apache-2.0': 10,
          'bsd-3-clause': 2,
          'bsd-2-clause': 2,
          'gpl-3.0': 9,
          'lgpl-3.0': 9,
          'mpl-2.0': 8,
          'unlicense': 1
        }
      },
      {
        value: 'no',
        label: '否，不需要专利保护',
        description: '专利不是主要考虑因素',
        weights: {
          'mit': 8,
          'apache-2.0': 7,
          'bsd-3-clause': 9,
          'bsd-2-clause': 9,
          'gpl-3.0': 6,
          'lgpl-3.0': 6,
          'mpl-2.0': 6,
          'unlicense': 10
        }
      }
    ],
    helpText: '专利保护对于可能涉及专利的技术项目很重要'
  },
  {
    id: 'project-type',
    title: '您的项目类型是什么？',
    description: '不同类型的项目可能适合不同的许可证',
    type: 'single',
    required: true,
    options: [
      {
        value: 'library',
        label: '库/框架',
        description: '供其他开发者使用的代码库',
        weights: {
          'mit': 10,
          'apache-2.0': 9,
          'bsd-3-clause': 8,
          'bsd-2-clause': 8,
          'gpl-3.0': 4,
          'lgpl-3.0': 9,
          'mpl-2.0': 7,
          'unlicense': 7
        }
      },
      {
        value: 'application',
        label: '应用程序',
        description: '最终用户使用的完整应用',
        weights: {
          'mit': 8,
          'apache-2.0': 8,
          'bsd-3-clause': 7,
          'bsd-2-clause': 7,
          'gpl-3.0': 9,
          'lgpl-3.0': 6,
          'mpl-2.0': 6,
          'unlicense': 6
        }
      },
      {
        value: 'tool',
        label: '开发工具',
        description: '帮助开发者的工具或实用程序',
        weights: {
          'mit': 9,
          'apache-2.0': 9,
          'bsd-3-clause': 8,
          'bsd-2-clause': 8,
          'gpl-3.0': 7,
          'lgpl-3.0': 5,
          'mpl-2.0': 6,
          'unlicense': 8
        }
      },
      {
        value: 'research',
        label: '研究/学术项目',
        description: '用于研究或教育目的的代码',
        weights: {
          'mit': 9,
          'apache-2.0': 7,
          'bsd-3-clause': 9,
          'bsd-2-clause': 9,
          'gpl-3.0': 8,
          'lgpl-3.0': 6,
          'mpl-2.0': 5,
          'unlicense': 10
        }
      }
    ],
    helpText: '库通常使用宽松许可证以提高采用率，应用可能使用copyleft许可证'
  },
  {
    id: 'complexity-preference',
    title: '您对许可证复杂度的偏好是什么？',
    description: '简单的许可证易于理解，复杂的许可证提供更多保护',
    type: 'single',
    required: true,
    options: [
      {
        value: 'simple',
        label: '简单易懂',
        description: '偏好简短、易于理解的许可证',
        weights: {
          'mit': 10,
          'apache-2.0': 4,
          'bsd-3-clause': 8,
          'bsd-2-clause': 9,
          'gpl-3.0': 2,
          'lgpl-3.0': 3,
          'mpl-2.0': 4,
          'unlicense': 10
        }
      },
      {
        value: 'balanced',
        label: '平衡',
        description: '在简单性和保护性之间寻求平衡',
        weights: {
          'mit': 7,
          'apache-2.0': 9,
          'bsd-3-clause': 8,
          'bsd-2-clause': 7,
          'gpl-3.0': 6,
          'lgpl-3.0': 8,
          'mpl-2.0': 9,
          'unlicense': 5
        }
      },
      {
        value: 'comprehensive',
        label: '全面保护',
        description: '偏好提供全面法律保护的详细许可证',
        weights: {
          'mit': 3,
          'apache-2.0': 8,
          'bsd-3-clause': 4,
          'bsd-2-clause': 3,
          'gpl-3.0': 10,
          'lgpl-3.0': 9,
          'mpl-2.0': 8,
          'unlicense': 1
        }
      }
    ],
    helpText: '简单的许可证更容易被采用，但可能缺少某些保护条款'
  },
  {
    id: 'attribution-requirement',
    title: '您是否要求使用者保留您的署名？',
    description: '大多数许可证都要求保留版权声明和许可证文本',
    type: 'single',
    required: true,
    options: [
      {
        value: 'yes',
        label: '是，要求保留署名',
        description: '使用者必须保留版权声明和许可证',
        weights: {
          'mit': 10,
          'apache-2.0': 10,
          'bsd-3-clause': 10,
          'bsd-2-clause': 10,
          'gpl-3.0': 10,
          'lgpl-3.0': 10,
          'mpl-2.0': 10,
          'unlicense': 0
        }
      },
      {
        value: 'no',
        label: '否，完全放弃权利',
        description: '将作品完全释放到公有领域',
        weights: {
          'mit': 2,
          'apache-2.0': 1,
          'bsd-3-clause': 1,
          'bsd-2-clause': 1,
          'gpl-3.0': 0,
          'lgpl-3.0': 0,
          'mpl-2.0': 0,
          'unlicense': 10
        }
      }
    ],
    helpText: '署名要求有助于维护开源社区的贡献记录'
  }
]

export const wizardConfig: WizardConfig = {
  questions: wizardQuestions,
  scoring: {
    minRecommendationScore: 5,
    maxRecommendations: 3,
    weightingMethod: 'sum'
  },
  ui: {
    showProgress: true,
    allowBackNavigation: true,
    showQuestionNumbers: true,
    autoAdvance: false
  }
}
