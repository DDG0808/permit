/**
 * 仓库分析器端到端测试
 * 测试GitHub仓库许可证分析功能
 */

import { test, expect } from '@playwright/test'
import { AnalyzerPage, TestUtils } from '../utils/test-helpers'

test.describe('仓库分析器功能测试', () => {
  let analyzerPage: AnalyzerPage

  test.beforeEach(async ({ page }) => {
    analyzerPage = new AnalyzerPage(page)
    await analyzerPage.goto()
  })

  test('分析器页面基本加载 @smoke', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/仓库分析器/)

    // 检查主要页面元素
    await expect(analyzerPage.urlInput).toBeVisible()
    await expect(analyzerPage.analyzeButton).toBeVisible()
    
    // 检查页面无控制台错误
    const errors = await TestUtils.checkConsoleErrors(page)
    expect(errors.length).toBe(0)
  })

  test('有效GitHub仓库分析测试 @analysis @integration', async ({ page }) => {
    const testData = TestUtils.generateTestData()
    
    // 输入有效的GitHub仓库URL
    await analyzerPage.analyzeRepository(testData.validGitHubUrl)
    
    // 检查加载状态
    await expect(analyzerPage.loadingState).toBeVisible()
    
    // 等待分析完成
    await analyzerPage.waitForAnalysisComplete()
    
    // 检查分析结果
    await expect(analyzerPage.resultSection).toBeVisible()
    
    // 检查结果内容
    const licenseInfo = page.locator('[data-testid="license-info"]')
    await expect(licenseInfo).toBeVisible()
    
    const compatibilityInfo = page.locator('[data-testid="compatibility-info"]')
    await expect(compatibilityInfo).toBeVisible()
    
    const riskAssessment = page.locator('[data-testid="risk-assessment"]')
    await expect(riskAssessment).toBeVisible()
  })

  test('无效URL输入验证测试 @validation', async ({ page }) => {
    const testData = TestUtils.generateTestData()
    
    // 输入无效URL
    await analyzerPage.urlInput.fill(testData.invalidUrl)
    await analyzerPage.analyzeButton.click()
    
    // 检查验证错误消息
    const errorMessage = page.locator('[data-testid="url-validation-error"]')
    await expect(errorMessage).toBeVisible()
    
    // 检查分析按钮状态
    await expect(analyzerPage.analyzeButton).toBeDisabled()
  })

  test('空输入验证测试 @validation', async ({ page }) => {
    // 不输入任何内容直接点击分析
    await analyzerPage.analyzeButton.click()
    
    // 检查验证提示
    const validationMessage = page.locator('[data-testid="empty-input-error"]')
    if (await validationMessage.count() > 0) {
      await expect(validationMessage).toBeVisible()
    } else {
      // 或者按钮应该被禁用
      await expect(analyzerPage.analyzeButton).toBeDisabled()
    }
  })

  test('网络错误处理测试 @error-handling', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/analyze/**', route => route.abort())
    
    const testData = TestUtils.generateTestData()
    await analyzerPage.analyzeRepository(testData.validGitHubUrl)
    
    // 检查错误状态
    await expect(analyzerPage.errorState).toBeVisible()
    
    // 检查错误消息
    const errorMessage = page.locator('[data-testid="network-error-message"]')
    await expect(errorMessage).toBeVisible()
    
    // 检查重试按钮
    const retryButton = page.locator('[data-testid="retry-button"]')
    if (await retryButton.count() > 0) {
      await expect(retryButton).toBeVisible()
    }
  })

  test('分析历史记录测试 @history', async ({ page }) => {
    const testData = TestUtils.generateTestData()
    
    // 进行第一次分析
    await analyzerPage.analyzeRepository(testData.validGitHubUrl)
    await analyzerPage.waitForAnalysisComplete()
    
    // 检查历史记录
    const historySection = page.locator('[data-testid="analysis-history"]')
    if (await historySection.count() > 0) {
      await expect(historySection).toBeVisible()
      
      const historyItems = page.locator('[data-testid^="history-item-"]')
      const itemCount = await historyItems.count()
      expect(itemCount).toBeGreaterThan(0)
    }
  })

  test('分析结果导出测试 @export', async ({ page }) => {
    const testData = TestUtils.generateTestData()
    
    await analyzerPage.analyzeRepository(testData.validGitHubUrl)
    await analyzerPage.waitForAnalysisComplete()
    
    // 检查导出按钮
    const exportButton = page.locator('[data-testid="export-results"]')
    if (await exportButton.count() > 0) {
      await expect(exportButton).toBeVisible()
      
      // 测试导出功能
      const downloadPromise = page.waitForEvent('download')
      await exportButton.click()
      const download = await downloadPromise
      
      // 验证下载文件
      expect(download.suggestedFilename()).toMatch(/.*\.(json|pdf|csv)$/)
    }
  })

  test('分析结果分享测试 @share', async ({ page }) => {
    const testData = TestUtils.generateTestData()
    
    await analyzerPage.analyzeRepository(testData.validGitHubUrl)
    await analyzerPage.waitForAnalysisComplete()
    
    // 检查分享按钮
    const shareButton = page.locator('[data-testid="share-results"]')
    if (await shareButton.count() > 0) {
      await expect(shareButton).toBeVisible()
      
      await shareButton.click()
      
      // 检查分享选项
      const shareModal = page.locator('[data-testid="share-modal"]')
      await expect(shareModal).toBeVisible()
      
      const shareLink = page.locator('[data-testid="share-link"]')
      await expect(shareLink).toBeVisible()
    }
  })

  test('实时分析进度测试 @progress', async ({ page }) => {
    const testData = TestUtils.generateTestData()
    
    await analyzerPage.analyzeRepository(testData.validGitHubUrl)
    
    // 检查进度指示器
    const progressBar = page.locator('[data-testid="analysis-progress"]')
    if (await progressBar.count() > 0) {
      await expect(progressBar).toBeVisible()
      
      // 检查进度文本
      const progressText = page.locator('[data-testid="progress-text"]')
      await expect(progressText).toBeVisible()
    }
    
    // 检查分析步骤指示
    const stepIndicator = page.locator('[data-testid="analysis-steps"]')
    if (await stepIndicator.count() > 0) {
      await expect(stepIndicator).toBeVisible()
    }
  })

  test('分析器响应式设计测试 @responsive', async ({ page }) => {
    await analyzerPage.checkResponsive()
    
    // 在移动端测试分析功能
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 检查移动端布局
    await expect(analyzerPage.urlInput).toBeVisible()
    await expect(analyzerPage.analyzeButton).toBeVisible()
    
    // 检查输入框是否适合移动端
    const inputBox = await analyzerPage.urlInput.boundingBox()
    if (inputBox) {
      expect(inputBox.height).toBeGreaterThanOrEqual(44) // 最小触摸目标
    }
  })

  test('分析器性能测试 @performance', async ({ page }) => {
    const metrics = await TestUtils.measurePerformance(page)
    
    // 检查页面加载性能
    expect(metrics.domContentLoaded).toBeLessThan(2000)
    expect(metrics.firstContentfulPaint).toBeLessThan(1500)
    
    // 测试分析交互性能
    const testData = TestUtils.generateTestData()
    
    const startTime = Date.now()
    await analyzerPage.urlInput.fill(testData.validGitHubUrl)
    const inputTime = Date.now() - startTime
    
    expect(inputTime).toBeLessThan(100) // 输入响应时间应小于100ms
  })

  test('分析器无障碍访问测试 @accessibility', async ({ page }) => {
    await analyzerPage.checkAccessibility()
    
    // 检查表单标签
    const urlInput = analyzerPage.urlInput
    const inputId = await urlInput.getAttribute('id')
    const label = page.locator(`label[for="${inputId}"]`)
    
    if (await label.count() > 0) {
      await expect(label).toBeVisible()
    } else {
      // 检查aria-label
      const ariaLabel = await urlInput.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
    }
    
    // 检查错误消息的可访问性
    const testData = TestUtils.generateTestData()
    await analyzerPage.urlInput.fill(testData.invalidUrl)
    await analyzerPage.analyzeButton.click()
    
    const errorMessage = page.locator('[data-testid="url-validation-error"]')
    if (await errorMessage.count() > 0) {
      const ariaLive = await errorMessage.getAttribute('aria-live')
      expect(ariaLive).toBeTruthy()
    }
  })

  test('分析器键盘导航测试 @accessibility @keyboard', async ({ page }) => {
    // 使用Tab键导航到输入框
    await page.keyboard.press('Tab')
    let focusedElement = page.locator(':focus')
    await expect(focusedElement).toBe(analyzerPage.urlInput)
    
    // 输入URL
    const testData = TestUtils.generateTestData()
    await page.keyboard.type(testData.validGitHubUrl)
    
    // Tab到分析按钮
    await page.keyboard.press('Tab')
    focusedElement = page.locator(':focus')
    await expect(focusedElement).toBe(analyzerPage.analyzeButton)
    
    // 使用Enter键触发分析
    await page.keyboard.press('Enter')
    await expect(analyzerPage.loadingState).toBeVisible()
  })
})

test.describe('分析器视觉回归测试', () => {
  test('分析器页面截图对比 @visual', async ({ page }) => {
    const analyzerPage = new AnalyzerPage(page)
    await analyzerPage.goto()
    await TestUtils.waitForAnimation(page, 1000)
    
    // 初始状态截图
    await expect(page).toHaveScreenshot('analyzer-initial.png', {
      fullPage: true,
      animations: 'disabled'
    })
    
    // 输入状态截图
    const testData = TestUtils.generateTestData()
    await analyzerPage.urlInput.fill(testData.validGitHubUrl)
    await expect(page).toHaveScreenshot('analyzer-with-input.png')
  })

  test('分析结果截图对比 @visual @integration', async ({ page }) => {
    const analyzerPage = new AnalyzerPage(page)
    await analyzerPage.goto()
    
    const testData = TestUtils.generateTestData()
    await analyzerPage.analyzeRepository(testData.validGitHubUrl)
    await analyzerPage.waitForAnalysisComplete()
    
    // 分析结果截图
    await expect(analyzerPage.resultSection).toHaveScreenshot('analyzer-results.png')
  })

  test('分析器移动端截图对比 @visual @mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const analyzerPage = new AnalyzerPage(page)
    await analyzerPage.goto()
    await TestUtils.waitForAnimation(page, 1000)
    
    // 移动端截图
    await expect(page).toHaveScreenshot('analyzer-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    })
  })
})
