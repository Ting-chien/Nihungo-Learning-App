import type { ApiResponse } from './quizHistory'

export type { ApiResponse }

export interface VocabularyEntry {
  id: number
  japanese: string
  kana: string
  accent: number | null
  chinese: string
  created_at: string
}

export interface VocabularyCreate {
  japanese: string
  kana: string
  accent: number | null
  chinese: string
}

export type VocabularyUpdate = VocabularyCreate
