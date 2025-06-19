/**
 * GitHub API相关类型定义
 */

// GitHub仓库基本信息
export interface GitHubRepo {
  id: number
  name: string
  fullName: string
  description: string | null
  url: string
  htmlUrl: string
  owner: {
    login: string
    avatarUrl: string
    type: 'User' | 'Organization'
  }
  isPrivate: boolean
  isFork: boolean
  language: string | null
  stargazersCount: number
  forksCount: number
  size: number
  createdAt: string
  updatedAt: string
  pushedAt: string
}

// GitHub许可证信息
export interface GitHubLicense {
  key: string
  name: string
  spdxId: string | null
  url: string | null
  nodeId: string
}

// GitHub仓库许可证响应
export interface GitHubRepoLicense {
  name: string
  path: string
  sha: string
  size: number
  url: string
  htmlUrl: string
  gitUrl: string
  downloadUrl: string
  type: 'file'
  content: string
  encoding: 'base64'
  license: GitHubLicense
}

// GitHub API错误响应
export interface GitHubApiError {
  message: string
  documentationUrl?: string
  status?: number
}

// GitHub URL解析结果
export interface ParsedGitHubUrl {
  owner: string
  repo: string
  isValid: boolean
  originalUrl: string
}

// GitHub仓库分析结果
export interface GitHubRepoAnalysis {
  repo: GitHubRepo
  license: GitHubRepoLicense | null
  analysis: {
    hasLicense: boolean
    licenseType: string | null
    recommendations: string[]
    warnings: string[]
  }
  fetchedAt: string
}

// GitHub API请求状态
export type GitHubApiStatus = 
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'

// GitHub API请求结果
export interface GitHubApiResult<T = any> {
  status: GitHubApiStatus
  data: T | null
  error: GitHubApiError | null
  lastFetch: string | null
}
