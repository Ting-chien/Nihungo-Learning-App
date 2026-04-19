import { useState, useEffect } from 'react'
import { sampleKanaByType, type KanaEntry, type QuizType } from '../lib/gojuuon'
import { quizHistoryService } from '../services/quizHistoryService'
import type { QuizAnswerCreate } from '../types/quizHistory'

const QUESTION_COUNT = 10
const TIMER_SECONDS = 10

type QuizStatus = 'idle' | 'answering' | 'feedback' | 'done'

interface QuizState {
  status: QuizStatus
  questions: KanaEntry[]
  currentIndex: number
  input: string
  /** null = not yet answered; true/false = result of last answer */
  lastResult: boolean | null
  /** true when the question timed out without an answer */
  timedOut: boolean
  score: number
  timeLeft: number
  /** Accumulated per-answer records, flushed to backend on finish */
  answers: QuizAnswerCreate[]
}

const initialState: QuizState = {
  status: 'idle',
  questions: [],
  currentIndex: 0,
  input: '',
  lastResult: null,
  timedOut: false,
  score: 0,
  timeLeft: TIMER_SECONDS,
  answers: [],
}

export const useGojuuonQuiz = () => {
  const [state, setState] = useState<QuizState>(initialState)

  // Countdown: tick every second while answering; transition to feedback on timeout
  useEffect(() => {
    if (state.status !== 'answering') return

    if (state.timeLeft <= 0) {
      const timedOutAnswer: QuizAnswerCreate = {
        kana: state.questions[state.currentIndex].kana,
        romaji_expected: state.questions[state.currentIndex].romaji,
        romaji_given: '',
        is_correct: false,
        timed_out: true,
      }
      setState((s) => ({
        ...s,
        status: 'feedback',
        lastResult: false,
        timedOut: true,
        answers: [...s.answers, timedOutAnswer],
      }))
      return
    }

    const id = setTimeout(() => {
      setState((s) => ({ ...s, timeLeft: s.timeLeft - 1 }))
    }, 1000)

    return () => clearTimeout(id)
  }, [state.status, state.timeLeft])

  // Save to backend whenever status transitions to 'done'
  useEffect(() => {
    if (state.status !== 'done') return
    quizHistoryService
      .saveSession({ score: state.score, total: QUESTION_COUNT, answers: state.answers })
      .catch(() => {
        // Silently swallow — history saving is best-effort and must not break UX
      })
  }, [state.status])

  const start = (quizType: QuizType = 'hiragana') => {
    setState({
      ...initialState,
      status: 'answering',
      questions: sampleKanaByType(QUESTION_COUNT, quizType),
    })
  }

  const setInput = (value: string) => {
    setState((s) => ({ ...s, input: value }))
  }

  const submit = () => {
    const { questions, currentIndex, input, score } = state
    const correct = questions[currentIndex].romaji
    const isCorrect = input.trim().toLowerCase() === correct.toLowerCase()
    const answer: QuizAnswerCreate = {
      kana: questions[currentIndex].kana,
      romaji_expected: correct,
      romaji_given: input.trim(),
      is_correct: isCorrect,
      timed_out: false,
    }
    setState((s) => ({
      ...s,
      status: 'feedback',
      lastResult: isCorrect,
      timedOut: false,
      score: isCorrect ? score + 1 : score,
      answers: [...s.answers, answer],
    }))
  }

  const next = () => {
    const { currentIndex, questions } = state
    const isLast = currentIndex === questions.length - 1
    setState((s) => ({
      ...s,
      status: isLast ? 'done' : 'answering',
      currentIndex: isLast ? s.currentIndex : s.currentIndex + 1,
      input: '',
      lastResult: null,
      timedOut: false,
      timeLeft: TIMER_SECONDS,
    }))
  }

  const finish = () => {
    // Record remaining unanswered question as timed-out if we bail mid-quiz
    setState((s) => {
      if (s.status !== 'answering') return { ...s, status: 'done' }
      const unanswered: QuizAnswerCreate = {
        kana: s.questions[s.currentIndex].kana,
        romaji_expected: s.questions[s.currentIndex].romaji,
        romaji_given: '',
        is_correct: false,
        timed_out: true,
      }
      return { ...s, status: 'done', answers: [...s.answers, unanswered] }
    })
  }

  const reset = () => setState(initialState)

  return { state, start, setInput, submit, next, finish, reset, QUESTION_COUNT, TIMER_SECONDS }
}
