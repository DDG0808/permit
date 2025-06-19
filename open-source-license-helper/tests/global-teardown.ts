/**
 * Playwright全局清理
 * 在所有测试运行后执行的清理操作
 */

import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 开始全局测试清理...')
  
  try {
    // 计算测试运行时间
    const startTime = parseInt(process.env.TEST_START_TIME || '0')
    const endTime = Date.now()
    const duration = endTime - startTime
    const durationMinutes = Math.round(duration / 1000 / 60 * 100) / 100
    
    console.log(`⏱️  测试总耗时: ${durationMinutes} 分钟`)
    
    // 生成测试报告摘要
    const fs = require('fs')
    const path = require('path')
    
    const testResultsDir = path.join(process.cwd(), 'test-results')
    const summaryFile = path.join(testResultsDir, 'test-summary.json')
    
    const summary = {
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      duration: duration,
      durationMinutes: durationMinutes,
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        ci: !!process.env.CI
      }
    }
    
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2))
    console.log('📊 测试摘要已生成')
    
    // 清理临时文件
    const tempDir = path.join(testResultsDir, 'temp')
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
      console.log('🗑️  临时文件已清理')
    }
    
    // 压缩测试结果（如果在CI环境中）
    if (process.env.CI) {
      console.log('📦 CI环境检测到，准备压缩测试结果...')
      // 这里可以添加压缩逻辑
    }
    
    console.log('✅ 全局清理完成')
    
  } catch (error) {
    console.error('❌ 全局清理失败:', error)
    // 不抛出错误，避免影响测试结果
  }
}

export default globalTeardown
