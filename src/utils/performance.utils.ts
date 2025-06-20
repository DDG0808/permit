/**
 * 性能监控和优化工具
 */

// 性能指标接口
export interface PerformanceMetrics {
  // 页面加载性能
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  
  // 资源加载性能
  resourceLoadTime: Record<string, number>
  
  // 内存使用情况
  memoryUsage?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
  
  // 网络信息
  networkInfo?: {
    effectiveType: string
    downlink: number
    rtt: number
  }
}

// 性能监控类
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
    this.collectBasicMetrics()
  }

  /**
   * 初始化性能观察器
   */
  private initializeObservers() {
    // 观察导航性能
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              this.metrics.loadTime = navEntry.loadEventEnd - navEntry.loadEventStart
              this.metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
            }
          })
        })
        navObserver.observe({ entryTypes: ['navigation'] })
        this.observers.push(navObserver)
      } catch (error) {
        console.warn('Navigation observer not supported:', error)
      }

      // 观察绘制性能
      try {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = entry.startTime
            }
          })
        })
        paintObserver.observe({ entryTypes: ['paint'] })
        this.observers.push(paintObserver)
      } catch (error) {
        console.warn('Paint observer not supported:', error)
      }

      // 观察最大内容绘制
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          this.metrics.largestContentfulPaint = lastEntry.startTime
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(lcpObserver)
      } catch (error) {
        console.warn('LCP observer not supported:', error)
      }

      // 观察首次输入延迟
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            const fidEntry = entry as any
            if (fidEntry.processingStart) {
              this.metrics.firstInputDelay = fidEntry.processingStart - entry.startTime
            }
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.push(fidObserver)
      } catch (error) {
        console.warn('FID observer not supported:', error)
      }

      // 观察布局偏移
      try {
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          let clsValue = 0
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          })
          this.metrics.cumulativeLayoutShift = clsValue
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(clsObserver)
      } catch (error) {
        console.warn('CLS observer not supported:', error)
      }
    }
  }

  /**
   * 收集基础性能指标
   */
  private collectBasicMetrics() {
    // 收集内存使用情况
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      }
    }

    // 收集网络信息
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      this.metrics.networkInfo = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      }
    }

    // 收集资源加载时间
    this.collectResourceMetrics()
  }

  /**
   * 收集资源加载性能
   */
  private collectResourceMetrics() {
    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const resourceLoadTime: Record<string, number> = {}

    resourceEntries.forEach((entry) => {
      const resourceName = entry.name.split('/').pop() || entry.name
      resourceLoadTime[resourceName] = entry.responseEnd - entry.startTime
    })

    this.metrics.resourceLoadTime = resourceLoadTime
  }

  /**
   * 获取当前性能指标
   */
  getMetrics(): Partial<PerformanceMetrics> {
    this.collectResourceMetrics() // 更新资源指标
    return { ...this.metrics }
  }

  /**
   * 测量函数执行时间
   */
  measureFunction<T>(name: string, fn: () => T): T {
    const startTime = performance.now()
    const result = fn()
    const endTime = performance.now()
    
    console.log(`${name} 执行时间: ${endTime - startTime}ms`)
    return result
  }

  /**
   * 测量异步函数执行时间
   */
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now()
    const result = await fn()
    const endTime = performance.now()
    
    console.log(`${name} 执行时间: ${endTime - startTime}ms`)
    return result
  }

  /**
   * 标记性能时间点
   */
  mark(name: string) {
    performance.mark(name)
  }

  /**
   * 测量两个标记之间的时间
   */
  measure(name: string, startMark: string, endMark: string) {
    performance.measure(name, startMark, endMark)
    const measure = performance.getEntriesByName(name, 'measure')[0]
    console.log(`${name}: ${measure.duration}ms`)
    return measure.duration
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const metrics = this.getMetrics()
    
    let report = '=== 性能报告 ===\n\n'
    
    // 核心Web指标
    report += '核心Web指标:\n'
    if (metrics.firstContentfulPaint) {
      report += `  首次内容绘制 (FCP): ${metrics.firstContentfulPaint.toFixed(2)}ms\n`
    }
    if (metrics.largestContentfulPaint) {
      report += `  最大内容绘制 (LCP): ${metrics.largestContentfulPaint.toFixed(2)}ms\n`
    }
    if (metrics.firstInputDelay) {
      report += `  首次输入延迟 (FID): ${metrics.firstInputDelay.toFixed(2)}ms\n`
    }
    if (metrics.cumulativeLayoutShift) {
      report += `  累积布局偏移 (CLS): ${metrics.cumulativeLayoutShift.toFixed(4)}\n`
    }
    
    // 页面加载性能
    report += '\n页面加载性能:\n'
    if (metrics.loadTime) {
      report += `  页面加载时间: ${metrics.loadTime.toFixed(2)}ms\n`
    }
    if (metrics.domContentLoaded) {
      report += `  DOM内容加载时间: ${metrics.domContentLoaded.toFixed(2)}ms\n`
    }
    
    // 内存使用情况
    if (metrics.memoryUsage) {
      report += '\n内存使用情况:\n'
      report += `  已使用堆内存: ${(metrics.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB\n`
      report += `  总堆内存: ${(metrics.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB\n`
      report += `  堆内存限制: ${(metrics.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB\n`
    }
    
    // 网络信息
    if (metrics.networkInfo) {
      report += '\n网络信息:\n'
      report += `  有效连接类型: ${metrics.networkInfo.effectiveType}\n`
      report += `  下行速度: ${metrics.networkInfo.downlink}Mbps\n`
      report += `  往返时间: ${metrics.networkInfo.rtt}ms\n`
    }
    
    return report
  }

  /**
   * 清理观察器
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// 单例实例
export const performanceMonitor = new PerformanceMonitor()

// 工具函数
export const measurePerformance = {
  /**
   * 测量组件渲染时间
   */
  measureComponentRender: (componentName: string) => {
    return {
      start: () => performanceMonitor.mark(`${componentName}-render-start`),
      end: () => {
        performanceMonitor.mark(`${componentName}-render-end`)
        return performanceMonitor.measure(
          `${componentName}-render`,
          `${componentName}-render-start`,
          `${componentName}-render-end`
        )
      }
    }
  },

  /**
   * 测量API请求时间
   */
  measureApiRequest: async <T>(name: string, request: () => Promise<T>): Promise<T> => {
    return performanceMonitor.measureAsyncFunction(`API-${name}`, request)
  },

  /**
   * 测量路由切换时间
   */
  measureRouteChange: (routeName: string) => {
    return {
      start: () => performanceMonitor.mark(`route-${routeName}-start`),
      end: () => {
        performanceMonitor.mark(`route-${routeName}-end`)
        return performanceMonitor.measure(
          `route-${routeName}`,
          `route-${routeName}-start`,
          `route-${routeName}-end`
        )
      }
    }
  }
}

// 性能优化建议
export const getPerformanceRecommendations = (metrics: Partial<PerformanceMetrics>): string[] => {
  const recommendations: string[] = []

  if (metrics.firstContentfulPaint && metrics.firstContentfulPaint > 2000) {
    recommendations.push('首次内容绘制时间过长，建议优化关键资源加载')
  }

  if (metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500) {
    recommendations.push('最大内容绘制时间过长，建议优化图片和字体加载')
  }

  if (metrics.firstInputDelay && metrics.firstInputDelay > 100) {
    recommendations.push('首次输入延迟过长，建议减少主线程阻塞')
  }

  if (metrics.cumulativeLayoutShift && metrics.cumulativeLayoutShift > 0.1) {
    recommendations.push('累积布局偏移过大，建议为图片和广告设置尺寸')
  }

  if (metrics.memoryUsage && metrics.memoryUsage.usedJSHeapSize > 50 * 1024 * 1024) {
    recommendations.push('内存使用过高，建议检查内存泄漏')
  }

  return recommendations
}
