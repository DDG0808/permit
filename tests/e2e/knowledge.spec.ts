/**
 * 知识库端到端测试
 * 测试许可证知识库的搜索、筛选和浏览功能
 */

import { test, expect } from '@playwright/test'
import { KnowledgePage, TestUtils } from '../utils/test-helpers'

test.describe('知识库功能测试', () => {
  let knowledgePage: KnowledgePage

  test.beforeEach(async ({ page }) => {
    knowledgePage = new KnowledgePage(page)
    await knowledgePage.goto()
  })

  test('知识库页面基本加载 @smoke', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/许可证知识库/)

    // 检查主要页面元素
    await expect(knowledgePage.searchInput).toBeVisible()
    await expect(knowledgePage.licenseCards).toHaveCount(0, { timeout: 1000 })
    
    // 等待许可证卡片加载
    await page.waitForTimeout(2000)
    const cardCount = await knowledgePage.licenseCards.count()
    expect(cardCount).toBeGreaterThan(0)
    
    // 检查页面无控制台错误
    const errors = await TestUtils.checkConsoleErrors(page)
    expect(errors.length).toBe(0)
  })

  test('许可证搜索功能测试 @search', async ({ page }) => {
    const testData = TestUtils.generateTestData()
    
    // 等待页面完全加载
    await page.waitForTimeout(2000)
    
    for (const query of testData.searchQueries) {
      // 搜索许可证
      await knowledgePage.searchLicense(query)
      await page.waitForTimeout(1000)
      
      // 检查搜索结果
      const visibleCards = knowledgePage.licenseCards.locator(':visible')
      const cardCount = await visibleCards.count()
      
      if (cardCount > 0) {
        // 验证搜索结果包含查询关键词
        const firstCard = visibleCards.first()
        const cardText = await firstCard.textContent()
        expect(cardText?.toLowerCase()).toContain(query.toLowerCase())
      }
      
      // 清空搜索
      await knowledgePage.searchInput.clear()
      await page.waitForTimeout(500)
    }
  })

  test('许可证筛选功能测试 @filter', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(2000)
    
    const categories = ['permissive', 'copyleft', 'public-domain']
    
    for (const category of categories) {
      // 应用筛选
      await knowledgePage.filterByCategory(category)
      await page.waitForTimeout(1000)
      
      // 检查筛选结果
      const visibleCards = knowledgePage.licenseCards.locator(':visible')
      const cardCount = await visibleCards.count()
      
      if (cardCount > 0) {
        // 验证筛选结果符合类别
        const firstCard = visibleCards.first()
        const categoryBadge = firstCard.locator('[data-testid="license-category"]')
        
        if (await categoryBadge.count() > 0) {
          const badgeText = await categoryBadge.textContent()
          expect(badgeText?.toLowerCase()).toContain(category)
        }
      }
    }
  })

  test('许可证详情查看测试 @details', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(2000)
    
    // 点击第一个许可证卡片
    const firstCard = knowledgePage.licenseCards.first()
    await expect(firstCard).toBeVisible()
    await firstCard.click()
    
    // 检查详情模态框或页面
    const detailModal = page.locator('[data-testid="license-detail-modal"]')
    const detailPage = page.locator('[data-testid="license-detail-page"]')
    
    if (await detailModal.count() > 0) {
      // 模态框模式
      await expect(detailModal).toBeVisible()
      
      // 检查详情内容
      const licenseTitle = detailModal.locator('[data-testid="license-title"]')
      await expect(licenseTitle).toBeVisible()
      
      const licenseText = detailModal.locator('[data-testid="license-full-text"]')
      await expect(licenseText).toBeVisible()
      
      const closeButton = detailModal.locator('[data-testid="close-modal"]')
      await expect(closeButton).toBeVisible()
      
      // 关闭模态框
      await closeButton.click()
      await expect(detailModal).toBeHidden()
      
    } else if (await detailPage.count() > 0) {
      // 独立页面模式
      await expect(detailPage).toBeVisible()
      
      // 检查详情内容
      const licenseTitle = page.locator('[data-testid="license-title"]')
      await expect(licenseTitle).toBeVisible()
      
      const licenseText = page.locator('[data-testid="license-full-text"]')
      await expect(licenseText).toBeVisible()
      
      // 返回知识库
      await page.goBack()
    }
  })

  test('视图切换功能测试 @view-toggle', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(2000)
    
    // 检查当前视图
    const currentView = await page.getAttribute('[data-testid="license-container"]', 'data-view')
    
    // 切换视图
    await knowledgePage.toggleView()
    await page.waitForTimeout(500)
    
    // 验证视图已切换
    const newView = await page.getAttribute('[data-testid="license-container"]', 'data-view')
    expect(newView).not.toBe(currentView)
    
    // 再次切换回原视图
    await knowledgePage.toggleView()
    await page.waitForTimeout(500)
    
    const finalView = await page.getAttribute('[data-testid="license-container"]', 'data-view')
    expect(finalView).toBe(currentView)
  })

  test('许可证比较功能测试 @comparison', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(2000)
    
    // 选择多个许可证进行比较
    const compareCheckboxes = page.locator('[data-testid^="compare-checkbox-"]')
    const checkboxCount = await compareCheckboxes.count()
    
    if (checkboxCount >= 2) {
      // 选择前两个许可证
      await compareCheckboxes.nth(0).check()
      await compareCheckboxes.nth(1).check()
      
      // 点击比较按钮
      const compareButton = page.locator('[data-testid="compare-licenses"]')
      await expect(compareButton).toBeVisible()
      await compareButton.click()
      
      // 检查比较页面或模态框
      const comparisonView = page.locator('[data-testid="license-comparison"]')
      await expect(comparisonView).toBeVisible()
      
      // 检查比较表格
      const comparisonTable = page.locator('[data-testid="comparison-table"]')
      await expect(comparisonTable).toBeVisible()
    }
  })

  test('许可证收藏功能测试 @favorites', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(2000)
    
    // 收藏第一个许可证
    const firstCard = knowledgePage.licenseCards.first()
    const favoriteButton = firstCard.locator('[data-testid="favorite-button"]')
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click()
      await page.waitForTimeout(500)
      
      // 检查收藏状态
      const isFavorited = await favoriteButton.getAttribute('data-favorited')
      expect(isFavorited).toBe('true')
      
      // 检查收藏列表
      const favoritesFilter = page.locator('[data-testid="filter-favorites"]')
      if (await favoritesFilter.count() > 0) {
        await favoritesFilter.click()
        await page.waitForTimeout(1000)
        
        const favoriteCards = knowledgePage.licenseCards.locator(':visible')
        const favoriteCount = await favoriteCards.count()
        expect(favoriteCount).toBeGreaterThan(0)
      }
    }
  })

  test('知识库响应式设计测试 @responsive', async ({ page }) => {
    await knowledgePage.checkResponsive()
    
    // 在移动端测试搜索功能
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(1000)
    
    // 检查移动端布局
    await expect(knowledgePage.searchInput).toBeVisible()
    
    // 检查许可证卡片在移动端的显示
    const cardContainer = page.locator('[data-testid="license-container"]')
    const containerClass = await cardContainer.getAttribute('class')
    expect(containerClass).toContain('mobile') // 假设有移动端样式类
  })

  test('知识库性能测试 @performance', async ({ page }) => {
    const metrics = await TestUtils.measurePerformance(page)
    
    // 检查页面加载性能
    expect(metrics.domContentLoaded).toBeLessThan(3000)
    expect(metrics.firstContentfulPaint).toBeLessThan(2000)
    
    // 测试搜索性能
    const testData = TestUtils.generateTestData()
    
    const startTime = Date.now()
    await knowledgePage.searchLicense(testData.searchQueries[0])
    await page.waitForTimeout(1000)
    const searchTime = Date.now() - startTime
    
    expect(searchTime).toBeLessThan(2000) // 搜索响应时间应小于2秒
  })

  test('知识库无障碍访问测试 @accessibility', async ({ page }) => {
    await knowledgePage.checkAccessibility()
    
    // 检查搜索框的可访问性
    const searchInput = knowledgePage.searchInput
    const searchLabel = await searchInput.getAttribute('aria-label')
    expect(searchLabel).toBeTruthy()
    
    // 检查许可证卡片的可访问性
    await page.waitForTimeout(2000)
    const firstCard = knowledgePage.licenseCards.first()
    
    if (await firstCard.count() > 0) {
      const cardRole = await firstCard.getAttribute('role')
      const cardTabIndex = await firstCard.getAttribute('tabindex')
      
      // 卡片应该是可聚焦的
      expect(cardRole || cardTabIndex).toBeTruthy()
    }
  })

  test('知识库键盘导航测试 @accessibility @keyboard', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(2000)
    
    // 使用Tab键导航到搜索框
    await page.keyboard.press('Tab')
    let focusedElement = page.locator(':focus')
    await expect(focusedElement).toBe(knowledgePage.searchInput)
    
    // 在搜索框中输入
    await page.keyboard.type('MIT')
    await page.waitForTimeout(1000)
    
    // 继续Tab导航到许可证卡片
    await page.keyboard.press('Tab')
    focusedElement = page.locator(':focus')
    
    // 验证焦点在许可证卡片上
    const cardElement = knowledgePage.licenseCards.first()
    if (await cardElement.count() > 0) {
      const isFocused = await cardElement.evaluate(el => el === document.activeElement)
      expect(isFocused).toBe(true)
    }
    
    // 使用Enter键打开许可证详情
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)
    
    // 检查是否打开了详情
    const detailModal = page.locator('[data-testid="license-detail-modal"]')
    if (await detailModal.count() > 0) {
      await expect(detailModal).toBeVisible()
    }
  })
})

