import { useState } from 'react'
import { HIRAGANA, KATAKANA } from '../lib/gojuuon'

type Script = 'hiragana' | 'katakana'

const GojuuonPage = () => {
  const [script, setScript] = useState<Script>('hiragana')

  const rows = script === 'hiragana' ? HIRAGANA : KATAKANA
  // Flatten all 11 rows × 5 cols into a single array for CSS Grid auto-flow
  const cells = rows.flat()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center py-6 sm:py-8 px-4">
        {/* Tab bar */}
        <div className="flex gap-1 mb-6 self-start">
          {(['hiragana', 'katakana'] as Script[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setScript(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                script === tab
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {tab === 'hiragana' ? '平假名' : '片假名'}
            </button>
          ))}
        </div>

        {/*
          Responsive grid layout:
          - Mobile (縱向): 5 columns, row auto-flow → consonant groups stack top-to-bottom
          - Web sm: (橫向): column auto-flow with 5 rows → consonant groups run left-to-right
            CSS Grid places items column-by-column, so each consonant group becomes a column.
        */}
        <div className="w-full max-w-lg sm:max-w-3xl">
          <div className="grid grid-cols-5 gap-1 sm:grid-cols-none sm:grid-rows-5 sm:grid-flow-col sm:auto-cols-fr sm:gap-2">
            {cells.map((cell, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center rounded-md py-2 sm:py-4 gap-1 ${
                  cell.romaji ? 'bg-secondary text-foreground' : 'bg-transparent'
                }`}
              >
                {cell.romaji && (
                  <>
                    <span className="text-xl sm:text-2xl font-medium">{cell.kana}</span>
                    <span className="text-xs text-muted-foreground">{cell.romaji}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default GojuuonPage
