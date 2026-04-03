import { GOJUUON } from '../lib/gojuuon'

// Pad each row to 5 columns for consistent grid layout
const ROWS = GOJUUON.map((row) => {
  const padded = [...row]
  while (padded.length < 5) padded.push({ kana: '', romaji: '' })
  return padded
})

const GojuuonPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center py-6 sm:py-8 px-4">
        <div className="w-full max-w-lg">
          {ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-5 gap-1 sm:gap-2 mb-1 sm:mb-2">
              {row.map((cell, colIdx) => (
                <div
                  key={colIdx}
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
          ))}
        </div>
      </main>
    </div>
  )
}

export default GojuuonPage
