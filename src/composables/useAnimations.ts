/**
 * 现代化动画系统组合式函数
 * 提供统一的动画管理、控制和交互效果
 */

import { ref, onMounted, onUnmounted, nextTick, type Ref } from 'vue'

// 动画类型定义
export type AnimationType = 
  | 'fadeIn' | 'fadeOut' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight'
  | 'scaleIn' | 'scaleOut' | 'bounceIn' | 'slideInUp' | 'slideInDown' 
  | 'slideInLeft' | 'slideInRight' | 'floating' | 'pulse' | 'heartbeat'
  | 'wiggle' | 'bounce' | 'rubberBand' | 'flash' | 'gradient' | 'ripple'

export type EasingType = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'ease-apple' | 'ease-bounce'

export interface AnimationConfig {
  type: AnimationType
  duration?: number
  delay?: number
  easing?: EasingType
  infinite?: boolean
}

// 动画状态管理
export function useAnimations() {
  const isAnimationEnabled = ref(true)
  const activeAnimations = ref(new Set<string>())
  
  // 检查用户是否偏好减少动画
  const checkReducedMotion = () => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      isAnimationEnabled.value = !mediaQuery.matches
      
      const handleChange = (e: MediaQueryListEvent) => {
        isAnimationEnabled.value = !e.matches
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
    return () => {}
  }
  
  // 应用动画到元素
  const applyAnimation = (
    element: HTMLElement | null,
    config: AnimationConfig,
    onComplete?: () => void
  ) => {
    if (!element || !isAnimationEnabled.value) {
      onComplete?.()
      return
    }
    
    const animationId = `${config.type}-${Date.now()}`
    activeAnimations.value.add(animationId)
    
    // 构建动画类名
    const animationClass = `animate-${config.type}`
    const durationClass = config.duration ? `duration-${config.duration}` : ''
    const delayClass = config.delay ? `animate-delay-${config.delay}` : ''
    const easingClass = config.easing ? `ease-${config.easing}` : ''
    
    // 添加动画类
    element.classList.add(animationClass)
    if (durationClass) element.classList.add(durationClass)
    if (delayClass) element.classList.add(delayClass)
    if (easingClass) element.classList.add(easingClass)
    
    // 监听动画结束
    const handleAnimationEnd = () => {
      if (!config.infinite) {
        element.classList.remove(animationClass, durationClass, delayClass, easingClass)
      }
      activeAnimations.value.delete(animationId)
      onComplete?.()
      element.removeEventListener('animationend', handleAnimationEnd)
    }
    
    element.addEventListener('animationend', handleAnimationEnd)
    
    return () => {
      element.classList.remove(animationClass, durationClass, delayClass, easingClass)
      activeAnimations.value.delete(animationId)
      element.removeEventListener('animationend', handleAnimationEnd)
    }
  }
  
  // 停止所有动画
  const stopAllAnimations = () => {
    activeAnimations.value.clear()
  }
  
  let cleanupReducedMotion: (() => void) | null = null
  
  onMounted(() => {
    cleanupReducedMotion = checkReducedMotion()
  })
  
  onUnmounted(() => {
    stopAllAnimations()
    cleanupReducedMotion?.()
  })
  
  return {
    isAnimationEnabled,
    activeAnimations,
    applyAnimation,
    stopAllAnimations
  }
}

// 滚动触发动画
export function useScrollReveal() {
  const revealElements = ref<Set<HTMLElement>>(new Set())
  const { isAnimationEnabled } = useAnimations()
  
  // 添加滚动监听元素
  const addRevealElement = (
    element: HTMLElement,
    animationType: 'up' | 'left' | 'right' | 'scale' = 'up',
    threshold = 0.1
  ) => {
    if (!isAnimationEnabled.value) {
      element.classList.add('revealed')
      return
    }
    
    revealElements.value.add(element)
    element.classList.add(`scroll-reveal${animationType !== 'up' ? '-' + animationType : ''}`)
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
            revealElements.value.delete(entry.target as HTMLElement)
          }
        })
      },
      { threshold }
    )
    
    observer.observe(element)
    
    return () => {
      observer.unobserve(element)
      revealElements.value.delete(element)
    }
  }
  
  // 批量添加滚动监听
  const addRevealElements = (
    elements: HTMLElement[],
    animationType: 'up' | 'left' | 'right' | 'scale' = 'up',
    staggerDelay = 100
  ) => {
    elements.forEach((element, index) => {
      setTimeout(() => {
        addRevealElement(element, animationType)
      }, index * staggerDelay)
    })
  }
  
  return {
    addRevealElement,
    addRevealElements,
    revealElements
  }
}

// 悬浮效果
export function useHoverEffects() {
  const { isAnimationEnabled } = useAnimations()
  
  // 磁性悬浮效果
  const addMagneticHover = (element: HTMLElement, intensity = 1) => {
    if (!isAnimationEnabled.value) return
    
    element.classList.add('magnetic-hover')
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      const moveX = (x / rect.width) * 20 * intensity
      const moveY = (y / rect.height) * 20 * intensity
      
      element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`
    }
    
    const handleMouseLeave = () => {
      element.style.transform = ''
    }
    
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.classList.remove('magnetic-hover')
    }
  }
  
  // 倾斜悬浮效果
  const addTiltHover = (element: HTMLElement, maxTilt = 15) => {
    if (!isAnimationEnabled.value) return
    
    element.classList.add('tilt-hover')
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = ((y - centerY) / centerY) * maxTilt
      const rotateY = ((centerX - x) / centerX) * maxTilt
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
    }
    
    const handleMouseLeave = () => {
      element.style.transform = ''
    }
    
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.classList.remove('tilt-hover')
    }
  }
  
  return {
    addMagneticHover,
    addTiltHover
  }
}

// 涟漪效果
export function useRippleEffect() {
  const { isAnimationEnabled } = useAnimations()
  
  const createRipple = (element: HTMLElement, event: MouseEvent) => {
    if (!isAnimationEnabled.value) return
    
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    const ripple = document.createElement('div')
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      pointer-events: none;
      animation: ripple 0.6s ease-out;
    `
    
    element.style.position = 'relative'
    element.style.overflow = 'hidden'
    element.appendChild(ripple)
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
      }
    }, 600)
  }
  
  const addRippleEffect = (element: HTMLElement) => {
    const handleClick = (e: MouseEvent) => {
      createRipple(element, e)
    }
    
    element.addEventListener('click', handleClick)
    
    return () => {
      element.removeEventListener('click', handleClick)
    }
  }
  
  return {
    createRipple,
    addRippleEffect
  }
}

