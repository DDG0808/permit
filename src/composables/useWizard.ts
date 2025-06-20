/**
 * 向导逻辑组合式函数
 */

import { ref, computed, type Ref } from 'vue'
import type {
  WizardQuestion,
  WizardAnswer,
  WizardResult,
  WizardState,
  WizardProgress,
  LicenseScore
} from '@/types/wizard.types'
import type { LicenseGenerationParams } from '@/types/license.types'
import { wizardQuestions, wizardConfig } from '@/data/questions.data'
import { licenses, getLicenseById } from '@/data/licenses.data'
import { downloadLicenseFile, validateLicenseParams } from '@/services/license-generator.service'

/**
 * 许可证选择向导组合式函数
 */
export function useWizard() {
  // 响应式状态
  const state = ref<WizardState>({
    currentQuestionIndex: 0,
    answers: [],
    isCompleted: false,
    result: null,
    startedAt: null,
    completedAt: null
  })

  // 计算属性
  const questions = computed(() => wizardQuestions)
  const currentQuestion = computed(() => questions.value[state.value.currentQuestionIndex])
  const totalQuestions = computed(() => questions.value.length)
  
  const progress = computed((): WizardProgress => {
    const current = state.value.currentQuestionIndex + 1
    const total = totalQuestions.value
    return {
      current,
      total,
      percentage: Math.round((current / total) * 100),
      canGoBack: state.value.currentQuestionIndex > 0,
      canGoNext: hasCurrentAnswer.value && state.value.currentQuestionIndex < total - 1,
      isCompleted: state.value.isCompleted
    }
  })

  const hasCurrentAnswer = computed(() => {
    if (!currentQuestion.value) return false
    return state.value.answers.some(answer => answer.questionId === currentQuestion.value.id)
  })

  const currentAnswer = computed(() => {
    if (!currentQuestion.value) return null
    return state.value.answers.find(answer => answer.questionId === currentQuestion.value.id) || null
  })

  const canComplete = computed(() => {
    return state.value.answers.length === totalQuestions.value
  })

  const isStarted = computed(() => {
    return state.value.startedAt !== null
  })

  /**
   * 开始向导
   */
  const startWizard = (): void => {
    state.value = {
      currentQuestionIndex: 0,
      answers: [],
      isCompleted: false,
      result: null,
      startedAt: new Date().toISOString(),
      completedAt: null
    }
  }

  /**
   * 回答当前问题
   * @param selectedValues - 选择的答案值
   */
  const answerQuestion = (selectedValues: string[]): void => {
    if (!currentQuestion.value) return

    const answer: WizardAnswer = {
      questionId: currentQuestion.value.id,
      selectedValues,
      timestamp: new Date().toISOString()
    }

    // 移除之前的答案（如果有）
    state.value.answers = state.value.answers.filter(
      a => a.questionId !== currentQuestion.value.id
    )

    // 添加新答案
    state.value.answers.push(answer)
  }

  /**
   * 前进到下一个问题
   */
  const nextQuestion = (): void => {
    if (progress.value.canGoNext) {
      state.value.currentQuestionIndex++
    }
  }

  /**
   * 后退到上一个问题
   */
  const previousQuestion = (): void => {
    if (progress.value.canGoBack) {
      state.value.currentQuestionIndex--
    }
  }

  /**
   * 跳转到指定问题
   * @param index - 问题索引
   */
  const goToQuestion = (index: number): void => {
    if (index >= 0 && index < totalQuestions.value) {
      state.value.currentQuestionIndex = index
    }
  }

  /**
   * 计算许可证评分
   */
  const calculateScores = (): LicenseScore[] => {
    const scores: Record<string, number> = {}
    const matchedCriteria: Record<string, string[]> = {}

    // 初始化分数
    licenses.forEach(license => {
      scores[license.id] = 0
      matchedCriteria[license.id] = []
    })

    // 计算每个答案的权重
    state.value.answers.forEach(answer => {
      const question = questions.value.find(q => q.id === answer.questionId)
      if (!question) return

      answer.selectedValues.forEach(value => {
        const option = question.options.find(opt => opt.value === value)
        if (!option) return

        // 添加权重到对应许可证
        Object.entries(option.weights).forEach(([licenseId, weight]) => {
          if (scores[licenseId] !== undefined) {
            scores[licenseId] += weight
            matchedCriteria[licenseId].push(`${question.title}: ${option.label}`)
          }
        })
      })
    })

    // 转换为LicenseScore数组并排序
    const licenseScores: LicenseScore[] = Object.entries(scores)
      .map(([licenseId, score]) => {
        const license = getLicenseById(licenseId)
        return {
          licenseId,
          score,
          matchedCriteria: matchedCriteria[licenseId],
          explanation: generateExplanation(licenseId, score, matchedCriteria[licenseId])
        }
      })
      .filter(score => score.score >= wizardConfig.scoring.minRecommendationScore)
      .sort((a, b) => b.score - a.score)

    return licenseScores
  }

  /**
   * 生成解释说明
   */
  const generateExplanation = (licenseId: string, score: number, criteria: string[]): string => {
    const license = getLicenseById(licenseId)
    if (!license) return ''

    let explanation = `${license.name} 获得了 ${score} 分，`
    
    if (score >= 40) {
      explanation += '非常适合您的需求。'
    } else if (score >= 25) {
      explanation += '比较适合您的需求。'
    } else {
      explanation += '基本符合您的需求。'
    }

    if (criteria.length > 0) {
      explanation += ` 主要匹配的条件包括：${criteria.slice(0, 3).join('、')}等。`
    }

    return explanation
  }

  /**
   * 完成向导
   */
  const completeWizard = (): WizardResult => {
    if (!canComplete.value) {
      throw new Error('向导未完成，无法生成结果')
    }

    const scores = calculateScores()
    const primary = scores[0]
    const alternatives = scores.slice(1, wizardConfig.scoring.maxRecommendations)

    const result: WizardResult = {
      answers: [...state.value.answers],
      scores,
      recommendations: {
        primary,
        alternatives
      },
      analysis: {
        userNeeds: extractUserNeeds(),
        considerations: generateConsiderations(primary),
        warnings: generateWarnings(primary)
      },
      completedAt: new Date().toISOString()
    }

    state.value.result = result
    state.value.isCompleted = true
    state.value.completedAt = result.completedAt

    return result
  }

  /**
   * 提取用户需求
   */
  const extractUserNeeds = (): string[] => {
    const needs: string[] = []
    
    state.value.answers.forEach(answer => {
      const question = questions.value.find(q => q.id === answer.questionId)
      if (!question) return

      answer.selectedValues.forEach(value => {
        const option = question.options.find(opt => opt.value === value)
        if (option) {
          needs.push(`${question.title}: ${option.label}`)
        }
      })
    })

    return needs
  }

  /**
   * 生成考虑因素
   */
  const generateConsiderations = (primary: LicenseScore): string[] => {
    const considerations: string[] = []
    const license = getLicenseById(primary.licenseId)
    
    if (license) {
      if (license.category === 'copyleft') {
        considerations.push('该许可证要求衍生作品也必须开源')
      }
      if (license.permissions.includes('patent-use')) {
        considerations.push('该许可证提供专利保护')
      }
      if (license.complexity > 5) {
        considerations.push('该许可证相对复杂，建议仔细阅读条款')
      }
    }

    return considerations
  }

  /**
   * 生成警告信息
   */
  const generateWarnings = (primary: LicenseScore): string[] => {
    const warnings: string[] = []
    const license = getLicenseById(primary.licenseId)
    
    if (license && license.category === 'copyleft') {
      warnings.push('使用copyleft许可证可能会限制商业采用')
    }

    return warnings
  }

  /**
   * 下载许可证文件
   * @param licenseId - 许可证ID
   * @param userInfo - 用户信息
   * @param onSuccess - 成功回调
   * @param onError - 错误回调
   */
  const downloadLicense = (
    licenseId: string,
    userInfo: {
      fullname?: string
      year?: string
      project?: string
      email?: string
      organization?: string
      filename?: string
    },
    onSuccess?: (filename: string) => void,
    onError?: (error: Error) => void
  ): void => {
    try {
      // 准备生成参数
      const params: LicenseGenerationParams = {
        licenseId,
        year: userInfo.year || new Date().getFullYear().toString(),
        fullname: userInfo.fullname || '',
        project: userInfo.project || '',
        email: userInfo.email || '',
        organization: userInfo.organization || '',
        filename: userInfo.filename || 'LICENSE'
      }

      // 验证参数
      const validation = validateLicenseParams(params)
      if (!validation.isValid) {
        throw new Error(`参数验证失败: ${validation.errors.join(', ')}`)
      }

      // 下载文件
      downloadLicenseFile(
        params,
        (filename) => {
          onSuccess?.(filename)
        },
        (error) => {
          onError?.(error)
        }
      )
    } catch (error) {
      onError?.(error as Error)
    }
  }

  /**
   * 重置向导
   */
  const resetWizard = (): void => {
    state.value = {
      currentQuestionIndex: 0,
      answers: [],
      isCompleted: false,
      result: null,
      startedAt: null,
      completedAt: null
    }
  }

  return {
    // 状态
    state: computed(() => state.value),
    
    // 计算属性
    questions,
    currentQuestion,
    totalQuestions,
    progress,
    hasCurrentAnswer,
    currentAnswer,
    canComplete,
    isStarted,
    
    // 方法
    startWizard,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    completeWizard,
    downloadLicense,
    resetWizard
  }
}
