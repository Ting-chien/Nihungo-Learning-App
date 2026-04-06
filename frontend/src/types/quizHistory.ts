export interface QuizAnswerResponse {
  id: number
  kana: string
  romaji_expected: string
  romaji_given: string
  is_correct: boolean
  timed_out: boolean
}

export interface QuizSessionSummary {
  id: number
  taken_at: string
  score: number
  total: number
  precision: number
}

export interface QuizSessionDetail extends QuizSessionSummary {
  answers: QuizAnswerResponse[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Payload sent to the backend when a quiz finishes
export interface QuizAnswerCreate {
  kana: string
  romaji_expected: string
  romaji_given: string
  is_correct: boolean
  timed_out: boolean
}

export interface QuizSessionCreate {
  score: number
  total: number
  answers: QuizAnswerCreate[]
}
