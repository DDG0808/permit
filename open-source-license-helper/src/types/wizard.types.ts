/**
 * 问答向导相关类型定义
 */

// 问题选项
export interface QuestionOption {
  value: string
  label: string
  description?: string
  // 权重评分：许可证ID -> 分数
  weights: Record<string, number>
}

// 向导问题
export interface WizardQuestion {
  id: string
  title: string
  description: string
  type: 'single' | 'multiple'
  required: boolean
  options: QuestionOption[]
  helpText?: string
}

// 用户答案
export interface WizardAnswer {
  questionId: string
  selectedValues: string[]
  timestamp: string
}

// 许可证评分结果
export interface LicenseScore {
  licenseId: string
  score: number
  matchedCriteria: string[]
  explanation: string
}

// 向导结果
export interface WizardResult {
  answers: WizardAnswer[]
  scores: LicenseScore[]
  recommendations: {
    primary: LicenseScore
    alternatives: LicenseScore[]
  }
  analysis: {
    userNeeds: string[]
    considerations: string[]
    warnings: string[]
  }
  completedAt: string
}

// 向导状态
export interface WizardState {
  currentQuestionIndex: number
  answers: WizardAnswer[]
  isCompleted: boolean
  result: WizardResult | null
  startedAt: string | null
  completedAt: string | null
}

// 向导进度
export interface WizardProgress {
  current: number
  total: number
  percentage: number
  canGoBack: boolean
  canGoNext: boolean
  isCompleted: boolean
}

// 向导配置
export interface WizardConfig {
  questions: WizardQuestion[]
  scoring: {
    // 最低推荐分数阈值
    minRecommendationScore: number
    // 最大推荐数量
    maxRecommendations: number
    // 权重计算方式
    weightingMethod: 'sum' | 'average' | 'weighted'
  }
  ui: {
    showProgress: boolean
    allowBackNavigation: boolean
    showQuestionNumbers: boolean
    autoAdvance: boolean
  }
}
