/**
 * GitHub API服务封装
 */

import axios, { type AxiosResponse, type AxiosError } from 'axios'
import type { 
  GitHubRepo, 
  GitHubRepoLicense, 
  GitHubApiError, 
  GitHubRepoAnalysis 
} from '@/types/github.types'
import { buildGitHubApiUrl } from '@/utils/url-parser.util'

// GitHub API基础配置
const GITHUB_API_BASE = 'https://api.github.com'
const API_TIMEOUT = 10000 // 10秒超时

// 创建axios实例
const githubApi = axios.create({
  baseURL: GITHUB_API_BASE,
  timeout: API_TIMEOUT,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Open-Source-License-Helper/1.0'
  }
})

/**
 * 获取仓库基本信息
 * @param owner - 仓库所有者
 * @param repo - 仓库名称
 * @returns 仓库信息
 */
export async function fetchRepoInfo(owner: string, repo: string): Promise<GitHubRepo> {
  try {
    const response: AxiosResponse<any> = await githubApi.get(`/repos/${owner}/${repo}`)
    return {
      id: response.data.id,
      name: response.data.name,
      fullName: response.data.full_name || `${owner}/${repo}`,
      description: response.data.description,
      url: response.data.url || buildGitHubApiUrl(owner, repo),
      htmlUrl: response.data.html_url || `https://github.com/${owner}/${repo}`,
      owner: {
        login: response.data.owner?.login || owner,
        avatarUrl: response.data.owner?.avatar_url || '',
        type: response.data.owner?.type || 'User'
      },
      isPrivate: response.data.private || false,
      isFork: response.data.fork || false,
      language: response.data.language,
      stargazersCount: response.data.stargazers_count || 0,
      forksCount: response.data.forks_count || 0,
      size: response.data.size || 0,
      createdAt: response.data.created_at || '',
      updatedAt: response.data.updated_at || '',
      pushedAt: response.data.pushed_at || ''
    }
  } catch (error) {
    throw handleGitHubApiError(error as AxiosError)
  }
}

/**
 * 获取仓库许可证信息
 * @param owner - 仓库所有者
 * @param repo - 仓库名称
 * @returns 许可证信息
 */
export async function fetchRepoLicense(owner: string, repo: string): Promise<GitHubRepoLicense | null> {
  try {
    const response: AxiosResponse<any> = await githubApi.get(`/repos/${owner}/${repo}/license`)
    return {
      name: response.data.name,
      path: response.data.path,
      sha: response.data.sha,
      size: response.data.size,
      url: response.data.url,
      htmlUrl: response.data.html_url,
      gitUrl: response.data.git_url,
      downloadUrl: response.data.download_url,
      type: response.data.type,
      content: response.data.content,
      encoding: response.data.encoding,
      license: {
        key: response.data.license.key,
        name: response.data.license.name,
        spdxId: response.data.license.spdx_id,
        url: response.data.license.url,
        nodeId: response.data.license.node_id
      }
    }
  } catch (error) {
    const axiosError = error as AxiosError

    // 404错误表示没有许可证文件
    if (axiosError.response?.status === 404) {
      return null
    }

    throw handleGitHubApiError(axiosError)
  }
}

/**
 * 获取完整的仓库分析结果
 * @param owner - 仓库所有者
 * @param repo - 仓库名称
 * @returns 分析结果
 */
export async function analyzeRepository(owner: string, repo: string): Promise<GitHubRepoAnalysis> {
  try {
    // 并行获取仓库信息和许可证信息
    const [repoInfo, licenseInfo] = await Promise.all([
      fetchRepoInfo(owner, repo),
      fetchRepoLicense(owner, repo)
    ])

    // 分析结果
    const analysis = {
      hasLicense: licenseInfo !== null,
      licenseType: licenseInfo?.license?.key || null,
      recommendations: generateRecommendations(repoInfo, licenseInfo),
      warnings: generateWarnings(repoInfo, licenseInfo)
    }

    return {
      repo: repoInfo,
      license: licenseInfo,
      analysis,
      fetchedAt: new Date().toISOString()
    }
  } catch (error) {
    throw handleGitHubApiError(error as AxiosError)
  }
}

/**
 * 生成推荐建议
 * @param repo - 仓库信息
 * @param license - 许可证信息
 * @returns 推荐建议列表
 */
function generateRecommendations(repo: GitHubRepo, license: GitHubRepoLicense | null): string[] {
  const recommendations: string[] = []

  if (!license) {
    recommendations.push('建议为项目添加开源许可证以明确使用条款')
    recommendations.push('可以使用我们的许可证选择向导来选择合适的许可证')
  } else {
    recommendations.push(`当前使用的是 ${license.license.name} 许可证`)
    
    if (license.license.key === 'mit') {
      recommendations.push('MIT许可证是最受欢迎的宽松许可证，适合大多数项目')
    } else if (license.license.key === 'apache-2.0') {
      recommendations.push('Apache 2.0许可证提供了专利保护，适合商业项目')
    } else if (license.license.key?.startsWith('gpl')) {
      recommendations.push('GPL许可证要求衍生作品也必须开源')
    }
  }

  return recommendations
}

/**
 * 生成警告信息
 * @param repo - 仓库信息
 * @param license - 许可证信息
 * @returns 警告信息列表
 */
function generateWarnings(repo: GitHubRepo, license: GitHubRepoLicense | null): string[] {
  const warnings: string[] = []

  if (repo.isPrivate) {
    warnings.push('这是一个私有仓库，许可证信息可能不完整')
  }

  if (repo.isFork && !license) {
    warnings.push('这是一个fork仓库，请检查原始仓库的许可证')
  }

  if (!license) {
    warnings.push('没有找到许可证文件，使用此代码可能存在法律风险')
  }

  return warnings
}

/**
 * 处理GitHub API错误
 * @param error - Axios错误对象
 * @returns 标准化的错误对象
 */
function handleGitHubApiError(error: AxiosError): GitHubApiError {
  const status = error.response?.status
  const responseData = error.response?.data as any

  let message = '获取GitHub信息时发生错误'
  let documentationUrl: string | undefined

  switch (status) {
    case 404:
      message = '仓库不存在或无法访问'
      break
    case 403:
      if (responseData?.message?.includes('rate limit')) {
        message = 'GitHub API调用频率限制，请稍后再试'
      } else {
        message = '无权限访问此仓库（可能是私有仓库）'
      }
      break
    case 401:
      message = 'GitHub API认证失败'
      break
    case 500:
    case 502:
    case 503:
      message = 'GitHub服务暂时不可用，请稍后再试'
      break
    default:
      if (responseData?.message) {
        message = responseData.message
      }
      if (responseData?.documentation_url) {
        documentationUrl = responseData.documentation_url
      }
  }

  return {
    message,
    documentationUrl,
    status
  }
}
