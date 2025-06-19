/**
 * 测试工具类
 * 提供通用的测试辅助函数和页面对象模型
 */

import { Page, Locator, expect } from '@playwright/test'

// 页面对象模型基类
export class BasePage {
  constructor(public page: Page) {}

  // 等待页面加载完成
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForLoadState('domcontentloaded')
  }

  // 等待元素可见
  async waitForVisible(selector: string, timeout = 5000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout })
  }

  // 等待元素隐藏
  async waitForHidden(selector: string, timeout = 5000) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout })
  }

  // 滚动到元素
  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded()
  }

  // 截图
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    })
  }

  // 检查无障碍访问
  async checkAccessibility() {
    // 检查页面是否有标题
    const title = await this.page.title()
    expect(title).toBeTruthy()

    // 检查是否有主要地标
    const main = this.page.locator('main, [role="main"]')
    await expect(main).toBeVisible()

    // 检查是否有跳转链接
    const skipLink = this.page.locator('a[href="#main"], a[href="#content"]')
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible()
    }
  }

  // 检查响应式设计
  async checkResponsive() {
    const viewports = [
      { width: 320, height: 568 },   // iPhone SE
      { width: 768, height: 1024 },  // iPad
      { width: 1024, height: 768 },  // iPad横屏
      { width: 1280, height: 720 },  // 桌面
      { width: 1920, height: 1080 }  // 大屏幕
    ]

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport)
      await this.page.waitForTimeout(500)
      
      // 检查页面是否正常显示
      const body = this.page.locator('body')
      await expect(body).toBeVisible()
      
      // 检查是否有水平滚动条
      const scrollWidth = await this.page.evaluate(() => document.body.scrollWidth)
      const clientWidth = await this.page.evaluate(() => document.body.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20) // 允许20px误差
    }
  }
}

// 首页页面对象
export class HomePage extends BasePage {
  // 页面元素
  get header() { return this.page.locator('[data-testid="app-header"]') }
  get heroSection() { return this.page.locator('[data-testid="hero-section"]') }
  get featuresSection() { return this.page.locator('[data-testid="features-section"]') }
  get statsSection() { return this.page.locator('[data-testid="stats-section"]') }
  get guideSection() { return this.page.locator('[data-testid="guide-section"]') }
  get footer() { return this.page.locator('[data-testid="app-footer"]') }

  // 导航元素
  get navHome() { return this.page.locator('[data-testid="nav-home"]') }
  get navWizard() { return this.page.locator('[data-testid="nav-wizard"]') }
  get navAnalyzer() { return this.page.locator('[data-testid="nav-analyzer"]') }
  get navKnowledge() { return this.page.locator('[data-testid="nav-knowledge"]') }
  get themeToggle() { return this.page.locator('[data-testid="theme-toggle"]') }

  // 功能卡片
  get wizardCard() { return this.page.locator('[data-testid="wizard-card"]') }
  get analyzerCard() { return this.page.locator('[data-testid="analyzer-card"]') }
  get knowledgeCard() { return this.page.locator('[data-testid="knowledge-card"]') }

  // 页面操作
  async goto() {
    await this.page.goto('/')
    await this.waitForPageLoad()
  }

  async clickWizardCard() {
    await this.wizardCard.click()
    await this.page.waitForURL('**/wizard')
  }

  async clickAnalyzerCard() {
    await this.analyzerCard.click()
    await this.page.waitForURL('**/analyzer')
  }

  async clickKnowledgeCard() {
    await this.knowledgeCard.click()
    await this.page.waitForURL('**/knowledge')
  }

  async toggleTheme() {
    await this.themeToggle.click()
    await this.page.waitForTimeout(300)
  }

  // 验证页面内容
  async verifyPageContent() {
    await expect(this.header).toBeVisible()
    await expect(this.heroSection).toBeVisible()
    await expect(this.featuresSection).toBeVisible()
    await expect(this.footer).toBeVisible()
  }

