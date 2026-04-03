import { useRef, useEffect } from 'react'
import { useGojuuonQuiz } from '../hooks/useGojuuonQuiz'

const QuizPage = () => {
  const { state, start, setInput, submit, next, reset, QUESTION_COUNT } = useGojuuonQuiz()
  const { status, questions, currentIndex, input, lastResult, score } = state
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'answering') inputRef.current?.focus()
  }, [status, currentIndex])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (status === 'answering' && input.trim()) submit()
      else if (status === 'feedback') next()
    }
  }

  return (
    <div
      className="flex items-center justify-center px-4"
      style={{ minHeight: 'calc(100vh - 3.5rem)' }}
    >
      {status === 'idle' && (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-foreground">五十音 小測驗</h2>
          <p className="text-muted-foreground text-sm">共 {QUESTION_COUNT} 題，請輸入假名對應的羅馬字</p>
          <button
            onClick={start}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-md text-lg font-medium hover:opacity-80 transition-opacity"
          >
            開始
          </button>
        </div>
      )}

      {(status === 'answering' || status === 'feedback') && (
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
          <p className="text-sm text-muted-foreground">
            第 {currentIndex + 1} / {QUESTION_COUNT} 題
          </p>

          <span className="text-8xl font-medium text-foreground">
            {questions[currentIndex].kana}
          </span>

          <div className="w-full flex flex-col gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={status === 'feedback'}
              placeholder="輸入羅馬字…"
              className="w-full px-4 py-3 border border-border rounded-md text-foreground bg-background text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            />

            {status === 'answering' && (
              <button
                onClick={submit}
                disabled={!input.trim()}
                className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                送出
              </button>
            )}
          </div>

          {status === 'feedback' && (
            <div className="flex flex-col items-center gap-4 w-full">
              {lastResult ? (
                <p className="text-lg font-semibold" style={{ color: 'hsl(142 71% 45%)' }}>
                  正確！
                </p>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <p className="text-lg font-semibold" style={{ color: 'hsl(0 72% 51%)' }}>
                    錯誤
                  </p>
                  <p className="text-sm text-muted-foreground">
                    正確答案：<span className="font-medium text-foreground">{questions[currentIndex].romaji}</span>
                  </p>
                </div>
              )}

              <button
                onClick={next}
                className="px-8 py-2 bg-secondary text-secondary-foreground rounded-md font-medium hover:opacity-80 transition-opacity"
              >
                {currentIndex === questions.length - 1 ? '查看結果' : '下一題'}
              </button>
            </div>
          )}
        </div>
      )}

      {status === 'done' && (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-foreground">測驗結束</h2>
          <p className="text-5xl font-bold text-foreground">
            {score} <span className="text-2xl text-muted-foreground font-normal">/ {QUESTION_COUNT}</span>
          </p>
          <p className="text-muted-foreground text-sm">
            {score === QUESTION_COUNT
              ? '全對！太厲害了！'
              : score >= QUESTION_COUNT / 2
              ? '不錯！繼續加油！'
              : '再練習一下吧！'}
          </p>
          <button
            onClick={reset}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-md text-lg font-medium hover:opacity-80 transition-opacity"
          >
            再來一次
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizPage
