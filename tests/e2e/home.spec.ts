/**
 * 首页端到端测试
 * 测试首页的核心功能和用户交互
 */

import { test, expect } from '@playwright/test'
import { HomePage, TestUtils } from '../utils/test-helpers'

test.describe('首页功能测试', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.goto()
  })

  test('页面基本加载 @smoke', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/开源许可证助手/)

    // 检查主要页面元素
    await homePage.verifyPageContent()
    
    // 检查页面无控制台错误
    const errors = await TestUtils.checkConsoleErrors(page)
    expect(errors.length).toBe(0)
  })

  test('导航功能测试 @navigation', async ({ page }) => {
    // 测试向导页面导航
    await homePage.navWizard.click()
    await expect(page).toHaveURL(/.*\/wizard/)
    
    // 返回首页
    await homePage.navHome.click()
    await expect(page).toHaveURL(/.*\/$/)
    
    // 测试分析器页面导航
    await homePage.navAnalyzer.click()
    await expect(page).toHaveURL(/.*\/analyzer/)
    
    // 返回首页
    await homePage.navHome.click()
    await expect(page).toHaveURL(/.*\/$/)
    
    // 测试知识库页面导航
    await homePage.navKnowledge.click()
    await expect(page).toHaveURL(/.*\/knowledge/)
  })

  test('功能卡片交互测试 @interaction', async ({ page }) => {
    // 测试向导卡片点击
    await homePage.clickWizardCard()
    await expect(page).toHaveURL(/.*\/wizard/)
    
    // 返回首页测试分析器卡片
    await page.goBack()
    await homePage.waitForPageLoad()
    await homePage.clickAnalyzerCard()
    await expect(page).toHaveURL(/.*\/analyzer/)
    
    // 返回首页测试知识库卡片
    await page.goBack()
    await homePage.waitForPageLoad()
    await homePage.clickKnowledgeCard()
    await expect(page).toHaveURL(/.*\/knowledge/)
  })

  test('主题切换功能测试 @theme', async ({ page }) => {
    // 获取初始主题
    const initialTheme = await page.getAttribute('html', 'data-theme')
    
    // 切换主题
    await homePage.toggleTheme()
    await TestUtils.waitForAnimation(page, 500)
    
    // 验证主题已切换
    const newTheme = await page.getAttribute('html', 'data-theme')
    expect(newTheme).not.toBe(initialTheme)
    
    // 再次切换回原主题
    await homePage.toggleTheme()
    await TestUtils.waitForAnimation(page, 500)
    
    const finalTheme = await page.getAttribute('html', 'data-theme')
    expect(finalTheme).toBe(initialTheme)
  })

  test('页面动画效果测试 @animation', async ({ page }) => {
    // 检查英雄区域动画
    const heroSection = homePage.heroSection
    await expect(heroSection).toBeVisible()
    
    // 检查浮动元素动画
    const floatingElements = page.locator('.floating-element')
    const count = await floatingElements.count()
    expect(count).toBeGreaterThan(0)
    
    // 检查功能卡片悬浮效果
    await homePage.wizardCard.hover()
    await TestUtils.waitForAnimation(page, 300)
    
    // 检查滚动触发动画
    await homePage.scrollToElement('[data-testid="stats-section"]')
    await TestUtils.waitForAnimation(page, 500)
  })

  test('响应式设计测试 @responsive', async ({ page }) => {
    await homePage.checkResponsive()
  })

  test('无障碍访问测试 @accessibility', async ({ page }) => {
    await homePage.checkAccessibility()
    
    // 检查键盘导航
    await page.keyboard.press('Tab')
    const focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // 检查ARIA标签
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const ariaLabel = await button.getAttribute('aria-label')
      const text = await button.textContent()
      
      // 按钮应该有可访问的名称
      expect(ariaLabel || text).toBeTruthy()
    }
  })

  test('性能测试 @performance', async ({ page }) => {
    const metrics = await TestUtils.measurePerformance(page)
    
    // 检查关键性能指标
    expect(metrics.domContentLoaded).toBeLessThan(3000) // 3秒内DOM加载完成
    expect(metrics.loadComplete).toBeLessThan(5000)     // 5秒内完全加载
    expect(metrics.firstContentfulPaint).toBeLessThan(2000) // 2秒内首次内容绘制
  })

  test('网络请求测试 @network', async ({ page }) => {
    const { requests, responses } = await TestUtils.checkNetworkRequests(page)
    
    await homePage.goto()
    
    // 检查是否有失败的请求
    const failedResponses = responses.filter(r => r.status >= 400)
    expect(failedResponses.length).toBe(0)
    
    // 检查关键资源是否加载
    const cssRequests = requests.filter(r => r.resourceType === 'stylesheet')
    const jsRequests = requests.filter(r => r.resourceType === 'script')
    
    expect(cssRequests.length).toBeGreaterThan(0)
    expect(jsRequests.length).toBeGreaterThan(0)
  })

  test('搜索引擎优化测试 @seo', async ({ page }) => {
    // 检查meta标签
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(50)
    
    const keywords = await page.locator('meta[name="keywords"]').getAttribute('content')
    expect(keywords).toBeTruthy()
    
    // 检查结构化数据
    const jsonLd = page.locator('script[type="application/ld+json"]')
    if (await jsonLd.count() > 0) {
      const jsonContent = await jsonLd.textContent()
      expect(() => JSON.parse(jsonContent!)).not.toThrow()
    }
    
    // 检查标题层级
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1) // 应该只有一个h1标签
  })

  test('错误处理测试 @error-handling', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/**', route => route.abort())
    
    // 尝试触发需要API的功能
    await homePage.clickAnalyzerCard()
    
    // 检查是否有适当的错误处理
    const errorMessage = page.locator('[data-testid="error-message"]')
    if (await errorMessage.count() > 0) {
      await expect(errorMessage).toBeVisible()
    }
  })
})

test.describe('首页视觉回归测试', () => {
  test('首页截图对比 @visual', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    
    // 等待所有动画完成
    await TestUtils.waitForAnimation(page, 2000)
    
    // 全页面截图
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled'
    })
    
    // 英雄区域截图
    await expect(homePage.heroSection).toHaveScreenshot('homepage-hero.png')
    
    // 功能卡片区域截图
    await expect(homePage.featuresSection).toHaveScreenshot('homepage-features.png')
  })

  test('深色模式截图对比 @visual @dark-mode', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    
    // 切换到深色模式
    await homePage.toggleTheme()
    await TestUtils.waitForAnimation(page, 1000)
    
    // 深色模式全页面截图
    await expect(page).toHaveScreenshot('homepage-dark-full.png', {
      fullPage: true,
      animations: 'disabled'
    })
  })

  test('移动端截图对比 @visual @mobile', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    
    const homePage = new HomePage(page)
    await homePage.goto()
    await TestUtils.waitForAnimation(page, 2000)
    
    // 移动端截图
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    })
  })
})

test.describe('首页跨浏览器测试', () => {
  test('Chrome浏览器兼容性 @cross-browser @chrome', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', '仅在Chrome中运行')
    
    const homePage = new HomePage(page)
    await homePage.goto()
    await homePage.verifyPageContent()
    await homePage.verifyFeatureCards()
  })

  test('Firefox浏览器兼容性 @cross-browser @firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', '仅在Firefox中运行')
    
    const homePage = new HomePage(page)
    await homePage.goto()
    await homePage.verifyPageContent()
    await homePage.verifyFeatureCards()
  })

  test('Safari浏览器兼容性 @cross-browser @safari', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', '仅在Safari中运行')
    
    const homePage = new HomePage(page)
    await homePage.goto()
    await homePage.verifyPageContent()
    await homePage.verifyFeatureCards()
  })
})
