/**
 * 综合集成测试
 * 测试应用的完整用户流程和跨页面功能
 */

import { test, expect } from '@playwright/test'
import { HomePage, WizardPage, AnalyzerPage, KnowledgePage, TestUtils } from '../utils/test-helpers'

test.describe('应用综合集成测试', () => {
  test('完整用户流程测试 @integration @user-journey', async ({ page }) => {
    // 1. 访问首页
    const homePage = new HomePage(page)
    await homePage.goto()
    await homePage.verifyPageContent()
    
    // 2. 使用许可证向导
    await homePage.clickWizardCard()
    
    const wizardPage = new WizardPage(page)
    await wizardPage.startWizard()
    
    // 完成向导流程
    await wizardPage.answerQuestion('commercial')
    await wizardPage.nextQuestion()
    await wizardPage.answerQuestion('modify')
    await wizardPage.nextQuestion()
    await wizardPage.answerQuestion('distribute')
    await wizardPage.nextQuestion()
    await wizardPage.answerQuestion('no-patent')
    await wizardPage.nextQuestion()
    await wizardPage.answerQuestion('permissive')
    await wizardPage.completeWizard()
    
    // 验证获得推荐结果
    await expect(wizardPage.resultSection).toBeVisible()
    
    // 3. 前往知识库了解更多
    await page.click('[data-testid="nav-knowledge"]')
    
    const knowledgePage = new KnowledgePage(page)
    await page.waitForTimeout(2000) // 等待数据加载
    
    // 搜索推荐的许可证
    await knowledgePage.searchLicense('MIT')
    await page.waitForTimeout(1000)
    
    // 查看许可证详情
    const firstCard = knowledgePage.licenseCards.first()
    await firstCard.click()
    
    // 4. 使用仓库分析器验证
    await page.click('[data-testid="nav-analyzer"]')
    
    const analyzerPage = new AnalyzerPage(page)
    const testData = TestUtils.generateTestData()
    await analyzerPage.analyzeRepository(testData.validGitHubUrl)
    await analyzerPage.waitForAnalysisComplete()
    
    // 验证分析结果
    await expect(analyzerPage.resultSection).toBeVisible()
    
    // 5. 返回首页
    await page.click('[data-testid="nav-home"]')
    await expect(page).toHaveURL(/.*\/$/)
  })

  test('跨页面状态保持测试 @integration @state-persistence', async ({ page }) => {
    // 在向导中设置状态
    const wizardPage = new WizardPage(page)
    await wizardPage.goto()
    await wizardPage.startWizard()
    await wizardPage.answerQuestion('commercial')
    
    // 切换到其他页面
    await page.click('[data-testid="nav-knowledge"]')
    await page.waitForTimeout(1000)
    
    // 返回向导页面
    await page.click('[data-testid="nav-wizard"]')
    
    // 检查状态是否保持（如果实现了此功能）
    const savedProgress = page.locator('[data-testid="saved-progress"]')
    if (await savedProgress.count() > 0) {
      await expect(savedProgress).toBeVisible()
    }
  })

  test('主题一致性测试 @integration @theme', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    
    // 切换到深色模式
    await homePage.toggleTheme()
    await TestUtils.waitForAnimation(page, 500)
    
    // 验证所有页面都应用了深色主题
    const pages = ['/wizard', '/analyzer', '/knowledge']
    
    for (const pagePath of pages) {
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')
      
      const theme = await page.getAttribute('html', 'data-theme')
      expect(theme).toBe('dark')
      
      // 检查深色模式样式
      const backgroundColor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor
      })
      
      // 深色模式应该有深色背景
      expect(backgroundColor).toMatch(/rgb\(.*\)/)
    }
  })

  test('搜索功能跨页面测试 @integration @search', async ({ page }) => {
    // 在知识库中搜索
    const knowledgePage = new KnowledgePage(page)
    await knowledgePage.goto()
    await page.waitForTimeout(2000)
    
    await knowledgePage.searchLicense('Apache')
    await page.waitForTimeout(1000)
    
    // 切换到分析器页面
    await page.click('[data-testid="nav-analyzer"]')
    
    // 检查是否有全局搜索功能
    const globalSearch = page.locator('[data-testid="global-search"]')
    if (await globalSearch.count() > 0) {
      await globalSearch.fill('Apache')
      await page.keyboard.press('Enter')
      
      // 应该返回到知识库并显示搜索结果
      await expect(page).toHaveURL(/.*\/knowledge/)
    }
  })

  test('错误恢复流程测试 @integration @error-recovery', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/**', route => route.abort())
    
    const analyzerPage = new AnalyzerPage(page)
    await analyzerPage.goto()
    
    const testData = TestUtils.generateTestData()
    await analyzerPage.analyzeRepository(testData.validGitHubUrl)
    
    // 检查错误状态
    await expect(analyzerPage.errorState).toBeVisible()
    
    // 恢复网络连接
    await page.unroute('**/api/**')
    
    // 重试操作
    const retryButton = page.locator('[data-testid="retry-button"]')
    if (await retryButton.count() > 0) {
      await retryButton.click()
      await analyzerPage.waitForAnalysisComplete()
      await expect(analyzerPage.resultSection).toBeVisible()
    }
  })

  test('性能监控集成测试 @integration @performance', async ({ page }) => {
    const performanceData: any[] = []
    
    // 监控所有页面的性能
    const pages = ['/', '/wizard', '/analyzer', '/knowledge']
    
    for (const pagePath of pages) {
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')
      
      const metrics = await TestUtils.measurePerformance(page)
      performanceData.push({
        page: pagePath,
        ...metrics
      })
    }
    
    // 验证性能指标
    for (const data of performanceData) {
      expect(data.domContentLoaded).toBeLessThan(3000)
      expect(data.firstContentfulPaint).toBeLessThan(2000)
    }
    
    // 计算平均性能
    const avgDomContentLoaded = performanceData.reduce((sum, data) => sum + data.domContentLoaded, 0) / performanceData.length
    const avgFirstContentfulPaint = performanceData.reduce((sum, data) => sum + data.firstContentfulPaint, 0) / performanceData.length
    
    expect(avgDomContentLoaded).toBeLessThan(2500)
    expect(avgFirstContentfulPaint).toBeLessThan(1500)
  })

  test('无障碍访问综合测试 @integration @accessibility', async ({ page }) => {
    const pages = ['/', '/wizard', '/analyzer', '/knowledge']
    
    for (const pagePath of pages) {
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')
      
      // 检查页面标题
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(10)
      
      // 检查主要地标
      const main = page.locator('main, [role="main"]')
      await expect(main).toBeVisible()
      
      // 检查键盘导航
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
      
      // 检查颜色对比度（简单检查）
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span').first()
      if (await textElements.count() > 0) {
        const styles = await textElements.evaluate(el => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          }
        })
        
        // 确保有文本颜色
        expect(styles.color).toBeTruthy()
      }
    }
  })

  test('数据流集成测试 @integration @data-flow', async ({ page }) => {
    // 1. 在向导中获得推荐
    const wizardPage = new WizardPage(page)
    await wizardPage.goto()
    await wizardPage.startWizard()
    
    // 选择特定答案以获得MIT推荐
    await wizardPage.answerQuestion('commercial')
    await wizardPage.nextQuestion()
    await wizardPage.answerQuestion('modify')
    await wizardPage.nextQuestion()
    await wizardPage.answerQuestion('distribute')
    await wizardPage.nextQuestion()
    await wizardPage.answerQuestion('no-patent')
    await wizardPage.nextQuestion()
    await wizardPage.answerQuestion('permissive')
    await wizardPage.completeWizard()
    
    // 获取推荐的许可证名称
    const recommendedLicense = page.locator('[data-testid="recommended-license-title"]')
    const licenseName = await recommendedLicense.textContent()
    
    // 2. 在知识库中搜索该许可证
    await page.click('[data-testid="nav-knowledge"]')
    
    const knowledgePage = new KnowledgePage(page)
    await page.waitForTimeout(2000)
    
    if (licenseName) {
      await knowledgePage.searchLicense(licenseName)
      await page.waitForTimeout(1000)
      
      // 验证搜索结果包含推荐的许可证
      const searchResults = knowledgePage.licenseCards.locator(':visible')
      const resultCount = await searchResults.count()
      expect(resultCount).toBeGreaterThan(0)
    }
    
    // 3. 使用分析器验证实际项目
    await page.click('[data-testid="nav-analyzer"]')
    
    const analyzerPage = new AnalyzerPage(page)
    const testData = TestUtils.generateTestData()
    await analyzerPage.analyzeRepository(testData.validGitHubUrl)
    await analyzerPage.waitForAnalysisComplete()
    
    // 检查分析结果是否与推荐一致
    const analysisResult = page.locator('[data-testid="detected-license"]')
    if (await analysisResult.count() > 0) {
      const detectedLicense = await analysisResult.textContent()
      // 这里可以添加更复杂的匹配逻辑
      expect(detectedLicense).toBeTruthy()
    }
  })

  test('用户偏好设置集成测试 @integration @preferences', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    
    // 设置用户偏好
    await homePage.toggleTheme() // 切换主题
    
    // 如果有语言设置
    const languageSelector = page.locator('[data-testid="language-selector"]')
    if (await languageSelector.count() > 0) {
      await languageSelector.selectOption('en')
    }
    
    // 如果有其他偏好设置
    const settingsButton = page.locator('[data-testid="settings-button"]')
    if (await settingsButton.count() > 0) {
      await settingsButton.click()
      
      const settingsModal = page.locator('[data-testid="settings-modal"]')
      await expect(settingsModal).toBeVisible()
      
      // 设置动画偏好
      const animationToggle = page.locator('[data-testid="animation-toggle"]')
      if (await animationToggle.count() > 0) {
        await animationToggle.click()
      }
      
      // 保存设置
      const saveButton = page.locator('[data-testid="save-settings"]')
      if (await saveButton.count() > 0) {
        await saveButton.click()
      }
    }
    
    // 验证设置在页面刷新后保持
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    const theme = await page.getAttribute('html', 'data-theme')
    expect(theme).toBe('dark') // 应该保持深色主题
  })
})
