import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GitHubService } from '@/services/github.service'
import { parseGitHubUrl } from '@/utils/github.utils'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('GitHubService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRepository', () => {
    it('should fetch repository data successfully', async () => {
      const mockRepoData = {
        id: 123,
        name: 'test-repo',
        full_name: 'user/test-repo',
        description: 'A test repository',
        html_url: 'https://github.com/user/test-repo',
        stargazers_count: 100,
        forks_count: 50,
        language: 'TypeScript',
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit'
        },
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z',
        pushed_at: '2023-12-01T12:00:00Z'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRepoData)
      })

      const result = await GitHubService.getRepository('user', 'test-repo')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/user/test-repo',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/vnd.github.v3+json'
          })
        })
      )
      expect(result).toEqual(mockRepoData)
    })

    it('should throw error when repository not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(GitHubService.getRepository('user', 'nonexistent'))
        .rejects.toThrow('Repository not found')
    })

    it('should throw error when API rate limit exceeded', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      })

      await expect(GitHubService.getRepository('user', 'test-repo'))
        .rejects.toThrow('API rate limit exceeded')
    })

    it('should throw error for network failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(GitHubService.getRepository('user', 'test-repo'))
        .rejects.toThrow('Failed to fetch repository data')
    })
  })

  describe('getLicense', () => {
    it('should fetch license data successfully', async () => {
      const mockLicenseData = {
        key: 'mit',
        name: 'MIT License',
        spdx_id: 'MIT',
        url: 'https://api.github.com/licenses/mit',
        html_url: 'https://choosealicense.com/licenses/mit/',
        description: 'A short and simple permissive license...',
        implementation: 'Create a text file...',
        permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'],
        conditions: ['include-copyright'],
        limitations: ['liability', 'warranty'],
        body: 'MIT License\n\nCopyright (c) [year] [fullname]...'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLicenseData)
      })

      const result = await GitHubService.getLicense('mit')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/licenses/mit',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/vnd.github.v3+json'
          })
        })
      )
      expect(result).toEqual(mockLicenseData)
    })

    it('should throw error when license not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(GitHubService.getLicense('invalid'))
        .rejects.toThrow('License not found')
    })
  })
})

describe('parseGitHubUrl', () => {
  it('should parse HTTPS GitHub URLs correctly', () => {
    const url = 'https://github.com/user/repo'
    const result = parseGitHubUrl(url)
    
    expect(result).toEqual({
      owner: 'user',
      repo: 'repo',
      isValid: true
    })
  })

  it('should parse HTTPS GitHub URLs with .git suffix', () => {
    const url = 'https://github.com/user/repo.git'
    const result = parseGitHubUrl(url)
    
    expect(result).toEqual({
      owner: 'user',
      repo: 'repo',
      isValid: true
    })
  })

  it('should parse SSH GitHub URLs correctly', () => {
    const url = 'git@github.com:user/repo.git'
    const result = parseGitHubUrl(url)
    
    expect(result).toEqual({
      owner: 'user',
      repo: 'repo',
      isValid: true
    })
  })

  it('should parse GitHub URLs with paths', () => {
    const url = 'https://github.com/user/repo/tree/main'
    const result = parseGitHubUrl(url)
    
    expect(result).toEqual({
      owner: 'user',
      repo: 'repo',
      isValid: true
    })
  })

  it('should handle invalid URLs', () => {
    const invalidUrls = [
      'not-a-url',
      'https://gitlab.com/user/repo',
      'https://github.com/user',
      'https://github.com/',
      ''
    ]

    invalidUrls.forEach(url => {
      const result = parseGitHubUrl(url)
      expect(result.isValid).toBe(false)
    })
  })

  it('should handle edge cases', () => {
    const edgeCases = [
      'https://github.com/user/repo/',
      'https://github.com/user/repo.git/',
      'git@github.com:user/repo',
      'https://www.github.com/user/repo'
    ]

    edgeCases.forEach(url => {
      const result = parseGitHubUrl(url)
      expect(result.isValid).toBe(true)
      expect(result.owner).toBe('user')
      expect(result.repo).toBe('repo')
    })
  })
})
