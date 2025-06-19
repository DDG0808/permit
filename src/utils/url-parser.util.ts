/**
 * GitHub URL解析工具
 */

import type { ParsedGitHubUrl } from '@/types/github.types'

/**
 * 解析GitHub URL，支持多种格式
 * @param url - GitHub URL
 * @returns 解析结果
 */
export function parseGitHubUrl(url: string): ParsedGitHubUrl {
  const result: ParsedGitHubUrl = {
    owner: '',
    repo: '',
    isValid: false,
    originalUrl: url.trim()
  }

  if (!url || typeof url !== 'string') {
    return result
  }

  const trimmedUrl = url.trim()

  // 支持的URL格式模式
  const patterns = [
    // https://github.com/owner/repo
    /^https?:\/\/github\.com\/([^\/\s]+)\/([^\/\s]+?)(?:\.git)?(?:\/.*)?$/i,
    // git@github.com:owner/repo.git
    /^git@github\.com:([^\/\s]+)\/([^\/\s]+?)(?:\.git)?$/i,
    // github.com/owner/repo (无协议)
    /^(?:www\.)?github\.com\/([^\/\s]+)\/([^\/\s]+?)(?:\.git)?(?:\/.*)?$/i,
    // 简化格式: owner/repo
    /^([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})\/([a-zA-Z0-9._-]+)$/
  ]

  for (const pattern of patterns) {
    const match = trimmedUrl.match(pattern)
    if (match) {
      const [, owner, repo] = match
      
      // 验证owner和repo名称
      if (isValidGitHubName(owner) && isValidGitHubName(repo)) {
        result.owner = owner
        result.repo = repo.replace(/\.git$/, '') // 移除.git后缀
        result.isValid = true
        break
      }
    }
  }

  return result
}

/**
 * 验证GitHub用户名或仓库名是否有效
 * @param name - 名称
 * @returns 是否有效
 */
function isValidGitHubName(name: string): boolean {
  if (!name || name.length === 0) return false
  
  // GitHub用户名规则：
  // - 最多39个字符
  // - 只能包含字母数字字符或单个连字符
  // - 不能以连字符开头或结尾
  // - 不能包含连续的连字符
  const userNamePattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/
  
  // GitHub仓库名规则：
  // - 最多100个字符
  // - 可以包含字母数字字符、连字符、下划线和点
  // - 不能以点开头
  const repoNamePattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/
  
  return userNamePattern.test(name) || repoNamePattern.test(name)
}

/**
 * 构建GitHub仓库URL
 * @param owner - 仓库所有者
 * @param repo - 仓库名称
 * @returns GitHub仓库URL
 */
export function buildGitHubUrl(owner: string, repo: string): string {
  return `https://github.com/${owner}/${repo}`
}

/**
 * 构建GitHub API URL
 * @param owner - 仓库所有者
 * @param repo - 仓库名称
 * @param endpoint - API端点
 * @returns GitHub API URL
 */
export function buildGitHubApiUrl(owner: string, repo: string, endpoint: string = ''): string {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`
  return endpoint ? `${baseUrl}/${endpoint}` : baseUrl
}

/**
 * 验证URL是否为GitHub URL
 * @param url - URL字符串
 * @returns 是否为GitHub URL
 */
export function isGitHubUrl(url: string): boolean {
  return parseGitHubUrl(url).isValid
}

/**
 * 从URL中提取仓库信息
 * @param url - GitHub URL
 * @returns 仓库信息或null
 */
export function extractRepoInfo(url: string): { owner: string; repo: string } | null {
  const parsed = parseGitHubUrl(url)
  return parsed.isValid ? { owner: parsed.owner, repo: parsed.repo } : null
}
