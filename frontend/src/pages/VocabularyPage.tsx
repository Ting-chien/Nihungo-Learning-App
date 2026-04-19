import { useState, useEffect, useRef } from 'react'
import { vocabularyService } from '../services/vocabularyService'
import type { VocabularyCreate, VocabularyEntry } from '../types/vocabulary'

// ─── Shared form field ────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
}

const FormField = ({ label, required, children }: FormFieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-muted-foreground">
      {label}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
    {children}
  </div>
)

// ─── Add / Edit dialog ────────────────────────────────────────────────────────

interface EntryDialogProps {
  /** When provided the dialog is in edit mode; otherwise add mode. */
  initial?: VocabularyEntry
  onClose: () => void
  onSave: (entry: VocabularyEntry) => void
}

const EMPTY_FORM: VocabularyCreate = { japanese: '', kana: '', accent: null, chinese: '' }

const EntryDialog = ({ initial, onClose, onSave }: EntryDialogProps) => {
  const isEdit = initial !== undefined
  const [form, setForm] = useState<VocabularyCreate>(
    isEdit
      ? { japanese: initial.japanese, kana: initial.kana, accent: initial.accent, chinese: initial.chinese }
      : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { firstInputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleChange = (key: keyof VocabularyCreate, value: string) => {
    if (key === 'accent') {
      setForm((f) => ({ ...f, accent: value === '' ? null : parseInt(value, 10) }))
    } else {
      setForm((f) => ({ ...f, [key]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.japanese.trim() || !form.kana.trim() || !form.chinese.trim()) {
      setError('日文、假名、中文為必填欄位')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const entry = isEdit
        ? await vocabularyService.update(initial.id, form)
        : await vocabularyService.create(form)
      onSave(entry)
    } catch {
      setError(isEdit ? '更新失敗，請稍後再試' : '新增失敗，請稍後再試')
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-md shadow-lg w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-foreground mb-4">
          {isEdit ? '編輯單字' : '新增單字'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label="日文" required>
            <input
              ref={firstInputRef}
              value={form.japanese}
              onChange={(e) => handleChange('japanese', e.target.value)}
              placeholder="例：食べる"
              className="input"
            />
          </FormField>

          <FormField label="假名" required>
            <input
              value={form.kana}
              onChange={(e) => handleChange('kana', e.target.value)}
              placeholder="例：たべる"
              className="input"
            />
          </FormField>

          <FormField label="重音（號碼）">
            <input
              type="number"
              min={0}
              value={form.accent ?? ''}
              onChange={(e) => handleChange('accent', e.target.value)}
              placeholder="例：2"
              className="input"
            />
          </FormField>

          <FormField label="中文" required>
            <input
              value={form.chinese}
              onChange={(e) => handleChange('chinese', e.target.value)}
              placeholder="例：吃"
              className="input"
            />
          </FormField>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md bg-secondary text-foreground hover:opacity-80 transition-opacity"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? '儲存中…' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Per-row action menu ──────────────────────────────────────────────────────

interface RowMenuProps {
  onEdit: () => void
  onDelete: () => void
}

const RowMenu = ({ onEdit, onDelete }: RowMenuProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="操作選單"
      >
        {/* Vertical three-dot icon */}
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.3" />
          <circle cx="8" cy="8" r="1.3" />
          <circle cx="8" cy="13" r="1.3" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-24 bg-background border border-border rounded-md shadow-md py-1 z-10">
          <button
            onClick={() => { setOpen(false); onEdit() }}
            className="w-full text-left px-3 py-1.5 text-sm text-foreground hover:bg-secondary transition-colors"
          >
            編輯
          </button>
          <button
            onClick={() => { setOpen(false); onDelete() }}
            className="w-full text-left px-3 py-1.5 text-sm text-destructive hover:bg-secondary transition-colors"
          >
            刪除
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Vocabulary table ─────────────────────────────────────────────────────────

interface VocabularyTableProps {
  entries: VocabularyEntry[]
  onEdit: (entry: VocabularyEntry) => void
  onDelete: (id: number) => void
}

const VocabularyTable = ({ entries, onEdit, onDelete }: VocabularyTableProps) => {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-1">還沒有單字，快新增第一個吧！</p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary">
            <th className="px-4 py-3 text-left font-semibold text-foreground">日文</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">假名</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">重音</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">中文</th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr
              key={entry.id}
              className={i % 2 === 0 ? 'bg-background' : 'bg-secondary/40'}
            >
              <td className="px-4 py-3 text-base font-medium text-foreground">{entry.japanese}</td>
              <td className="px-4 py-3 text-muted-foreground">{entry.kana}</td>
              <td className="px-4 py-3 text-center text-muted-foreground tabular-nums">
                {entry.accent !== null ? entry.accent : '—'}
              </td>
              <td className="px-4 py-3 text-foreground">{entry.chinese}</td>
              <td className="px-4 py-3 text-right">
                <RowMenu
                  onEdit={() => onEdit(entry)}
                  onDelete={() => onDelete(entry.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

type DialogState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; entry: VocabularyEntry }

const VocabularyPage = () => {
  const [entries, setEntries] = useState<VocabularyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })

  useEffect(() => {
    vocabularyService
      .list()
      .then(setEntries)
      .catch(() => setError('無法載入單字列表，請確認後端服務是否運行中。'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = (saved: VocabularyEntry) => {
    setEntries((prev) => {
      const exists = prev.some((e) => e.id === saved.id)
      // Edit: replace in place; Add: prepend
      return exists ? prev.map((e) => (e.id === saved.id ? saved : e)) : [saved, ...prev]
    })
    setDialog({ mode: 'closed' })
  }

  const handleDelete = async (id: number) => {
    try {
      await vocabularyService.delete(id)
      setEntries((prev) => prev.filter((e) => e.id !== id))
    } catch {
      setError('刪除失敗，請稍後再試')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col py-6 sm:py-8 px-4">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-foreground">單詞模組</h1>
            <button
              onClick={() => setDialog({ mode: 'add' })}
              className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              + 新增單字
            </button>
          </div>

          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          {loading ? (
            <p className="text-sm text-muted-foreground">載入中…</p>
          ) : (
            <VocabularyTable
              entries={entries}
              onEdit={(entry) => setDialog({ mode: 'edit', entry })}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      {dialog.mode !== 'closed' && (
        <EntryDialog
          initial={dialog.mode === 'edit' ? dialog.entry : undefined}
          onClose={() => setDialog({ mode: 'closed' })}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default VocabularyPage