// 页面转换动画
export function usePageTransitions() {
  const { isAnimationEnabled } = useAnimations()

  const getTransitionName = (to: any, from: any) => {
    if (!isAnimationEnabled.value) return ''

    // 根据路由层级决定动画方向
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length

    if (toDepth > fromDepth) {
      return 'slide-left'
    } else if (toDepth < fromDepth) {
      return 'slide-right'
    } else {
      return 'fade'
    }
  }

  return {
    getTransitionName
  }
}

// 加载动画
export function useLoadingAnimations() {
  const { isAnimationEnabled } = useAnimations()

  // 创建骨架屏
  const createSkeleton = (element: HTMLElement, config?: {
    lines?: number
    avatar?: boolean
    button?: boolean
  }) => {
    if (!isAnimationEnabled.value) return

    const { lines = 3, avatar = false, button = false } = config || {}

    element.innerHTML = ''
    element.classList.add('skeleton-container')

    if (avatar) {
      const skeletonAvatar = document.createElement('div')
      skeletonAvatar.className = 'skeleton skeleton-avatar'
      element.appendChild(skeletonAvatar)
    }

    for (let i = 0; i < lines; i++) {
      const skeletonText = document.createElement('div')
      skeletonText.className = 'skeleton skeleton-text'
      element.appendChild(skeletonText)
    }

    if (button) {
      const skeletonButton = document.createElement('div')
      skeletonButton.className = 'skeleton skeleton-button'
      element.appendChild(skeletonButton)
    }
  }

  // 移除骨架屏
  const removeSkeleton = (element: HTMLElement) => {
    element.classList.remove('skeleton-container')
    const skeletonElements = element.querySelectorAll('.skeleton')
    skeletonElements.forEach(el => el.remove())
  }

  return {
    createSkeleton,
    removeSkeleton
  }
}

// 微交互动画
export function useMicroInteractions() {
  const { isAnimationEnabled } = useAnimations()

  // 按钮点击反馈
  const addClickFeedback = (element: HTMLElement, type: 'scale' | 'bounce' | 'pulse' = 'scale') => {
    if (!isAnimationEnabled.value) return

    const handleClick = () => {
      element.classList.add(`animate-${type}`)
      setTimeout(() => {
        element.classList.remove(`animate-${type}`)
      }, 300)
    }

    element.addEventListener('click', handleClick)

    return () => {
      element.removeEventListener('click', handleClick)
    }
  }

  // 输入框焦点动画
  const addInputFocusAnimation = (input: HTMLInputElement) => {
    if (!isAnimationEnabled.value) return

    const handleFocus = () => {
      input.parentElement?.classList.add('input-focused')
    }

    const handleBlur = () => {
      input.parentElement?.classList.remove('input-focused')
    }

    input.addEventListener('focus', handleFocus)
    input.addEventListener('blur', handleBlur)

    return () => {
      input.removeEventListener('focus', handleFocus)
      input.removeEventListener('blur', handleBlur)
    }
  }

  // 卡片悬浮动画
  const addCardHoverAnimation = (card: HTMLElement) => {
    if (!isAnimationEnabled.value) return

    card.classList.add('card-hover-effect')

    return () => {
      card.classList.remove('card-hover-effect')
    }
  }

  return {
    addClickFeedback,
    addInputFocusAnimation,
    addCardHoverAnimation
  }
}

// 数字计数动画
export function useCountAnimation() {
  const { isAnimationEnabled } = useAnimations()

  const animateCount = (
    element: HTMLElement,
    from: number,
    to: number,
    duration = 1000,
    formatter?: (value: number) => string
  ) => {
    if (!isAnimationEnabled.value) {
      element.textContent = formatter ? formatter(to) : to.toString()
      return
    }

    const startTime = performance.now()
    const difference = to - from

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 使用缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.round(from + difference * easeOutQuart)

      element.textContent = formatter ? formatter(currentValue) : currentValue.toString()

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }

  return {
    animateCount
  }
}

// 视差滚动效果
export function useParallaxEffect() {
  const { isAnimationEnabled } = useAnimations()
  const parallaxElements = ref<Map<HTMLElement, number>>(new Map())

  const addParallaxElement = (element: HTMLElement, speed = 0.5) => {
    if (!isAnimationEnabled.value) return

    parallaxElements.value.set(element, speed)
  }

  const updateParallax = () => {
    if (!isAnimationEnabled.value) return

    const scrollY = window.scrollY

    parallaxElements.value.forEach((speed, element) => {
      const yPos = -(scrollY * speed)
      element.style.transform = `translateY(${yPos}px)`
    })
  }

  onMounted(() => {
    if (isAnimationEnabled.value) {
      window.addEventListener('scroll', updateParallax, { passive: true })
    }
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateParallax)
  })

  return {
    addParallaxElement,
    updateParallax
  }
}
