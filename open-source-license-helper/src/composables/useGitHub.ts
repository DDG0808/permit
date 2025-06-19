/**
 * GitHub功能组合式函数
 */

import { ref, computed, type Ref } from 'vue'
import type { 
  GitHubApiResult, 
  GitHubRepoAnalysis, 
  GitHubApiStatus,
  ParsedGitHubUrl 
} from '@/types/github.types'
import { parseGitHubUrl } from '@/utils/url-parser.util'
import { analyzeRepository } from '@/services/github.service'

// 防抖延迟时间（毫秒）
const DEBOUNCE_DELAY = 500

/**
 * GitHub仓库分析组合式函数
 */
export function useGitHubAnalyzer() {
  // 响应式状态
  const inputUrl = ref('')
  const result = ref<GitHubApiResult<GitHubRepoAnalysis>>({
    status: 'idle',
    data: null,
    error: null,
    lastFetch: null
  })

  // 防抖定时器
  let debounceTimer: number | null = null

  // 计算属性
  const parsedUrl = computed((): ParsedGitHubUrl => {
    return parseGitHubUrl(inputUrl.value)
  })

  const isValidUrl = computed((): boolean => {
    return parsedUrl.value.isValid
  })

  const isLoading = computed((): boolean => {
    return result.value.status === 'loading'
  })

  const hasData = computed((): boolean => {
    return result.value.status === 'success' && result.value.data !== null
  })

  const hasError = computed((): boolean => {
    return result.value.status === 'error'
  })

  const canAnalyze = computed((): boolean => {
    return isValidUrl.value && !isLoading.value
  })

  /**
   * 分析GitHub仓库
   * @param url - GitHub URL（可选，默认使用inputUrl）
   */
  const analyzeRepo = async (url?: string): Promise<void> => {
    const targetUrl = url || inputUrl.value
    const parsed = parseGitHubUrl(targetUrl)

    if (!parsed.isValid) {
      result.value = {
        status: 'error',
        data: null,
        error: {
          message: '请输入有效的GitHub仓库URL'
        },
        lastFetch: new Date().toISOString()
      }
      return
    }

    // 设置加载状态
    result.value = {
      status: 'loading',
      data: null,
      error: null,
      lastFetch: null
    }

    try {
      const analysis = await analyzeRepository(parsed.owner, parsed.repo)
      
      result.value = {
        status: 'success',
        data: analysis,
        error: null,
        lastFetch: new Date().toISOString()
      }
    } catch (error: any) {
      result.value = {
        status: 'error',
        data: null,
        error: {
          message: error.message || '分析仓库时发生未知错误',
          status: error.status
        },
        lastFetch: new Date().toISOString()
      }
    }
  }

  /**
   * 带防抖的分析函数
   * @param url - GitHub URL（可选）
   */
  const analyzeRepoDebounced = (url?: string): void => {
    if (debounceTimer) {
      window.clearTimeout(debounceTimer)
    }

    debounceTimer = window.setTimeout(() => {
      analyzeRepo(url)
    }, DEBOUNCE_DELAY)
  }

  /**
   * 重置状态
   */
  const reset = (): void => {
    inputUrl.value = ''
    result.value = {
      status: 'idle',
      data: null,
      error: null,
      lastFetch: null
    }
    
    if (debounceTimer) {
      window.clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  /**
   * 清除错误状态
   */
  const clearError = (): void => {
    if (result.value.status === 'error') {
      result.value = {
        ...result.value,
        status: 'idle',
        error: null
      }
    }
  }

  /**
   * 设置输入URL并触发防抖分析
   * @param url - GitHub URL
   */
  const setUrl = (url: string): void => {
    inputUrl.value = url
    if (url.trim()) {
      analyzeRepoDebounced()
    } else {
      reset()
    }
  }

  return {
    // 响应式状态
    inputUrl,
    result: computed(() => result.value),
    parsedUrl,
    
    // 计算属性
    isValidUrl,
    isLoading,
    hasData,
    hasError,
    canAnalyze,
    
    // 方法
    analyzeRepo,
    analyzeRepoDebounced,
    setUrl,
    reset,
    clearError
  }
}

/**
 * GitHub URL验证组合式函数
 */
export function useGitHubUrlValidator() {
  const url = ref('')
  
  const parsed = computed(() => parseGitHubUrl(url.value))
  const isValid = computed(() => parsed.value.isValid)
  const errorMessage = computed(() => {
    if (!url.value.trim()) return ''
    if (!isValid.value) return '请输入有效的GitHub仓库URL'
    return ''
  })

  const validate = (inputUrl: string): boolean => {
    url.value = inputUrl
    return isValid.value
  }

  return {
    url,
    parsed,
    isValid,
    errorMessage,
    validate
  }
}
