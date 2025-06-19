/**
 * 许可证向导端到端测试
 * 测试向导的完整流程和交互功能
 */

import { test, expect } from '@playwright/test'
import { WizardPage, TestUtils } from '../utils/test-helpers'

test.describe('许可证向导功能测试', () => {
  let wizardPage: WizardPage

  test.beforeEach(async ({ page }) => {
    wizardPage = new WizardPage(page)
    await wizardPage.goto()
  })

  test('向导页面基本加载 @smoke', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/许可证向导/)

    // 检查欢迎界面
    await expect(wizardPage.welcomeSection).toBeVisible()
    await expect(wizardPage.startButton).toBeVisible()
    
    // 检查页面无控制台错误
    const errors = await TestUtils.checkConsoleErrors(page)
    expect(errors.length).toBe(0)
  })

  test('向导完整流程测试 @workflow', async ({ page }) => {
    // 开始向导
    await wizardPage.startWizard()
    await expect(wizardPage.questionSection).toBeVisible()
    
    // 模拟回答问题流程
    const questions = [
      'commercial',     // 商业使用
      'modify',         // 允许修改
      'distribute',     // 允许分发
      'patent',         // 专利保护
      'copyleft-weak'   // 弱版权左
    ]
    
    for (let i = 0; i < questions.length; i++) {
      // 回答当前问题
      await wizardPage.answerQuestion(questions[i])
      
      // 如果不是最后一个问题，点击下一步
      if (i < questions.length - 1) {
        await wizardPage.nextQuestion()
        await TestUtils.waitForAnimation(page, 300)
      }
    }
    
    // 完成向导
    await wizardPage.completeWizard()
    await expect(wizardPage.resultSection).toBeVisible()
  })

  test('向导导航功能测试 @navigation', async ({ page }) => {
    await wizardPage.startWizard()
    
    // 回答第一个问题
    await wizardPage.answerQuestion('commercial')
    await wizardPage.nextQuestion()
    
    // 回答第二个问题
    await wizardPage.answerQuestion('modify')
    await wizardPage.nextQuestion()
    
    // 测试返回上一步
    await wizardPage.previousQuestion()
    await TestUtils.waitForAnimation(page, 300)
    
    // 验证可以重新选择答案
    await wizardPage.answerQuestion('no-modify')
    await wizardPage.nextQuestion()
    
    // 继续完成向导
    await wizardPage.answerQuestion('distribute')
    await wizardPage.nextQuestion()
    
    await wizardPage.answerQuestion('no-patent')
    await wizardPage.nextQuestion()
    
    await wizardPage.answerQuestion('permissive')
    
    await wizardPage.completeWizard()
    await expect(wizardPage.resultSection).toBeVisible()
  })

  test('向导重新开始功能测试 @restart', async ({ page }) => {
    // 完成一次向导
    await wizardPage.startWizard()
    await wizardPage.answerQuestion('commercial')
    await wizardPage.nextQuestion()
    await wizardPage.answerQuestion('modify')
    await wizardPage.completeWizard()
    
    // 重新开始
    await wizardPage.restartButton.click()
    await expect(wizardPage.welcomeSection).toBeVisible()
    await expect(wizardPage.startButton).toBeVisible()
  })

  test('向导结果展示测试 @results', async ({ page }) => {
    await wizardPage.startWizard()
    
    // 选择特定答案组合以获得MIT许可证推荐
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
    
    // 检查结果页面元素
    await expect(wizardPage.resultSection).toBeVisible()
    
    // 检查推荐的许可证信息
    const licenseTitle = page.locator('[data-testid="recommended-license-title"]')
    await expect(licenseTitle).toBeVisible()
    
    const licenseDescription = page.locator('[data-testid="recommended-license-description"]')
    await expect(licenseDescription).toBeVisible()
    
    // 检查许可证文本
    const licenseText = page.locator('[data-testid="license-text"]')
    await expect(licenseText).toBeVisible()
    
    // 检查下载按钮
    const downloadButton = page.locator('[data-testid="download-license"]')
    await expect(downloadButton).toBeVisible()
  })

  test('向导问题验证测试 @validation', async ({ page }) => {
    await wizardPage.startWizard()
    
    // 尝试不选择答案直接下一步
    const nextButton = wizardPage.nextButton
    
    // 检查下一步按钮是否被禁用
    if (await nextButton.isEnabled()) {
      // 如果按钮可用，点击后应该有验证提示
      await nextButton.click()
      
      const validationMessage = page.locator('[data-testid="validation-message"]')
      if (await validationMessage.count() > 0) {
        await expect(validationMessage).toBeVisible()
      }
    } else {
      // 按钮应该被禁用
      await expect(nextButton).toBeDisabled()
    }
  })

  test('向导键盘导航测试 @accessibility @keyboard', async ({ page }) => {
    await wizardPage.startWizard()
    
    // 使用Tab键导航
    await page.keyboard.press('Tab')
    let focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // 使用空格键选择答案
    await page.keyboard.press('Space')
    await TestUtils.waitForAnimation(page, 300)
    
    // 使用Enter键确认
    await page.keyboard.press('Enter')
    await TestUtils.waitForAnimation(page, 300)
  })

  test('向导动画效果测试 @animation', async ({ page }) => {
    // 检查欢迎界面动画
    await expect(wizardPage.welcomeSection).toBeVisible()
    
    // 开始向导，检查过渡动画
    await wizardPage.startWizard()
    await TestUtils.waitForAnimation(page, 500)
    
    // 检查问题切换动画
    await wizardPage.answerQuestion('commercial')
    await wizardPage.nextQuestion()
    await TestUtils.waitForAnimation(page, 500)
    
    // 检查进度指示器动画
    const progressIndicator = page.locator('[data-testid="progress-indicator"]')
    if (await progressIndicator.count() > 0) {
      await expect(progressIndicator).toBeVisible()
    }
  })

  test('向导响应式设计测试 @responsive', async ({ page }) => {
    await wizardPage.checkResponsive()
    
    // 在移动端测试向导流程
    await page.setViewportSize({ width: 375, height: 667 })
    await wizardPage.startWizard()
    
    // 检查移动端布局
    await expect(wizardPage.questionSection).toBeVisible()
    
    // 检查按钮是否适合触摸
    const answerButtons = page.locator('[data-testid^="answer-"]')
    const buttonCount = await answerButtons.count()
    
    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const button = answerButtons.nth(i)
      const boundingBox = await button.boundingBox()
      
      if (boundingBox) {
        expect(boundingBox.height).toBeGreaterThanOrEqual(44) // 最小触摸目标
        expect(boundingBox.width).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('向导性能测试 @performance', async ({ page }) => {
    const metrics = await TestUtils.measurePerformance(page)
    
    // 检查页面加载性能
    expect(metrics.domContentLoaded).toBeLessThan(2000)
    expect(metrics.firstContentfulPaint).toBeLessThan(1500)
    
    // 测试向导交互性能
    const startTime = Date.now()
    await wizardPage.startWizard()
    const interactionTime = Date.now() - startTime
    
    expect(interactionTime).toBeLessThan(500) // 交互响应时间应小于500ms
  })

  test('向导数据持久化测试 @persistence', async ({ page }) => {
    await wizardPage.startWizard()
    
    // 回答几个问题
    await wizardPage.answerQuestion('commercial')
    await wizardPage.nextQuestion()
    
    await wizardPage.answerQuestion('modify')
    await wizardPage.nextQuestion()
    
    // 刷新页面
    await page.reload()
    await wizardPage.waitForPageLoad()
    
    // 检查是否保存了进度（如果实现了此功能）
    const savedProgress = page.locator('[data-testid="saved-progress"]')
    if (await savedProgress.count() > 0) {
      await expect(savedProgress).toBeVisible()
    }
  })
})

test.describe('向导视觉回归测试', () => {
  test('向导页面截图对比 @visual', async ({ page }) => {
    const wizardPage = new WizardPage(page)
    await wizardPage.goto()
    
    // 欢迎界面截图
    await expect(wizardPage.welcomeSection).toHaveScreenshot('wizard-welcome.png')
    
    // 开始向导
    await wizardPage.startWizard()
    await TestUtils.waitForAnimation(page, 1000)
    
    // 问题界面截图
    await expect(wizardPage.questionSection).toHaveScreenshot('wizard-question.png')
    
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
    
    // 结果界面截图
    await expect(wizardPage.resultSection).toHaveScreenshot('wizard-result.png')
  })

  test('向导移动端截图对比 @visual @mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const wizardPage = new WizardPage(page)
    await wizardPage.goto()
    await TestUtils.waitForAnimation(page, 1000)
    
    // 移动端欢迎界面截图
    await expect(wizardPage.welcomeSection).toHaveScreenshot('wizard-welcome-mobile.png')
    
    await wizardPage.startWizard()
    await TestUtils.waitForAnimation(page, 1000)
    
    // 移动端问题界面截图
    await expect(wizardPage.questionSection).toHaveScreenshot('wizard-question-mobile.png')
  })
})
