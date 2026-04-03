import { useState } from 'react'
import { sampleKana, type KanaEntry } from '../lib/gojuuon'

const QUESTION_COUNT = 10

type QuizStatus = 'idle' | 'answering' | 'feedback' | 'done'

interface QuizState {
  status: QuizStatus
  questions: KanaEntry[]
  currentIndex: number
  input: string
  /** null = not yet answered; true/false = result of last answer */
  lastResult: boolean | null
  score: number
}

const initialState: QuizState = {
  status: 'idle',
  questions: [],
  currentIndex: 0,
  input: '',
  lastResult: null,
  score: 0,
}

export const useGojuuonQuiz = () => {
  const [state, setState] = useState<QuizState>(initialState)

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
    }))
  }

  const reset = () => setState(initialState)

  return { state, start, setInput, submit, next, reset, QUESTION_COUNT }
}