test.describe('知识库视觉回归测试', () => {
  test('知识库页面截图对比 @visual', async ({ page }) => {
    const knowledgePage = new KnowledgePage(page)
    await knowledgePage.goto()
    await page.waitForTimeout(3000) // 等待许可证数据加载
    
    // 完整页面截图
    await expect(page).toHaveScreenshot('knowledge-full.png', {
      fullPage: true,
      animations: 'disabled'
    })
    
    // 搜索结果截图
    await knowledgePage.searchLicense('MIT')
    await page.waitForTimeout(1000)
    await expect(page).toHaveScreenshot('knowledge-search-results.png')
  })

  test('知识库网格视图截图对比 @visual', async ({ page }) => {
    const knowledgePage = new KnowledgePage(page)
    await knowledgePage.goto()
    await page.waitForTimeout(3000)
    
    // 切换到网格视图
    await knowledgePage.toggleView()
    await page.waitForTimeout(1000)
    
    // 网格视图截图
    const licenseContainer = page.locator('[data-testid="license-container"]')
    await expect(licenseContainer).toHaveScreenshot('knowledge-grid-view.png')
  })

  test('知识库移动端截图对比 @visual @mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const knowledgePage = new KnowledgePage(page)
    await knowledgePage.goto()
    await page.waitForTimeout(3000)
    
    // 移动端截图
    await expect(page).toHaveScreenshot('knowledge-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    })
  })
})
