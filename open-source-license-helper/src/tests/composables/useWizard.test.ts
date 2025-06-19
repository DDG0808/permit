import { describe, it, expect, beforeEach } from 'vitest'
import { useWizard } from '@/composables/useWizard'

describe('useWizard', () => {
  let wizard: ReturnType<typeof useWizard>

  beforeEach(() => {
    wizard = useWizard()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(wizard.state.value.currentQuestionIndex).toBe(0)
      expect(wizard.state.value.answers).toEqual([])
      expect(wizard.state.value.isCompleted).toBe(false)
      expect(wizard.state.value.result).toBeNull()
      expect(wizard.isStarted.value).toBe(false)
    })

    it('should have questions loaded', () => {
      expect(wizard.questions.value).toBeDefined()
      expect(wizard.questions.value.length).toBeGreaterThan(0)
      expect(wizard.totalQuestions.value).toBe(wizard.questions.value.length)
    })

    it('should have current question as first question', () => {
      expect(wizard.currentQuestion.value).toEqual(wizard.questions.value[0])
    })
  })

  describe('wizard flow', () => {
    it('should start wizard correctly', () => {
      wizard.startWizard()
      
      expect(wizard.isStarted.value).toBe(true)
      expect(wizard.state.value.currentQuestionIndex).toBe(0)
    })

    it('should answer questions correctly', () => {
      wizard.startWizard()
      
      const firstQuestion = wizard.currentQuestion.value!
      const selectedValues = [firstQuestion.options[0].value]
      
      wizard.answerQuestion(selectedValues)
      
      expect(wizard.state.value.answers).toHaveLength(1)
      expect(wizard.state.value.answers[0]).toEqual({
        questionId: firstQuestion.id,
        selectedValues
      })
    })

    it('should navigate to next question', () => {
      wizard.startWizard()
      wizard.answerQuestion(['test-answer'])
      
      const initialIndex = wizard.state.value.currentQuestionIndex
      wizard.nextQuestion()
      
      expect(wizard.state.value.currentQuestionIndex).toBe(initialIndex + 1)
      expect(wizard.currentQuestion.value).toEqual(wizard.questions.value[1])
    })

    it('should navigate to previous question', () => {
      wizard.startWizard()
      wizard.answerQuestion(['test-answer'])
      wizard.nextQuestion()
      
      const currentIndex = wizard.state.value.currentQuestionIndex
      wizard.previousQuestion()
      
      expect(wizard.state.value.currentQuestionIndex).toBe(currentIndex - 1)
    })

    it('should not go to previous question from first question', () => {
      wizard.startWizard()
      
      wizard.previousQuestion()
      
      expect(wizard.state.value.currentQuestionIndex).toBe(0)
    })

    it('should not go to next question without answer', () => {
      wizard.startWizard()
      
      wizard.nextQuestion()
      
      expect(wizard.state.value.currentQuestionIndex).toBe(0)
    })
  })

  describe('progress tracking', () => {
    it('should calculate progress correctly', () => {
      wizard.startWizard()
      
      const initialProgress = wizard.progress.value
      expect(initialProgress.current).toBe(1)
      expect(initialProgress.total).toBe(wizard.totalQuestions.value)
      expect(initialProgress.percentage).toBe(Math.round((1 / wizard.totalQuestions.value) * 100))
      expect(initialProgress.canGoBack).toBe(false)
      expect(initialProgress.canGoNext).toBe(false)
    })

    it('should update progress after answering', () => {
      wizard.startWizard()
      wizard.answerQuestion(['test-answer'])
      
      const progress = wizard.progress.value
      expect(progress.canGoNext).toBe(true)
    })

    it('should update progress after navigation', () => {
      wizard.startWizard()
      wizard.answerQuestion(['test-answer'])
      wizard.nextQuestion()
      
      const progress = wizard.progress.value
      expect(progress.current).toBe(2)
      expect(progress.canGoBack).toBe(true)
    })
  })

  describe('wizard completion', () => {
    it('should complete wizard when all questions answered', () => {
      wizard.startWizard()
      
      // Answer all questions
      wizard.questions.value.forEach((question, index) => {
        wizard.state.value.currentQuestionIndex = index
        wizard.answerQuestion([question.options[0].value])
      })
      
      wizard.completeWizard()
      
      expect(wizard.state.value.isCompleted).toBe(true)
      expect(wizard.state.value.result).toBeDefined()
      expect(wizard.state.value.result?.recommendations).toBeDefined()
    })

    it('should not complete wizard with missing answers', () => {
      wizard.startWizard()
      wizard.answerQuestion(['test-answer'])
      
      expect(() => wizard.completeWizard()).toThrow()
    })

    it('should generate valid recommendations', () => {
      wizard.startWizard()
      
      // Answer all questions with specific values
      wizard.questions.value.forEach((question, index) => {
        wizard.state.value.currentQuestionIndex = index
        wizard.answerQuestion([question.options[0].value])
      })
      
      wizard.completeWizard()
      
      const result = wizard.state.value.result!
      expect(result.recommendations.primary).toBeDefined()
      expect(result.recommendations.primary.licenseId).toBeTruthy()
      expect(result.recommendations.primary.score).toBeGreaterThan(0)
      expect(result.recommendations.alternatives).toBeInstanceOf(Array)
    })
  })

  describe('wizard reset', () => {
    it('should reset wizard to initial state', () => {
      wizard.startWizard()
      wizard.answerQuestion(['test-answer'])
      wizard.nextQuestion()
      wizard.completeWizard = () => {
        wizard.state.value.isCompleted = true
        wizard.state.value.result = {
          recommendations: {
            primary: { licenseId: 'MIT', score: 100, reasons: [] },
            alternatives: []
          },
          analysis: {
            userPreferences: {},
            compatibilityMatrix: {},
            riskAssessment: {}
          }
        }
      }
      
      wizard.resetWizard()
      
      expect(wizard.state.value.currentQuestionIndex).toBe(0)
      expect(wizard.state.value.answers).toEqual([])
      expect(wizard.state.value.isCompleted).toBe(false)
      expect(wizard.state.value.result).toBeNull()
      expect(wizard.isStarted.value).toBe(false)
    })
  })

  describe('navigation helpers', () => {
    it('should go to specific question', () => {
      wizard.startWizard()
      
      // Answer first question to enable navigation
      wizard.answerQuestion(['test-answer'])
      
      wizard.goToQuestion(2)
      
      expect(wizard.state.value.currentQuestionIndex).toBe(1) // 0-based index
    })

    it('should not go to invalid question index', () => {
      wizard.startWizard()
      
      const initialIndex = wizard.state.value.currentQuestionIndex
      
      wizard.goToQuestion(-1)
      expect(wizard.state.value.currentQuestionIndex).toBe(initialIndex)
      
      wizard.goToQuestion(999)
      expect(wizard.state.value.currentQuestionIndex).toBe(initialIndex)
    })
  })

  describe('answer management', () => {
    it('should get current answer correctly', () => {
      wizard.startWizard()
      
      expect(wizard.currentAnswer.value).toBeUndefined()
      
      wizard.answerQuestion(['test-answer'])
      
      expect(wizard.currentAnswer.value).toBeDefined()
      expect(wizard.currentAnswer.value?.selectedValues).toEqual(['test-answer'])
    })

    it('should update existing answer', () => {
      wizard.startWizard()
      
      wizard.answerQuestion(['first-answer'])
      wizard.answerQuestion(['updated-answer'])
      
      expect(wizard.state.value.answers).toHaveLength(1)
      expect(wizard.currentAnswer.value?.selectedValues).toEqual(['updated-answer'])
    })
  })
})
