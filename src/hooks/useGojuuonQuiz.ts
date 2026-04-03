import { useState, useEffect } from 'react'
import { sampleKana, type KanaEntry } from '../lib/gojuuon'

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
}

export const useGojuuonQuiz = () => {
  const [state, setState] = useState<QuizState>(initialState)

  // Countdown: tick every second while answering; transition to feedback on timeout
  useEffect(() => {
    if (state.status !== 'answering') return

    if (state.timeLeft <= 0) {
      setState((s) => ({ ...s, status: 'feedback', lastResult: false, timedOut: true }))
      return
    }

    const id = setTimeout(() => {
      setState((s) => ({ ...s, timeLeft: s.timeLeft - 1 }))
    }, 1000)

    return () => clearTimeout(id)
  }, [state.status, state.timeLeft])

  const start = () => {
    setState({
      ...initialState,
      status: 'answering',
      questions: sampleKana(QUESTION_COUNT),
    })
  }

  const setInput = (value: string) => {
    setState((s) => ({ ...s, input: value }))
  }

  const submit = () => {
    const { questions, currentIndex, input, score } = state
    const correct = questions[currentIndex].romaji
    const isCorrect = input.trim().toLowerCase() === correct.toLowerCase()
    setState((s) => ({
      ...s,
      status: 'feedback',
      lastResult: isCorrect,
      timedOut: false,
      score: isCorrect ? score + 1 : score,
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
    setState((s) => ({ ...s, status: 'done' }))
  }

  const reset = () => setState(initialState)

  return { state, start, setInput, submit, next, finish, reset, QUESTION_COUNT, TIMER_SECONDS }
}
