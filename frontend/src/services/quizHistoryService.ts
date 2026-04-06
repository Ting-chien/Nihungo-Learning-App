import type {
  ApiResponse,
  QuizSessionCreate,
  QuizSessionDetail,
  QuizSessionSummary,
} from '../types/quizHistory'

const BASE_URL = 'http://localhost:8000/api/v1/quiz-history'

export const quizHistoryService = {
  saveSession: async (payload: QuizSessionCreate): Promise<QuizSessionSummary> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to save quiz session')
    const json: ApiResponse<QuizSessionSummary> = await res.json()
    return json.data
  },

  listSessions: async (): Promise<QuizSessionSummary[]> => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to load quiz history')
    const json: ApiResponse<QuizSessionSummary[]> = await res.json()
    return json.data
  },

  getSession: async (id: number): Promise<QuizSessionDetail> => {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) throw new Error('Failed to load quiz session detail')
    const json: ApiResponse<QuizSessionDetail> = await res.json()
    return json.data
  },
}
