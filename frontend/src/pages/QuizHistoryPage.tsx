import { useState, useEffect } from 'react'
import { quizHistoryService } from '../services/quizHistoryService'
import type { QuizSessionDetail, QuizSessionSummary } from '../types/quizHistory'

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

const pct = (p: number) => `${Math.round(p * 100)}%`

// ─── Left column: session list ───────────────────────────────────────────────

interface SessionListProps {
  sessions: QuizSessionSummary[]
  selectedId: number | null
  onSelect: (id: number) => void
  detail: QuizSessionDetail | null
  detailLoading: boolean
}

const SessionList = ({ sessions, selectedId, onSelect, detail, detailLoading }: SessionListProps) => {
  if (sessions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-1">還沒有測驗紀錄，快去做第一次測驗吧！</p>
    )
  }

  return (
    <ul className="flex flex-col gap-1">
      {sessions.map((s) => {
        const isSelected = s.id === selectedId
        return (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium tabular-nums">
                  {s.score} / {s.total}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {pct(s.precision)}
                </span>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}
              >
                {fmt(s.taken_at)}
              </p>
            </button>

            {/* Mobile inline detail — hidden on sm+ where the right panel takes over */}
            {isSelected && (
              <div className="sm:hidden mt-1 border border-border rounded-md p-4">
                {detailLoading ? (
                  <p className="text-sm text-muted-foreground">載入中…</p>
                ) : detail ? (
                  <SessionDetail detail={detail} />
                ) : null}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

// ─── Right column: session detail ────────────────────────────────────────────

interface SessionDetailProps {
  detail: QuizSessionDetail
}

const SessionDetail = ({ detail }: SessionDetailProps) => (
  <div className="flex flex-col gap-4">
    {/* Header */}
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold text-foreground">
        {detail.score}
        <span className="text-lg font-normal text-muted-foreground"> / {detail.total}</span>
      </span>
      <span className="text-sm text-muted-foreground">{pct(detail.precision)}</span>
    </div>
    <p className="text-xs text-muted-foreground">{fmt(detail.taken_at)}</p>

    {/* Answer grid */}
    <div className="flex flex-col gap-1">
      {detail.answers.map((ans) => (
        <div
          key={ans.id}
          className="grid grid-cols-3 items-center gap-2 px-4 py-2 rounded-md bg-secondary"
        >
          <span className="text-xl font-medium text-foreground">{ans.kana}</span>

          <span className="text-sm text-center text-muted-foreground">
            {ans.timed_out ? (
              <span className="italic">時間到</span>
            ) : (
              ans.romaji_given || <span className="italic text-muted-foreground/60">（空）</span>
            )}
          </span>

          <span
            className="text-right text-sm font-medium"
            style={{
              color: ans.is_correct ? 'hsl(142 71% 45%)' : 'hsl(0 72% 51%)',
            }}
          >
            {ans.is_correct ? '✓' : `✗ ${ans.romaji_expected}`}
          </span>
        </div>
      ))}
    </div>
  </div>
)

// ─── Page ────────────────────────────────────────────────────────────────────

const QuizHistoryPage = () => {
  const [sessions, setSessions] = useState<QuizSessionSummary[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<QuizSessionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    quizHistoryService
      .listSessions()
      .then(setSessions)
      .catch(() => setError('無法載入測驗紀錄，請確認後端服務是否運行中。'))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (id: number) => {
    // Toggle collapse on mobile (and desktop) when the same row is tapped again
    if (selectedId === id) {
      setSelectedId(null)
      setDetail(null)
      return
    }
    setSelectedId(id)
    setDetailLoading(true)
    setDetail(null)
    quizHistoryService
      .getSession(id)
      .then(setDetail)
      .catch(() => setError('無法載入測驗詳細資料。'))
      .finally(() => setDetailLoading(false))
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col py-6 sm:py-8 px-4">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-foreground mb-6">測驗紀錄</h1>

          {error && (
            <p className="text-sm mb-4" style={{ color: 'hsl(0 72% 51%)' }}>
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground">載入中…</p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              {/* Left column */}
              <div className="w-full sm:w-56 shrink-0">
                <SessionList
                  sessions={sessions}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  detail={detail}
                  detailLoading={detailLoading}
                />
              </div>

              {/* Right column — desktop only; mobile uses inline expansion inside SessionList */}
              {(selectedId !== null) && (
                <div className="hidden sm:block flex-1 border border-border rounded-md p-4">
                  {detailLoading ? (
                    <p className="text-sm text-muted-foreground">載入中…</p>
                  ) : detail ? (
                    <SessionDetail detail={detail} />
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default QuizHistoryPage
