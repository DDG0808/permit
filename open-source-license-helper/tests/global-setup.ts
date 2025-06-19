/**
 * Playwright全局设置
 * 在所有测试运行前执行的初始化操作
 */

import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 开始全局测试设置...')
  
  // 启动浏览器进行预热
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  
  try {
    // 预热应用
    console.log('🔥 预热应用...')
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    
    // 检查应用是否正常加载
    const title = await page.title()
    console.log(`📄 应用标题: ${title}`)
    
    // 等待关键元素加载
    await page.waitForSelector('[data-testid="app-header"]', { timeout: 10000 })
    console.log('✅ 应用头部加载完成')
    
    // 检查路由是否正常工作
    await page.click('[data-testid="nav-wizard"]')
    await page.waitForURL('**/wizard')
    console.log('✅ 路由导航正常')
    
    // 返回首页
    await page.click('[data-testid="nav-home"]')
    await page.waitForURL('**/')
    
    // 检查主题切换功能
    await page.click('[data-testid="theme-toggle"]')
    await page.waitForTimeout(500)
    console.log('✅ 主题切换功能正常')
    
    // 创建测试数据目录
    const fs = require('fs')
    const path = require('path')
    
    const testDataDir = path.join(process.cwd(), 'test-results')
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true })
    }
    
    const screenshotsDir = path.join(testDataDir, 'screenshots')
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true })
    }
    
    const videosDir = path.join(testDataDir, 'videos')
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true })
    }
    
    console.log('📁 测试目录创建完成')
    
    // 设置全局变量
    process.env.TEST_START_TIME = Date.now().toString()
    
    console.log('✅ 全局设置完成')
    
  } catch (error) {
    console.error('❌ 全局设置失败:', error)
    throw error
  } finally {
    await context.close()
    await browser.close()
  }
}

export default globalSetup