  async verifyFeatureCards() {
    await expect(this.wizardCard).toBeVisible()
    await expect(this.analyzerCard).toBeVisible()
    await expect(this.knowledgeCard).toBeVisible()
  }
}

// 向导页面对象
export class WizardPage extends BasePage {
  get welcomeSection() { return this.page.locator('[data-testid="wizard-welcome"]') }
  get questionSection() { return this.page.locator('[data-testid="wizard-questions"]') }
  get resultSection() { return this.page.locator('[data-testid="wizard-result"]') }
  get startButton() { return this.page.locator('[data-testid="wizard-start"]') }
  get nextButton() { return this.page.locator('[data-testid="wizard-next"]') }
  get prevButton() { return this.page.locator('[data-testid="wizard-prev"]') }
  get restartButton() { return this.page.locator('[data-testid="wizard-restart"]') }

  async goto() {
    await this.page.goto('/wizard')
    await this.waitForPageLoad()
  }

  async startWizard() {
    await this.startButton.click()
    await this.waitForVisible('[data-testid="wizard-questions"]')
  }

  async answerQuestion(answer: string) {
    const answerButton = this.page.locator(`[data-testid="answer-${answer}"]`)
    await answerButton.click()
  }

  async nextQuestion() {
    await this.nextButton.click()
    await this.page.waitForTimeout(300)
  }

  async previousQuestion() {
    await this.prevButton.click()
    await this.page.waitForTimeout(300)
  }

  async completeWizard() {
    await this.waitForVisible('[data-testid="wizard-result"]')
  }
}

// 分析器页面对象
export class AnalyzerPage extends BasePage {
  get urlInput() { return this.page.locator('[data-testid="repo-url-input"]') }
  get analyzeButton() { return this.page.locator('[data-testid="analyze-button"]') }
  get loadingState() { return this.page.locator('[data-testid="loading-state"]') }
  get resultSection() { return this.page.locator('[data-testid="analysis-result"]') }
  get errorState() { return this.page.locator('[data-testid="error-state"]') }

  async goto() {
    await this.page.goto('/analyzer')
    await this.waitForPageLoad()
  }

  async analyzeRepository(url: string) {
    await this.urlInput.fill(url)
    await this.analyzeButton.click()
  }

  async waitForAnalysisComplete() {
    await this.waitForHidden('[data-testid="loading-state"]')
    await this.waitForVisible('[data-testid="analysis-result"]')
  }
}

// 知识库页面对象
export class KnowledgePage extends BasePage {
  get searchInput() { return this.page.locator('[data-testid="license-search"]') }
  get filterButtons() { return this.page.locator('[data-testid^="filter-"]') }
  get licenseCards() { return this.page.locator('[data-testid^="license-card-"]') }
  get viewToggle() { return this.page.locator('[data-testid="view-toggle"]') }

  async goto() {
    await this.page.goto('/knowledge')
    await this.waitForPageLoad()
  }

  async searchLicense(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForTimeout(500)
  }

  async filterByCategory(category: string) {
    const filterButton = this.page.locator(`[data-testid="filter-${category}"]`)
    await filterButton.click()
  }

  async toggleView() {
    await this.viewToggle.click()
    await this.page.waitForTimeout(300)
  }
}

// 测试工具函数
export class TestUtils {
  static async waitForAnimation(page: Page, duration = 1000) {
    await page.waitForTimeout(duration)
  }

  static async checkConsoleErrors(page: Page) {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    return errors
  }

  static async measurePerformance(page: Page) {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      }
    })

    return metrics
  }

  static async checkNetworkRequests(page: Page) {
    const requests: any[] = []
    const responses: any[] = []

    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      })
    })

    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      })
    })

    return { requests, responses }
  }

  static generateTestData() {
    return {
      validGitHubUrl: 'https://github.com/microsoft/vscode',
      invalidUrl: 'not-a-valid-url',
      searchQueries: ['MIT', 'Apache', 'GPL', 'BSD'],
      testEmail: 'test@example.com',
      testText: 'This is a test text for input validation'
    }
  }
}
