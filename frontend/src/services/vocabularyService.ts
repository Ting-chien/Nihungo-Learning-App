import type { ApiResponse, VocabularyCreate, VocabularyEntry, VocabularyUpdate } from '../types/vocabulary'

const BASE_URL = '/api/v1/vocabulary'

export const vocabularyService = {
  list: async (): Promise<VocabularyEntry[]> => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to load vocabulary')
    const json: ApiResponse<VocabularyEntry[]> = await res.json()
    return json.data
  },

  create: async (payload: VocabularyCreate): Promise<VocabularyEntry> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to create vocabulary entry')
    const json: ApiResponse<VocabularyEntry> = await res.json()
    return json.data
  },

  update: async (id: number, payload: VocabularyUpdate): Promise<VocabularyEntry> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to update vocabulary entry')
    const json: ApiResponse<VocabularyEntry> = await res.json()
    return json.data
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete vocabulary entry')
  },
}
